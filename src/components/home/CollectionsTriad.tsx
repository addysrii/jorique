import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CollectionTier {
  id: 'essential' | 'signature' | 'luxe';
  brandPrefix: string;
  name: string;
  headline: string;
  description: string;
  microTag: string;
  ctaText: string;
  accentColor: string;
  badgeBg: string;
  textColor: string;
  image: string;
  link: string;
}

const COLLECTIONS: CollectionTier[] = [
  {
    id: 'essential',
    brandPrefix: 'JORIQUE',
    name: 'Essential',
    headline: 'Everyday comfort, thoughtfully designed.',
    description: 'Beautifully crafted textiles for real homes and everyday moments.',
    microTag: 'SIMPLE • BEAUTIFUL • HONEST',
    ctaText: 'EXPLORE ESSENTIAL',
    accentColor: '#7A8B72',
    badgeBg: 'rgba(122, 139, 114, 0.15)',
    textColor: '#556B4E',
    image: '/Products/2.jpg',
    link: '/shop?collection=essential',
  },
  {
    id: 'signature',
    brandPrefix: 'JORIQUE',
    name: 'Signature',
    headline: 'Refined comfort, distinctive design.',
    description: 'A considered collection for those who value finer details in everyday life.',
    microTag: 'MORE THAN AESTHETICS • A FEELING',
    ctaText: 'EXPLORE SIGNATURE',
    accentColor: '#243B64',
    badgeBg: 'rgba(36, 59, 100, 0.14)',
    textColor: '#243B64',
    image: '/Products/1.jpg',
    link: '/shop?collection=signature',
  },
  {
    id: 'luxe',
    brandPrefix: 'JORIQUE',
    name: 'Luxe',
    headline: 'Elevated comfort, exceptional detail.',
    description: 'Our most luxurious collection, designed for a life of quiet indulgence.',
    microTag: 'TIMELESS • EXQUISITE • UNFORGETTABLE',
    ctaText: 'EXPLORE LUXE',
    accentColor: '#0B5F61',
    badgeBg: 'rgba(11, 95, 97, 0.15)',
    textColor: '#0B5F61',
    image: '/Products/5.jpg',
    link: '/shop?collection=luxe',
  },
];

export default function CollectionsTriad() {
  return (
    <section
      id="collections"
      className="py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#F5EDE3] dark:bg-[#14100D] text-primary dark:text-[#FCFAF7] transition-colors duration-500"
    >
      <div className="max-w-[1400px] mx-auto space-y-8 lg:space-y-12">
        {/* Editorial Section Introduction */}
        <div className="text-center max-w-2xl mx-auto space-y-3 px-4">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-mono tracking-[0.3em] uppercase text-secondary dark:text-[#C6A96B]"
          >
            The Three Core Collections
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-primary dark:text-white"
          >
            Levels of Refinement
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm text-secondary dark:text-white/70 font-light leading-relaxed"
          >
            Essential, Signature, and Luxe communicate three tiers of material craftsmanship and quiet luxury.
            Every product category exists across all three tiers.
          </motion.p>
        </div>

        {/* 3-Column Desktop / Stacked Mobile Triad */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {COLLECTIONS.map((col, idx) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group relative flex flex-col justify-between rounded-3xl overflow-hidden bg-[#FCFAF7] dark:bg-[#1C1613] border border-[#E8DFD3] dark:border-[#332922] shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Top Accent Strip */}
              <div
                className="h-1.5 w-full transition-all duration-300"
                style={{ backgroundColor: col.accentColor }}
              />

              {/* Upper Content Header */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-secondary dark:text-white/60 block">
                      {col.brandPrefix}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-primary dark:text-white">
                      {col.name}
                    </h3>
                  </div>
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 dark:border-white/20 shadow-xs"
                    style={{ backgroundColor: col.accentColor }}
                    title={`${col.name} signature hue`}
                  />
                </div>

                <h4
                  className="font-serif text-base sm:text-lg font-medium leading-snug transition-colors"
                  style={{ color: col.accentColor }}
                >
                  {col.headline}
                </h4>

                <p className="text-xs sm:text-sm text-secondary dark:text-white/70 font-light leading-relaxed">
                  {col.description}
                </p>
              </div>

              {/* Atmospheric Editorial Visual Frame */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#E8DFD3]/40 dark:bg-[#14100D]">
                <img
                  src={col.image}
                  alt={`JORIQUE ${col.name} Collection`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />

                {/* Bottom Micro Tag inside photo */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[9px] font-mono tracking-[0.2em] text-white/90 uppercase drop-shadow-md">
                  <span>{col.microTag}</span>
                  <span className="text-[#C6A96B]">✦</span>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="p-6 sm:p-8 pt-6 border-t border-[#E8DFD3] dark:border-[#332922] bg-white/50 dark:bg-white/[0.02]">
                <Link to={col.link} className="block">
                  <button
                    className="w-full py-3.5 px-6 rounded-2xl flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 group-hover:shadow-md cursor-pointer"
                    style={{
                      backgroundColor: 'transparent',
                      color: col.accentColor,
                      border: `1.5px solid ${col.accentColor}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = col.accentColor;
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = col.accentColor;
                    }}
                  >
                    <span>{col.ctaText}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
