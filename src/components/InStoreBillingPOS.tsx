import { useState, useEffect, useMemo } from 'react';
import {
  Phone,
  User,
  Search,
  Plus,
  Minus,
  Trash2,
  Receipt,
  Ticket,
  CheckCircle2,
  AlertCircle,
  Clock,
  Coins,
  CreditCard,
  QrCode,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Eye,
  RefreshCw,
  X,
  History,
  Store,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Product } from '../types';
import type { InStoreCustomer, PosCartItem, InStoreInvoice } from '../types/pos';
import {
  searchCustomerByPhone,
  createInStoreInvoice,
  normalizePhone,
  getAllInStoreCustomers,
} from '../lib/utils/posStorage';
import { validateCouponCode } from '../lib/utils/couponStorage';
import RetailInvoiceModal from './RetailInvoiceModal';

interface InStoreBillingPOSProps {
  products: Product[];
  initialCouponCode?: string;
}

export default function InStoreBillingPOS({ products, initialCouponCode }: InStoreBillingPOSProps) {
  // Customer lookup state
  const [phoneInput, setPhoneInput] = useState('');
  const [customer, setCustomer] = useState<InStoreCustomer | null>(null);
  const [customerHistory, setCustomerHistory] = useState<InStoreInvoice[]>([]);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  // New customer registration fields (if phone not found)
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerCity, setNewCustomerCity] = useState('');

  // Cart state
  const [cart, setCart] = useState<PosCartItem[]>([]);

  // Product catalog search & filters
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Coupon state
  const [couponInput, setCouponInput] = useState(initialCouponCode || '');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    message?: string;
  } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'card'>('upi');
  const [cashierNotes, setCashierNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal view for completed or reprinted invoice
  const [activeInvoice, setActiveInvoice] = useState<InStoreInvoice | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  // Debounced search for customer phone
  useEffect(() => {
    const clean = normalizePhone(phoneInput);
    if (!clean || clean.length < 5) {
      setCustomer(null);
      setCustomerHistory([]);
      return;
    }

    setIsSearchingCustomer(true);
    const timer = setTimeout(async () => {
      try {
        const { customer: found, history } = await searchCustomerByPhone(clean);
        setCustomer(found);
        setCustomerHistory(history);
        if (found) {
          setNewCustomerName(found.fullName);
          setNewCustomerEmail(found.email || '');
          setNewCustomerCity(found.city || '');
        }
      } catch (err) {
        console.error('Customer lookup error:', err);
      } finally {
        setIsSearchingCustomer(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [phoneInput]);

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const q = productSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [products, productSearch, selectedCategory]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Cart operations
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.productId === product.id);
      const price = Number(product.price) || 0;
      if (idx >= 0) {
        const updated = [...prev];
        const newQty = updated[idx].quantity + 1;
        updated[idx] = {
          ...updated[idx],
          quantity: newQty,
          lineTotal: newQty * updated[idx].unitPrice,
        };
        return updated;
      } else {
        const newItem: PosCartItem = {
          productId: product.id,
          name: product.name,
          sku: product.sku || 'JR-GEN',
          category: product.category,
          image: product.images?.[0],
          unitPrice: price,
          quantity: 1,
          lineTotal: price,
        };
        return [...prev, newItem];
      }
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = Math.max(0, item.quantity + delta);
            return {
              ...item,
              quantity: newQty,
              lineTotal: newQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Subtotal & Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.lineTotal, 0);
  }, [cart]);

  // Re-validate coupon when subtotal changes
  useEffect(() => {
    if (appliedCoupon) {
      validateCouponCode(appliedCoupon.code, subtotal).then((res) => {
        if (!res.valid) {
          setAppliedCoupon(null);
          setCouponError(res.message || 'Coupon no longer meets criteria.');
        } else {
          setAppliedCoupon({
            code: appliedCoupon.code,
            discountAmount: res.discountAmount,
            message: res.message,
          });
          setCouponError('');
        }
      });
    }
  }, [subtotal]);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponError('');
    setIsValidatingCoupon(true);

    try {
      const res = await validateCouponCode(couponInput, subtotal);
      if (res.valid) {
        setAppliedCoupon({
          code: couponInput.trim().toUpperCase(),
          discountAmount: res.discountAmount,
          message: res.message,
        });
        showToast('success', res.message || 'Coupon applied successfully!');
      } else {
        setCouponError(res.message || 'Coupon could not be applied.');
        showToast('error', res.message || 'Coupon invalid.');
      }
    } catch {
      setCouponError('Failed to validate coupon.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount);

  // Complete checkout & create invoice
  const handleCompleteBill = async () => {
    const cleanPhone = normalizePhone(phoneInput);
    if (!cleanPhone || cleanPhone.length < 10) {
      showToast('error', 'Please enter a valid 10-digit customer phone number.');
      return;
    }

    const customerName = (customer?.fullName || newCustomerName || '').trim();
    if (!customerName) {
      showToast('error', 'Please provide the customer name.');
      return;
    }

    if (cart.length === 0) {
      showToast('error', 'Cart is empty. Please add items to bill.');
      return;
    }

    setIsSubmitting(true);
    try {
      const invoice = await createInStoreInvoice({
        customer: {
          phone: cleanPhone,
          fullName: customerName,
          email: newCustomerEmail.trim() || undefined,
          city: newCustomerCity.trim() || undefined,
        },
        items: cart,
        subtotal,
        couponCode: appliedCoupon?.code,
        discountAmount,
        taxAmount: 0,
        grandTotal,
        paymentMethod,
        notes: cashierNotes.trim() || undefined,
      });

      // Update customer state with latest history
      const { customer: refreshed, history } = await searchCustomerByPhone(cleanPhone);
      setCustomer(refreshed);
      setCustomerHistory(history);

      // Open printable invoice modal
      setActiveInvoice(invoice);
      showToast('success', `Invoice ${invoice.invoiceNumber} created!`);
    } catch (err: any) {
      showToast('error', err?.message || 'Error generating invoice.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForNewBill = () => {
    setCart([]);
    setPhoneInput('');
    setCustomer(null);
    setCustomerHistory([]);
    setNewCustomerName('');
    setNewCustomerEmail('');
    setNewCustomerCity('');
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    setCashierNotes('');
    setActiveInvoice(null);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md transition-all animate-bounce ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Invoice Modal */}
      {activeInvoice && (
        <RetailInvoiceModal
          invoice={activeInvoice}
          onClose={() => setActiveInvoice(null)}
          onNewBill={handleResetForNewBill}
        />
      )}

      {/* Top Banner */}
      <div className="rounded-3xl border border-border dark:border-[#2E2925] bg-gradient-to-r from-cream/60 via-cream/30 to-transparent dark:from-white/5 dark:via-white/[0.02] dark:to-transparent p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest border border-[#D4AF37]/20 mb-3">
            <Store size={12} />
            Maison JORIQUE Flagship POS
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-primary dark:text-white tracking-wide">
            In-Store Billing & Client Ledger
          </h2>
          <p className="text-xs text-secondary dark:text-white/60 mt-1 max-w-xl leading-relaxed">
            Enter the client's mobile number to reveal their lifetime purchase history and luxury tier. Add products, apply boutique privilege coupons, and generate instant retail tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetForNewBill}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] hover:bg-cream dark:hover:bg-white/5 text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/80 transition-colors shadow-sm"
          >
            <RefreshCw size={13} />
            Clear / New Bill
          </button>
        </div>
      </div>

      {/* 2-Column POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Customer Phone Lookup + Product Selector (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Customer Phone Lookup Box */}
          <div className="rounded-3xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-primary dark:text-white flex items-center gap-2">
                <Phone size={14} className="text-[#D4AF37]" />
                Customer Mobile Number *
              </label>
              {isSearchingCustomer && (
                <span className="text-[11px] text-secondary dark:text-white/60 flex items-center gap-1">
                  <RefreshCw size={11} className="animate-spin text-[#D4AF37]" />
                  Searching ledger...
                </span>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-secondary dark:text-white/40">
                <span className="font-mono text-xs font-bold mr-1">+91</span>
              </div>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Enter 10-digit phone (e.g. 9876543210)"
                maxLength={13}
                className="w-full font-mono pl-14 pr-10 py-3.5 rounded-2xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37] font-semibold tracking-wider transition-colors"
              />
              {phoneInput && (
                <button
                  type="button"
                  onClick={() => setPhoneInput('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary dark:text-white/40 hover:text-primary dark:hover:text-white"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Customer Status: Existing vs New */}
            {phoneInput.length >= 5 && (
              <div className="mt-4 pt-4 border-t border-border/70 dark:border-[#2E2925]">
                {customer ? (
                  /* Existing Customer Card with Lifetime Stats */
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-primary dark:text-white">
                            {customer.fullName}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider border border-[#D4AF37]/30">
                            {customer.totalSpent >= 40000 ? 'VIP Platinum' : customer.totalSpent >= 20000 ? 'Gold Client' : 'Classic Client'}
                          </span>
                        </div>
                        <p className="text-[11px] text-secondary dark:text-white/60 mt-0.5">
                          {customer.city ? `City: ${customer.city} • ` : ''}Client Since: {new Date(customer.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Lifetime Stats */}
                      <div className="text-right">
                        <span className="text-[10px] text-secondary dark:text-white/50 uppercase font-semibold block">
                          Lifetime Purchases
                        </span>
                        <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{customer.totalSpent.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-secondary dark:text-white/60 block">
                          {customer.ordersCount} total bills
                        </span>
                      </div>
                    </div>

                    {/* Customer Notes if present */}
                    {customer.notes && (
                      <p className="text-[11px] text-secondary dark:text-white/70 italic bg-cream/40 dark:bg-white/[0.03] p-2.5 rounded-xl border border-border/60 dark:border-[#2E2925]/60">
                        "{customer.notes}"
                      </p>
                    )}

                    {/* Expandable Lifetime Order History Timeline */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setShowHistoryDrawer((prev) => !prev)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary dark:text-[#D4AF37] hover:underline"
                      >
                        <History size={13} />
                        <span>
                          {showHistoryDrawer ? 'Hide Previous Bills' : `View All Previous Bills (${customerHistory.length})`}
                        </span>
                        {showHistoryDrawer ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>

                      {showHistoryDrawer && (
                        <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1">
                          {customerHistory.length === 0 ? (
                            <p className="text-xs text-secondary dark:text-white/50 italic py-2">
                              No previous physical receipts recorded yet.
                            </p>
                          ) : (
                            customerHistory.map((pastInv) => (
                              <div
                                key={pastInv.id}
                                className="p-3 rounded-xl bg-cream/30 dark:bg-white/[0.02] border border-border/70 dark:border-[#2E2925] flex items-center justify-between text-xs hover:border-[#D4AF37]/50 transition-colors"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-primary dark:text-white">
                                      {pastInv.invoiceNumber}
                                    </span>
                                    <span className="text-[10px] text-secondary dark:text-white/60">
                                      {new Date(pastInv.createdAt).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                      })}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-secondary dark:text-white/70 mt-0.5">
                                    {pastInv.items.length} item(s) • Paid via {pastInv.paymentMethod.toUpperCase()}
                                  </p>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="font-mono font-bold text-primary dark:text-[#D4AF37]">
                                    ₹{pastInv.grandTotal.toLocaleString('en-IN')}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setActiveInvoice(pastInv)}
                                    className="p-1.5 rounded-lg border border-border dark:border-[#2E2925] text-secondary dark:text-white/70 hover:text-primary dark:hover:text-white hover:bg-white dark:hover:bg-white/10"
                                    title="View & Reprint Invoice"
                                  >
                                    <Eye size={13} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* New Customer Registration Inline Inputs */
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-semibold">
                      <Sparkles size={13} />
                      <span>New Walk-in Client Profile</span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-secondary dark:text-white/60 mb-1">
                          Client Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newCustomerName}
                          onChange={(e) => setNewCustomerName(e.target.value)}
                          placeholder="e.g. Vikram Singhania"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] text-xs text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-secondary dark:text-white/60 mb-1">
                          City / Locality (Optional)
                        </label>
                        <input
                          type="text"
                          value={newCustomerCity}
                          onChange={(e) => setNewCustomerCity(e.target.value)}
                          placeholder="e.g. South Delhi, Mumbai"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] text-xs text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Product Catalog Picker */}
          <div className="rounded-3xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary dark:text-white flex items-center gap-2">
                  <ShoppingBag size={14} className="text-[#D4AF37]" />
                  Product Catalog & Quick-Add
                </h3>
                <p className="text-[11px] text-secondary dark:text-white/60 mt-0.5">
                  Click to add luxury pieces directly into the active bill.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary dark:text-white/40" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search name, SKU, barcode..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] text-xs text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary dark:bg-[#D4AF37] text-white dark:text-black font-bold shadow-xs'
                      : 'bg-cream/40 dark:bg-white/5 text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 max-h-96 overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const inCart = cart.find((c) => c.productId === p.id);
                return (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl border border-border/80 dark:border-[#2E2925] bg-cream/20 dark:bg-white/[0.02] hover:border-primary/40 dark:hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between gap-2"
                  >
                    <div className="flex gap-2.5">
                      {p.images && p.images[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover border border-border/60 dark:border-[#2E2925]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-cream dark:bg-white/5 flex items-center justify-center text-secondary/40 font-serif">
                          J
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary dark:text-white truncate">
                          {p.name}
                        </p>
                        <p className="text-[10px] font-mono text-secondary dark:text-white/50 truncate">
                          {p.sku || 'No SKU'}
                        </p>
                        <p className="text-xs font-bold text-primary dark:text-[#D4AF37] mt-1">
                          ₹{Number(p.price).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(p)}
                      className={`w-full py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
                        inCart
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-primary dark:bg-[#D4AF37] text-white dark:text-black hover:bg-primary/90 dark:hover:bg-[#E5C158]'
                      }`}
                    >
                      <Plus size={12} />
                      {inCart ? `Added (${inCart.quantity})` : 'Add to Bill'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Bill Cart, Coupon & Checkout (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] p-6 shadow-sm space-y-5 sticky top-28">
          <div className="flex items-center justify-between border-b border-border dark:border-[#2E2925] pb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary dark:text-white flex items-center gap-2">
                <Receipt size={15} className="text-[#D4AF37]" />
                Active Order Bill
              </h3>
              <p className="text-[11px] text-secondary dark:text-white/60">
                {cart.length} item line(s) in counter cart
              </p>
            </div>

            {cart.length > 0 && (
              <button
                type="button"
                onClick={() => setCart([])}
                className="text-[11px] text-red-500 hover:underline"
              >
                Empty Cart
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-secondary dark:text-white/50 text-xs">
                <ShoppingBag size={28} className="mx-auto mb-2 opacity-40" />
                No items added to the bill yet.
                <br />
                Select items from the catalog.
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.productId}
                  className="p-3 rounded-2xl bg-cream/30 dark:bg-white/[0.02] border border-border/70 dark:border-[#2E2925] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-primary dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] font-mono text-secondary dark:text-white/60">
                      ₹{item.unitPrice.toLocaleString('en-IN')} × {item.quantity}
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 bg-white dark:bg-[#100E0D] px-2 py-1 rounded-xl border border-border dark:border-[#2E2925]">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="p-0.5 text-secondary dark:text-white/70 hover:text-primary dark:hover:text-white"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="font-mono font-bold text-primary dark:text-white w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="p-0.5 text-secondary dark:text-white/70 hover:text-primary dark:hover:text-white"
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-primary dark:text-white block">
                      ₹{item.lineTotal.toLocaleString('en-IN')}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      className="text-[10px] text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Coupon Code Section */}
          <div className="pt-3 border-t border-border dark:border-[#2E2925] space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-secondary dark:text-white/60 flex items-center gap-1.5">
              <Ticket size={12} className="text-[#D4AF37]" />
              Apply Boutique Coupon Code
            </label>

            {appliedCoupon ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    ✓ {appliedCoupon.code} Applied
                  </span>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    -₹{appliedCoupon.discountAmount.toLocaleString('en-IN')} privilege discount
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME10, FESTIVE500"
                  className="flex-1 font-mono uppercase px-3.5 py-2 rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] text-xs text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                />
                <button
                  type="button"
                  disabled={isValidatingCoupon || !couponInput.trim() || subtotal <= 0}
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 rounded-xl bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-all disabled:opacity-50"
                >
                  {isValidatingCoupon ? 'Checking...' : 'Apply'}
                </button>
              </div>
            )}
            {couponError && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400">{couponError}</p>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="pt-3 border-t border-border dark:border-[#2E2925] space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-secondary dark:text-white/60 block">
              Tender / Payment Mode
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-2 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-primary dark:text-[#D4AF37] font-bold shadow-xs'
                    : 'border-border dark:border-[#2E2925] text-secondary dark:text-white/60 hover:bg-cream/40 dark:hover:bg-white/5'
                }`}
              >
                <QrCode size={14} />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-primary dark:text-[#D4AF37] font-bold shadow-xs'
                    : 'border-border dark:border-[#2E2925] text-secondary dark:text-white/60 hover:bg-cream/40 dark:hover:bg-white/5'
                }`}
              >
                <CreditCard size={14} />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-primary dark:text-[#D4AF37] font-bold shadow-xs'
                    : 'border-border dark:border-[#2E2925] text-secondary dark:text-white/60 hover:bg-cream/40 dark:hover:bg-white/5'
                }`}
              >
                <Coins size={14} />
                <span>Cash</span>
              </button>
            </div>
          </div>

          {/* Financial Totals */}
          <div className="pt-3 border-t border-border dark:border-[#2E2925] space-y-1.5 text-xs">
            <div className="flex justify-between text-secondary dark:text-white/70">
              <span>Subtotal:</span>
              <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Discount ({appliedCoupon?.code}):</span>
                <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-primary dark:text-[#D4AF37] pt-2 border-t border-border dark:border-[#2E2925]">
              <span>Grand Total:</span>
              <span className="font-mono text-lg">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Checkout Submit Button */}
          <button
            type="button"
            disabled={isSubmitting || cart.length === 0 || !phoneInput}
            onClick={handleCompleteBill}
            className="w-full py-4 rounded-2xl bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold uppercase tracking-widest hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Receipt size={16} />
            {isSubmitting ? 'Generating Invoice...' : 'Complete Bill & Generate Invoice'}
          </button>
        </div>
      </div>
    </div>
  );
}
