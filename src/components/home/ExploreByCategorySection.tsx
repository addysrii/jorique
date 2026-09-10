import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  link: string;
  image: string;
  previewTierNote: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'bedding',
    name: 'BEDDING',
    description: 'Comfort designed for the spaces where the day begins and ends.',
    link: '/shop?category=Bedsheet',
    image: '/Products/2.jpg',
    previewTierNote: 'Available in Essential • Signature • Luxe',
  },
  {
    id: 'cushion-covers',
    name: 'CUSHION COVERS',
    description: 'Thoughtful details that change the character of a room.',
    link: '/shop?category=Pillow',
    image: '/Products/1.jpg',
    previewTierNote: 'Available in Essential • Signature • Luxe',
  },
  {
    id: 'towels',
    name: 'TOWELS',
    description: 'Everyday rituals, elevated through texture and detail.',
    link: '/shop?category=Towel',
    image: '/images/luxury-products/towel_clean.png',
    previewTierNote: 'Available in Essential • Signature • Luxe',
  },
  {
    id: 'table-linen',
    name: 'TABLE LINEN',
    description: 'Considered pieces for tables, gatherings and everyday moments.',
    link: '/shop?category=Table%20Linen',
    image: '/Products/4.jpg',
    previewTierNote: 'Available in Essential • Signature • Luxe',
  },
  {
    id: 'womens-suits',
    name: "WOMEN'S SUITS",
    description: 'Timeless comfort with thoughtful design and refined detail.',
    link: '/shop?category=Suits',
    image: '/Products/3.jpg',
    previewTierNote: 'Available in Essential • Signature • Luxe',
  },
];

export default function ExploreByCategorySection() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <section className="py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-12 bg-[#F5EDE3] dark:bg-[#14100D] text-primary dark:text-[#FCFAF7] transition-colors duration-500">
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8DFD3] dark:border-[#2E2925] pb-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-secondary dark:text-[#C6A96B] block">
              05 — EXPLORE BY CATEGORY
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-primary dark:text-white">
              Shop by Living Need
            </h2>
            <p className="text-xs sm:text-sm text-secondary dark:text-white/70 font-light leading-relaxed">
              Find exactly what your home calls for. Each category is meticulously loomed across our three tiers of refinement.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase text-secondary dark:text-[#C6A96B]/80 pb-1">
            <span>Essential</span>
            <span>→</span>
            <span>Signature</span>
            <span>→</span>
            <span>Luxe</span>
          </div>
        </div>

        {/* Editorial Category Table / Rows */}
        <div className="divide-y divide-[#E8DFD3] dark:divide-[#2E2925] border-y border-[#E8DFD3] dark:border-[#2E2925]">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={cat.id}
              to={cat.link}
              onMouseEnter={() => setHoveredCategory(cat.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="group block py-6 sm:py-8 lg:py-10 transition-colors duration-300 hover:bg-white/40 dark:hover:bg-white/[0.02] px-3 sm:px-6 rounded-2xl cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 lg:gap-8">
                
                {/* Left: Category Title & Index */}
                <div className="md:w-1/3 flex items-baseline gap-4">
                  <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#8A847D]/70 dark:text-white/40">
                    0{idx + 1}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-medium tracking-wide text-primary dark:text-white group-hover:text-[#851C25] dark:group-hover:text-[#C6A96B] transition-colors duration-300">
                    {cat.name}
                  </h3>
                </div>

                {/* Middle: Editorial Description */}
                <div className="md:w-1/2">
                  <p className="text-xs sm:text-sm text-secondary dark:text-white/70 font-light leading-relaxed group-hover:text-primary dark:group-hover:text-white/90 transition-colors duration-200">
                    {cat.description}
                  </p>
                  <span className="text-[10px] font-mono tracking-wider text-[#8A847D] dark:text-[#C6A96B]/70 uppercase block mt-1">
                    {cat.previewTierNote}
                  </span>
                </div>

                {/* Right: CTA */}
                <div className="md:w-1/6 flex items-center justify-start md:justify-end gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-white group-hover:text-[#851C25] dark:group-hover:text-[#C6A96B] transition-colors">
                  <span className="border-b border-current pb-0.5">EXPLORE</span>
                  <ArrowRight
                    size={14}
                    className="transform group-hover:translate-x-1.5 transition-transform duration-300"
                  />
                </div>

              </div>
            </Link>
          ))}
        </div>

        {/* Product Architecture Note */}
        <div className="p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-secondary dark:text-white/70 font-light">
          <p>
            <strong className="font-semibold text-primary dark:text-white">Product Architecture:</strong> Every category page allows seamless filtering between Essential, Signature, and Luxe collections.
          </p>
          <Link
            to="/shop"
            className="text-[11px] font-mono uppercase tracking-widest text-[#851C25] dark:text-[#C6A96B] hover:underline font-medium shrink-0"
          >
            Browse All Categories →
          </Link>
        </div>

      </div>
    </section>
  );
}
