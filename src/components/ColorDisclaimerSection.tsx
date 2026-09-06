import { motion } from 'framer-motion';
import { Sparkles, Monitor, Smartphone, Tablet } from 'lucide-react';

interface ColorDisclaimerSectionProps {
  images: string[];
  productName: string;
}

export default function ColorDisclaimerSection({ images, productName }: ColorDisclaimerSectionProps) {
  // Fallbacks
  const fallbackImage = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200';
  const laptopImage = images[0] || fallbackImage;
  const tabletImage = images[1] || images[0] || fallbackImage;
  const phoneImage = images[2] || images[0] || fallbackImage;

  return (
    <section className="py-12 sm:py-16 my-10 border-y border-border/80 dark:border-[#2E2925] bg-warm-white/70 dark:bg-[#141210] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: Multi-Device Showcase with Prominently Visible Laptop */}
          <div className="lg:col-span-7 flex items-center justify-center p-2 sm:p-4">
            <div className="relative w-full max-w-[620px] aspect-[16/10] flex items-end justify-center">
              
              {/* 1. LARGE LAPTOP (Center Stage - 84% width, almost entirely visible) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative w-[82%] sm:w-[84%] mb-2 sm:mb-3 z-10"
              >
                {/* Laptop Display Lid */}
                <div className="rounded-t-2xl sm:rounded-t-3xl bg-[#181818] p-2 sm:p-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.3)] border border-white/20 ring-1 ring-black/60">
                  {/* Webcam */}
                  <div className="flex justify-center mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#333] border border-white/20" />
                  </div>

                  {/* Screen Content (16:10 Wide Aspect Ratio) */}
                  <div className="relative aspect-[16/10] rounded-md sm:rounded-lg overflow-hidden bg-black shadow-inner">
                    <img
                      src={laptopImage}
                      alt={`${productName} on Laptop`}
                      className="w-full h-full object-cover brightness-[0.98] contrast-[1.02]"
                    />
                    {/* Glass glare */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/10 pointer-events-none" />
                  </div>
                </div>

                {/* Open MacBook Aluminum Base & Keyboard Deck */}
                <div className="relative w-[104%] -left-[2%] h-8 sm:h-12 bg-gradient-to-b from-[#e3e3e3] via-[#d5d5d5] to-[#b0b0b0] dark:from-[#2a2a2a] dark:via-[#202020] dark:to-[#141414] rounded-b-xl sm:rounded-b-2xl shadow-xl border-t border-white/70 dark:border-white/15 px-4 sm:px-6 pt-1 sm:pt-1.5 overflow-hidden">
                  {/* Keyboard Area */}
                  <div className="w-[82%] h-3.5 sm:h-5 mx-auto bg-[#1a1a1a] dark:bg-[#0c0c0c] rounded-t-xs rounded-b-sm shadow-inner flex flex-col justify-center px-1">
                    <div className="grid grid-cols-12 gap-0.5 sm:gap-1 h-2.5 sm:h-3.5 opacity-70">
                      {[...Array(24)].map((_, i) => (
                        <div key={i} className="bg-[#2a2a2a] dark:bg-[#1c1c1c] rounded-[1px]" />
                      ))}
                    </div>
                  </div>

                  {/* Trackpad */}
                  <div className="w-12 sm:w-16 h-2 sm:h-2.5 mx-auto mt-0.5 sm:mt-1 border border-black/15 dark:border-white/10 rounded-[2px] bg-black/5 dark:bg-white/5" />

                  {/* Front Lip Thumb Scoop */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 sm:w-20 h-1 bg-[#888] dark:bg-[#0a0a0a] rounded-t-sm" />
                </div>

                {/* Desk Shadow */}
                <div className="w-[94%] h-3 mx-auto bg-black/25 dark:bg-black/70 blur-md rounded-full mt-[-2px]" />
              </motion.div>

              {/* 2. COMPACT SMARTPHONE (Far Bottom-Left - only covers ~8% of the laptop corner) */}
              <motion.div
                initial={{ opacity: 0, x: -15, y: 15 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="absolute left-0 bottom-0 w-[17%] sm:w-[16%] max-w-[105px] z-20"
              >
                <div className="relative rounded-[16px] sm:rounded-[22px] bg-[#121212] p-1 sm:p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.5)] border border-white/20 ring-1 ring-black/70">
                  {/* Dynamic Island */}
                  <div className="absolute top-1.5 sm:top-2 left-1/2 -translate-x-1/2 w-4 sm:w-6 h-1 sm:h-1.5 bg-black rounded-full z-30 shadow-xs border border-white/10" />

                  {/* Phone Screen */}
                  <div className="relative aspect-[9/19] rounded-[12px] sm:rounded-[18px] overflow-hidden bg-black shadow-inner">
                    <img
                      src={phoneImage}
                      alt={`${productName} on Phone`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/15 pointer-events-none" />
                  </div>

                  {/* Home Bar */}
                  <div className="w-6 sm:w-8 h-0.5 bg-white/40 rounded-full mx-auto mt-0.5" />
                </div>
              </motion.div>

              {/* 3. SLEEK TABLET (Far Bottom-Right - placed beside laptop, overlaps only ~15% edge) */}
              <motion.div
                initial={{ opacity: 0, x: 15, y: 15 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="absolute right-0 bottom-0 w-[26%] sm:w-[25%] max-w-[160px] z-20"
              >
                <div className="relative rounded-[16px] sm:rounded-[20px] bg-[#181818] p-1.5 sm:p-2 shadow-[0_16px_35px_rgba(0,0,0,0.5)] border border-white/20 ring-1 ring-black/70">
                  {/* Tablet Camera */}
                  <div className="w-1.5 h-1.5 rounded-full bg-[#333] border border-white/20 mx-auto mb-1" />

                  {/* Tablet Screen */}
                  <div className="relative aspect-[3/4] rounded-[12px] sm:rounded-[15px] overflow-hidden bg-black shadow-inner">
                    <img
                      src={tabletImage}
                      alt={`${productName} on Tablet`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/15 pointer-events-none" />
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

          {/* RIGHT: Clean Typography & Explanation */}
          <div className="lg:col-span-5 space-y-4 text-center lg:text-left pl-0 lg:pl-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream dark:bg-white/10 text-primary dark:text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase border border-border dark:border-[#2E2925]">
              <Sparkles size={12} />
              <span>Display Fidelity</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-primary dark:text-white tracking-tight leading-tight">
              Colour Disclaimer
            </h3>

            <p className="text-sm sm:text-base text-secondary dark:text-white/80 leading-relaxed font-sans max-w-lg">
              Product colour may slightly vary due to photographic lighting sources or your device settings.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-secondary/80 dark:text-white/60">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Monitor size={14} className="text-primary dark:text-[#D4AF37]" /> Desktop
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Tablet size={14} className="text-primary dark:text-[#D4AF37]" /> Tablet
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Smartphone size={14} className="text-primary dark:text-[#D4AF37]" /> Mobile
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
