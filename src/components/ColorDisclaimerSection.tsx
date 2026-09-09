import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Monitor, Laptop, Tablet } from 'lucide-react';

interface ColorDisclaimerSectionProps {
  images?: string[];
  productName?: string;
}

export default function ColorDisclaimerSection({
  images = [],
  productName = 'Product',
}: ColorDisclaimerSectionProps) {
  // Primary product image placed inside the real Apple device displays
  const displayImage =
    (images && images.length > 0 ? images[0] : null) ||
    '/Products/1.webp';

  // Each device simultaneously displays a distinct real-world lighting & screen profile:
  // 1. Center Studio Display: Standard Studio Daylight (6500K neutral reference)
  const studioFilter = 'brightness(0.99) contrast(1.02)';

  // 2. Left MacBook Pro: Warm Indoor Ambient (2700K incandescent warmth)
  const laptopFilter = 'sepia(0.18) brightness(0.97) contrast(1.03) saturate(1.10)';

  // 3. Right iPad Pro: Vibrant OLED Retina P3 (high dynamic range & rich saturation)
  const tabletFilter = 'saturate(1.24) contrast(1.10) brightness(1.02)';

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl overflow-hidden p-6 sm:p-10 lg:p-12 bg-[#FAF8F5] dark:bg-[#151210] border border-border/80 dark:border-[#2E2925] shadow-sm space-y-8"
      >
        {/* Subtle ambient motif */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#C6A96B_1px,transparent_1px)] [background-size:28px_28px] opacity-10 dark:opacity-5" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C6A96B]/10 rounded-full blur-3xl pointer-events-none" />

        {/* TOP SECTION: Typography & Explanation */}
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream dark:bg-white/5 text-primary dark:text-[#D4AF37] text-[10px] font-bold tracking-[0.25em] uppercase border border-border dark:border-[#2E2925]">
            <Sparkles size={11} className="text-[#C6A96B] dark:text-[#D4AF37]" />
            <span>Display Fidelity & Tone</span>
          </div>

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-light text-primary dark:text-white tracking-tight leading-snug">
            Colour Disclaimer
          </h3>

          <p className="text-xs sm:text-sm text-secondary dark:text-white/80 leading-relaxed font-sans font-light">
            Colour Disclaimer: Actual product colour may vary slightly from the images due to differences in display colour tone, camera settings, lighting conditions, and screen technology across devices.
          </p>
        </div>

        {/* BOTTOM SECTION: Transparent Apple Hardware Multi-Screen Showcase */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center select-none pt-2">

          {/* Panoramic Device Frame Container (Matching exact 1780x883 proportion of user's image) */}
          <div className="relative w-full aspect-[1780/883] drop-shadow-xl">

            {/* 1. Center Studio Display Screen (Studio Daylight 6500K) */}
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
                alt={`${productName} in Studio Daylight`}
                className="w-full h-full object-cover"
                style={{
                  filter: studioFilter,
                }}
              />
              {/* Subtle glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5 pointer-events-none" />
            </div>

            {/* 2. Left MacBook Pro Screen (Warm Indoor 2700K) */}
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
                alt={`${productName} in Warm Indoor Light`}
                className="w-full h-full object-cover scale-[1.20] origin-center"
                style={{
                  filter: laptopFilter,
                }}
              />
              {/* Subtle glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/5 pointer-events-none" />
            </div>

            {/* 3. Right iPad Pro Screen (Vibrant OLED / Retina P3) */}
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
                alt={`${productName} in Vibrant OLED Display`}
                className="w-full h-full object-cover scale-[1.45] origin-center"
                style={{
                  filter: tabletFilter,
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

          {/* Micro Badges Indicating the Different Screen Calibrations */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-6 text-[11px] font-medium text-secondary/80 dark:text-white/60">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-white/5 border border-border/60 dark:border-white/10 shadow-2xs">
              <Laptop size={12} className="text-amber-500" />
              <span>MacBook: Warm Indoor (2700K)</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-white/5 border border-border/60 dark:border-white/10 shadow-2xs">
              <Monitor size={12} className="text-[#C6A96B] dark:text-[#D4AF37]" />
              <span>Studio Display: Studio Daylight (6500K)</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-white/5 border border-border/60 dark:border-white/10 shadow-2xs">
              <Tablet size={12} className="text-purple-500" />
              <span>iPad Pro: Vibrant OLED (Retina P3)</span>
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
