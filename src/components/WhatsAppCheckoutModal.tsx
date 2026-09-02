import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, MapPin, User, Phone, FileText, CheckCircle2, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../lib/api/orders';

export default function WhatsAppCheckoutModal() {
  const { cart, subtotal, isCheckoutOpen, setIsCheckoutOpen, clearCart, whatsappNumber } = useCart();
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (!isCheckoutOpen) return null;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
      alert('Please fill in all delivery details (Name, Phone, Address, City & Pincode).');
      return;
    }

    setLoading(true);

    const generatedOrderNum = `JRQ-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    setOrderNumber(generatedOrderNum);

    // Save order in backend / database
    try {
      await orderService.createOrder({
        order_number: generatedOrderNum,
        total: subtotal,
        items: cart.map((item) => ({
          product_id: item.product.id,
          sku: item.product.sku,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.discount_price || item.product.price,
        })),
        customer_details: {
          name: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
          notes: notes.trim(),
        },
      });
    } catch (err) {
      console.warn('Order recording to backend skipped or deferred:', err);
    }

    // Format WhatsApp message
    const formattedItems = cart
      .map((item, idx) => {
        const itemPrice = item.product.discount_price || item.product.price;
        const lineTotal = itemPrice * item.quantity;
        return `${idx + 1}. *${item.product.name}*\n   • SKU: ${item.product.sku || 'N/A'}\n   • Qty: ${item.quantity} × ₹${itemPrice.toLocaleString('en-IN')} = ₹${lineTotal.toLocaleString('en-IN')}`;
      })
      .join('\n\n');

    const todayDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const message = `🛍️ *NEW ORDER FROM JORIQUE WEBSITE*
────────────────────────────
📋 *Order ID:* #${generatedOrderNum}
📅 *Date:* ${todayDate}

👤 *CUSTOMER DELIVERY DETAILS:*
• *Name:* ${fullName.trim()}
• *Phone:* ${phone.trim()}
• *Address:* ${address.trim()}
• *City:* ${city.trim()} - ${pincode.trim()}
${notes.trim() ? `• *Notes:* ${notes.trim()}\n` : ''}
📦 *ORDER SUMMARY:*
${formattedItems}

────────────────────────────
💰 *GRAND TOTAL:* ₹${subtotal.toLocaleString('en-IN')}
🚚 *Delivery:* FREE Express Delivery
────────────────────────────
Please confirm this order and advise on delivery timeline. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    // Trigger WhatsApp redirect
    window.open(whatsappUrl, '_blank');

    setLoading(false);
    setOrderCompleted(true);
    clearCart();
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderCompleted(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#181615] rounded-3xl border border-border dark:border-[#2E2925] shadow-2xl overflow-hidden my-auto text-primary dark:text-[#F5F2EB]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border dark:border-[#2E2925] bg-cream/40 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <MessageCircle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-light tracking-wide text-primary dark:text-white">
                  {orderCompleted ? 'Order Sent via WhatsApp!' : 'Delivery Details & WhatsApp Order'}
                </h3>
                <p className="text-xs text-secondary dark:text-white/60">
                  {orderCompleted ? 'Direct chat initialized with JORIQUE Concierge' : 'No credit card required • Order directly on WhatsApp'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-cream dark:hover:bg-white/10 text-secondary dark:text-white/70 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {orderCompleted ? (
            /* Order Success View */
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  ORDER #{orderNumber}
                </span>
                <h4 className="text-2xl font-light text-primary dark:text-white mt-3">
                  Thank You for Your Order!
                </h4>
                <p className="text-xs text-secondary dark:text-white/70 max-w-md mx-auto mt-2 leading-relaxed font-light">
                  Your order details have been formatted and sent to our WhatsApp Concierge. If WhatsApp didn't open automatically, click the button below to resume your chat.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-md"
                >
                  Done & Back to Shop
                </button>
              </div>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">

              {/* Order Items Brief */}
              <div className="p-4 rounded-2xl bg-cream/40 dark:bg-white/5 border border-border/70 dark:border-[#2E2925] space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/60">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag size={14} className="text-primary dark:text-[#D4AF37]" /> Order Summary ({cart.reduce((a, c) => a + c.quantity, 0)} items)
                  </span>
                  <span className="text-primary dark:text-[#D4AF37] text-sm font-bold">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="divide-y divide-border/40 dark:divide-[#2E2925] max-h-36 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 truncate">
                        <img
                          src={item.product.images[0] || '/placeholder-image.jpg'}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover border border-border/50 shrink-0"
                        />
                        <span className="truncate text-primary dark:text-white font-medium">{item.product.name}</span>
                      </div>
                      <span className="text-secondary dark:text-white/60 font-mono text-[11px] shrink-0 ml-2">
                        {item.quantity} × ₹{(item.product.discount_price || item.product.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details Fields */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary dark:text-[#D4AF37]">
                  1. Delivery Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary/60 dark:text-white/40" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aditya Srivastava"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] text-xs text-primary dark:text-white placeholder:text-secondary/40 focus:outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary/60 dark:text-white/40" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 99193 88211"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] text-xs text-primary dark:text-white placeholder:text-secondary/40 focus:outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1">
                    Complete Street Address *
                  </label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-3 text-secondary/60 dark:text-white/40" />
                    <textarea
                      rows={2}
                      required
                      placeholder="House/Flat No., Street, Landmark..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] text-xs text-primary dark:text-white placeholder:text-secondary/40 focus:outline-none focus:border-primary dark:focus:border-[#D4AF37] resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. New Delhi"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] text-xs text-primary dark:text-white placeholder:text-secondary/40 focus:outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1">
                      Pincode / Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 110001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] text-xs text-primary dark:text-white placeholder:text-secondary/40 focus:outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1">
                    Special Delivery Notes / Customization (Optional)
                  </label>
                  <div className="relative">
                    <FileText size={15} className="absolute left-3.5 top-3 text-secondary/60 dark:text-white/40" />
                    <textarea
                      rows={2}
                      placeholder="Gift wrap request, specific delivery timing..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] text-xs text-primary dark:text-white placeholder:text-secondary/40 focus:outline-none focus:border-primary dark:focus:border-[#D4AF37] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Security Banner */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300">
                <ShieldCheck size={16} className="shrink-0" />
                <span>You will chat directly with JORIQUE Concierge on WhatsApp to confirm payment & dispatch.</span>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <MessageCircle size={18} />
                <span>{loading ? 'Preparing Order...' : 'Place Order & Chat on WhatsApp'}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
