export interface InStoreCustomer {
  id: string;
  phone: string; // Primary lookup key (10-digit or international format)
  fullName: string;
  email?: string;
  city?: string;
  address?: string;
  totalSpent: number;
  ordersCount: number;
  lastVisit: string;
  notes?: string;
  createdAt: string;
}

export interface PosCartItem {
  productId: string;
  name: string;
  sku: string;
  category: string;
  image?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface InStoreInvoice {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-0042
  customer: InStoreCustomer;
  items: PosCartItem[];
  subtotal: number;
  couponCode?: string;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  paymentMethod: 'cash' | 'upi' | 'card' | 'split';
  paymentStatus: 'paid' | 'pending';
  notes?: string;
  cashierName?: string;
  createdAt: string;
}
