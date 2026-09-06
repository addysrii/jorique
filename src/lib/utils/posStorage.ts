import { supabase } from '../supabase';
import type { InStoreCustomer, InStoreInvoice } from '../../types/pos';
import { incrementCouponUsage } from './couponStorage';

const CUSTOMERS_STORAGE_KEY = 'jorique_pos_customers';
const INVOICES_STORAGE_KEY = 'jorique_pos_invoices';

// Clean phone digits for uniform lookup (extract last 10 digits if possible)
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) {
    return digits.slice(-10);
  }
  return digits;
}

function getLocalCustomers(): InStoreCustomer[] {
  try {
    const raw = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Filter out any leftover legacy dummy presets (cust-1, cust-2, cust-3)
    const realOnly = Array.isArray(parsed) ? parsed.filter(c => !c.id?.startsWith('cust-')) : [];
    return realOnly;
  } catch {
    return [];
  }
}

function saveLocalCustomers(list: InStoreCustomer[]): void {
  try {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save customers to local storage:', err);
  }
}

function getLocalInvoices(): InStoreInvoice[] {
  try {
    const raw = localStorage.getItem(INVOICES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Filter out any leftover legacy dummy presets (inv-1, inv-2, inv-3)
    const realOnly = Array.isArray(parsed) ? parsed.filter(inv => !inv.id?.startsWith('inv-')) : [];
    return realOnly;
  } catch {
    return [];
  }
}

function saveLocalInvoices(list: InStoreInvoice[]): void {
  try {
    localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save invoices to local storage:', err);
  }
}

export async function searchCustomerByPhone(rawPhone: string): Promise<{
  customer: InStoreCustomer | null;
  history: InStoreInvoice[];
}> {
  const clean = normalizePhone(rawPhone);
  if (!clean || clean.length < 5) {
    return { customer: null, history: [] };
  }

  // 1. Try Supabase
  try {
    const { data: dbCustomer } = await supabase
      .from('customers')
      .select('*')
      .ilike('phone', `%${clean}%`)
      .maybeSingle();

    if (dbCustomer) {
      const customer: InStoreCustomer = {
        id: dbCustomer.id,
        phone: dbCustomer.phone || clean,
        fullName: dbCustomer.full_name || 'Valued Client',
        email: dbCustomer.email || undefined,
        city: dbCustomer.address?.city || undefined,
        address: dbCustomer.address?.line || undefined,
        totalSpent: Number(dbCustomer.total_spent) || 0,
        ordersCount: Number(dbCustomer.orders_count) || 0,
        lastVisit: dbCustomer.updated_at || dbCustomer.created_at,
        notes: dbCustomer.notes || undefined,
        createdAt: dbCustomer.created_at,
      };

      // Load invoices matching this phone from local / remote
      const localInvoices = getLocalInvoices().filter(
        (inv) => normalizePhone(inv.customer.phone).includes(clean)
      );

      return { customer, history: localInvoices };
    }
  } catch {
    // Fall back to local storage
  }

  // 2. Search local storage
  const localCustomers = getLocalCustomers();
  const match = localCustomers.find((c) => normalizePhone(c.phone).includes(clean));

  if (match) {
    const history = getLocalInvoices().filter((inv) =>
      normalizePhone(inv.customer.phone).includes(clean)
    );
    return { customer: match, history };
  }

  return { customer: null, history: [] };
}

export async function saveOrUpdateCustomer(data: {
  phone: string;
  fullName: string;
  email?: string;
  city?: string;
  address?: string;
  notes?: string;
  addSpent?: number;
}): Promise<InStoreCustomer> {
  const cleanPhone = normalizePhone(data.phone);
  const localCustomers = getLocalCustomers();
  const existingIdx = localCustomers.findIndex((c) => normalizePhone(c.phone) === cleanPhone);

  const now = new Date().toISOString();
  let updatedCustomer: InStoreCustomer;

  if (existingIdx >= 0) {
    const prev = localCustomers[existingIdx];
    updatedCustomer = {
      ...prev,
      fullName: data.fullName || prev.fullName,
      email: data.email || prev.email,
      city: data.city || prev.city,
      address: data.address || prev.address,
      notes: data.notes || prev.notes,
      totalSpent: prev.totalSpent + (data.addSpent || 0),
      ordersCount: prev.ordersCount + (data.addSpent ? 1 : 0),
      lastVisit: now,
    };
    localCustomers[existingIdx] = updatedCustomer;
  } else {
    updatedCustomer = {
      id: `cust-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      phone: cleanPhone,
      fullName: data.fullName || 'Valued Client',
      email: data.email,
      city: data.city,
      address: data.address,
      notes: data.notes,
      totalSpent: data.addSpent || 0,
      ordersCount: data.addSpent ? 1 : 0,
      lastVisit: now,
      createdAt: now,
    };
    localCustomers.unshift(updatedCustomer);
  }

  saveLocalCustomers(localCustomers);

  // Sync to Supabase customers table if available
  try {
    await supabase.from('customers').upsert(
      {
        phone: cleanPhone,
        full_name: updatedCustomer.fullName,
        email: updatedCustomer.email || null,
        address: { city: updatedCustomer.city, line: updatedCustomer.address },
        updated_at: now,
      },
      { onConflict: 'phone' }
    );
  } catch (err) {
    console.warn('Supabase customers upsert skipped:', err);
  }

  return updatedCustomer;
}

export async function createInStoreInvoice(payload: {
  customer: {
    phone: string;
    fullName: string;
    email?: string;
    city?: string;
    address?: string;
  };
  items: InStoreInvoice['items'];
  subtotal: number;
  couponCode?: string;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  paymentMethod: InStoreInvoice['paymentMethod'];
  notes?: string;
  cashierName?: string;
}): Promise<InStoreInvoice> {
  const customer = await saveOrUpdateCustomer({
    phone: payload.customer.phone,
    fullName: payload.customer.fullName,
    email: payload.customer.email,
    city: payload.customer.city,
    address: payload.customer.address,
    addSpent: payload.grandTotal,
  });

  // Generate official serial invoice number
  const nextInvoiceNum = `INV-${new Date().getFullYear()}-${String(
    getLocalInvoices().length + 25
  ).padStart(4, '0')}`;

  const newInvoice: InStoreInvoice = {
    id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    invoiceNumber: nextInvoiceNum,
    customer,
    items: payload.items,
    subtotal: payload.subtotal,
    couponCode: payload.couponCode || undefined,
    discountAmount: payload.discountAmount,
    taxAmount: payload.taxAmount,
    grandTotal: payload.grandTotal,
    paymentMethod: payload.paymentMethod,
    paymentStatus: 'paid',
    notes: payload.notes,
    cashierName: payload.cashierName || 'Maison Jorique In-Store POS',
    createdAt: new Date().toISOString(),
  };

  const invoices = getLocalInvoices();
  invoices.unshift(newInvoice);
  saveLocalInvoices(invoices);

  // If coupon was applied, increment its usage counter
  if (payload.couponCode) {
    incrementCouponUsage(payload.couponCode).catch(() => {});
  }

  // Also sync order to backend / Supabase orders table
  try {
    await supabase.from('orders').insert({
      order_number: newInvoice.invoiceNumber,
      status: 'delivered',
      total: newInvoice.grandTotal,
      items: {
        source: 'in_store_pos',
        invoice_id: newInvoice.id,
        customer_phone: customer.phone,
        customer_name: customer.fullName,
        payment_method: newInvoice.paymentMethod,
        coupon_code: newInvoice.couponCode,
        discount_amount: newInvoice.discountAmount,
        line_items: newInvoice.items,
      },
    });
  } catch (err) {
    console.warn('Supabase in-store order sync skipped:', err);
  }

  return newInvoice;
}

export function getAllInStoreInvoices(): InStoreInvoice[] {
  return getLocalInvoices();
}

export function getAllInStoreCustomers(): InStoreCustomer[] {
  return getLocalCustomers();
}
