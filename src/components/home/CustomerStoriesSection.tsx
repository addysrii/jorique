import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllReviews } from '../../lib/api/products';

export default function CustomerStoriesSection() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getAllReviews();
        if (data && data.length > 0) {
          setReviews(data);
        }
      } catch (err) {
        console.warn('CustomerStories fallback:', err);
      }
    };
    fetchReviews();
  }, []);

  const latestReview = reviews[0];
  const quote = latestReview?.comment || 'A beautiful balance of comfort and detail — it changed the feel of the room.';
  const author = latestReview?.customer_name || 'Customer Name';
  const roleOrTag = 'Verified Purchase';

  return (
    <section className="py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] dark:bg-[#100E0D] text-primary dark:text-[#FCFAF7] transition-colors duration-500 border-t border-[#E8DFD3] dark:border-[#2E2925]">
      <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-10">
        
        {/* Header Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C6A96B]/30 bg-white/70 dark:bg-white/5 text-secondary dark:text-[#C6A96B] text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase"
        >
          <span>LOVED BY THOSE WHO LIVE WITH JORIQUE</span>
        </motion.div>

        {/* Featured Editorial Quote Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-[#F5EDE3] dark:bg-[#1C1613] border border-[#E8DFD3] dark:border-[#332922] shadow-xl relative overflow-hidden"
        >
          {/* Subtle quotation watermark */}
          <span className="absolute top-4 left-6 text-7xl font-serif text-[#C6A96B]/15 pointer-events-none select-none">
            “
          </span>

          <div className="space-y-6 relative z-10">
            <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light italic leading-relaxed text-primary dark:text-white max-w-2xl mx-auto">
              “{quote}”
            </blockquote>

            <div className="flex items-center justify-center gap-1 text-[#C6A96B]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" stroke="none" />
              ))}
            </div>

            <div className="pt-2">
              <p className="text-xs sm:text-sm font-mono tracking-wider text-secondary dark:text-white/60 uppercase">
                <span className="font-semibold text-primary dark:text-white">{author}</span>
                <span className="mx-2 text-[#C6A96B]">✦</span>
                <span>{roleOrTag}</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* View All Reviews CTA */}
        <div className="pt-2">
          <Link to="/reviews">
            <button className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-white hover:text-[#851C25] dark:hover:text-[#C6A96B] transition-colors border-b border-current pb-1 cursor-pointer">
              <span>VIEW ALL REVIEWS</span>
              <ArrowRight size={13} />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
