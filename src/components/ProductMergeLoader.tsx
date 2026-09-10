import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ProductMergeLoaderProps {
  onComplete?: () => void;
  autoExitDelay?: number; // ms to stay on final logo before exit, default 1200ms
  showSkip?: boolean;
}

interface ProductItem {
  id: string;
  name: string;
  src: string;
  // Offset multiplier from center (-2.5 to +2.5) for precise horizontal convergence
  centerOffset: number;
}

const PRODUCTS: ProductItem[] = [
  { id: 'bedsheet', name: 'BEDSHEET', src: '/images/luxury-products/bedsheet_clean.png', centerOffset: -2.5 },
  { id: 'pillow', name: 'PILLOW COVER', src: '/images/luxury-products/pillow_clean.png', centerOffset: -1.5 },
  { id: 'suit', name: "WOMEN'S SUIT", src: '/images/luxury-products/suit_clean.png', centerOffset: -0.5 },
  { id: 'towel', name: 'TOWEL', src: '/images/luxury-products/towel_clean.png', centerOffset: 0.5 },
  { id: 'cushion', name: 'CUSHION COVER', src: '/images/luxury-products/cushion_clean.png', centerOffset: 1.5 },
  { id: 'shirt', name: "MEN'S SHIRT", src: '/images/luxury-products/shirt_clean.png', centerOffset: 2.5 },
];

export default function ProductMergeLoader({
  onComplete,
  autoExitDelay = 1200,
  showSkip = true,
}: ProductMergeLoaderProps) {
  // Animation states: 'ingress' | 'merge' | 'logo' | 'complete'
  const [phase, setPhase] = useState<'ingress' | 'merge' | 'logo' | 'complete'>('ingress');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Timeline sequence:
    // 0.0s - 1.8s : Ingress (Products appear in horizontal line)
    // 1.8s - 3.2s : Merge (Products glide inward to center and fuse)
    // 3.2s - 4.8s : Logo reveal (JORIQUE wordmark emerges from the fusion)
    // 4.8s+       : Complete / exit

    const tMerge = setTimeout(() => {
      setPhase('merge');
    }, 1800);

    const tLogo = setTimeout(() => {
      setPhase('logo');
    }, 3200);

    const tComplete = setTimeout(() => {
      setPhase('complete');
      setIsExiting(true);
      if (onComplete) {
        setTimeout(onComplete, 600);
      }
    }, 3200 + autoExitDelay + 1600);

    return () => {
      clearTimeout(tMerge);
      clearTimeout(tLogo);
      clearTimeout(tComplete);
    };
  }, [autoExitDelay, onComplete]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 300);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="product-merge-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#FBF8F2] select-none"

          
        >
          {/* Subtle Ambient Radial Golden Warmth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212, 175, 55, 0.12) 0%, rgba(198, 169, 107, 0.06) 45%, transparent 75%)',
            }}
          />

          {/* Decorative Corner Filigree Stars (✦) */}
          <div className="absolute top-8 left-8 text-[#C6A96B] text-xl opacity-40 font-serif select-none pointer-events-none">
            ✦
          </div>
          <div className="absolute top-8 right-8 text-[#C6A96B] text-xl opacity-40 font-serif select-none pointer-events-none">
            ✦
          </div>
          <div className="absolute bottom-8 left-8 text-[#C6A96B] text-xl opacity-40 font-serif select-none pointer-events-none">
            ✦
          </div>
          <div className="absolute bottom-8 right-8 text-[#C6A96B] text-xl opacity-40 font-serif select-none pointer-events-none">
            ✦
          </div>

          {/* Skip Button */}
          {showSkip && (
            <motion.button
              type="button"
              onClick={handleSkip}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              whileHover={{ opacity: 1, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-7 right-7 z-50 px-4 py-1.5 rounded-full border border-[#C6A96B]/30 bg-white/40 backdrop-blur-md text-[10px] sm:text-xs tracking-[0.25em] uppercase font-semibold text-[#665D55] hover:text-[#1A1816] hover:border-[#C6A96B] transition-all shadow-xs cursor-pointer"
            >
              Skip
            </motion.button>
          )}

          {/* Stage Container for Horizontal Line and Merging */}
          <div className="relative w-full max-w-6xl px-4 sm:px-8 flex flex-col items-center justify-center min-h-[420px]">

            {/* ═══════════════════════════════════════════════════════════════
                PHASE 1 & 2: THE 6 LUXURY PRODUCTS IN HORIZONTAL ROW
                ═══════════════════════════════════════════════════════════════ */}
            <div className="relative w-full flex items-center justify-center py-6">
              <div className="flex items-end justify-center gap-3 sm:gap-6 md:gap-8 lg:gap-10 w-full max-w-5xl">
                {PRODUCTS.map((prod, index) => {
                  const isMerged = phase === 'merge' || phase === 'logo' || phase === 'complete';

                  // Calculate approximate inward travel distance toward center based on item offset
                  // Center is between prod index 2 and 3.
                  // Negative offsets move right (+x), positive offsets move left (-x).
                  const glideX = -prod.centerOffset * 180;

                  return (
                    <motion.div
                      key={prod.id}
                      className="relative flex flex-col items-center justify-end z-10"
                      initial={{ opacity: 0, y: 35, scale: 0.9 }}
                      animate={
                        isMerged
                          ? {
                            // Glide inward toward center, converge and dissolve into golden focal point
                            x: glideX,
                            y: 0,
                            scale: 0.35,
                            opacity: 0,
                            filter: 'blur(10px) brightness(1.7)',
                          }
                          : {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            x: 0,
                            filter: 'blur(0px) brightness(1.0)',
                          }
                      }
                      transition={
                        isMerged
                          ? {
                            duration: 1.25,
                            ease: [0.65, 0, 0.35, 1],
                            delay: (3 - Math.abs(prod.centerOffset)) * 0.04,
                          }
                          : {
                            duration: 0.85,
                            ease: [0.22, 1, 0.36, 1],
                            delay: index * 0.1,
                          }
                      }
                      style={{
                        transformOrigin: 'center center',
                      }}
                    >
                      {/* Product Cutout Wrapper */}
                      <div className="relative flex items-center justify-center w-14 sm:w-20 md:w-28 lg:w-32 h-20 sm:h-28 md:h-36 lg:h-40">
                        {/* Soft pedestal shadow */}
                        <div className="absolute -bottom-2 w-4/5 h-3 bg-black/10 rounded-full blur-sm pointer-events-none" />

                        <img
                          src={prod.src}
                          alt={prod.name}
                          className="max-w-full max-h-full object-contain pointer-events-none select-none drop-shadow-md transition-transform"
                        />
                      </div>

                      {/* Delicate Luxury Label (Fade out when merge begins) */}
                      <motion.div
                        className="mt-3 text-center pointer-events-none"
                        initial={{ opacity: 0, y: 6 }}
                        animate={
                          phase === 'ingress'
                            ? { opacity: 1, y: 0, transition: { delay: index * 0.1 + 0.3, duration: 0.6 } }
                            : { opacity: 0, y: -8, transition: { duration: 0.3 } }
                        }
                      >
                        <span className="text-[8px] sm:text-[9px] md:text-[10px] font-sans font-medium tracking-[0.25em] text-[#7A7168] dark:text-[#9A9188] uppercase whitespace-nowrap block">
                          {prod.name}
                        </span>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* ═══════════════════════════════════════════════════════════════
                  GOLDEN FUSION POINT: Central flare when items collide
                  ═══════════════════════════════════════════════════════════════ */}
              <AnimatePresence>
                {(phase === 'merge' || phase === 'logo') && (
                  <motion.div
                    key="golden-fusion-flare"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={
                      phase === 'merge'
                        ? {
                          scale: [0, 1.4, 0.9],
                          opacity: [0, 0.95, 0.45],
                          transition: { delay: 0.7, duration: 0.8, ease: 'easeOut' },
                        }
                        : {
                          scale: 2.2,
                          opacity: 0,
                          transition: { duration: 0.9, ease: 'easeOut' },
                        }
                    }
                    className="absolute z-20 pointer-events-none w-36 h-36 rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(255, 235, 175, 0.95) 0%, rgba(212, 175, 55, 0.6) 35%, rgba(198, 169, 107, 0.15) 60%, transparent 80%)',
                      filter: 'blur(8px)',
                    }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                PHASE 3: JORIQUE WORDMARK REVEAL
                Emerges gracefully from the center as the products fuse!
                ═══════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
              {(phase === 'logo' || phase === 'complete') && (
                <motion.div
                  key="jorique-logo-container"
                  initial={{ opacity: 0, scale: 0.92, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30"
                >
                  {/* Outer Glow Halo */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 0.3, 0.15], scale: [0.8, 1.2, 1.0] }}
                    transition={{ duration: 1.6, ease: 'easeOut' }}
                    className="absolute w-80 sm:w-96 h-48 rounded-full bg-[#D4AF37]/25 blur-3xl pointer-events-none"
                  />

                  {/* Main JORIQUE Wordmark */}
                  <motion.h1
                    initial={{ letterSpacing: '0.15em', opacity: 0, y: 10 }}
                    animate={{ letterSpacing: '0.28em', opacity: 1, y: 0 }}
                    transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                    className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-[#231C16] tracking-[0.28em] uppercase relative select-none"
                  >
                    JORIQUE
                  </motion.h1>

                  {/* Golden Filigree Separator Line (Expands Horizontally from Center) */}
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="h-[1.5px] w-48 sm:w-72 md:w-80 mt-3 sm:mt-4 bg-gradient-to-r from-transparent via-[#C6A96B] to-transparent origin-center"
                  />

                  {/* Bespoke Tagline: "Where Comfort Meets Design" */}
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 0.85, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                    className="font-serif italic text-xs sm:text-sm md:text-base text-[#6F665D] tracking-[0.16em] mt-3 sm:mt-4 text-center select-none"
                  >
                    Where Comfort Meets Design
                  </motion.p>

                  {/* Micro Golden Sparkle Accent */}
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: [0, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 1.0, delay: 0.7, ease: 'easeOut' }}
                    className="mt-4 text-[#C6A96B] text-xs font-serif"
                  >
                    ✦
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Footer Sub-indicator */}
          <div className="absolute bottom-8 flex flex-col items-center pointer-events-none opacity-50">
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#8A8177] font-mono">
              The Luxury Atelier
            </span>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
