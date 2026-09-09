import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MessageCircle,
  MapPin,
  User,
  Phone,
  FileText,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  Video,
  ArrowRight,
  Lock,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../lib/api/orders';
import GoogleAuthButton from './GoogleAuthButton';

export default function WhatsAppCheckoutModal() {
  const { cart, subtotal, isCheckoutOpen, setIsCheckoutOpen, clearCart, whatsappNumber } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || user?.fullName || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Update name if user logs in
  useEffect(() => {
    if (user && !fullName) {
      setFullName(user.fullName || user.user_metadata?.full_name || '');
    }
  }, [user]);

  // If user just authenticated after being redirected to login, automatically reopen checkout
  useEffect(() => {
    const shouldReopen = localStorage.getItem('jorique_reopen_checkout');
    if (shouldReopen === 'true' && user) {
      localStorage.removeItem('jorique_reopen_checkout');
      setIsCheckoutOpen(true);
    }
  }, [user, setIsCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strict authentication barrier
    if (!user) {
      alert('Please log in or register before placing your order.');
      return;
    }

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
        customer_id: user?.id,
        customer_email: user?.email,
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
        return `${idx + 1}. *${item.product.name}*\n   • Qty: ${item.quantity} × ₹${itemPrice.toLocaleString('en-IN')} = ₹${lineTotal.toLocaleString('en-IN')}`;
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

👤 *CUSTOMER DETAILS (Verified Account):*
• *Account Email:* ${user.email}
• *Recipient Name:* ${fullName.trim()}
• *Phone:* ${phone.trim()}
• *Delivery Address:* ${address.trim()}
• *City:* ${city.trim()} - ${pincode.trim()}
${notes.trim() ? `• *Notes:* ${notes.trim()}\n` : ''}
📦 *ORDER SUMMARY:*
${formattedItems}

────────────────────────────
💰 *GRAND TOTAL:* ₹${subtotal.toLocaleString('en-IN')}
🚚 *Delivery:* FREE Express Delivery
────────────────────────────
⚠️ *NOTICE:* Handcrafted & pre-dispatch inspected. For transit damage or defect claims, a continuous 360° unboxing video recorded prior to opening is mandatory within 48 hours of delivery (care@jorique.in).
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

  const handleNavigateToAuth = (path: '/login' | '/signup') => {
    localStorage.setItem('jorique_reopen_checkout', 'true');
    setIsCheckoutOpen(false);
    navigate(path, {
      state: {
        from: location.pathname,
        openCheckout: true,
        message: 'Please sign in to finalize and place your order.',
      },
    });
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
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  orderCompleted
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : !user
                    ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]'
                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {orderCompleted ? (
                  <CheckCircle2 size={20} />
                ) : !user ? (
                  <Lock size={20} />
                ) : (
                  <MessageCircle size={20} />
                )}
              </div>
              <div>
                <h3 className="text-lg font-light tracking-wide text-primary dark:text-white">
                  {orderCompleted
                    ? 'Order Sent via WhatsApp!'
                    : !user
                    ? 'Account Login Required'
                    : 'Delivery Details & WhatsApp Order'}
                </h3>
                <p className="text-xs text-secondary dark:text-white/60">
                  {orderCompleted
                    ? 'Direct chat initialized with JORIQUE Concierge'
                    : !user
                    ? 'Please log in to place your order with verified tracking'
                    : 'Verified Customer • Direct WhatsApp confirmation'}
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
            /* ── Order Success View ── */
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

              {/* Mandatory Unboxing Video Reminder */}
              <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-left space-y-2 max-w-md mx-auto">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold text-xs uppercase tracking-wider">
                  <Video size={15} />
                  <span>Important Delivery Reminder</span>
                </div>
                <p className="text-xs text-secondary dark:text-white/80 leading-relaxed">
                  Upon arrival, please record a <strong>continuous 360° unboxing video</strong> starting <em>before</em> breaking the outer seal. Defect and damage claims must be registered within <strong>48 hours</strong> of delivery.
                </p>
                <Link
                  to="/return-policy"
                  target="_blank"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#851C25] dark:text-[#D4AF37] hover:underline pt-1"
                >
                  <span>Review Return & Exchange Policy</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-md"
                >
                  Done & Back to Shop
                </button>
              </div>
            </div>
          ) : !user ? (
            /* ── Sign In Required View (Enforces Login Before Order Placement) ── */
            <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Order Items Summary Teaser */}
              <div className="p-4 rounded-2xl bg-cream/40 dark:bg-white/5 border border-border/70 dark:border-[#2E2925] space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/60">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag size={14} className="text-primary dark:text-[#D4AF37]" /> Your Order ({cart.reduce((a, c) => a + c.quantity, 0)} items saved)
                  </span>
                  <span className="text-primary dark:text-[#D4AF37] text-sm font-bold">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white/60 dark:bg-[#1A1816] border border-border/60 dark:border-white/10 shrink-0 text-xs"
                    >
                      <img
                        src={item.product.images[0] || '/placeholder-image.jpg'}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <div className="truncate max-w-[130px]">
                        <p className="truncate font-medium text-[11px] text-primary dark:text-white">{item.product.name}</p>
                        <p className="text-[10px] text-secondary dark:text-white/50">{item.quantity} × ₹{(item.product.discount_price || item.product.price).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Login Callout Card */}
              <div className="text-center py-4 px-2 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto shadow-sm">
                  <Lock size={26} />
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-light text-primary dark:text-white tracking-wide">
                    Sign in to Place Your Order
                  </h4>
                  <p className="text-xs text-secondary dark:text-white/70 max-w-md mx-auto mt-2 leading-relaxed">
                    To connect your order with WhatsApp concierge, track shipment milestones, and secure your 48-hour video exchange guarantee, please sign in.
                  </p>
                </div>
              </div>

              {/* Authentication Actions */}
              <div className="space-y-3 max-w-md mx-auto">
                {/* 1-Click Google Sign-In */}
                <GoogleAuthButton
                  onSuccess={() => {
                    // Google auth succeeds, user is updated in AuthContext automatically!
                  }}
                  text="Continue with Google to Checkout"
                  className="w-full py-3.5 px-6 rounded-2xl bg-white dark:bg-[#100E0D] hover:bg-gray-50 dark:hover:bg-white/5 text-gray-800 dark:text-white border border-gray-200 dark:border-white/15 text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2.5 active:scale-[0.99]"
                />

                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-border/70 dark:border-[#2E2925] w-full" />
                  <span className="bg-white dark:bg-[#181615] px-3 text-[10px] font-semibold tracking-widest text-secondary/60 dark:text-white/40 uppercase absolute">
                    Or
                  </span>
                </div>

                {/* Email / WhatsApp Sign-In Button */}
                <button
                  type="button"
                  onClick={() => handleNavigateToAuth('/login')}
                  className="w-full py-3.5 rounded-2xl bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold uppercase tracking-[0.18em] shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <LogIn size={15} />
                  <span>Sign In with Email or Phone</span>
                </button>

                {/* Create Account Link */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => handleNavigateToAuth('/signup')}
                    className="inline-flex items-center gap-1.5 text-xs text-secondary dark:text-white/70 hover:text-primary dark:hover:text-[#D4AF37] transition-colors"
                  >
                    <UserPlus size={13} />
                    <span>Don't have an account? <strong className="underline text-primary dark:text-[#D4AF37]">Sign Up</strong></span>
                  </button>
                </div>
              </div>

              {/* Assurance Guarantee */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-secondary/80 dark:text-white/50 pt-2 border-t border-border/50 dark:border-[#2E2925]">
                <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Your cart items remain securely preserved while you sign in.</span>
              </div>
            </div>
          ) : (
            /* ── Logged-in Form View (Order Placement) ── */
            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Logged in User Bar */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Ordering as: <strong>{user.fullName || user.user_metadata?.full_name || user.email}</strong></span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md">
                  Verified
                </span>
              </div>

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
                  Delivery Details
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
                        placeholder="Recipient full name"
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
                      placeholder="House/Flat No., Building, Street, Landmark..."
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

              {/* Policy Acknowledgement */}
              <div className="text-[11px] text-secondary dark:text-white/60 leading-relaxed px-1">
                By placing this order, you acknowledge that all items undergo pre-dispatch inspection. For transit damage or defects, claims must be made within 48 hours accompanied by a mandatory 360° unboxing video.{' '}
                <Link
                  to="/return-policy"
                  target="_blank"
                  className="text-[#851C25] dark:text-[#D4AF37] underline font-medium hover:opacity-80"
                >
                  Return & Exchange Policy
                </Link>
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
