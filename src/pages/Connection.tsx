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
      icon: <Globe className="w-5 h-5 text-[#2C2623]" />,
      title: 'Visit Our Website',
      subtitle: 'jorique.in',
      action: () => (window.location.href = 'https://jorique.in'),
      external: false,
    },
    {
      icon: <Instagram className="w-5 h-5 text-[#2C2623]" />,
      title: 'Follow Us on Instagram',
      subtitle: '@thejorique',
      action: () => window.open('https://www.instagram.com/thejorique', '_blank', 'noopener,noreferrer'),
      external: true,
    },
    {
      icon: <Facebook className="w-5 h-5 text-[#2C2623]" />,
      title: 'Like Us on Facebook',
      subtitle: 'JORIQUE',
      action: () => window.open('https://www.facebook.com/people/Thejorique/61591612536766', '_blank', 'noopener,noreferrer'),
      external: true,
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-[#2C2623]" />,
      title: 'Chat on WhatsApp',
      subtitle: 'Quick Support',
      action: () => window.open('https://wa.me/919919388211', '_blank', 'noopener,noreferrer'),
      external: true,
    },
    {
      icon: <Mail className="w-5 h-5 text-[#2C2623]" />,
      title: 'Email Us',
      subtitle: 'care@jorique.in',
      action: () => (window.location.href = 'mailto:care@jorique.in'),
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F0EB] text-[#1C1817] selection:bg-[#C5B49D] selection:text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow relative pt-28 pb-12 md:pt-36 md:pb-16 px-4 sm:px-6 overflow-hidden">
        {/* Ambient Warm Lighting & Shadow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-radial from-[#EBE0D2]/60 via-[#F5F0EB]/30 to-transparent pointer-events-none blur-2xl -z-10" />

        {/* Floating Toast Alert for Copying Link */}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1C1817] text-white px-5 py-2.5 rounded-full text-xs font-medium shadow-xl flex items-center gap-2 border border-[#3A3331]"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Link copied to clipboard!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Review & Earn Rewards Modal */}
        <AnimatePresence>
          {showReviewModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-[#FAF7F3] border border-[#E8DFC0] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-left"
              >
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewSubmitted(false);
                  }}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#EFE6DA] hover:bg-[#E5D7C4] text-[#1C1817] flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {!reviewSubmitted ? (
                  <>
                    <div className="flex items-center gap-2 text-[#8C7047] text-xs font-medium uppercase tracking-widest mb-1">
                      <Gift className="w-4 h-4" />
                      <span>Review & Earn Rewards</span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-[#1C1817] mb-2">
                      Share Your Experience
                    </h3>
                    <p className="text-xs text-[#6E635B] mb-5">
                      Write a review for your recent JORIQUE purchase and get an instant 10% reward code!
                    </p>

                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      {/* Rating Stars */}
                      <div>
                        <label className="block text-xs font-semibold text-[#1C1817] mb-1.5">
                          Your Overall Rating
                        </label>
                        <div className="flex items-center gap-1 text-[#C09A58]">
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
                                    ? 'fill-current text-[#C09A58]'
                                    : 'text-[#D5C7B5]'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Name & Order Number */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[#1C1817] mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Priya Sharma"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-[#E5DACD] rounded-xl text-xs text-[#1C1817] focus:outline-none focus:border-[#A2845E]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#1C1817] mb-1">
                            Order / Product QR ID
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. JOR-8821"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-[#E5DACD] rounded-xl text-xs text-[#1C1817] focus:outline-none focus:border-[#A2845E]"
                          />
                        </div>
                      </div>

                      {/* Review Text */}
                      <div>
                        <label className="block text-xs font-medium text-[#1C1817] mb-1">
                          Your Review
                        </label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Tell us what you loved about the fabric, texture, or design..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#E5DACD] rounded-xl text-xs text-[#1C1817] focus:outline-none focus:border-[#A2845E] resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#1C1817] hover:bg-black text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 mt-2"
                      >
                        <span>Submit Review & Claim Reward</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-14 h-14 bg-[#EFE6DA] rounded-full flex items-center justify-center text-[#8C7047] mx-auto mb-3">
                      <Gift className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-[#1C1817] mb-1">
                      Thank You for Your Review!
                    </h3>
                    <p className="text-xs text-[#6E635B] max-w-xs mx-auto mb-4">
                      We appreciate your feedback. Here is your exclusive reward code for 10% off your next purchase:
                    </p>

                    <div className="bg-[#1C1817] text-white p-3 rounded-xl font-mono text-sm font-bold tracking-widest inline-block mb-4 border border-[#A2845E]/40 select-all">
                      JORIQUE10
                    </div>

                    <button
                      onClick={() => {
                        setShowReviewModal(false);
                        setReviewSubmitted(false);
                      }}
                      className="block w-full bg-[#8C7047] hover:bg-[#775D37] text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-all"
                    >
                      Close Window
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Central Container matching UI mockup */}
        <div className="max-w-2xl mx-auto relative z-10">
          
          {/* Header Card / Top Info */}
          <div className="relative mb-8 text-center pt-2">
            {/* Top Right Options Menu Button */}
            <div className="absolute top-0 right-0 z-20">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="w-9 h-9 rounded-full bg-white/70 hover:bg-white border border-[#E5DACD] flex items-center justify-center text-[#3A3331] transition-all shadow-sm active:scale-95"
                title="Options"
                aria-label="Share Options"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {/* Share Dropdown */}
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E5DACD] p-1.5 text-left z-30"
                  >
                    <button
                      onClick={handleCopyLink}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-[#1C1817] hover:bg-[#F5F0EB] rounded-lg flex items-center gap-2.5 transition-colors"
                    >
                      <Share2 className="w-4 h-4 text-[#9E825D]" />
                      <span>Share Connection Page</span>
                    </button>
                    <button
                      onClick={handleSaveVCard}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-[#1C1817] hover:bg-[#F5F0EB] rounded-lg flex items-center gap-2.5 transition-colors"
                    >
                      <Download className="w-4 h-4 text-[#9E825D]" />
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
                className="text-4xl md:text-5xl font-serif tracking-[0.25em] pl-[0.25em] text-[#1C1817] font-normal uppercase text-center"
              >
                JORIQUE
              </motion.h1>

              {/* Thin horizontal line directly below JORIQUE text */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.05 }}
                className="w-32 sm:w-44 h-[1px] bg-[#C5B49D] mx-auto my-2.5 opacity-90"
              />

              {/* Tagline directly below line */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xs sm:text-sm md:text-base font-serif text-[#2C2623] italic tracking-wide text-center"
              >
                Where Comfort Meets Design
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-xs md:text-sm text-[#6E635B] max-w-xs sm:max-w-sm mx-auto font-light leading-relaxed text-center mt-3"
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
                className="bg-[#FAF7F3] hover:bg-white border border-[#E8DFC0]/70 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#EFE6DA] group-hover:bg-[#E5D7C4] flex items-center justify-center shrink-0 transition-colors">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1C1817] group-hover:text-black transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#7A6E65] font-normal mt-0.5">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
                <div className="p-1">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#A48256] group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* 1. Call Us Section (Positioned IMMEDIATELY ABOVE Save JORIQUE Contact card) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#FAF7F3] border border-[#E8DFC0]/80 rounded-2xl p-4 sm:p-5 shadow-sm mb-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E5DACD] items-center">
              {/* Header column */}
              <div className="sm:col-span-4 flex items-center gap-3 pb-3 sm:pb-0">
                <div className="w-11 h-11 rounded-full bg-[#EFE6DA] flex items-center justify-center text-[#8C7047] shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#1C1817]">Call Us</h4>
                  <p className="text-[11px] text-[#7A6E65]">We are here to help you</p>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="sm:col-span-8 flex flex-wrap items-center justify-around gap-3 pt-3 sm:pt-0 sm:pl-4 text-left sm:text-center">
                <a
                  href="tel:+919919388211"
                  className="text-xs sm:text-sm font-bold text-[#1C1817] hover:text-[#8C7047] transition-colors block"
                >
                  +91 99193 88211
                </a>
                <a
                  href="tel:+918840196009"
                  className="text-xs sm:text-sm font-bold text-[#1C1817] hover:text-[#8C7047] transition-colors block"
                >
                  +91 88401 96009
                </a>
                <a
                  href="https://wa.me/919026260421"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-bold text-[#1C1817] hover:text-[#8C7047] transition-colors block"
                >
                  +91 90262 60421
                </a>
              </div>
            </div>
          </motion.div>

          {/* 2. Save JORIQUE Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-[#FAF7F3] border border-[#E8DFC0]/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm mb-6"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#A2845E] text-white flex items-center justify-center shrink-0 shadow-inner">
                <BookUser className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1C1817]">Save JORIQUE Contact</h3>
                <p className="text-xs text-[#6E635B] font-light leading-snug mt-0.5">
                  All our contact details in one tap. Save to your phone instantly.
                </p>
              </div>
            </div>
            <button
              onClick={handleSaveVCard}
              className="bg-[#1C1817] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm active:scale-95"
            >
              <span>SAVE TO CONTACT</span>
              <Download className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* 3. Love Your Purchase Banner Card (with Bedsheet Product Image) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#FAF7F3] border border-[#E8DFC0]/80 rounded-2xl p-4 sm:p-5 shadow-sm mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              {/* Left Photo - Bedsheet Product Image */}
              <div className="sm:col-span-5 relative rounded-xl overflow-hidden aspect-[4/3] sm:aspect-square w-full shadow-sm">
                <img
                  src="/images/Review_Card.png"
                  alt="JORIQUE Bedsheet Product"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Right Content */}
              <div className="sm:col-span-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1 text-[#C09A58] mb-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C1817] mb-3">
                    Love Your Purchase?
                  </h3>

                  <ul className="space-y-2 text-xs text-[#5A4F47] font-medium mb-4">
                    <li className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-[#ECE3D5] flex items-center justify-center text-[#8C7047] shrink-0">
                        <QrCode className="w-3.5 h-3.5" />
                      </div>
                      <span>Scan your product QR</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-[#ECE3D5] flex items-center justify-center text-[#8C7047] shrink-0">
                        <SquarePen className="w-3.5 h-3.5" />
                      </div>
                      <span>Write a verified review</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-[#ECE3D5] flex items-center justify-center text-[#8C7047] shrink-0">
                        <Gift className="w-3.5 h-3.5" />
                      </div>
                      <span>Earn Rewards Instantly</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowReviewModal(true)}
                  className="w-full bg-[#1C1817] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  <span>REVIEW & EARN REWARDS</span>
                  <Gift className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Quick Icons Footer Bar */}
          <div className="border-t border-[#E5DACD] pt-6 pb-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-center text-xs text-[#5C524A]">
            <a href="https://jorique.in" className="flex items-center gap-1.5 hover:text-black transition-colors">
              <Globe className="w-3.5 h-3.5 text-[#9E825D]" />
              <span>jorique.in</span>
            </a>
            <span className="text-[#C5B49D] hidden sm:inline">|</span>

            <a
              href="https://www.instagram.com/thejorique"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-black transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-[#9E825D]" />
              <span>@thejorique</span>
            </a>
            <span className="text-[#C5B49D] hidden sm:inline">|</span>

            <a
              href="https://www.facebook.com/people/Thejorique/61591612536766"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-black transition-colors"
            >
              <Facebook className="w-3.5 h-3.5 text-[#9E825D]" />
              <span>JORIQUE</span>
            </a>
            <span className="text-[#C5B49D] hidden sm:inline">|</span>

            <a
              href="https://wa.me/919919388211"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-black transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#9E825D]" />
              <span>99193 88211</span>
            </a>
            <span className="text-[#C5B49D] hidden sm:inline">|</span>

            <a
              href="mailto:care@jorique.in"
              className="flex items-center gap-1.5 hover:text-black transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#9E825D]" />
              <span>care@jorique.in</span>
            </a>
          </div>

          {/* Bottom Legal Copyright Bar */}
          <div className="text-[11px] text-[#8C7F74] text-center pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 border-t border-[#E5DACD]/60 mt-2">
            <span>&copy; {new Date().getFullYear()} JORIQUE</span>
            <span className="text-[#C5B49D]">|</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span className="text-[#C5B49D]">|</span>
            <a href="#" className="hover:underline">Terms & Conditions</a>
            <span className="text-[#C5B49D]">|</span>
            <a href="#" className="hover:underline">Shipping Policy</a>
            <span className="text-[#C5B49D]">|</span>
            <a href="#" className="hover:underline">Returns Policy</a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
