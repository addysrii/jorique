import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Monitor, Tablet, Smartphone, SunMedium, Lamp, Sparkle } from 'lucide-react';

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
  const getFilter = (device: 'monitor' | 'tablet' | 'phone') => {
    if (activeMode === 'warm') {
      if (device === 'monitor') return 'sepia(0.12) brightness(0.97) contrast(1.02)';
      if (device === 'tablet') return 'sepia(0.16) brightness(0.99) contrast(1.01)';
      return 'sepia(0.18) brightness(0.96) contrast(1.06)';
    }

    if (activeMode === 'vibrant') {
      if (device === 'monitor') return 'saturate(1.12) contrast(1.05)';
      if (device === 'tablet') return 'saturate(1.15) contrast(1.04)';
      return 'saturate(1.22) contrast(1.10) brightness(1.02)';
    }

    // Studio Standard
    if (device === 'monitor') return 'brightness(0.98) contrast(1.02)';
    if (device === 'tablet') return 'brightness(1.00) saturate(1.02)';
    return 'brightness(0.97) contrast(1.04)';
  };

  return (
    <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl overflow-hidden p-6 sm:p-10 lg:p-12 bg-[#FAF8F5] dark:bg-[#151210] border border-border/80 dark:border-[#2E2925] shadow-sm"
      >
        {/* Subtle ambient motif */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#C6A96B_1px,transparent_1px)] [background-size:28px_28px] opacity-10 dark:opacity-5" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C6A96B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: Real Apple Devices Showcase with Multi-Zoom Displays */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-2 sm:p-4">
            <div className="relative w-full max-w-[580px] mx-auto aspect-square select-none flex items-center justify-center">
              <svg
                viewBox="0 0 640 640"
                className="w-full h-full drop-shadow-2xl overflow-visible"
                style={{ shapeRendering: 'geometricPrecision' }}
              >
                <defs>
                  {/* 1. Desktop Monitor Screen Clip */}
                  <clipPath id="realImacClip">
                    <rect x="120" y="143" width="407" height="260" rx="4" ry="4" />
                  </clipPath>

                  {/* 2. Left Tablet Screen Clip */}
                  <clipPath id="realTabletClip">
                    <rect x="57" y="356" width="104" height="142" rx="5" ry="5" />
                  </clipPath>

                  {/* 3. Right Phone Screen Clip */}
                  <clipPath id="realPhoneClip">
                    <rect x="506" y="350" width="88" height="148" rx="8" ry="8" />
                  </clipPath>
                </defs>

                {/* 1. Desktop Monitor Screen (Wide View - 1.0x Full Perspective) */}
                <g clipPath="url(#realImacClip)">
                  <image
                    href={displayImage}
                    x="120"
                    y="143"
                    width="407"
                    height="260"
                    preserveAspectRatio="xMidYMid slice"
                    style={{
                      filter: getFilter('monitor'),
                      transition: 'filter 0.5s ease',
                    }}
                  />
                  {/* Screen Glass Glare */}
                  <rect
                    x="120"
                    y="143"
                    width="407"
                    height="260"
                    fill="white"
                    opacity="0.04"
                    pointerEvents="none"
                  />
                </g>

                {/* 2. Left Tablet Screen (1.35x Mid-Range Texture Zoom) */}
                <g clipPath="url(#realTabletClip)">
                  <g transform="scale(1.35)" style={{ transformOrigin: '109px 427px', transition: 'transform 0.5s ease' }}>
                    <image
                      href={displayImage}
                      x="57"
                      y="356"
                      width="104"
                      height="142"
                      preserveAspectRatio="xMidYMid slice"
                      style={{
                        filter: getFilter('tablet'),
                        transition: 'filter 0.5s ease',
                      }}
                    />
                  </g>
                </g>

                {/* 3. Right Phone Screen (1.75x High Detail Macro Zoom) */}
                <g clipPath="url(#realPhoneClip)">
                  <g transform="scale(1.75)" style={{ transformOrigin: '550px 424px', transition: 'transform 0.5s ease' }}>
                    <image
                      href={displayImage}
                      x="506"
                      y="350"
                      width="88"
                      height="148"
                      preserveAspectRatio="xMidYMid slice"
                      style={{
                        filter: getFilter('phone'),
                        transition: 'filter 0.5s ease',
                      }}
                    />
                  </g>
                </g>

                {/* 4. REAL APPLE HARDWARE FRAME (Precision Overlay from pngtree-apple-devices-display-png-image_14334194.png) */}
                <image
                  href="/images/apple-devices-transparent-frame.png"
                  x="0"
                  y="0"
                  width="640"
                  height="640"
                  pointerEvents="none"
                />
              </svg>
            </div>

            {/* Micro Caption Showing Device Scale Levels */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4 text-[11px] font-medium text-secondary/80 dark:text-white/60">
              <span className="flex items-center gap-1">
                <Monitor size={12} className="text-[#C6A96B] dark:text-[#D4AF37]" /> Desktop (1.0× Wide)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Tablet size={12} className="text-[#C6A96B] dark:text-[#D4AF37]" /> Left Tablet (1.35× Texture)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Smartphone size={12} className="text-[#C6A96B] dark:text-[#D4AF37]" /> Mobile (1.75× Macro)
              </span>
            </div>
          </div>

          {/* RIGHT: Typography, Explanation & Interactive Lighting Modes */}
          <div className="lg:col-span-5 space-y-5 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream dark:bg-white/5 text-primary dark:text-[#D4AF37] text-[10px] font-bold tracking-[0.25em] uppercase border border-border dark:border-[#2E2925]">
              <Sparkles size={11} className="text-[#C6A96B] dark:text-[#D4AF37]" />
              <span>Display Fidelity & Tone</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-light text-primary dark:text-white tracking-tight leading-snug">
              Colour Disclaimer
            </h3>

            <p className="text-xs sm:text-sm text-secondary dark:text-white/80 leading-relaxed font-sans font-light">
              We capture our textiles under calibrated studio daylight to reproduce tones faithfully. However, actual fabric luster and hues can vary slightly across different device screens, color calibrations (Retina, True Tone, OLED), and your ambient room lighting.
            </p>

            {/* Interactive Lighting Simulation Selector */}
            <div className="pt-2 border-t border-border/60 dark:border-white/10 space-y-2.5">
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-secondary dark:text-white/60">
                Simulate Ambient Lighting:
              </span>

              <div className="grid grid-cols-3 gap-2">
                {/* 1. Studio Daylight */}
                <button
                  type="button"
                  onClick={() => setActiveMode('studio')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    activeMode === 'studio'
                      ? 'bg-white dark:bg-[#1F1C19] border-[#C6A96B] text-primary dark:text-[#D4AF37] shadow-xs'
                      : 'bg-cream/40 dark:bg-white/5 border-transparent text-secondary dark:text-white/60 hover:bg-cream dark:hover:bg-white/10'
                  }`}
                >
                  <SunMedium size={15} className="mb-1 text-amber-500" />
                  <span className="text-[10px] leading-tight">Studio Daylight</span>
                  <span className="text-[8px] opacity-60 font-mono mt-0.5">6500K</span>
                </button>

                {/* 2. Warm Ambient */}
                <button
                  type="button"
                  onClick={() => setActiveMode('warm')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    activeMode === 'warm'
                      ? 'bg-white dark:bg-[#1F1C19] border-[#C6A96B] text-primary dark:text-[#D4AF37] shadow-xs'
                      : 'bg-cream/40 dark:bg-white/5 border-transparent text-secondary dark:text-white/60 hover:bg-cream dark:hover:bg-white/10'
                  }`}
                >
                  <Lamp size={15} className="mb-1 text-orange-500" />
                  <span className="text-[10px] leading-tight">Warm Indoor</span>
                  <span className="text-[8px] opacity-60 font-mono mt-0.5">2700K</span>
                </button>

                {/* 3. Vibrant OLED */}
                <button
                  type="button"
                  onClick={() => setActiveMode('vibrant')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    activeMode === 'vibrant'
                      ? 'bg-white dark:bg-[#1F1C19] border-[#C6A96B] text-primary dark:text-[#D4AF37] shadow-xs'
                      : 'bg-cream/40 dark:bg-white/5 border-transparent text-secondary dark:text-white/60 hover:bg-cream dark:hover:bg-white/10'
                  }`}
                >
                  <Sparkle size={15} className="mb-1 text-purple-500" />
                  <span className="text-[10px] leading-tight">Vibrant OLED</span>
                  <span className="text-[8px] opacity-60 font-mono mt-0.5">High Contrast</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </motion.div>
    </section>
  );
}
