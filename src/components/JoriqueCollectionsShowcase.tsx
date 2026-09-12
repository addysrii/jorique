import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  Layers, 
  Feather, 
  Crown,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface TierItem {
  id: 'essential' | 'signature' | 'luxe';
  title: string;
  badge: string;
  shortSubtitle: string;
  tagline: string;
  description: string;
  colorName: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  image: string;
  productCutout: string;
  specs: { label: string; val: string }[];
  swatches: { name: string; hex: string }[];
  link: string;
}

const TIERS: TierItem[] = [
  {
    id: 'essential',
    title: 'JORIQUE Essential',
    badge: 'Sage Serenity • Everyday Living',
    shortSubtitle: 'Organic Everyday Luxury',
    tagline: 'Pure breathable cottons and relaxed natural weaves designed for daily sanctuaries.',
    description:
      'Engineered for the rhythms of everyday life. Sourced from 100% certified long-staple cotton and breathable natural linen, JORIQUE Essential embodies relaxed elegance, airy thermoregulation, and effortless washability that grows softer with every evening.',
    colorName: 'Sage & Warm Ivory',
    accentColor: '#7A8B72',
    badgeBg: 'rgba(122, 139, 114, 0.15)',
    badgeText: '#556B4E',
    image: '/Products/2.jpg',
    productCutout: '/images/luxury-products/bedsheet_clean.png',
    specs: [
      { label: 'Weave', val: 'Air-Washed Percale' },
      { label: 'Fiber', val: '100% Organic Cotton' },
      { label: 'Feel', val: 'Cloud-Soft & Crisp' },
      { label: 'Care', val: 'Effortless Washability' },
    ],
    swatches: [
      { name: 'Sage Green', hex: '#7A8B72' },
      { name: 'Warm Ivory', hex: '#F5EDE3' },
      { name: 'Natural Sand', hex: '#D8CEBE' },
    ],
    link: '/shop?collection=essential',
  },
  {
    id: 'signature',
    title: 'JORIQUE Signature',
    badge: 'Deep Royal • Masterpiece Weave',
    shortSubtitle: 'Architectural Heirloom Weaves',
    tagline: 'Masterpiece jacquards and heritage deep royal weaves blending past and present.',
    description:
      'Where Indian textile artisanship meets modern architecture. Intricately loomed dobby patterns and deep indigo-toned jacquards create a luminous play of light, tailored with reinforced borders and tactile weight that transforms any master bedroom.',
    colorName: 'Deep Royal & Gold',
    accentColor: '#243B64',
    badgeBg: 'rgba(36, 59, 100, 0.12)',
    badgeText: '#243B64',
    image: '/Products/1.jpg',
    productCutout: '/images/luxury-products/suit_clean.png',
    specs: [
      { label: 'Weave', val: 'Intricate Dobby & Jacquard' },
      { label: 'Fiber', val: 'Giza & Combed Cotton' },
      { label: 'Feel', val: 'Lustrous & Substantial' },
      { label: 'Craft', val: 'Master Artisan Loomed' },
    ],
    swatches: [
      { name: 'Royal Indigo', hex: '#243B64' },
      { name: 'Imperial Gold', hex: '#C6A96B' },
      { name: 'Pristine Cream', hex: '#EDE8DF' },
    ],
    link: '/shop?collection=signature',
  },
  {
    id: 'luxe',
    title: 'JORIQUE Luxe',
    badge: 'Burgundy Opulence • Couture Grade',
    shortSubtitle: 'Ultra-High Thread Count Splendor',
    tagline: 'Mulberry silks, rich velvet accents, and calendered sateen for supreme decadence.',
    description:
      'Our ultimate expression of tactile opulence. Tailored for presidential suites and connoisseurs of fine living, JORIQUE Luxe combines high-density mulberry silk borders with velvet touches and 800+ thread count liquid sateen for an unforgettable tactile caress.',
    colorName: 'Burgundy & Champagne Gilt',
    accentColor: '#641F2D',
    badgeBg: 'rgba(100, 31, 45, 0.15)',
    badgeText: '#641F2D',
    image: '/Products/5.jpg',
    productCutout: '/images/luxury-products/cushion_clean.png',
    specs: [
      { label: 'Weave', val: 'Liquid Mirror Sateen' },
      { label: 'Fiber', val: 'Mulberry Silk & Long-Staple' },
      { label: 'Feel', val: 'Fluid Silk & Velvety Nap' },
      { label: 'Finishing', val: 'Calendered Luster' },
    ],
    swatches: [
      { name: 'Velvet Wine', hex: '#641F2D' },
      { name: 'Champagne Gilt', hex: '#C6A96B' },
      { name: 'Deep Obsidian', hex: '#1C1917' },
    ],
    link: '/shop?collection=luxe',
  },
];

export default function JoriqueCollectionsShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll / rotate every 5 seconds when not hovered/paused
  useEffect(() => {
    if (isPaused) return;

    autoPlayRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % TIERS.length);
    }, 5000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused]);

  const activeTier = TIERS[activeIdx];

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % TIERS.length);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + TIERS.length) % TIERS.length);
  };

  return (
    <section 
      className="py-20 lg:py-28 px-4 sm:px-6 lg:px-10 bg-[#F5EDE3] dark:bg-[#14100D] text-primary dark:text-[#FCFAF7] transition-colors duration-500 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">

        {/* ── SECTION HEADER ── */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-[#C6A96B]/30 backdrop-blur-md text-[#0B5F61] dark:text-[#D4AF37] text-[10px] sm:text-[11px] font-bold tracking-[0.3em] uppercase shadow-xs">
            <Sparkles size={12} className="text-[#C6A96B]" />
            The Three Atelier Tiers
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-light text-primary dark:text-white tracking-tight leading-tight">
            Curated Living by JORIQUE
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-secondary dark:text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
            Every home sanctuary demands its own rhythm. Explore our three distinctive collection realms—from 
            everyday organic serenity to master-loomed jacquards and couture silk opulence.
          </p>
        </div>

        {/* ── THE SINGLE UNIFIED TRILOGY FRAME (Matches Website Palette) ── */}
        <div className="relative rounded-[32px] sm:rounded-[40px] bg-white/85 dark:bg-[#1C1613]/90 backdrop-blur-xl border border-[#E8DFD3] dark:border-[#332922] p-5 sm:p-8 lg:p-12 shadow-2xl transition-all duration-500 overflow-hidden">
          
          {/* Subtle Ambient Gold Warmth */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-[#C6A96B]/15 via-transparent to-transparent blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-radial from-[#C6A96B]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

          {/* Top Tabs & Auto-Scroll Header */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E8DFD3] dark:border-[#332922]">
            {/* 3 Tier Tab Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {TIERS.map((tier, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#1A1A1A] dark:bg-[#C6A96B] text-white dark:text-black shadow-md scale-102'
                        : 'bg-cream/60 dark:bg-white/5 text-secondary dark:text-white/70 hover:text-primary dark:hover:text-white border border-[#E8DFD3]/80 dark:border-[#332922]'
                    }`}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full border border-black/20 dark:border-white/30"
                      style={{ backgroundColor: tier.accentColor }}
                    />
                    <span>{tier.title.replace('JORIQUE ', '')}</span>
                  </button>
                );
              })}
            </div>

            {/* Auto-Scroll Controls & Status */}
            <div className="flex items-center gap-3 text-secondary dark:text-white/70">
              <span className="hidden sm:inline text-[10px] font-mono tracking-widest uppercase opacity-70">
                {isPaused ? 'Paused' : 'Auto-Rotating (5s)'}
              </span>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-8 h-8 rounded-full bg-cream/80 dark:bg-white/5 hover:bg-cream dark:hover:bg-white/10 border border-[#E8DFD3] dark:border-[#332922] flex items-center justify-center transition-all cursor-pointer text-primary dark:text-white"
                title={isPaused ? 'Resume Auto-Scroll' : 'Pause Auto-Scroll'}
              >
                {isPaused ? <Play size={12} /> : <Pause size={12} />}
              </button>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-full bg-cream/80 dark:bg-white/5 hover:bg-cream dark:hover:bg-white/10 border border-[#E8DFD3] dark:border-[#332922] flex items-center justify-center transition-all cursor-pointer text-primary dark:text-white"
                  title="Previous Tier"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNext}
                  className="w-8 h-8 rounded-full bg-cream/80 dark:bg-white/5 hover:bg-cream dark:hover:bg-white/10 border border-[#E8DFD3] dark:border-[#332922] flex items-center justify-center transition-all cursor-pointer text-primary dark:text-white"
                  title="Next Tier"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* ── STAGE CONTENT: DUAL COLUMN SHOWCASE ── */}
          <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center py-6 sm:py-10">
            
            {/* Left Narrative Column */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTier.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-7 space-y-6"
              >
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest uppercase border border-current"
                    style={{ color: activeTier.accentColor }}
                  >
                    <span>{activeTier.badge}</span>
                  </div>

                  <h3 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-primary dark:text-white leading-tight">
                    {activeTier.title}
                  </h3>

                  <p className="font-serif italic text-base sm:text-lg lg:text-xl text-[#0B5F61] dark:text-[#C6A96B] font-light leading-relaxed">
                    “{activeTier.tagline}”
                  </p>
                </div>

                <p className="text-xs sm:text-sm md:text-base text-secondary dark:text-white/75 font-light leading-relaxed max-w-2xl">
                  {activeTier.description}
                </p>

                {/* Technical Weave Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {activeTier.specs.map((spec, i) => (
                    <div 
                      key={i} 
                      className="p-3 rounded-2xl bg-cream/40 dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922]"
                    >
                      <span className="text-[9px] font-mono uppercase tracking-widest text-secondary dark:text-white/50 block">
                        {spec.label}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-primary dark:text-white block mt-0.5">
                        {spec.val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Color Palette & Explore CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-[#E8DFD3] dark:border-[#332922]">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-secondary dark:text-white/60 block">
                      Curated Palette:
                    </span>
                    <div className="flex items-center gap-3">
                      {activeTier.swatches.map((swatch, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span 
                            className="w-4 h-4 rounded-full border border-black/15 dark:border-white/30 shadow-xs"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <span className="text-[11px] text-primary dark:text-white/80 font-medium">
                            {swatch.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link to={activeTier.link}>
                    <button className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1A1A1A] hover:bg-[#0B5F61] dark:bg-[#C6A96B] dark:hover:bg-[#E5C158] text-white dark:text-black font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer">
                      <span>Explore {activeTier.title}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Right Architectural Visual Showcase */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTier.id}
                  initial={{ opacity: 0, scale: 0.94, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -15 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#E8DFD3] dark:border-[#332922] bg-cream dark:bg-[#14100D] group"
                >
                  {/* Atmospheric Photo */}
                  <img
                    src={activeTier.image}
                    alt={activeTier.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
                  />

                  {/* Soft Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Product Cutout Overlay */}
                  <div className="absolute bottom-6 right-6 w-36 sm:w-44 h-36 sm:h-44 pointer-events-none drop-shadow-2xl">
                    <img
                      src={activeTier.productCutout}
                      alt={`${activeTier.title} cutout`}
                      className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
                    />
                  </div>

                  {/* Bottom Overlay Label */}
                  <div className="absolute bottom-6 left-6 z-10 text-white space-y-1">
                    <span 
                      className="text-[10px] font-mono tracking-widest uppercase block text-[#C6A96B]"
                    >
                      {activeTier.badge.split('•')[0]}
                    </span>
                    <span className="font-serif text-xl sm:text-2xl font-light text-white block">
                      {activeTier.shortSubtitle}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* Bottom Progress Bar Strip (Shows all 3 with active progress indicator) */}
          <div className="relative z-20 pt-4 border-t border-[#E8DFD3] dark:border-[#332922] grid grid-cols-3 gap-3 sm:gap-6 text-center">
            {TIERS.map((tier, idx) => {
              const isActive = idx === activeIdx;
              return (
                <div 
                  key={tier.id}
                  onClick={() => setActiveIdx(idx)}
                  className="group cursor-pointer space-y-2 text-left"
                >
                  <div className="w-full h-1.5 rounded-full bg-[#E8DFD3] dark:bg-white/10 overflow-hidden">
                    <motion.div 
                      className="h-full bg-[#C6A96B] rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: isActive ? '100%' : '0%' }}
                      transition={{ duration: isActive ? 5.0 : 0.3, ease: 'linear' }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono uppercase tracking-widest text-secondary dark:text-white/60 group-hover:text-primary dark:group-hover:text-white transition-colors">
                    <span>0{idx + 1}. {tier.title.replace('JORIQUE ', '')}</span>
                    {isActive && <span className="hidden sm:inline text-[#C6A96B] font-bold">● Active</span>}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
