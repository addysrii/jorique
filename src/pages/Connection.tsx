import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Instagram,
  Facebook,
  MessageCircle,
  Mail,
  ArrowRight,
  Download,
  Star,
  QrCode,
  SquarePen,
  Gift,
  PhoneCall,
  MoreHorizontal,
  Share2,
  Check,
  BookUser,
  X,
  Send,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Connection() {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    setShowShareMenu(false);
  };

  const handleSaveVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:JORIQUE Home Textiles
ORG:JORIQUE
TEL;TYPE=CELL:+919919388211
TEL;TYPE=WORK:+918840196009
EMAIL:care@jorique.in
URL:https://jorique.in
NOTE:Where Comfort Meets Design - Thoughtfully crafted home textiles for a beautiful everyday.
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'JORIQUE_Contact.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setReviewSubmitted(true);
  };

  const linkCards = [
    {
      icon: <Globe className="w-5 h-5 text-primary dark:text-[#D4AF37]" />,
      title: 'Visit Our Website',
      subtitle: 'jorique.in',
      action: () => (window.location.href = 'https://jorique.in'),
      external: false,
    },
    {
      icon: <Instagram className="w-5 h-5 text-primary dark:text-[#D4AF37]" />,
      title: 'Follow Us on Instagram',
      subtitle: '@thejorique',
      action: () => window.open('https://www.instagram.com/thejorique', '_blank', 'noopener,noreferrer'),
      external: true,
    },
    {
      icon: <Facebook className="w-5 h-5 text-primary dark:text-[#D4AF37]" />,
      title: 'Like Us on Facebook',
      subtitle: 'JORIQUE',
      action: () => window.open('https://www.facebook.com/people/Thejorique/61591612536766', '_blank', 'noopener,noreferrer'),
      external: true,
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-primary dark:text-[#D4AF37]" />,
      title: 'Chat on WhatsApp',
      subtitle: '+91 90262 60421',
      action: () => window.open('https://wa.me/919026260421', '_blank', 'noopener,noreferrer'),
      external: true,
    },
    {
      icon: <Mail className="w-5 h-5 text-primary dark:text-[#D4AF37]" />,
      title: 'Email Us Directly',
      subtitle: 'care@jorique.in',
      action: () => (window.location.href = 'mailto:care@jorique.in'),
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB] flex flex-col justify-between font-sans selection:bg-[#2C2623] selection:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-8 pt-28 sm:py-16">
        {/* Toast notification for copied link */}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 z-50 bg-[#1C1817] dark:bg-[#221F1C] text-white text-xs px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-white/10"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Link copied to clipboard!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Review & Earn Rewards Modal */}
        <AnimatePresence>
          {showReviewModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-[#FAF7F3] dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-left"
              >
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewSubmitted(false);
                  }}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cream dark:bg-white/10 text-primary dark:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {!reviewSubmitted ? (
                  <>
                    <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-1">
                      <Gift className="w-4 h-4" />
                      <span>Review & Earn Rewards</span>
                    </div>

                    <h3 className="text-xl font-light text-primary dark:text-white mb-2">
                      Share Your Experience
                    </h3>
                    <p className="text-xs text-secondary dark:text-white/60 mb-5">
                      Write a review for your recent JORIQUE purchase and get an instant 10% reward code!
                    </p>

                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      {/* Rating Stars */}
                      <div>
                        <label className="block text-xs font-semibold text-primary dark:text-white mb-1.5">
                          Your Overall Rating
                        </label>
                        <div className="flex items-center gap-1 text-[#D4AF37]">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(rating)}
                              className="p-1 focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= (hoverRating || rating)
                                    ? 'fill-current text-[#D4AF37]'
                                    : 'text-border dark:text-white/20'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Name & Order Number */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-primary dark:text-white mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Priya Sharma"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white dark:bg-[#100E0D] border border-border dark:border-[#2E2925] rounded-xl text-xs text-primary dark:text-white focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-primary dark:text-white mb-1">
                            Order / Product QR ID
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. JOR-8821"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white dark:bg-[#100E0D] border border-border dark:border-[#2E2925] rounded-xl text-xs text-primary dark:text-white focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>

                      {/* Review Text */}
                      <div>
                        <label className="block text-xs font-medium text-primary dark:text-white mb-1">
                          Your Review
                        </label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Tell us what you loved about the fabric, texture, or design..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white dark:bg-[#100E0D] border border-border dark:border-[#2E2925] rounded-xl text-xs text-primary dark:text-white focus:outline-none focus:border-[#D4AF37] resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-primary dark:bg-[#D4AF37] hover:bg-primary/90 dark:hover:bg-[#E5C158] text-white dark:text-black text-xs font-bold uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 mt-2"
                      >
                        <span>Submit Review & Claim Reward</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-4">
                      <Check className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-light text-primary dark:text-white mb-2">Thank You, {reviewName}!</h3>
                    <p className="text-xs text-secondary dark:text-white/70 mb-5">
                      Your review has been shared. Here is your exclusive 10% discount code:
                    </p>
                    <div className="p-3 bg-white dark:bg-black rounded-xl border border-dashed border-[#D4AF37] font-mono text-sm font-bold text-[#D4AF37] tracking-wider mb-5">
                      JORIQUE-LUXE-10
                    </div>
                    <button
                      onClick={() => {
                        setShowReviewModal(false);
                        setReviewSubmitted(false);
                      }}
                      className="w-full bg-primary dark:bg-white text-white dark:text-black py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                    >
                      Done
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="w-full max-w-md bg-white dark:bg-[#1A1816] rounded-3xl p-6 sm:p-8 shadow-xl border border-border dark:border-[#2E2925] text-center transition-colors duration-300">
          
          {/* Top Options Bar */}
          <div className="relative mb-6">
            <div className="flex justify-end">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="w-8 h-8 rounded-full bg-cream dark:bg-white/10 hover:bg-cream/80 text-primary dark:text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="Share Options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {/* Share Dropdown */}
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#201D1B] rounded-2xl shadow-xl border border-border dark:border-[#2E2925] p-1.5 text-left z-30"
                  >
                    <button
                      onClick={handleCopyLink}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-primary dark:text-white hover:bg-cream dark:hover:bg-white/5 rounded-xl flex items-center gap-2.5 transition-colors"
                    >
                      <Share2 className="w-4 h-4 text-[#D4AF37]" />
                      <span>Share Connection Page</span>
                    </button>
                    <button
                      onClick={handleSaveVCard}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-primary dark:text-white hover:bg-cream dark:hover:bg-white/5 rounded-xl flex items-center gap-2.5 transition-colors"
                    >
                      <Download className="w-4 h-4 text-[#D4AF37]" />
                      <span>Download Contact Card</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Official JORIQUE Logo Layout */}
            <div className="flex flex-col items-center justify-center mb-6">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-light tracking-[0.25em] pl-[0.25em] text-primary dark:text-white uppercase text-center"
              >
                JORIQUE
              </motion.h1>

              {/* Thin horizontal line */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.05 }}
                className="w-32 sm:w-44 h-[1px] bg-[#D4AF37] mx-auto my-2.5 opacity-80"
              />

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xs sm:text-sm md:text-base text-primary dark:text-[#D4AF37] italic tracking-wide text-center"
              >
                Where Comfort Meets Design
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-xs md:text-sm text-secondary dark:text-white/60 max-w-xs sm:max-w-sm mx-auto font-light leading-relaxed text-center mt-3"
              >
                Thoughtfully crafted home textiles for a beautiful everyday.
              </motion.p>
            </div>
          </div>

          {/* 5 Link Cards */}
          <div className="space-y-3 mb-6">
            {linkCards.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                onClick={card.action}
                className="bg-cream/40 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-border dark:border-[#2E2925] rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white dark:bg-[#100E0D] group-hover:bg-cream dark:group-hover:bg-white/10 flex items-center justify-center shrink-0 transition-colors shadow-sm">
                    {card.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-primary dark:text-white transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-secondary dark:text-white/50 font-normal mt-0.5">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
                <div className="p-1">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call Us Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-cream/40 dark:bg-white/5 border border-border dark:border-[#2E2925] rounded-2xl p-4 sm:p-5 shadow-sm mb-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-border dark:divide-[#2E2925] items-center">
              <div className="sm:col-span-4 flex items-center gap-3 pb-3 sm:pb-0">
                <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#100E0D] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-sm">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-xs sm:text-sm text-primary dark:text-white">Call Us</h4>
                  <p className="text-[11px] text-secondary dark:text-white/50">Direct concierge</p>
                </div>
              </div>

              <div className="sm:col-span-8 flex flex-wrap items-center justify-around gap-3 pt-3 sm:pt-0 sm:pl-4 text-left sm:text-center">
                <a
                  href="tel:+919919388211"
                  className="text-xs sm:text-sm font-semibold text-primary dark:text-white hover:text-[#D4AF37] transition-colors block"
                >
                  +91 99193 88211
                </a>
                <a
                  href="tel:+918840196009"
                  className="text-xs sm:text-sm font-semibold text-primary dark:text-white hover:text-[#D4AF37] transition-colors block"
                >
                  +91 88401 96009
                </a>
                <a
                  href="https://wa.me/919026260421"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-semibold text-primary dark:text-white hover:text-[#D4AF37] transition-colors block"
                >
                  +91 90262 60421
                </a>
              </div>
            </div>
          </motion.div>

          {/* Save JORIQUE Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-cream/40 dark:bg-white/5 border border-border dark:border-[#2E2925] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm mb-6"
          >
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#100E0D] flex items-center justify-center text-[#D4AF37] shrink-0 shadow-sm">
                <BookUser className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-primary dark:text-white">Save JORIQUE Contact</h4>
                <p className="text-xs text-secondary dark:text-white/50">Add directly to your mobile address book</p>
              </div>
            </div>
            <button
              onClick={handleSaveVCard}
              className="bg-primary dark:bg-[#D4AF37] hover:bg-primary/90 dark:hover:bg-[#E5C158] text-white dark:text-black text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Contact</span>
            </button>
          </motion.div>

          {/* QR Code and Actions */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="p-3 bg-white dark:bg-black rounded-2xl border border-border dark:border-[#2E2925] shadow-sm mb-3">
              <QrCode className="w-24 h-24 text-primary dark:text-white" />
            </div>
            <p className="text-[11px] text-secondary dark:text-white/60">Scan with your smartphone camera to connect</p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
