import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, setIsCheckoutOpen, subtotal, cartCount } = useCart();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
        
        {/* Backdrop Click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md bg-white dark:bg-[#181615] h-full shadow-2xl flex flex-col justify-between z-10 border-l border-border dark:border-[#2E2925] text-primary dark:text-[#F5F2EB]"
        >
          {/* Header */}
          <div className="p-6 border-b border-border dark:border-[#2E2925] flex items-center justify-between bg-cream/40 dark:bg-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary dark:bg-[#D4AF37] text-white dark:text-black flex items-center justify-center">
                <ShoppingBag size={16} />
              </div>
              <div>
                <h3 className="text-base font-light tracking-wide text-primary dark:text-white uppercase">
                  Your Shopping Bag
                </h3>
                <p className="text-[11px] text-secondary dark:text-white/60 font-mono">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-cream dark:hover:bg-white/10 text-secondary dark:text-white/70 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-cream dark:bg-white/5 border border-border dark:border-[#2E2925] flex items-center justify-center text-secondary/50 dark:text-white/40">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-light text-primary dark:text-white mb-1">Your bag is empty</h4>
                  <p className="text-xs text-secondary dark:text-white/60 max-w-xs font-light">
                    Explore our handcrafted Egyptian organic cotton duvets, stonewashed linens, and mulberry silk.
                  </p>
                </div>
                <Link
                  to="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-md mt-2"
                >
                  <span>Explore Collection</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice = item.product.discount_price || item.product.price;
                return (
                  <div
                    key={item.product.id}
                    className="p-4 rounded-2xl bg-cream/30 dark:bg-white/5 border border-border/80 dark:border-[#2E2925] flex gap-4 items-center shadow-sm"
                  >
                    <img
                      src={item.product.images[0] || '/placeholder-image.jpg'}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-xl object-cover border border-border/50 shrink-0 bg-cream"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-primary dark:text-white truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-secondary/60 hover:text-rose-600 dark:text-white/40 dark:hover:text-rose-400 p-1 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>



                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-border dark:border-[#2E2925] rounded-lg bg-white dark:bg-[#100E0D] overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-cream dark:hover:bg-white/10 text-secondary dark:text-white/70 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-primary dark:text-white font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-1 hover:bg-cream dark:hover:bg-white/10 text-secondary dark:text-white/70 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-primary dark:text-[#D4AF37]">
                          ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & WhatsApp Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-border dark:border-[#2E2925] bg-cream/40 dark:bg-white/5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-secondary dark:text-white/70">
                  <span>Subtotal</span>
                  <span className="font-semibold text-primary dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  <span>Express Delivery</span>
                  <span>FREE</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-primary dark:text-white pt-2 border-t border-border/60 dark:border-[#2E2925]">
                  <span>Total Amount</span>
                  <span className="text-base text-primary dark:text-[#D4AF37]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-[10px] text-emerald-800 dark:text-emerald-300 font-medium">
                <ShieldCheck size={14} className="shrink-0" />
                <span>Direct WhatsApp Checkout • Instant Confirmation</span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Checkout via WhatsApp</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
