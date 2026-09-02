import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Star, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Parallax3DCard from '../components/Parallax3DCard';
import { submitReview } from '../lib/api/products';

interface ReviewLocationState {
  productName?: string;
  serialNumber?: string;
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const { serial } = useParams();
  const location = useLocation();
  const state = (location.state as ReviewLocationState | null) || {};

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const serialNumber = state.serialNumber || serial || '';
  const productName = state.productName || 'Your JORIQUE product';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serialNumber) {
      setMessage('Serial number is missing.');
      return;
    }

    if (!comment.trim()) {
      setMessage('Please add a quick review before submitting.');
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const result = await submitReview({
        serial_number: serialNumber,
        rating,
        comment: comment.trim(),
        customer_name: customerName.trim() || undefined,
        customer_email: customerEmail.trim() || undefined,
      });

      if (!result.success) {
        setMessage(result.message || 'Unable to submit review.');
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setMessage(result.message);
      setSubmitting(false);

      setTimeout(() => {
        navigate(`/gift?serial=${encodeURIComponent(serialNumber)}`);
      }, 1800);
    } catch (error) {
      console.error('Review submission failed:', error);
      setMessage('Something went wrong while submitting your review.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB] transition-colors duration-300 overflow-hidden">
      <Navbar />

      <main className="max-w-xl mx-auto px-4 py-8 pt-28">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/scan')}
            className="p-2 hover:bg-cream dark:hover:bg-white/10 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream dark:bg-white/5 border border-border dark:border-[#2E2925] text-secondary dark:text-[#D4AF37] text-[10px] font-semibold tracking-[0.25em] uppercase mb-1">
              <Sparkles size={11} className="text-[#D4AF37]" />
              JORIQUE Authentication
            </div>
            <h1 className="text-2xl sm:text-3xl font-light text-primary dark:text-white tracking-wide">Review Studio</h1>
            <p className="text-xs sm:text-sm text-secondary dark:text-white/60 font-light mt-0.5">Share your tactile experience & claim your complimentary gift</p>
          </div>
        </div>

        <Parallax3DCard
          maxRotation={6}
          perspective={1200}
          glareEffect={true}
          scaleOnHover={1.01}
          className="rounded-3xl shadow-xl border border-border dark:border-[#2E2925] overflow-hidden"
        >
          <div className="bg-white dark:bg-[#1A1816] rounded-3xl p-6 sm:p-8 transform-style-3d">
            <div className="mb-6 p-4 rounded-2xl bg-cream/40 dark:bg-white/5 border border-border dark:border-[#2E2925] flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-white">{productName}</p>
                <p className="text-[11px] font-mono tracking-wider text-secondary dark:text-white/50 mt-0.5">SERIAL: {serialNumber}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full shrink-0">
                <CheckCircle size={10} /> Verified
              </span>
            </div>

            {success ? (
              <div className="py-12 text-center transform-style-3d">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-light tracking-wide text-primary dark:text-white mb-2">Review Submitted!</h2>
                <p className="text-xs sm:text-sm text-secondary dark:text-white/70 font-light leading-relaxed mb-6">
                  {message || 'Generating your exclusive complimentary gift...'}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-secondary dark:text-white/60 font-light tracking-wide">
                  <Loader2 size={14} className="animate-spin text-primary dark:text-[#D4AF37]" />
                  <span>Redirecting to Gift Voucher Studio...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 transform-style-3d">
                {message && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2 font-light">
                    <AlertCircle size={15} />
                    <span>{message}</span>
                  </div>
                )}

                {/* Rating Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-secondary dark:text-white/70 mb-2">
                    Overall Satisfaction *
                  </label>
                  <div className="flex gap-2 text-[#D4AF37]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          size={26}
                          fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-secondary dark:text-white/70 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. David L."
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] text-sm text-primary dark:text-white placeholder:text-secondary/50 placeholder:font-light dark:placeholder:text-white/30 focus:outline-none focus:border-primary dark:focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-secondary dark:text-white/70 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="david@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] text-sm text-primary dark:text-white placeholder:text-secondary/50 placeholder:font-light dark:placeholder:text-white/30 focus:outline-none focus:border-primary dark:focus:border-[#D4AF37] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-secondary dark:text-white/70 mb-1.5">
                    Your Review & Notes *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the fabric feel, drape, breathability, and packaging..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] text-sm text-primary dark:text-white placeholder:text-secondary/50 placeholder:font-light dark:placeholder:text-white/30 focus:outline-none focus:border-primary dark:focus:border-[#D4AF37] transition-colors resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold uppercase tracking-[0.25em] hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Submit Review & Claim Gift</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </Parallax3DCard>
      </main>

      <Footer />
    </div>
  );
}
