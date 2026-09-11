import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CollectionColumn {
  id: 'essential' | 'signature' | 'luxe';
  brand: string;
  name: string;
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  ctaText: string;
  cornerTagLines: string[];
  image: string;
  accentHex: string;
  gradientTop: string;
  link: string;
}

const COLUMNS: CollectionColumn[] = [
  {
    id: 'essential',
    brand: 'JORIQUE',
    name: 'Essential',
    headlineLine1: 'Everyday comfort,',
    headlineLine2: 'thoughtfully designed.',
    description:
      'Beautiful textiles for real homes and everyday moments. Effortless, versatile and made to be lived with.',
    ctaText: 'EXPLORE ESSENTIAL',
    cornerTagLines: ['LIVE', 'SIMPLE', 'LIVE', 'BEAUTIFULLY'],
    image: '/images/collections/essential.jpg',
    accentHex: '#7A8B72',
    gradientTop:
      'linear-gradient(to bottom, rgba(48, 58, 41, 0.94) 0%, rgba(48, 58, 41, 0.82) 28%, rgba(48, 58, 41, 0.35) 55%, transparent 80%)',
    link: '/shop?collection=essential',
  },
  {
    id: 'signature',
    brand: 'JORIQUE',
    name: 'Signature',
    headlineLine1: 'Refined comfort,',
    headlineLine2: 'distinctive living.',
    description:
      'A curated collection for those who appreciate finer details. Elevated textiles and apparel for a more considered way of life.',
    ctaText: 'EXPLORE SIGNATURE',
    cornerTagLines: ['DETAILS', 'MAKE LIFE', 'RICHER'],
    image: '/images/collections/signature.jpg',
    accentHex: '#243B64',
    gradientTop:
      'linear-gradient(to bottom, rgba(23, 37, 56, 0.94) 0%, rgba(23, 37, 56, 0.82) 28%, rgba(23, 37, 56, 0.35) 55%, transparent 80%)',
    link: '/shop?collection=signature',
  },
  {
    id: 'luxe',
    brand: 'JORIQUE',
    name: 'Luxe',
    headlineLine1: 'Elevated comfort,',
    headlineLine2: 'Exceptional living.',
    description:
      'Our most luxurious collection, crafted for those who seek the extraordinary in everyday life.',
    ctaText: 'EXPLORE LUXE',
    cornerTagLines: ['SPACES', 'PEOPLE', 'LOVE'],
    image: '/images/collections/luxe.jpg',
    accentHex: '#641F2D',
    gradientTop:
      'linear-gradient(to bottom, rgba(72, 19, 28, 0.94) 0%, rgba(72, 19, 28, 0.82) 28%, rgba(72, 19, 28, 0.35) 55%, transparent 80%)',
    link: '/shop?collection=luxe',
  },
];

export default function FlagshipCollectionsHero() {
  return (
    <section className="relative w-full bg-[#F5EDE3] dark:bg-[#100E0D] text-primary dark:text-[#FCFAF7] transition-colors duration-500 overflow-hidden pt-16 lg:pt-20">

      {/* ─────────────────────────────────────────────────────────────
          1. THREE FULL-HEIGHT EDITORIAL HERO PANELS (Side by Side)
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/20 dark:divide-[#332922]">
        {COLUMNS.map((col, idx) => (
          <div
            key={col.id}
            className="group relative w-full h-[620px] sm:h-[680px] lg:h-[82vh] lg:min-h-[640px] lg:max-h-[860px] overflow-hidden flex flex-col justify-between"
          >
            {/* Background Photography with smooth hover zoom */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-black">
              <img
                src={col.image}
                alt={`JORIQUE ${col.name} Collection`}
                className="w-full h-full object-cover object-bottom sm:object-center group-hover:scale-105 transition-transform duration-1000 ease-out select-none"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />

              {/* Tinted Top Color Gradient Overlay for pristine text readability */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{ background: col.gradientTop }}
              />

              {/* Subtle bottom vignette to ground the room setting */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Top Row: Brand & Main Titles + Corner Tag */}
            <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex items-start justify-between gap-4">

              {/* Left Content Block */}
              <div className="max-w-md space-y-2">
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * idx }}
                  className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-white/75 uppercase block"
                >
                  {col.brand}
                </motion.span>

                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 * idx }}
                  className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-none"
                >
                  {col.name}
                </motion.h2>

                <div className="pt-2 space-y-0.5">
                  <p className="font-serif text-base sm:text-lg lg:text-xl font-semibold brand-tagline text-white/95 leading-tight">
                    {col.headlineLine1}
                  </p>
                  <p className="font-serif text-base sm:text-lg lg:text-xl font-semibold brand-tagline text-white/95 leading-tight">
                    {col.headlineLine2}
                  </p>
                </div>

                <p className="font-sans text-xs sm:text-[13px] text-white/80 font-normal leading-relaxed max-w-sm pt-2">
                  {col.description}
                </p>

                {/* Pill Action Button */}
                <div className="pt-4">
                  <Link to={col.link}>
                    <button
                      className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-white/60 bg-white/10 hover:bg-white hover:text-black backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-lg cursor-pointer"
                    >
                      <span>{col.ctaText}</span>
                      <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right Corner Philosophy Tag (from design mockup) */}
              <div className="text-right shrink-0 pt-1">
                {col.cornerTagLines.map((line, lIdx) => (
                  <span
                    key={lIdx}
                    className="block text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-white/75 uppercase leading-tight font-medium"
                  >
                    {line}
                  </span>
                ))}
              </div>

            </div>

            {/* Bottom Spacer/Indicator for balanced proportion */}
            <div className="relative z-10 p-6 sm:p-8 lg:p-10 pointer-events-none">
              <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.2em] uppercase text-white/70">
                {/* <span className="opacity-70">0{idx + 1}</span>
                <span className="opacity-70">✦</span> */}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. THE EDITORIAL PHILOSOPHY BAR (Directly beneath the 3 columns)
          "Comfort is a feeling. And a more beautiful way of living."
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full border-t border-b border-[#E8DFD3] dark:border-[#2E2925] bg-[#F5EDE3] dark:bg-[#100E0D] px-6 sm:px-10 lg:px-16 py-8 sm:py-10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-8">

          {/* Left: — MORE THAN PRODUCTS */}
          <div className="lg:col-span-3 flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#8A847D]/60 dark:bg-[#C6A96B]/60" />
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.28em] text-[#8A847D] dark:text-white/60 uppercase font-medium">
              MORE THAN PRODUCTS
            </span>
          </div>

          {/* Center: Comfort is a feeling. And a more beautiful way of living. */}
          <div className="lg:col-span-6 text-center space-y-1">
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-primary dark:text-[#FCFAF7] tracking-tight leading-tight">
              Comfort is a feeling.
            </h3>
            <p className="font-serif italic text-2xl sm:text-3xl lg:text-4xl font-semibold brand-tagline text-[#8A847D] dark:text-[#C6A96B] leading-tight">
              And a more beautiful way of living.
            </p>
          </div>

          {/* Right: Thoughtfully designed collections statement */}
          <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-[#E8DFD3] dark:border-[#2E2925] pt-4 lg:pt-0 lg:pl-8">
            <p className="text-xs text-secondary dark:text-white/70 font-light leading-relaxed">
              Thoughtfully designed collections for homes, journeys and spaces that bring people together.
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}
