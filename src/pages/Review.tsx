import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Star, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
        navigate('/home');
      }, 1800);
    } catch (error) {
      console.error('Review submission failed:', error);
      setMessage('Something went wrong while submitting your review.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-xl mx-auto px-4 py-8 pt-28">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/scan')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-light text-gray-900">Leave a Review</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Verified product</p>
            <h2 className="mt-2 text-xl font-medium text-gray-900">{productName}</h2>
            <p className="mt-1 text-xs text-gray-500 font-mono">{serialNumber}</p>
          </div>

          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Review submitted</h3>
              <p className="mt-2 text-sm text-gray-600">{message || 'Thank you for sharing your feedback.'}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name (optional)</label>
                <input
                  id="name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email (optional)</label>
                <input
                  id="email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Your review</label>
                <textarea
                  id="comment"
                  rows={5}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you loved about your JORIQUE product..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none focus:border-primary focus:bg-white resize-none"
                  required
                />
              </div>

              {message && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  'Submit review'
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
