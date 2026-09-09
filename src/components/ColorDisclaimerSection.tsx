import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Monitor, Laptop, Tablet, SunMedium, Lamp, Sparkle } from 'lucide-react';

interface ColorDisclaimerSectionProps {
  images?: string[];
  productName?: string;
}

type LightingMode = 'studio' | 'warm' | 'vibrant';

export default function ColorDisclaimerSection({
  images = [],
  productName = 'Product',
}: ColorDisclaimerSectionProps) {
  const [activeMode, setActiveMode] = useState<LightingMode>('studio');

  // Primary product image placed inside the real Apple device displays
  const displayImage =
    (images && images.length > 0 ? images[0] : null) ||
    '/Products/1.webp';

  // CSS filter string based on active simulated lighting
  const getFilter = (device: 'monitor' | 'laptop' | 'tablet') => {
    if (activeMode === 'warm') {
      if (device === 'monitor') return 'sepia(0.12) brightness(0.97) contrast(1.02)';
      if (device === 'laptop') return 'sepia(0.14) brightness(0.98) contrast(1.01)';
      return 'sepia(0.18) brightness(0.96) contrast(1.06)';
    }

    if (activeMode === 'vibrant') {
      if (device === 'monitor') return 'saturate(1.12) contrast(1.05)';
      if (device === 'laptop') return 'saturate(1.14) contrast(1.04)';
      return 'saturate(1.22) contrast(1.10) brightness(1.02)';
    }

    // Studio Standard
    if (device === 'monitor') return 'brightness(0.98) contrast(1.02)';
    if (device === 'laptop') return 'brightness(0.99) saturate(1.02)';
    return 'brightness(0.97) contrast(1.04)';
  };

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl overflow-hidden p-6 sm:p-10 lg:p-12 bg-[#FAF8F5] dark:bg-[#151210] border border-border/80 dark:border-[#2E2925] shadow-sm space-y-10"
      >
        {/* Subtle ambient motif */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#C6A96B_1px,transparent_1px)] [background-size:28px_28px] opacity-10 dark:opacity-5" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C6A96B]/10 rounded-full blur-3xl pointer-events-none" />

        {/* TOP SECTION: Typography, Explanation & Interactive Lighting Modes */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-3.5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream dark:bg-white/5 text-primary dark:text-[#D4AF37] text-[10px] font-bold tracking-[0.25em] uppercase border border-border dark:border-[#2E2925]">
              <Sparkles size={11} className="text-[#C6A96B] dark:text-[#D4AF37]" />
              <span>Display Fidelity & Tone</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-light text-primary dark:text-white tracking-tight leading-snug">
              Colour Disclaimer
            </h3>

            <p className="text-xs sm:text-sm text-secondary dark:text-white/80 leading-relaxed font-sans font-light max-w-2xl">
              Colour Disclaimer: Actual product colour may vary slightly from the images due to differences in Display color tone, camera settings, lighting conditions, and image editing.
            </p>
          </div>

          {/* Interactive Ambient Lighting Selector */}
          <div className="lg:col-span-5 bg-white/70 dark:bg-[#1C1916]/80 backdrop-blur-md p-4 rounded-2xl border border-border/60 dark:border-white/10 space-y-2.5">
            <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-secondary dark:text-white/60">
              Simulate Ambient Room Lighting:
            </span>

            <div className="grid grid-cols-3 gap-2">
              {/* 1. Studio Daylight */}
              <button
                type="button"
                onClick={() => setActiveMode('studio')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-semibold transition-all ${activeMode === 'studio'
                  ? 'bg-white dark:bg-[#25211E] border-[#C6A96B] text-primary dark:text-[#D4AF37] shadow-xs'
                  : 'bg-cream/40 dark:bg-white/5 border-transparent text-secondary dark:text-white/60 hover:bg-cream dark:hover:bg-white/10'
                  }`}
              >
                <SunMedium size={14} className="mb-1 text-amber-500" />
                <span className="text-[10px] leading-tight">Studio Daylight</span>
                <span className="text-[8px] opacity-60 font-mono mt-0.5">6500K</span>
              </button>

              {/* 2. Warm Ambient */}
              <button
                type="button"
                onClick={() => setActiveMode('warm')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-semibold transition-all ${activeMode === 'warm'
                  ? 'bg-white dark:bg-[#25211E] border-[#C6A96B] text-primary dark:text-[#D4AF37] shadow-xs'
                  : 'bg-cream/40 dark:bg-white/5 border-transparent text-secondary dark:text-white/60 hover:bg-cream dark:hover:bg-white/10'
                  }`}
              >
                <Lamp size={14} className="mb-1 text-orange-500" />
                <span className="text-[10px] leading-tight">Warm Indoor</span>
                <span className="text-[8px] opacity-60 font-mono mt-0.5">2700K</span>
              </button>

              {/* 3. Vibrant OLED */}
              <button
                type="button"
                onClick={() => setActiveMode('vibrant')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-semibold transition-all ${activeMode === 'vibrant'
                  ? 'bg-white dark:bg-[#25211E] border-[#C6A96B] text-primary dark:text-[#D4AF37] shadow-xs'
                  : 'bg-cream/40 dark:bg-white/5 border-transparent text-secondary dark:text-white/60 hover:bg-cream dark:hover:bg-white/10'
                  }`}
              >
                <Sparkle size={14} className="mb-1 text-purple-500" />
                <span className="text-[10px] leading-tight">Vibrant OLED</span>
                <span className="text-[8px] opacity-60 font-mono mt-0.5">Retina P3</span>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Transparent Apple Hardware Multi-Screen Showcase */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center select-none pt-2">

          {/* Panoramic Device Frame Container (Matching exact 1780x883 proportion of user's image) */}
          <div className="relative w-full aspect-[1780/883] drop-shadow-xl">

            {/* 1. Center Studio Display Screen (1.0x Full Lifestyle View) */}
            <div
              className="absolute overflow-hidden"
              style={{
                left: '31.91%',
                top: '9.06%',
                width: '52.70%',
                height: '60.02%',
                zIndex: 1,
              }}
            >
              <img
                src={displayImage}
                alt={`${productName} on Apple Studio Display`}
                className="w-full h-full object-cover"
                style={{
                  filter: getFilter('monitor'),
                  transition: 'filter 0.5s ease',
                }}
              />
              {/* Subtle glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5 pointer-events-none" />
            </div>

            {/* 2. Left MacBook Pro Screen (1.20x Laptop Perspective) */}
            <div
              className="absolute overflow-hidden"
              style={{
                left: '10.67%',
                top: '43.15%',
                width: '35.84%',
                height: '46.55%',
                zIndex: 2,
              }}
            >
              <img
                src={displayImage}
                alt={`${productName} on MacBook Pro`}
                className="w-full h-full object-cover scale-[1.20] origin-center"
                style={{
                  filter: getFilter('laptop'),
                  transition: 'filter 0.5s ease',
                }}
              />
              {/* Subtle glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5 pointer-events-none" />
            </div>

            {/* 3. Right iPad Pro Screen (1.45x Texture Focus Zoom) */}
            <div
              className="absolute overflow-hidden"
              style={{
                left: '77.13%',
                top: '40.66%',
                width: '18.20%',
                height: '51.08%',
                zIndex: 2,
              }}
            >
              <img
                src={displayImage}
                alt={`${productName} on iPad Pro`}
                className="w-full h-full object-cover scale-[1.45] origin-center"
                style={{
                  filter: getFilter('tablet'),
                  transition: 'filter 0.5s ease',
                }}
              />
              {/* Subtle glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5 pointer-events-none" />
            </div>

            {/* 4. REAL APPLE HARDWARE FRAME (Authentic Studio Display, MacBook Pro, iPad from user image) */}
            <img
              src="/images/apple-suite-transparent-frame.png"
              alt="Real Apple Hardware Ecosystem"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-10"
            />
          </div>

          {/* Micro Caption Showing Device Scale & Role */}
          {/* <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-6 text-[11px] font-medium text-secondary/80 dark:text-white/60">
            <span className="flex items-center gap-1">
              <Monitor size={12} className="text-[#C6A96B] dark:text-[#D4AF37]" /> Studio Display (1.0× Wide)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Laptop size={12} className="text-[#C6A96B] dark:text-[#D4AF37]" /> MacBook Pro (1.20× Context)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Tablet size={12} className="text-[#C6A96B] dark:text-[#D4AF37]" /> iPad Pro (1.45× Texture Focus)
            </span>
          </div> */}

        </div>
      </motion.div>
    </section>
  );
}
