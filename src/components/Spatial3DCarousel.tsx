import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import Parallax3DCard from './Parallax3DCard';

interface CarouselItem {
  id: string;
  sku: string;
  title: string;
  category: string;
  badge: string;
  price: string;
  image: string;
  tagline: string;
  metric: string;
}

const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: 'c1',
    sku: 'JR-BS-2026-001',
    title: 'The Egyptian Sateen Duvet',
    category: 'Signature Bedding',
    badge: 'Flagship 2026',
    price: '₹5,499',
    image: '/Products/1.jpg',
    tagline: '800TC Long-Staple Giza Cotton with liquid drape finish.',
    metric: '800 Thread Count',
  },
  {
    id: 'c2',
    sku: 'JR-BS-2026-002',
    title: 'Belgian Stonewashed Flax',
    category: 'Pure Linen',
    badge: 'Eco-Certified',
    price: '₹6,299',
    image: '/Products/2.jpg',
    tagline: 'Pre-washed with volcanic pumice for buttery vintage softness.',
    metric: '100% French Flax',
  },
  {
    id: 'c3',
    sku: 'JR-BS-2026-003',
    title: 'Mulberry Silk Sovereign Pillowcases',
    category: 'Mulberry Silk',
    badge: 'Sensory Luxe',
    price: '₹3,899',
    image: '/Products/3.jpg',
    tagline: '22-Momme pure Grade 6A mulberry silk to prevent hair & skin friction.',
    metric: '22 Momme Silk',
  },
  {
    id: 'c4',
    sku: 'JR-BS-2026-004',
    title: 'Classic Waffle Thermal Blanket',
    category: 'Home Decor',
    badge: 'Master Weaver',
    price: '₹4,199',
    image: '/Products/4.jpg',
    tagline: 'Deep honeycomb matrix weave for buoyant thermal micro-pockets.',
    metric: '450 GSM Weight',
  },
  {
    id: 'c5',
    sku: 'JR-BS-2026-005',
    title: 'Guimarães Artisanal Throw',
    category: 'Heritage Craft',
    badge: 'Limited Edition',
    price: '₹4,799',
    image: '/Products/5.jpg',
    tagline: 'Hand-finished in Portugal with brushed cashmere-touch organic cotton.',
    metric: 'Artisanal Portuguese Weave',
  },
];

export default function Spatial3DCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((curr) => (curr - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length);
  const next = () => setActiveIndex((curr) => (curr + 1) % CAROUSEL_ITEMS.length);

  return (
    <section className="py-28 lg:py-40 bg-gradient-to-b from-[#FAF8F5] via-[#F3EFE9] to-[#FAF8F5] dark:from-[#181615] dark:via-[#1F1C1A] dark:to-[#181615] text-primary dark:text-white overflow-hidden relative select-none border-b border-border/80 dark:border-[#2E2925] transition-colors duration-300">
      {/* Ambient background lights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 dark:bg-[#D4AF37]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#C4A482]/10 dark:bg-[#C4A482]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream dark:bg-white/10 border border-border dark:border-white/15 backdrop-blur-md mb-3 shadow-sm">
              <Sparkles size={13} className="text-[#D4AF37]" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary dark:text-white/80">
                Spatial 3D Showcase
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-light text-primary dark:text-white tracking-wide">
              Curated Masterpieces
            </h2>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              aria-label="Previous masterpiece"
              className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-border dark:border-white/15 flex items-center justify-center text-primary dark:text-white hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 shadow-md"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              aria-label="Next masterpiece"
              className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-border dark:border-white/15 flex items-center justify-center text-primary dark:text-white hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 shadow-md"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* 3D Spatial Carousel Stage */}
        <div
          style={{ perspective: '1800px' }}
          className="relative min-h-[460px] sm:min-h-[520px] flex items-center justify-center overflow-visible"
        >
          <div className="w-full h-full relative flex items-center justify-center transform-style-3d">
            {CAROUSEL_ITEMS.map((item, index) => {
              // Calculate relative offset from active index (-2, -1, 0, 1, 2)
              const count = CAROUSEL_ITEMS.length;
              let offset = (index - activeIndex + count) % count;
              if (offset > count / 2) offset -= count;

              const isCenter = offset === 0;
              const isVisible = Math.abs(offset) <= 2;

              if (!isVisible) return null;

              const xTranslate = offset * 280; // px spacing
              const zTranslate = isCenter ? 80 : -Math.abs(offset) * 140; // depth
              const rotateY = offset * -25; // 3D curve angle
              const scale = isCenter ? 1.05 : 1 - Math.abs(offset) * 0.15;
              const opacity = isCenter ? 1 : Math.max(0.35, 1 - Math.abs(offset) * 0.4);

              return (
                <motion.div
                  key={item.id}
                  onClick={() => setActiveIndex(index)}
                  animate={{
                    x: xTranslate,
                    z: zTranslate,
                    rotateY,
                    scale,
                    opacity,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 220,
                    damping: 24,
                    mass: 0.8,
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                  className={`absolute w-72 sm:w-84 aspect-[4/5] rounded-3xl cursor-pointer will-change-transform shadow-2xl ${
                    isCenter ? 'z-30' : 'z-10 pointer-events-auto'
                  }`}
                >
                  <Parallax3DCard
                    maxRotation={isCenter ? 14 : 4}
                    perspective={1200}
                    glareEffect={isCenter}
                    scaleOnHover={1}
                    className="w-full h-full rounded-3xl"
                  >
                    <div className="w-full h-full relative rounded-3xl overflow-hidden border-2 border-white/60 dark:border-white/20 transform-style-3d bg-white dark:bg-black shadow-2xl">
                      
                      {/* Image Layer */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover brightness-[0.9] dark:brightness-[0.85] contrast-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                      {/* Floating Badge (Depth: 35px) */}
                      <div
                        className="absolute top-5 left-5 z-20 pointer-events-none transform-style-3d"
                        style={{ transform: 'translateZ(35px)' }}
                      >
                        <span className="px-3 py-1 rounded-full bg-white/95 dark:bg-black/60 backdrop-blur-md border border-border dark:border-white/20 text-[10px] font-bold tracking-widest uppercase text-primary dark:text-[#D4AF37] shadow-md">
                          {item.badge}
                        </span>
                      </div>

                      {/* Floating Metric Indicator (Depth: 40px) */}
                      <div
                        className="absolute top-5 right-5 z-20 pointer-events-none transform-style-3d"
                        style={{ transform: 'translateZ(40px)' }}
                      >
                        <span className="px-3 py-1 rounded-full bg-black/60 dark:bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white">
                          {item.metric}
                        </span>
                      </div>

                      {/* Foreground Info (Depth: 50px) */}
                      <div
                        className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none transform-style-3d"
                        style={{ transform: 'translateZ(50px)' }}
                      >
                        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D4AF37] block mb-1">
                          {item.category}
                        </span>
                        <h3 className="text-xl font-light text-white tracking-wide mb-1 leading-snug drop-shadow-md">
                          {item.title}
                        </h3>
                        <p className="text-xs text-white/80 line-clamp-2 mb-4 font-light leading-relaxed">
                          {item.tagline}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-white/20">
                          <span className="text-lg font-semibold text-white">{item.price}</span>
                          {isCenter && (
                            <Link
                              to={`/product/${item.sku}`}
                              className="pointer-events-auto inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white text-black text-[11px] font-bold uppercase tracking-wider hover:bg-cream shadow-lg transition-transform hover:scale-105"
                            >
                              <span>Inspect</span>
                              <ArrowRight size={12} />
                            </Link>
                          )}
                        </div>
                      </div>

                    </div>
                  </Parallax3DCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Carousel Pagination Indicator */}
        <div className="flex items-center justify-center gap-2 mt-12">
          {CAROUSEL_ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === i ? 'w-8 bg-primary dark:bg-[#D4AF37]' : 'w-2 bg-secondary/30 dark:bg-white/20 hover:bg-secondary/60'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
