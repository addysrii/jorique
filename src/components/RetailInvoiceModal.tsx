import { Printer, Share2, X, CheckCircle2, Sparkles, Building2, Phone, Calendar, CreditCard } from 'lucide-react';
import type { InStoreInvoice } from '../types/pos';

interface RetailInvoiceModalProps {
  invoice: InStoreInvoice;
  onClose: () => void;
  onNewBill: () => void;
}

export default function RetailInvoiceModal({ invoice, onClose, onNewBill }: RetailInvoiceModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const cleanPhone = invoice.customer.phone.replace(/\D/g, '');
    const recipient = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const itemsSummary = invoice.items
      .map((item, idx) => `${idx + 1}. ${item.name} (${item.sku}) × ${item.quantity} = ₹${item.lineTotal.toLocaleString('en-IN')}`)
      .join('\n');

    const message = `✨ *JORIQUE — Official Retail Tax Invoice* ✨\n\n` +
      `Dear ${invoice.customer.fullName},\n` +
      `Thank you for shopping at Maison JORIQUE.\n\n` +
      `*Invoice No:* ${invoice.invoiceNumber}\n` +
      `*Date:* ${new Date(invoice.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}\n` +
      `*Payment:* ${invoice.paymentMethod.toUpperCase()} (PAID)\n\n` +
      `*Items Purchased:*\n${itemsSummary}\n\n` +
      (invoice.discountAmount > 0 ? `*Discount (${invoice.couponCode || 'Promo'}):* -₹${invoice.discountAmount.toLocaleString('en-IN')}\n` : '') +
      `*Grand Total:* ₹${invoice.grandTotal.toLocaleString('en-IN')}\n\n` +
      `We hope our heirloom textiles bring sanctuary to your home.\n` +
      `_JORIQUE Flagship Store • Customer Care: +91 98765 43210_`;

    const url = `https://wa.me/${recipient}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const formattedDate = new Date(invoice.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = new Date(invoice.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#1A1816] rounded-3xl max-w-2xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-border dark:border-[#2E2925] overflow-hidden my-auto animate-in fade-in zoom-in-95">
        {/* Modal Action Header (Hidden on Print) */}
        <div className="print:hidden p-4 sm:p-5 border-b border-border dark:border-[#2E2925] flex items-center justify-between bg-cream/40 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 size={16} />
            </span>
            <div>
              <h3 className="text-sm font-bold text-primary dark:text-white">
                Invoice Generated Successfully
              </h3>
              <p className="text-[11px] text-secondary dark:text-white/60 font-mono">
                {invoice.invoiceNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
              title="Share via WhatsApp"
            >
              <Share2 size={13} />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary dark:bg-[#D4AF37] text-white dark:text-black hover:bg-primary/90 dark:hover:bg-[#E5C158] text-xs font-bold transition-all shadow-xs"
            >
              <Printer size={13} />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white hover:bg-cream dark:hover:bg-white/5 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 print:p-0 print:m-0 print:overflow-visible text-primary dark:text-[#F5F2EB]">
          <div id="printable-invoice" className="bg-white dark:bg-[#151311] p-6 sm:p-8 rounded-2xl border border-border/80 dark:border-[#2E2925] shadow-xs text-xs space-y-6">
            {/* Invoice Top Brand Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-border dark:border-[#2E2925]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-serif tracking-widest text-xl font-bold uppercase text-primary dark:text-[#D4AF37]">
                    JORIQUE
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                    Boutique Tax Invoice
                  </span>
                </div>
                <p className="text-[11px] text-secondary dark:text-white/60 leading-relaxed max-w-xs">
                  Maison JORIQUE Flagship Store • Luxury Home Textiles & Fine Linens
                  <br />
                  GSTIN: 27AAAAJ9988P1Z5
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <div className="font-mono font-bold text-sm text-primary dark:text-[#D4AF37]">
                  {invoice.invoiceNumber}
                </div>
                <p className="text-[11px] text-secondary dark:text-white/60">
                  {formattedDate} • {formattedTime}
                </p>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                  Paid via {invoice.paymentMethod.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Billed To Customer Details */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-cream/40 dark:bg-white/[0.03] border border-border/70 dark:border-[#2E2925]/70">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-secondary dark:text-white/50 block mb-1">
                  Billed To Client:
                </span>
                <p className="text-xs font-bold text-primary dark:text-white">
                  {invoice.customer.fullName}
                </p>
                <p className="text-[11px] font-mono text-secondary dark:text-white/70 mt-0.5">
                  Ph: {invoice.customer.phone}
                </p>
                {invoice.customer.email && (
                  <p className="text-[11px] text-secondary dark:text-white/60">
                    {invoice.customer.email}
                  </p>
                )}
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold tracking-wider text-secondary dark:text-white/50 block mb-1">
                  Store & Terminal:
                </span>
                <p className="text-xs font-semibold text-primary dark:text-white">
                  Flagship Showroom
                </p>
                <p className="text-[11px] text-secondary dark:text-white/60 mt-0.5">
                  {invoice.cashierName || 'POS Terminal 01'}
                </p>
                {invoice.customer.city && (
                  <p className="text-[11px] text-secondary dark:text-white/60">
                    Destination: {invoice.customer.city}
                  </p>
                )}
              </div>
            </div>

            {/* Itemized Table */}
            <div>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border dark:border-[#2E2925] text-[10px] uppercase tracking-wider text-secondary dark:text-white/50">
                    <th className="py-2.5 font-semibold">#</th>
                    <th className="py-2.5 font-semibold">Item & SKU</th>
                    <th className="py-2.5 font-semibold text-center">Qty</th>
                    <th className="py-2.5 font-semibold text-right">Unit Rate</th>
                    <th className="py-2.5 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-[#2E2925]/60">
                  {invoice.items.map((item, idx) => (
                    <tr key={idx} className="text-xs">
                      <td className="py-3 text-secondary dark:text-white/50">{idx + 1}</td>
                      <td className="py-3">
                        <p className="font-semibold text-primary dark:text-white">{item.name}</p>
                        <span className="font-mono text-[10px] text-secondary dark:text-white/60">
                          SKU: {item.sku}
                        </span>
                      </td>
                      <td className="py-3 text-center font-mono font-medium">{item.quantity}</td>
                      <td className="py-3 text-right font-mono text-secondary dark:text-white/80">
                        ₹{item.unitPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-primary dark:text-white">
                        ₹{item.lineTotal.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals & Discounts Breakdown */}
            <div className="pt-4 border-t border-border dark:border-[#2E2925] flex justify-end">
              <div className="w-full sm:w-72 space-y-2 text-xs">
                <div className="flex justify-between text-secondary dark:text-white/70">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{invoice.subtotal.toLocaleString('en-IN')}</span>
                </div>

                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>
                      Discount {invoice.couponCode ? `(${invoice.couponCode})` : ''}:
                    </span>
                    <span className="font-mono">-₹{invoice.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {invoice.taxAmount > 0 && (
                  <div className="flex justify-between text-secondary dark:text-white/70">
                    <span>GST (Included / Applied):</span>
                    <span className="font-mono">₹{invoice.taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-primary dark:text-[#D4AF37] pt-2 border-t border-border dark:border-[#2E2925]">
                  <span>Grand Total:</span>
                  <span className="font-mono text-base">₹{invoice.grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Footer Terms & Maison Notes */}
            <div className="pt-4 border-t border-dashed border-border dark:border-[#2E2925] text-[10px] text-secondary dark:text-white/50 space-y-1 text-center">
              <p className="font-medium text-primary dark:text-white">
                Thank you for choosing Maison JORIQUE.
              </p>
              <p>
                Heirloom textiles carry a 7-day boutique exchange guarantee in original unworn luxury packaging with proof of purchase.
              </p>
              <p className="font-mono text-[9px] text-secondary/60">
                Authorized Retail Copy • Computer Generated Tax Invoice
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer (Hidden on Print) */}
        <div className="print:hidden p-4 sm:p-5 border-t border-border dark:border-[#2E2925] bg-cream/30 dark:bg-white/[0.02] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-border dark:border-[#2E2925] text-xs font-semibold text-secondary dark:text-white/70 hover:bg-cream dark:hover:bg-white/5 transition-colors"
          >
            Close Receipt
          </button>
          <button
            onClick={onNewBill}
            className="inline-flex items-center gap-2 bg-primary dark:bg-[#D4AF37] text-white dark:text-black px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-all shadow-md"
          >
            <Sparkles size={14} />
            Start New Bill
          </button>
        </div>
      </div>
    </div>
  );
}
