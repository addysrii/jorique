import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Check, X, Filter, MessageSquare, ArrowUpDown, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Parallax3DCard from '../components/Parallax3DCard';
import { products } from '../data/products';

type SortOption = 'recent' | 'highest' | 'lowest';

// Define Review Interface
interface Review {
  id: string;
  name: string;
  avatarColor: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  productName: string;
  verified: boolean;
  helpfulCount: number;
}

// Initial dummy reviews data
const INITIAL_REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Soren A.',
    avatarColor: 'bg-[#3F3A36] text-white',
    rating: 5,
    date: '2026-07-02',
    title: 'Exceeded all expectations',
    body: 'The Organic Linen Duvet Cover Set is incredibly soft, even before the first wash. It has a beautiful, natural texture and keeps me cool throughout the night. The olive shade is exactly what I was looking for — a perfect, muted earth tone.',
    productName: 'Organic Linen Duvet Cover Set',
    verified: true,
    helpfulCount: 24,
  },
  {
    id: '2',
    name: 'Elena K.',
    avatarColor: 'bg-[#706B64] text-white',
    rating: 5,
    date: '2026-06-28',
    title: 'Simply luxurious pillowcases',
    body: 'I bought two Mulberry Silk Pillowcases and they feel absolutely divine. They are gentle on my hair and skin, and the quality of the stitching is top-notch. They wash perfectly on a delicate cycle. Highly recommend!',
    productName: 'Mulberry Silk Pillowcase',
    verified: true,
    helpfulCount: 18,
  },
  {
    id: '3',
    name: 'Marcus G.',
    avatarColor: 'bg-[#9C948D] text-white',
    rating: 4,
    date: '2026-06-15',
    title: 'Thick and very absorbent towels',
    body: 'The Classic Waffle Towels have a great texture and absorb moisture quickly. They dry much faster than standard terry cloth towels, which is a big plus. Only giving 4 stars because they shrank slightly in the first hot wash, but still look and perform amazingly.',
    productName: 'Classic Waffle Towel Set',
    verified: true,
    helpfulCount: 7,
  },
  {
    id: '4',
    name: 'Freja L.',
    avatarColor: 'bg-[#C2BBB4] text-[#3F3A36]',
    rating: 5,
    date: '2026-06-08',
    title: 'Absolute heaven to sleep in',
    body: 'The Percale Cotton Sheets are crisp, cool, and feel exactly like a luxury hotel. If you prefer sheets that stay cool and do not cling, these are the ones to get. Customer support was also helpful when I needed to update my delivery address.',
    productName: 'Crisp Percale Cotton Sheets',
    verified: true,
    helpfulCount: 31,
  },
  {
    id: '5',
    name: 'Johan D.',
    avatarColor: 'bg-[#E3DFD9] text-[#3F3A36]',
    rating: 4,
    date: '2026-05-24',
    title: 'Premium throw blanket',
    body: 'The Cashmere Blend Throw is extremely soft and looks beautiful draped over our sofa. It is lightweight but surprisingly warm. Just be careful with jewelry, as it can snag if you are not careful. A wonderful piece of craftsmanship.',
    productName: 'Cashmere Blend Throw',
    verified: true,
    helpfulCount: 12,
  },
  {
    id: '6',
    name: 'Charlotte M.',
    avatarColor: 'bg-[#2E2E2E] text-white',
    rating: 5,
    date: '2026-05-11',
    title: 'Stunning craftsmanship',
    body: 'Purchased the linen sheets and the waffle robe. Both feel luxurious and look very elegant. JORIQUE has quickly become my go-to brand for home textiles. Safe packaging and prompt shipping too.',
    productName: 'Linen Robe & Sheet Bundle',
    verified: true,
    helpfulCount: 15,
  },
];

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [helpfulClicked, setHelpfulClicked] = useState<Record<string, boolean>>({});

  // Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formProductName, setFormProductName] = useState(products[0]?.name || '');
  const [formSuccess, setFormSuccess] = useState(false);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { average: '0.0', counts: [0, 0, 0, 0, 0], percentages: [0, 0, 0, 0, 0], total: 0 };

    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const average = (sum / total).toFixed(1);

    const counts = [5, 4, 3, 2, 1].map((r) => reviews.filter((rev) => rev.rating === r).length);
    const percentages = counts.map((count) => Math.round((count / total) * 100));

    return { average, counts, percentages, total };
  }, [reviews]);

  // Filtered and Sorted Reviews
  const processedReviews = useMemo(() => {
    return reviews
      .filter((review) => {
        if (filterRating === 'all') return true;
        return review.rating === filterRating;
      })
      .sort((a, b) => {
        if (sortBy === 'recent') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === 'highest') {
          return b.rating - a.rating;
        }
        if (sortBy === 'lowest') {
          return a.rating - b.rating;
        }
        return 0;
      });
  }, [reviews, filterRating, sortBy]);

  const handleHelpful = (id: string) => {
    if (helpfulClicked[id]) return;

    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    setHelpfulClicked((prev) => ({ ...prev, [id]: true }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formTitle.trim() || !formBody.trim()) return;

    const colors = [
      'bg-[#3F3A36] text-white',
      'bg-[#706B64] text-white',
      'bg-[#9C948D] text-white',
      'bg-[#C2BBB4] text-[#3F3A36]',
      'bg-[#E3DFD9] text-[#3F3A36]',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newReview: Review = {
      id: Date.now().toString(),
      name: formName,
      avatarColor: randomColor,
      rating: formRating,
      date: new Date().toISOString().split('T')[0],
      title: formTitle,
      body: formBody,
      productName: formProductName,
      verified: true,
      helpfulCount: 0,
    };

    setReviews((prev) => [newReview, ...prev]);
    setFormSuccess(true);

    // Reset Form
    setTimeout(() => {
      setFormSuccess(false);
      setIsModalOpen(false);
      setFormName('');
      setFormRating(5);
      setFormTitle('');
      setFormBody('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB] transition-colors duration-300">
      <Navbar />

      {/* Header Section */}
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cream dark:bg-white/5 border border-border dark:border-[#2E2925] text-secondary dark:text-[#D4AF37] text-[11px] font-semibold tracking-[0.3em] uppercase mb-4">
            <Sparkles size={12} className="text-[#D4AF37]" />
            Verified Customer Impressions
          </div>
          <h1 className="text-3xl lg:text-5xl font-light text-primary dark:text-white tracking-wide mb-6">
            Reviews & Testimonials
          </h1>
          <p className="text-secondary dark:text-white/70 text-base lg:text-lg font-light max-w-xl mx-auto leading-relaxed">
            Read what our community has to say about their experience with JORIQUE luxury textiles.
          </p>
        </motion.div>
      </section>

      {/* Stats and Dashboard Section */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto bg-white dark:bg-[#1A1816] rounded-3xl border border-border dark:border-[#2E2925] p-6 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Average Rating Big Display */}
            <div className="md:col-span-4 text-center md:border-r md:border-border dark:md:border-[#2E2925] md:pr-8">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-secondary dark:text-white/60 mb-2">Overall Rating</p>
              <div className="text-6xl font-light text-primary dark:text-[#D4AF37] tracking-tight mb-3">
                {stats.average}
              </div>
              <div className="flex justify-center gap-1 mb-2 text-[#D4AF37]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    fill={star <= Math.round(Number(stats.average)) ? 'currentColor' : 'none'}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <p className="text-xs text-secondary dark:text-white/60 font-light mt-1">Based on {stats.total} verified reviews</p>
            </div>

            {/* Progress Bars */}
            <div className="md:col-span-5 flex flex-col gap-2.5">
              {[5, 4, 3, 2, 1].map((rating, index) => {
                const count = stats.counts[index];
                const percentage = stats.percentages[index];
                return (
                  <button
                    key={rating}
                    onClick={() => setFilterRating(rating === filterRating ? 'all' : rating)}
                    className={`flex items-center gap-3 w-full text-left text-xs group hover:text-primary dark:hover:text-[#D4AF37] transition-colors ${
                      filterRating === rating ? 'font-semibold text-primary dark:text-[#D4AF37]' : 'text-secondary dark:text-white/60'
                    }`}
                  >
                    <span className="w-12 whitespace-nowrap font-medium tracking-wide">{rating} Stars</span>
                    <div className="flex-1 h-2 bg-cream dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary dark:bg-[#D4AF37]"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                    <span className="w-8 text-right font-medium">{percentage}%</span>
                    <span className="text-[10px] opacity-60">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="md:col-span-3 text-center md:pl-8 flex flex-col items-center justify-center">
              <p className="text-xs text-secondary dark:text-white/60 font-light mb-4 leading-relaxed max-w-xs md:max-w-none">
                Have you purchased JORIQUE products? Share your feedback with the community.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold tracking-[0.25em] uppercase px-6 py-3.5 rounded-xl hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-all shadow-md"
              >
                <MessageSquare size={14} />
                Write a Review
              </motion.button>
            </div>

          </div>
        </div>
      </section>

      {/* Filter and Sort Toolbar */}
      <section className="px-6 py-6 border-y border-border dark:border-[#2E2925] bg-white/95 dark:bg-[#151311]/95 backdrop-blur-md sticky top-[64px] lg:top-[80px] z-40 shadow-sm transition-colors duration-300">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Active Filter Indicators */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            <Filter size={14} className="text-secondary dark:text-white/60" />
            <span className="text-xs font-semibold text-secondary dark:text-white/60 uppercase tracking-[0.2em]">Filter:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterRating('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                  filterRating === 'all'
                    ? 'bg-primary dark:bg-[#D4AF37] text-white dark:text-black shadow-sm'
                    : 'bg-cream dark:bg-white/10 text-secondary dark:text-white/70 hover:text-primary dark:hover:text-white'
                }`}
              >
                All ({reviews.length})
              </button>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter((r) => r.rating === rating).length;
                return (
                  <button
                    key={rating}
                    onClick={() => setFilterRating(rating)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all flex items-center gap-1 ${
                      filterRating === rating
                        ? 'bg-primary dark:bg-[#D4AF37] text-white dark:text-black shadow-sm'
                        : 'bg-cream dark:bg-white/10 text-secondary dark:text-white/70 hover:text-primary dark:hover:text-white'
                    }`}
                  >
                    {rating} <Star size={10} fill={filterRating === rating ? 'currentColor' : 'none'} className="inline" /> ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <ArrowUpDown size={14} className="text-secondary dark:text-white/60" />
            <span className="text-xs font-semibold text-secondary dark:text-white/60 uppercase tracking-[0.2em]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-[#D4AF37] bg-transparent border-b border-border dark:border-[#2E2925] py-1 focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="recent" className="dark:bg-[#1A1816] text-black dark:text-white">Most Recent</option>
              <option value="highest" className="dark:bg-[#1A1816] text-black dark:text-white">Highest Rating</option>
              <option value="lowest" className="dark:bg-[#1A1816] text-black dark:text-white">Lowest Rating</option>
            </select>
          </div>

        </div>
      </section>

      {/* Reviews List */}
      <section className="px-6 py-12 lg:py-16">
        <div className="max-w-5xl mx-auto">
          {processedReviews.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#1A1816] rounded-3xl border border-border dark:border-[#2E2925]">
              <p className="text-secondary dark:text-white/60 font-light text-base mb-4">No reviews found matching that rating filter.</p>
              <button
                onClick={() => setFilterRating('all')}
                className="text-xs font-semibold tracking-[0.2em] uppercase text-primary dark:text-[#D4AF37] border-b border-primary dark:border-[#D4AF37] pb-0.5"
              >
                Reset Rating Filter
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {processedReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                  >
                    <Parallax3DCard
                      maxRotation={6}
                      perspective={1200}
                      glareEffect={true}
                      scaleOnHover={1.01}
                      className="rounded-3xl shadow-sm hover:shadow-xl transition-shadow"
                    >
                      <div className="p-6 lg:p-8 bg-white dark:bg-[#1A1816] rounded-3xl border border-border dark:border-[#2E2925] flex flex-col md:flex-row gap-6 items-start transform-style-3d">
                        {/* Reviewer Meta Column */}
                        <div
                          className="md:w-1/4 flex-shrink-0 flex items-center md:items-start gap-4 md:flex-col transform-style-3d"
                          style={{ transform: 'translateZ(25px)' }}
                        >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-semibold tracking-wider shadow-inner ${review.avatarColor}`}>
                            {review.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold tracking-wide text-primary dark:text-white">{review.name}</h4>
                            <p className="text-[11px] text-secondary dark:text-white/50 font-light tracking-wide mt-0.5">{new Date(review.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</p>
                            {review.verified && (
                              <div className="flex items-center gap-1 text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold tracking-[0.15em] uppercase mt-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full w-fit">
                                <Check size={10} strokeWidth={3} className="text-emerald-700 dark:text-emerald-400" />
                                Verified Buyer
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Review Detail Column */}
                        <div
                          className="flex-1 flex flex-col transform-style-3d"
                          style={{ transform: 'translateZ(15px)' }}
                        >
                          {/* Rating Stars */}
                          <div className="flex items-center gap-1 text-[#D4AF37] mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={14}
                                fill={star <= review.rating ? 'currentColor' : 'none'}
                                strokeWidth={1.5}
                              />
                            ))}
                          </div>

                          {/* Title and Body */}
                          <h3 className="text-base font-medium tracking-wide text-primary dark:text-white mb-2.5">
                            {review.title}
                          </h3>
                          <p className="text-sm text-secondary dark:text-white/70 leading-relaxed font-light mb-4">
                            {review.body}
                          </p>

                          {/* Product tags & helpful actions */}
                          <div className="mt-auto pt-4 border-t border-border/60 dark:border-[#2E2925] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="text-[11px] text-secondary dark:text-white/50 tracking-wide font-light">
                              Purchased: <span className="font-semibold text-primary dark:text-white">{review.productName}</span>
                            </div>
                            <button
                              onClick={() => handleHelpful(review.id)}
                              className={`text-xs flex items-center gap-1.5 font-light tracking-wide transition-colors ${
                                helpfulClicked[review.id]
                                  ? 'text-primary dark:text-[#D4AF37] font-medium pointer-events-none'
                                  : 'text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white'
                              }`}
                            >
                              <span>Was this review helpful?</span>
                              <span className="px-2 py-0.5 bg-cream dark:bg-white/10 rounded-md font-semibold text-[11px]">
                                {review.helpfulCount}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </Parallax3DCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50"
            />

            {/* Modal Wrapper Container */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-lg bg-white dark:bg-[#1A1816] rounded-3xl border border-border dark:border-[#2E2925] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col pointer-events-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-border dark:border-[#2E2925] flex-shrink-0">
                  <h3 className="text-sm font-semibold tracking-[0.25em] uppercase text-primary dark:text-white">Write a Review</h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white transition-colors"
                  >
                    <X size={18} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Success Screen */}
                {formSuccess ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center flex-1">
                    <div className="w-12 h-12 bg-cream dark:bg-white/10 text-primary dark:text-[#D4AF37] rounded-full flex items-center justify-center mb-4">
                      <Check size={24} strokeWidth={1.5} />
                    </div>
                    <h4 className="text-xl font-light text-primary dark:text-white tracking-wide mb-2">Thank you!</h4>
                    <p className="text-sm text-secondary dark:text-white/70 leading-relaxed font-light">
                      Your review has been successfully submitted and posted.
                    </p>
                  </div>
                ) : (
                  /* Form Body */
                  <form onSubmit={handleSubmitReview} className="p-6 overflow-y-auto flex-1 space-y-5">
                    {/* Rating Selector */}
                    <div>
                      <label className="block text-xs font-semibold tracking-[0.2em] text-secondary dark:text-white/70 uppercase mb-2">
                        Your Rating *
                      </label>
                      <div className="flex gap-1.5 text-[#D4AF37]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormRating(star)}
                            className="hover:scale-110 transition-transform p-0.5"
                          >
                            <Star
                              size={24}
                              fill={star <= formRating ? 'currentColor' : 'none'}
                              strokeWidth={1.5}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name Input */}
                    <div>
                      <label className="block text-xs font-semibold tracking-[0.2em] text-secondary dark:text-white/70 uppercase mb-2">
                        Your Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Liam S."
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full border border-border dark:border-[#2E2925] px-4 py-3 rounded-xl text-sm text-primary dark:text-white placeholder:text-secondary/40 placeholder:font-light dark:placeholder:text-white/30 bg-warm-white dark:bg-[#100E0D] focus:outline-none focus:border-primary dark:focus:border-[#D4AF37] transition-colors duration-200 font-normal"
                      />
                    </div>

                    {/* Product Selector */}
                    <div>
                      <label className="block text-xs font-semibold tracking-[0.2em] text-secondary dark:text-white/70 uppercase mb-2">
                        Product Purchased *
                      </label>
                      <select
                        value={formProductName}
                        onChange={(e) => setFormProductName(e.target.value)}
                        className="w-full border border-border dark:border-[#2E2925] px-4 py-3 rounded-xl text-sm text-primary dark:text-white bg-warm-white dark:bg-[#100E0D] focus:outline-none focus:border-primary dark:focus:border-[#D4AF37] transition-colors duration-200"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.name} className="dark:bg-[#100E0D]">
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Review Title Input */}
                    <div>
                      <label className="block text-xs font-semibold tracking-[0.2em] text-secondary dark:text-white/70 uppercase mb-2">
                        Review Title *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Summarize your experience"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full border border-border dark:border-[#2E2925] px-4 py-3 rounded-xl text-sm text-primary dark:text-white placeholder:text-secondary/40 placeholder:font-light dark:placeholder:text-white/30 bg-warm-white dark:bg-[#100E0D] focus:outline-none focus:border-primary dark:focus:border-[#D4AF37] transition-colors duration-200 font-normal"
                      />
                    </div>

                    {/* Review Body Input */}
                    <div>
                      <label className="block text-xs font-semibold tracking-[0.2em] text-secondary dark:text-white/70 uppercase mb-2">
                        Review *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Write your review comments here..."
                        value={formBody}
                        onChange={(e) => setFormBody(e.target.value)}
                        className="w-full border border-border dark:border-[#2E2925] px-4 py-3 rounded-xl text-sm text-primary dark:text-white placeholder:text-secondary/40 placeholder:font-light dark:placeholder:text-white/30 bg-warm-white dark:bg-[#100E0D] focus:outline-none focus:border-primary dark:focus:border-[#D4AF37] transition-colors duration-200 resize-none font-normal leading-relaxed"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-primary dark:bg-[#D4AF37] text-white dark:text-black rounded-xl text-xs font-bold tracking-[0.25em] uppercase py-4 hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-colors duration-200 shadow-md"
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
