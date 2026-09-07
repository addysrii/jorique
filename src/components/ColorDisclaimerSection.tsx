import { motion } from 'framer-motion';
import { Sparkles, Monitor, Smartphone, Tablet, Sun, Moon, Eye } from 'lucide-react';

interface ColorDisclaimerSectionProps {
  images: string[];
  productName: string;
}

export default function ColorDisclaimerSection({ images, productName }: ColorDisclaimerSectionProps) {
  // Fallback photography
  const fallbackImage = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200';
  const macbookImage = images[0] || fallbackImage;
  const tabletImage = images[1] || images[0] || fallbackImage;
  const iphoneImage = images[2] || images[0] || fallbackImage;

  return (
    <section className="py-12 sm:py-16 my-10 border-y border-border/80 dark:border-[#2E2925] bg-[#FAF8F5] dark:bg-[#13110F] transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* LEFT: Authentic Apple Products Showcase with Differing Screen Profiles */}
          <div className="lg:col-span-7 flex items-center justify-center p-1 sm:p-4">
            <div className="relative w-full max-w-[620px] aspect-[16/11] flex items-end justify-center">
              
              {/* 1. APPLE MACBOOK PRO 16" (Center Stage - Calibrated Studio / Deeper Contrast "Dark") */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative w-[84%] sm:w-[86%] mb-2 sm:mb-3.5 z-10"
              >
                {/* MacBook Display Lid & Aluminum Enclosure */}
                <div className="rounded-t-2xl sm:rounded-t-[22px] bg-[#1a1918] dark:bg-[#0f0e0d] p-2 sm:p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-white/20 dark:border-white/10 ring-1 ring-black/80">
                  
                  {/* Liquid Retina XDR Screen Bezel with Signature Apple Camera Notch */}
                  <div className="relative aspect-[16/10] rounded-md sm:rounded-lg overflow-hidden bg-black shadow-inner">
                    
                    {/* Apple Camera Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 sm:w-20 h-2.5 sm:h-3.5 bg-black rounded-b-md z-30 flex items-center justify-center gap-1.5 px-2 border-b border-x border-white/5">
                      <div className="w-1 h-1 rounded-full bg-[#1c2a38] border border-blue-400/40" />
                      <div className="w-0.5 h-0.5 rounded-full bg-emerald-400/60" />
                    </div>

                    {/* Apple Menu Bar Mockup */}
                    <div className="absolute top-0 inset-x-0 h-3.5 sm:h-4 bg-black/40 backdrop-blur-xs z-20 flex items-center justify-between px-2 text-[7px] sm:text-[8px] text-white/75 font-sans pointer-events-none">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold"></span>
                        <span className="hidden sm:inline font-medium">JORIQUE Studio</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[7px] font-mono opacity-80">
                        <span>P3 Studio</span>
                        <span>9:41 AM</span>
                      </div>
                    </div>

                    {/* Screen Content: Calibrated Studio / Deeper Shadows (Darker tone) */}
                    <img
                      src={macbookImage}
                      alt={`${productName} on MacBook Pro`}
                      className="w-full h-full object-cover brightness-[0.82] contrast-[1.24] saturate-[0.95] filter"
                    />

                    {/* Calibrated Studio Overlay Pill Badge */}
                    <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[8px] sm:text-[9px] font-medium text-white shadow-md">
                      <Moon size={10} className="text-indigo-400" />
                      <span>MacBook Pro • Studio Gamut (Deeper Contrast)</span>
                    </div>

                    {/* Display Glass Reflections */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/[0.08] pointer-events-none" />
                  </div>
                </div>

                {/* MacBook Anodized Aluminum Keyboard Deck */}
                <div className="relative w-[104%] -left-[2%] h-7 sm:h-11 bg-gradient-to-b from-[#dedede] via-[#cfcfcf] to-[#b3b3b3] dark:from-[#2c2926] dark:via-[#201e1c] dark:to-[#161413] rounded-b-xl sm:rounded-b-2xl shadow-2xl border-t border-white/80 dark:border-white/15 px-4 sm:px-6 pt-1 sm:pt-1.5 overflow-hidden">
                  {/* Black Keyboard Well */}
                  <div className="w-[84%] h-3 sm:h-4.5 mx-auto bg-[#141414] dark:bg-[#0a0a0a] rounded-t-xs rounded-b-sm shadow-inner flex flex-col justify-center px-1">
                    <div className="grid grid-cols-14 gap-0.5 h-2 sm:h-3 opacity-70">
                      {[...Array(28)].map((_, i) => (
                        <div key={i} className="bg-[#2a2a2a] dark:bg-[#1a1a1a] rounded-[0.5px]" />
                      ))}
                    </div>
                  </div>

                  {/* Force Touch Glass Trackpad */}
                  <div className="w-14 sm:w-20 h-1.5 sm:h-2 mx-auto mt-0.5 border border-black/15 dark:border-white/10 rounded-[1.5px] bg-black/5 dark:bg-white/5 shadow-inner" />

                  {/* Front Lip Display Opener Groove */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-0.5 sm:h-1 bg-[#888] dark:bg-[#0a0a0a] rounded-t-xs" />
                </div>

                {/* MacBook Surface Shadow */}
                <div className="w-[96%] h-3.5 mx-auto bg-black/35 dark:bg-black/80 blur-md rounded-full mt-[-3px]" />
              </motion.div>

              {/* 2. APPLE iPHONE 16 PRO (Far Bottom-Left - Super Retina OLED "Jada Bright") */}
              <motion.div
                initial={{ opacity: 0, x: -16, y: 18 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="absolute left-0 bottom-0 w-[18%] sm:w-[17%] max-w-[110px] z-20"
              >
                <div className="relative rounded-[18px] sm:rounded-[24px] bg-[#1a1918] dark:bg-[#0f0e0d] p-1 sm:p-1.5 shadow-[0_16px_36px_rgba(0,0,0,0.55)] border border-[#d6c7b2]/40 dark:border-white/20 ring-1 ring-black/90">
                  
                  {/* Apple Dynamic Island */}
                  <div className="absolute top-1.5 sm:top-2 left-1/2 -translate-x-1/2 w-5 sm:w-7 h-1.5 sm:h-2 bg-black rounded-full z-30 shadow-xs border border-white/10 flex items-center justify-end pr-1">
                    <div className="w-1 h-1 rounded-full bg-[#122236]" />
                  </div>

                  {/* iPhone Screen: Super Retina XDR OLED (Ultra Bright & Punchy Saturation) */}
                  <div className="relative aspect-[9/19.5] rounded-[14px] sm:rounded-[19px] overflow-hidden bg-black shadow-inner">
                    
                    {/* Status Bar */}
                    <div className="absolute top-1 inset-x-1.5 z-20 flex justify-between items-center text-[6px] sm:text-[7px] text-white/90 font-mono pointer-events-none">
                      <span>9:41</span>
                      <div className="flex items-center gap-0.5">
                        <span className="text-[5px]">5G</span>
                        <div className="w-2.5 h-1 border border-white/80 rounded-[1px] p-[0.5px]">
                          <div className="w-full h-full bg-white rounded-[0.5px]" />
                        </div>
                      </div>
                    </div>

                    <img
                      src={iphoneImage}
                      alt={`${productName} on iPhone 16 Pro`}
                      className="w-full h-full object-cover brightness-[1.18] contrast-[1.12] saturate-[1.28] hue-rotate-[1deg] filter"
                    />

                    {/* Bright OLED Luminous Badge */}
                    <div className="absolute bottom-3 inset-x-1 z-20 text-center">
                      <span className="inline-block px-1.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-amber-400/40 text-[6px] sm:text-[7px] font-bold text-amber-300 shadow-sm leading-tight">
                        iPhone • Ultra Bright
                      </span>
                    </div>

                    {/* Apple Home Indicator Bar */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-7 sm:w-9 h-0.5 bg-white/70 rounded-full z-20" />

                    {/* Glossy OLED Sheen */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-amber-200/15 pointer-events-none" />
                  </div>
                </div>
              </motion.div>

              {/* 3. APPLE iPAD PRO (Far Bottom-Right - True Tone Daylight Balance) */}
              <motion.div
                initial={{ opacity: 0, x: 16, y: 18 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="absolute right-0 bottom-0 w-[27%] sm:w-[26%] max-w-[165px] z-20"
              >
                <div className="relative rounded-[16px] sm:rounded-[20px] bg-[#1a1918] dark:bg-[#0f0e0d] p-1.5 sm:p-2 shadow-[0_18px_40px_rgba(0,0,0,0.55)] border border-white/25 dark:border-white/15 ring-1 ring-black/90">
                  
                  {/* TrueDepth Front Camera Dot */}
                  <div className="w-1 h-1 rounded-full bg-[#222] border border-white/20 mx-auto mb-1" />

                  {/* iPad Screen: True Tone Balanced Ambient Daylight */}
                  <div className="relative aspect-[3/4] rounded-[12px] sm:rounded-[15px] overflow-hidden bg-black shadow-inner">
                    <img
                      src={tabletImage}
                      alt={`${productName} on iPad Pro`}
                      className="w-full h-full object-cover brightness-[1.01] contrast-[1.02] saturate-[1.06] sepia-[0.05] filter"
                    />

                    {/* True Tone Daylight Badge */}
                    <div className="absolute bottom-2 inset-x-1.5 z-20 text-center">
                      <span className="inline-block px-1.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-emerald-400/40 text-[7px] sm:text-[8px] font-bold text-emerald-300 shadow-sm leading-tight">
                        iPad Pro • True Tone
                      </span>
                    </div>

                    {/* Apple Home Bar */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-0.5 bg-white/60 rounded-full z-20" />

                    {/* Gentle Matte Glare */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/10 pointer-events-none" />
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

          {/* RIGHT: Clean Typography & Explanation of Varied Screen Calibrations */}
          <div className="lg:col-span-5 space-y-5 text-center lg:text-left pl-0 lg:pl-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream dark:bg-white/10 text-primary dark:text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase border border-border dark:border-[#2E2925]">
              <Sparkles size={12} />
              <span>Apple Display Fidelity</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-primary dark:text-white tracking-tight leading-tight">
              Colour Disclaimer
            </h3>

            <div className="space-y-2 max-w-lg">
              <p className="text-sm sm:text-base text-primary/90 dark:text-white/95 leading-relaxed font-sans font-medium">
                Actual product colour may vary slightly from the images due to differences in camera settings, lighting conditions, and image editing.
              </p>
              <p className="text-xs sm:text-sm text-secondary dark:text-white/70 leading-relaxed font-sans">
                Every Apple and mobile device renders fabric hues through distinct color profiles, ambient sensors, and screen technologies.
              </p>
            </div>

            {/* 3 Display Calibration Profiles Breakdown */}
            <div className="space-y-3 pt-1 text-left text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-[#1A1816] border border-border/80 dark:border-[#2E2925] flex items-start gap-3 shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sun size={15} />
                </div>
                <div>
                  <p className="font-bold text-primary dark:text-white flex items-center gap-1.5">
                    <Smartphone size={13} className="text-[#C6A96B]" /> iPhone 16 Pro (Super Retina OLED)
                  </p>
                  <p className="text-[11px] text-secondary dark:text-white/60 mt-0.5 leading-normal">
                    Features ultra-high peak brightness and punchy color saturation. Rich tones appear warmer and more radiant under direct lighting.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#1A1816] border border-border/80 dark:border-[#2E2925] flex items-start gap-3 shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Moon size={15} />
                </div>
                <div>
                  <p className="font-bold text-primary dark:text-white flex items-center gap-1.5">
                    <Monitor size={13} className="text-[#C6A96B]" /> MacBook Pro (Liquid Retina XDR)
                  </p>
                  <p className="text-[11px] text-secondary dark:text-white/60 mt-0.5 leading-normal">
                    Calibrated to studio D65 P3 color space with deeper blacks and higher contrast. Shadows and deep tones render visibly darker.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-[#1A1816] border border-border/80 dark:border-[#2E2925] flex items-start gap-3 shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Eye size={15} />
                </div>
                <div>
                  <p className="font-bold text-primary dark:text-white flex items-center gap-1.5">
                    <Tablet size={13} className="text-[#C6A96B]" /> iPad Pro (True Tone & ProMotion)
                  </p>
                  <p className="text-[11px] text-secondary dark:text-white/60 mt-0.5 leading-normal">
                    Actively measures room illuminance to provide balanced daylight viewing, producing softer, organic fabric tones.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
