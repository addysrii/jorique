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

const categories = [
  {
    title: "Bed Sheets",
    subtitle: "Ultra-soft cottons & dobby weaves",
    image: "/images/luxury-products/bedsheet_clean.png",
    link: "/shop?category=Bedsheet",
    tag: "Signature Bedding"
  },
  {
    title: " Cushion Covers",
    subtitle: "Handwoven textures & rich tones",
    image: "/images/luxury-products/cushion_clean.png",
    link: "/shop?category=Cushion+Cover",
    tag: "Artisanal Living"
  },
  {
    title: "Suits",
    subtitle: "Crisp shirts & structured suiting",
    image: "/images/luxury-products/suit_clean.png",
    link: "/shop?category=Suits",
    tag: "Modern Wardrobe"
  },
  {
    title: "Towels",
    subtitle: "High-absorbency cloud towels",
    image: "/images/luxury-products/towel_clean.png",
    link: "/shop?category=Towel",
    tag: "Daily Rituals"
  }
];

export default function ExploreByCategorySection() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <section className="py-20 lg:py-28 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E1D5] dark:border-[#2E2925] pb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#0B5F61] dark:text-[#D4AF37]">
              The Portfolio
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#1A1816] dark:text-white mt-1">
              Explore The Collections
            </h2>
          </div>
          <Link to="/shop" className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#0B5F61] dark:text-[#D4AF37]">
            <span>View Entire Catalogue</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.link}
              className="group relative rounded-3xl p-6 bg-white/70 dark:bg-white/5 border border-[#E8E1D5] dark:border-[#2E2925] hover:border-[#C6A96B] transition-all duration-300 flex flex-col items-center text-center shadow-xs hover:shadow-lg"
            >
              {/* <span className="absolute top-4 left-4 text-[9px] font-mono tracking-widest uppercase text-[#8A8177] dark:text-white/40">
                {cat.tag}
              </span> */}

              <div className="w-full h-44 sm:h-48 my-4 flex items-center justify-center overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-500 pointer-events-none select-none drop-shadow-sm"
                />
              </div>

              <div className="space-y-1 w-full pt-2 border-t border-[#E8E1D5]/70 dark:border-[#2E2925]/70">
                <h3 className="font-serif text-base text-[#1A1816] dark:text-white group-hover:text-[#0B5F61] dark:group-hover:text-[#D4AF37] transition-colors">
                  {cat.title}
                </h3>
                {/* <p className="text-[11px] text-[#7A7168] dark:text-white/60 font-light">
                  {cat.subtitle}
                </p> */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
