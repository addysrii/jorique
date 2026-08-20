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
    <div className="min-h-screen bg-[#F5F0EB] text-[#1C1817] flex flex-col justify-between selection:bg-[#C5B49D] selection:text-white font-sans relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial from-[#EBE0D2]/70 via-[#F5F0EB]/30 to-transparent pointer-events-none blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-radial from-[#E5D7C4]/40 to-transparent pointer-events-none blur-3xl -z-10" />

      {/* Top Header Bar */}
      <header className="py-6 px-6 sm:px-12 flex justify-between items-center z-10">
        <Link to="/connect" className="text-xs font-medium tracking-widest uppercase text-[#8C7047] hover:text-[#1C1817] transition-colors flex items-center gap-1.5">
          <span>Digital Business Card</span>
          <ArrowRight className="w-3.5 h-3.5" />
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
          <h1 className="text-4xl sm:text-6xl font-serif tracking-[0.25em] pl-[0.25em] text-[#1C1817] font-normal uppercase">
            JORIQUE
          </h1>
          
          {/* Thin horizontal line directly below JORIQUE text */}
          <div className="w-32 sm:w-44 h-[1px] bg-[#C5B49D] mx-auto my-3 opacity-90" />
          
          {/* Tagline directly below line */}
          <p className="text-sm sm:text-base md:text-lg font-serif text-[#2C2623] italic tracking-wide">
            Where Comfort Meets Design
          </p>
        </motion.div>

        {/* Coming Soon Notice Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-[#FAF7F3] border border-[#E8DFC0]/80 rounded-3xl p-6 sm:p-10 shadow-sm w-full backdrop-blur-sm"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFE6DA] text-[#8C7047] text-xs font-medium uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Grand Opening Soon</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif text-[#1C1817] font-semibold mb-3">
            Something Extraordinary is Coming
          </h2>
          
          <p className="text-xs sm:text-sm text-[#6E635B] font-light leading-relaxed max-w-lg mx-auto mb-8">
            We are meticulously preparing our complete luxury home textiles collection. 
            Subscribe to receive exclusive early access and special launch offers.
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
                  className="flex-grow px-4 py-3 bg-white border border-[#E5DACD] rounded-xl text-xs sm:text-sm text-[#1C1817] placeholder-[#A4988D] focus:outline-none focus:border-[#A2845E] transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1C1817] hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-70 shrink-0"
                >
                  {loading ? 'Subscribing...' : 'Notify Me'}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#EFE6DA]/60 border border-[#DBC9B3] text-[#2C2623] p-4 rounded-2xl flex items-center justify-center gap-3 text-xs sm:text-sm font-medium"
              >
                <div className="w-6 h-6 rounded-full bg-[#8C7047] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Thank you! You will be the first to know when we launch.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick Link to Connect Page */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Link
            to="/connect"
            className="inline-flex items-center gap-2 bg-white hover:bg-[#FAF7F3] border border-[#E5DACD] text-[#1C1817] text-xs font-semibold px-5 py-2.5 rounded-full shadow-sm transition-all hover:shadow-md"
          >
            <span>Visit Digital Business Card (/connect)</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#9E825D]" />
          </Link>
        </motion.div>
      </main>

      {/* Footer Section */}
      <footer className="py-6 px-4 z-10 flex flex-col items-center gap-4">
        {/* Social Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#6E635B]">
          <a
            href="https://www.instagram.com/thejorique"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#1C1817] transition-colors"
          >
            <Instagram className="w-4 h-4 text-[#9E825D]" />
            <span>@thejorique</span>
          </a>
          <span className="text-[#C5B49D]">|</span>

          <a
            href="https://www.facebook.com/people/Thejorique/61591612536766"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#1C1817] transition-colors"
          >
            <Facebook className="w-4 h-4 text-[#9E825D]" />
            <span>Facebook</span>
          </a>
          <span className="text-[#C5B49D]">|</span>

          <a
            href="https://wa.me/919919388211"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#1C1817] transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#9E825D]" />
            <span>WhatsApp</span>
          </a>
          <span className="text-[#C5B49D]">|</span>

          <a
            href="mailto:care@jorique.in"
            className="flex items-center gap-1.5 hover:text-[#1C1817] transition-colors"
          >
            <Mail className="w-4 h-4 text-[#9E825D]" />
            <span>care@jorique.in</span>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-[11px] text-[#8C7F74]">
          &copy; {new Date().getFullYear()} JORIQUE. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
