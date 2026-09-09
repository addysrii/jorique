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

  // Primary product image placed inside the device displays
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
          
          {/* LEFT: Precision Multi-Device Showcase (Zero Distortion, Apple-grade realism) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-2 sm:p-4">
            <div className="relative w-full max-w-[620px] aspect-[16/11] sm:aspect-[16/10] flex items-end justify-center select-none">
              
              {/* 1. LARGE LAPTOP (Center-Stage - 85% width) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative w-[84%] sm:w-[86%] mb-3 z-10"
              >
                {/* Laptop Display Lid */}
                <div className="rounded-t-2xl sm:rounded-t-3xl bg-[#1a1a1a] p-2 sm:p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-neutral-700/80 ring-1 ring-black/80">
                  {/* Webcam & Ambient Sensor */}
                  <div className="flex items-center justify-center gap-1.5 mb-1 sm:mb-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] border border-neutral-600 ring-1 ring-neutral-800" />
                    <div className="w-1 h-1 rounded-full bg-[#152238] opacity-60" />
                  </div>

                  {/* Screen Content (16:10 Wide Aspect Ratio - 1.0x Full Perspective) */}
                  <div className="relative aspect-[16/10] rounded-md sm:rounded-lg overflow-hidden bg-neutral-900 shadow-inner">
                    <img
                      src={displayImage}
                      alt={`${productName} on Desktop Monitor`}
                      className="w-full h-full object-cover transition-all duration-500"
                      style={{
                        filter: getFilter('monitor'),
                      }}
                    />
                    {/* Realistic Screen Glare */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/10 pointer-events-none" />
                    
                    {/* Screen corner badge */}
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono text-white/80">
                      1.0× Wide
                    </div>
                  </div>
                </div>

                {/* Open MacBook Aluminum Base & Keyboard Deck */}
                <div className="relative w-[104%] -left-[2%] h-8 sm:h-12 bg-gradient-to-b from-[#e3e3e3] via-[#d5d5d5] to-[#b0b0b0] dark:from-[#2c2a29] dark:via-[#22201e] dark:to-[#161514] rounded-b-xl sm:rounded-b-2xl shadow-2xl border-t border-white/80 dark:border-white/15 px-4 sm:px-6 pt-1 sm:pt-1.5 overflow-hidden">
                  {/* Keyboard Well */}
                  <div className="w-[84%] h-3.5 sm:h-5 mx-auto bg-[#141414] dark:bg-[#0a0a0a] rounded-t-xs rounded-b-sm shadow-inner flex flex-col justify-center px-1">
                    <div className="grid grid-cols-12 gap-0.5 sm:gap-1 h-2.5 sm:h-3.5 opacity-75">
                      {[...Array(24)].map((_, i) => (
                        <div key={i} className="bg-[#282828] dark:bg-[#1a1a1a] rounded-[1px] shadow-xs" />
                      ))}
                    </div>
                  </div>

                  {/* Glass Trackpad */}
                  <div className="w-12 sm:w-16 h-2 sm:h-2.5 mx-auto mt-0.5 sm:mt-1 border border-black/15 dark:border-white/10 rounded-[2px] bg-black/5 dark:bg-white/5" />

                  {/* Front Lip Display Opener Scoop */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 sm:w-20 h-1 bg-[#888] dark:bg-[#080808] rounded-t-sm" />
                </div>

                {/* Grounding Desk Shadow */}
                <div className="w-[96%] h-3.5 mx-auto bg-black/30 dark:bg-black/80 blur-md rounded-full mt-[-2px]" />
              </motion.div>

              {/* 2. ENLARGED LEFT-HAND TABLET (Enlarged size as requested, 1.35x Texture Zoom) */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 15 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="absolute left-0 sm:left-1 bottom-0 w-[30%] sm:w-[32%] max-w-[210px] z-20"
              >
                <div className="relative rounded-[18px] sm:rounded-[24px] bg-[#1a1a1a] p-1.5 sm:p-2 shadow-[0_20px_45px_rgba(0,0,0,0.55)] border border-neutral-700/80 ring-1 ring-black/80">
                  {/* Tablet Front Camera */}
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] border border-neutral-600 mx-auto mb-1 opacity-80" />

                  {/* Tablet Screen (3:4 Ratio - 1.35x Fabric Zoom) */}
                  <div className="relative aspect-[3/4] rounded-[12px] sm:rounded-[18px] overflow-hidden bg-neutral-900 shadow-inner">
                    <img
                      src={displayImage}
                      alt={`${productName} on Tablet`}
                      className="w-full h-full object-cover transition-all duration-500 scale-[1.35] origin-center"
                      style={{
                        filter: getFilter('tablet'),
                      }}
                    />
                    {/* Glass Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/15 pointer-events-none" />
                    
                    {/* Micro Zoom Badge */}
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-mono text-white/90">
                      1.35× Texture
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 3. RIGHT-HAND COMPACT SMARTPHONE (1.75x Macro Zoom) */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: 15 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="absolute right-0 sm:right-1 bottom-0 w-[18%] sm:w-[19%] max-w-[125px] z-20"
              >
                <div className="relative rounded-[18px] sm:rounded-[24px] bg-[#121212] p-1 sm:p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.55)] border border-neutral-700/80 ring-1 ring-black/80">
                  {/* Dynamic Island / Speaker */}
                  <div className="absolute top-1.5 sm:top-2 left-1/2 -translate-x-1/2 w-5 sm:w-7 h-1 sm:h-1.5 bg-black rounded-full z-30 shadow-xs border border-white/10" />

                  {/* Phone Screen (9:19.5 Aspect Ratio - 1.75x Macro Thread Zoom) */}
                  <div className="relative aspect-[9/19.5] rounded-[14px] sm:rounded-[20px] overflow-hidden bg-neutral-900 shadow-inner">
                    <img
                      src={displayImage}
                      alt={`${productName} on Smartphone`}
                      className="w-full h-full object-cover transition-all duration-500 scale-[1.75] origin-center"
                      style={{
                        filter: getFilter('phone'),
                      }}
                    />
                    {/* Glass Glare */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/20 pointer-events-none" />

                    {/* Micro Zoom Badge */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[7px] font-mono text-white/90 whitespace-nowrap">
                      1.75× Macro
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className="w-5 sm:w-7 h-0.5 bg-white/40 rounded-full mx-auto mt-0.5" />
                </div>
              </motion.div>

            </div>

            {/* Micro Caption Showing Scale Levels & Zero-Distortion Verification */}
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
