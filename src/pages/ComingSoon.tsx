import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Facebook, MessageCircle, Mail, Check, ArrowRight, Sparkles } from 'lucide-react';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail('');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB] flex flex-col justify-between selection:bg-[#C5B49D] selection:text-white font-sans relative overflow-hidden transition-colors duration-300">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#EBE0D2]/50 dark:from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-radial from-[#E5D7C4]/30 dark:from-[#C4A482]/10 to-transparent pointer-events-none blur-3xl -z-10" />

      {/* Top Header Bar */}
      <header className="py-6 px-6 sm:px-12 flex justify-between items-center z-10">
        <Link to="/connect" className="text-xs font-semibold tracking-widest uppercase text-[#D4AF37] hover:text-primary dark:hover:text-white transition-colors flex items-center gap-1.5">
          <span>Digital Business Card</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link to="/" className="text-xs font-semibold tracking-widest uppercase text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white">
          Enter Website →
        </Link>
      </header>

      {/* Main Content Center */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 py-8 z-10 max-w-2xl mx-auto text-center">
        
        {/* Official JORIQUE Logo Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-col items-center"
        >
          <h1 className="text-4xl sm:text-6xl font-light tracking-[0.25em] pl-[0.25em] text-primary dark:text-white uppercase">
            JORIQUE
          </h1>
          
          <div className="w-32 sm:w-44 h-[1px] bg-[#D4AF37] mx-auto my-3 opacity-80" />
          
          <p className="text-sm sm:text-base md:text-lg text-primary dark:text-[#D4AF37] italic tracking-wide">
            Where Comfort Meets Design
          </p>
        </motion.div>

        {/* Coming Soon Notice Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-3xl p-6 sm:p-10 shadow-xl w-full backdrop-blur-sm"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream dark:bg-white/5 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-4 border border-border dark:border-[#2E2925]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Grand Opening Collection</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-light text-primary dark:text-white mb-3">
            Something Extraordinary is Coming
          </h2>
          
          <p className="text-xs sm:text-sm text-secondary dark:text-white/60 font-light leading-relaxed max-w-lg mx-auto mb-8">
            We are meticulously preparing our complete luxury home textiles collection. 
            Subscribe to receive exclusive early access and special launch invitations.
          </p>

          {/* Email Subscription Form */}
          <AnimatePresence mode="wait">
            {!subscribed ? (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow px-4 py-3 bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] rounded-xl text-xs sm:text-sm text-primary dark:text-white placeholder:text-secondary/40 focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary dark:bg-[#D4AF37] text-white dark:text-black px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-all disabled:opacity-50 shrink-0 shadow-md"
                >
                  {loading ? 'Subscribing...' : 'Notify Me'}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center justify-center gap-3 text-emerald-800 dark:text-emerald-300 max-w-md mx-auto"
              >
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold">You are on the VIP early access list!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 text-center text-xs text-secondary dark:text-white/50 border-t border-border/60 dark:border-[#2E2925] z-10">
        © 2026 JORIQUE Textiles. All rights reserved.
      </footer>
    </div>
  );
}
