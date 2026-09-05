import { useState, useEffect } from 'react';
import {
  Ticket,
  Plus,
  Trash2,
  Copy,
  Check,
  Percent,
  Coins,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Layers,
  ArrowRight,
} from 'lucide-react';
import type { Coupon } from '../types/coupon';
import {
  fetchCoupons,
  saveCoupon,
  deleteCoupon,
} from '../lib/utils/couponStorage';

interface CouponManagerProps {
  onSelectCouponForPOS?: (code: string) => void;
}

export default function CouponManager({ onSelectCouponForPOS }: CouponManagerProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState(1500);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | ''>('');
  const [usageLimit, setUsageLimit] = useState<number | ''>('');
  const [expiryDate, setExpiryDate] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await fetchCoupons();
      setCoupons(data);
    } catch {
      showToast('error', 'Failed to load coupon codes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    showToast('success', `Copied "${couponCode}" to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setCode('');
    setDiscountType('percentage');
    setDiscountValue(10);
    setMinOrderAmount(1500);
    setMaxDiscountAmount('');
    setUsageLimit('');
    setExpiryDate('');
    setDescription('');
    setIsActive(true);
    setShowModal(true);
  };

  const openEditModal = (c: Coupon) => {
    setEditingId(c.id);
    setCode(c.code);
    setDiscountType(c.discountType);
    setDiscountValue(c.discountValue);
    setMinOrderAmount(c.minOrderAmount);
    setMaxDiscountAmount(c.maxDiscountAmount ?? '');
    setUsageLimit(c.usageLimit ?? '');
    setExpiryDate(c.expiryDate || '');
    setDescription(c.description || '');
    setIsActive(c.isActive);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/gi, '');
    if (!cleanCode) {
      showToast('error', 'Coupon code is required.');
      return;
    }

    if (discountValue <= 0) {
      showToast('error', 'Discount value must be greater than 0.');
      return;
    }

    setIsSaving(true);
    try {
      await saveCoupon({
        id: editingId || undefined,
        code: cleanCode,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount) || 0,
        maxDiscountAmount: maxDiscountAmount !== '' ? Number(maxDiscountAmount) : undefined,
        usageLimit: usageLimit !== '' ? Number(usageLimit) : undefined,
        expiryDate: expiryDate || undefined,
        isActive,
        description: description.trim() || undefined,
      });

      showToast('success', `Coupon "${cleanCode}" saved successfully.`);
      setShowModal(false);
      await loadCoupons();
    } catch (err: any) {
      showToast('error', err?.message || 'Error saving coupon.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${couponCode}"?`)) return;
    try {
      await deleteCoupon(id);
      showToast('success', `Coupon "${couponCode}" deleted.`);
      await loadCoupons();
    } catch {
      showToast('error', 'Failed to delete coupon.');
    }
  };

  const handleToggleActive = async (c: Coupon) => {
    try {
      await saveCoupon({
        ...c,
        isActive: !c.isActive,
      });
      setCoupons((prev) =>
        prev.map((item) => (item.id === c.id ? { ...item, isActive: !item.isActive } : item))
      );
      showToast('success', `Coupon "${c.code}" is now ${!c.isActive ? 'Active' : 'Inactive'}.`);
    } catch {
      showToast('error', 'Failed to update status.');
    }
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

      {/* Top Banner */}
      <div className="rounded-3xl border border-border dark:border-[#2E2925] bg-gradient-to-r from-cream/60 via-cream/30 to-transparent dark:from-white/5 dark:via-white/[0.02] dark:to-transparent p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest border border-[#D4AF37]/20 mb-3">
            <Ticket size={12} />
            Promotional & POS Discounts
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-primary dark:text-white tracking-wide">
            Coupon & Privilege Codes
          </h2>
          <p className="text-xs text-secondary dark:text-white/60 mt-1 max-w-xl leading-relaxed">
            Create percentage or flat monetary discounts for physical boutique shoppers and VIP client tiers. These coupons can be applied during in-store counter billing.
          </p>
        </div>

        <div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-primary dark:bg-[#D4AF37] text-white dark:text-black px-5 py-3 rounded-2xl hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-all text-xs font-bold uppercase tracking-wider shadow-lg"
          >
            <Plus size={16} />
            Create Coupon Code
          </button>
        </div>
      </div>

      {/* Coupons List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <RefreshCw size={24} className="animate-spin text-[#D4AF37]" />
          <p className="text-xs text-secondary dark:text-white/60">Loading coupons...</p>
        </div>
      ) : coupons.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-border dark:border-[#2E2925] bg-white/40 dark:bg-white/[0.02]">
          <Ticket size={36} className="mx-auto text-secondary/40 dark:text-white/30 mb-3" />
          <h3 className="text-base font-medium text-primary dark:text-white">No Coupons Configured</h3>
          <p className="text-xs text-secondary dark:text-white/60 mt-1 mb-4">
            Create your first boutique discount coupon code.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-primary dark:bg-[#D4AF37] text-white dark:text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            <Plus size={14} /> Create Coupon
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coupons.map((c) => {
            const isCopied = copiedCode === c.code;

            return (
              <div
                key={c.id}
                className={`relative rounded-3xl border transition-all p-6 flex flex-col justify-between shadow-sm hover:shadow-md ${
                  c.isActive
                    ? 'bg-white dark:bg-[#1A1816] border-border dark:border-[#2E2925]'
                    : 'bg-cream/30 dark:bg-white/[0.02] border-border/60 dark:border-[#2E2925]/60 opacity-60'
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-primary dark:text-[#D4AF37] tracking-wider">
                          {c.code}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            c.isActive
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                              : 'bg-gray-100 dark:bg-white/10 text-secondary dark:text-white/50'
                          }`}
                        >
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {c.description && (
                        <p className="text-xs text-secondary dark:text-white/60 mt-1 line-clamp-2">
                          {c.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(c.code)}
                        className="p-1.5 rounded-lg text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white hover:bg-cream dark:hover:bg-white/5 transition-colors"
                        title="Copy Code"
                      >
                        {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.code)}
                        className="p-1.5 rounded-lg text-secondary dark:text-white/60 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Value Highlight Badge */}
                  <div className="my-3 p-3.5 rounded-2xl bg-cream/40 dark:bg-white/5 border border-border/70 dark:border-[#2E2925] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-secondary dark:text-white/50 block mb-0.5">
                        Discount Value
                      </span>
                      <span className="text-lg font-bold text-primary dark:text-white">
                        {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue.toLocaleString('en-IN')} FLAT OFF`}
                      </span>
                    </div>

                    <span className="p-2.5 rounded-xl bg-white dark:bg-[#100E0D] border border-border dark:border-[#2E2925] text-[#D4AF37]">
                      {c.discountType === 'percentage' ? <Percent size={18} /> : <Coins size={18} />}
                    </span>
                  </div>

                  {/* Rules Summary */}
                  <div className="space-y-1 text-xs text-secondary dark:text-white/60 py-2 border-t border-border/60 dark:border-[#2E2925]/60">
                    <div className="flex justify-between">
                      <span>Min Purchase:</span>
                      <span className="font-mono text-primary dark:text-white font-medium">
                        ₹{c.minOrderAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {c.maxDiscountAmount && (
                      <div className="flex justify-between">
                        <span>Max Discount Cap:</span>
                        <span className="font-mono text-primary dark:text-white font-medium">
                          ₹{c.maxDiscountAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                    {c.expiryDate && (
                      <div className="flex justify-between">
                        <span>Expires:</span>
                        <span className="font-mono text-primary dark:text-white font-medium">
                          {c.expiryDate}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Redemptions:</span>
                      <span className="font-mono text-primary dark:text-white font-medium">
                        {c.timesUsed} {c.usageLimit ? `/ ${c.usageLimit}` : 'times'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Controls */}
                <div className="pt-3 border-t border-border/70 dark:border-[#2E2925] flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => handleToggleActive(c)}
                    className="text-[11px] font-semibold text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white underline"
                  >
                    {c.isActive ? 'Deactivate' : 'Activate'}
                  </button>

                  {onSelectCouponForPOS && (
                    <button
                      onClick={() => onSelectCouponForPOS(c.code)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary dark:text-[#D4AF37] hover:underline"
                    >
                      Use in POS <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1A1816] rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-border dark:border-[#2E2925] animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-border dark:border-[#2E2925] flex items-center justify-between">
              <div>
                <h3 className="text-xl font-light text-primary dark:text-white tracking-wide">
                  {editingId ? 'Edit Coupon Code' : 'New Coupon Code'}
                </h3>
                <p className="text-xs text-secondary dark:text-white/60 mt-0.5">
                  Set discount values, minimum cart rules, and validity.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full hover:bg-cream dark:hover:bg-white/10 text-secondary dark:text-white/70"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
              {/* Code */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME10, FESTIVE500, VIP20"
                  className="w-full font-mono uppercase font-bold rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-3.5 py-3 text-xs font-medium text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={discountType === 'percentage' ? 100 : 100000}
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                    placeholder={discountType === 'percentage' ? '15' : '500'}
                    className="w-full font-mono rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Min Order & Max Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(parseFloat(e.target.value) || 0)}
                    placeholder="1500"
                    className="w-full font-mono rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    disabled={discountType === 'fixed'}
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(e.target.value ? parseFloat(e.target.value) : '')}
                    placeholder={discountType === 'fixed' ? 'N/A for flat' : 'e.g. 2000'}
                    className="w-full font-mono rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37] disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Usage Limit & Expiry */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">
                    Total Usage Limit
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value ? parseInt(e.target.value) : '')}
                    placeholder="Unlimited if empty"
                    className="w-full font-mono rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">
                  Campaign Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Festive season celebration code"
                  className="w-full rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border dark:border-[#2E2925]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-border dark:border-[#2E2925] text-xs font-semibold text-secondary dark:text-white/70 hover:bg-cream dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary dark:bg-[#D4AF37] text-white dark:text-black px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-all shadow-md disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingId ? 'Update Coupon' : 'Create & Activate Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
