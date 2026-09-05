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

// Initial realistic customer database presets for demo & showroom testing
const DEFAULT_PRESET_CUSTOMERS: InStoreCustomer[] = [
  {
    id: 'cust-1',
    phone: '9876543210',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    city: 'Mumbai',
    address: 'Bandra West, Luxury Enclave',
    totalSpent: 34990,
    ordersCount: 3,
    lastVisit: '2026-08-22T14:30:00Z',
    notes: 'Prefers 800TC Egyptian sateen bedsheets in Champagne and Emerald.',
    createdAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'cust-2',
    phone: '9811223344',
    fullName: 'Rajesh Malhotra',
    email: 'malhotra.r@outlook.com',
    city: 'New Delhi',
    address: 'Golf Links, New Delhi',
    totalSpent: 52400,
    ordersCount: 4,
    lastVisit: '2026-08-30T16:45:00Z',
    notes: 'VIP collector; bought Mulberry Silk Comforter set and velvet throws.',
    createdAt: '2026-01-10T12:00:00Z',
  },
  {
    id: 'cust-3',
    phone: '9744556677',
    fullName: 'Ananya Deshmukh',
    email: 'ananya.d@gmail.com',
    city: 'Pune',
    totalSpent: 8990,
    ordersCount: 1,
    lastVisit: '2026-07-14T11:20:00Z',
    createdAt: '2026-07-14T11:20:00Z',
  },
];

const DEFAULT_PRESET_INVOICES: InStoreInvoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-0018',
    customer: DEFAULT_PRESET_CUSTOMERS[0],
    items: [
      {
        productId: 'prod-bed-1',
        name: '800TC Egyptian Cotton Sateen Sheet Set',
        sku: 'JR-BED-2026-001',
        category: 'Bedsheets',
        unitPrice: 12999,
        quantity: 1,
        lineTotal: 12999,
      },
      {
        productId: 'prod-pil-1',
        name: 'Mulberry Silk Pillowcase Pair (Ivory)',
        sku: 'JR-PIL-2026-004',
        category: 'Pillows',
        unitPrice: 4999,
        quantity: 2,
        lineTotal: 9998,
      },
    ],
    subtotal: 22997,
    couponCode: 'WELCOME10',
    discountAmount: 1000,
    taxAmount: 0,
    grandTotal: 21997,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    cashierName: 'Maison Jorique POS 1',
    createdAt: '2026-08-22T14:30:00Z',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-0012',
    customer: DEFAULT_PRESET_CUSTOMERS[0],
    items: [
      {
        productId: 'prod-cush-1',
        name: 'Hand-Tufted Velvet Accent Cushion',
        sku: 'JR-CUS-2026-002',
        category: 'Home Decor',
        unitPrice: 3248,
        quantity: 4,
        lineTotal: 12993,
      },
    ],
    subtotal: 12993,
    discountAmount: 0,
    taxAmount: 0,
    grandTotal: 12993,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    cashierName: 'Maison Jorique POS 1',
    createdAt: '2026-05-18T17:15:00Z',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-0024',
    customer: DEFAULT_PRESET_CUSTOMERS[1],
    items: [
      {
        productId: 'prod-silk-1',
        name: 'Royal Heritage Silk Duvet Ensemble',
        sku: 'RHS-2026-0001-LUX',
        category: 'Bedsheets',
        unitPrice: 28900,
        quantity: 1,
        lineTotal: 28900,
      },
      {
        productId: 'prod-throw-1',
        name: 'Fine Cashmere Blend Throw Blanket',
        sku: 'JR-THW-2026-003',
        category: 'Home Decor',
        unitPrice: 23500,
        quantity: 1,
        lineTotal: 23500,
      },
    ],
    subtotal: 52400,
    discountAmount: 0,
    taxAmount: 0,
    grandTotal: 52400,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    cashierName: 'Maison Jorique Flagship',
    createdAt: '2026-08-30T16:45:00Z',
  },
];

function getLocalCustomers(): InStoreCustomer[] {
  try {
    const raw = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(DEFAULT_PRESET_CUSTOMERS));
      return DEFAULT_PRESET_CUSTOMERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PRESET_CUSTOMERS;
  } catch {
    return DEFAULT_PRESET_CUSTOMERS;
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
    if (!raw) {
      localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(DEFAULT_PRESET_INVOICES));
      return DEFAULT_PRESET_INVOICES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PRESET_INVOICES;
  } catch {
    return DEFAULT_PRESET_INVOICES;
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
