import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Tag,
  Copy,
  Check,
  ArrowRight,
  Clock,
  Gift,
  Zap,
  Percent
} from 'lucide-react';

export interface DealBannerSlide {
  id: string;
  badge: string;
  badgeIcon: React.ReactNode;
  title: string;
  subtitle: string;
  highlightText?: string;
  code?: string;
  ctaText: string;
  filterTarget?: string;
  gradientBgLight: string;
  gradientBgDark: string;
  accentColor: string;
}

const DEFAULT_DEALS: DealBannerSlide[] = [
  {
    id: 'deal-1',
    badge: 'Content to be added',
    badgeIcon: <Sparkles size={12} className="text-[#C6A96B] dark:text-[#D4AF37]" />,
    title: 'Content to be added',
    subtitle: 'Content to be added',
    highlightText: 'Instant Extra 10% on UPI',
    code: 'ATELIER25',
    ctaText: 'Explore Bedding Deals',
    filterTarget: 'Bedding',
    gradientBgLight: 'from-[#FAF6F0] via-[#F4EDE2] to-[#EFE4D3]',
    gradientBgDark: 'from-[#1E1712] via-[#17120E] to-[#120E0B]',
    accentColor: '#C6A96B',
  },
  {
    id: 'deal-2',
    badge: 'Content to be added',
    badgeIcon: <Gift size={12} className="text-[#0B5F61] dark:text-[#2DD4BF]" />,
    title: 'Content to be added',
    subtitle: 'Content to be added',
    highlightText: 'Auto-Applied Storewide',
    code: 'FREESHIP',
    ctaText: 'Discover Bestsellers',
    filterTarget: 'All',
    gradientBgLight: 'from-[#F2F7F6] via-[#E8F1EF] to-[#DCECE9]',
    gradientBgDark: 'from-[#121A1A] via-[#101616] to-[#0E1212]',
    accentColor: '#0B5F61',
  },
  {
    id: 'deal-3',
    badge: 'Content to be added',
    badgeIcon: <Percent size={12} className="text-[#851C25] dark:text-[#F87171]" />,
    title: 'Content to be added',
    subtitle: 'Content to be added',
    highlightText: 'Min. cart value ₹2,499',
    code: 'JORIQUE500',
    ctaText: 'Shop All Offers',
    filterTarget: 'All',
    gradientBgLight: 'from-[#FBF3F3] via-[#F7ECEC] to-[#EFE0E0]',
    gradientBgDark: 'from-[#201314] via-[#180F10] to-[#120B0C]',
    accentColor: '#D4AF37',
  },
  {
    id: 'deal-4',
    badge: 'Content to be added',
    badgeIcon: <Zap size={12} className="text-amber-600 dark:text-amber-400" />,
    title: 'Content to be added',
    subtitle: 'Content to be added',
    highlightText: 'No Minimum Spend Required',
    ctaText: 'View Catalog',
    filterTarget: 'All',
    gradientBgLight: 'from-[#FDF8EE] via-[#F9F1DC] to-[#F2E7C6]',
    gradientBgDark: 'from-[#201A10] via-[#18130B] to-[#130E07]',
    accentColor: '#D97706',
  },
];

interface ShopDealsBannerCarouselProps {
  onSelectFilter?: (target: string) => void;
  className?: string;
}

export default function ShopDealsBannerCarousel({
  onSelectFilter,
  className = '',
}: ShopDealsBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % DEFAULT_DEALS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + DEFAULT_DEALS.length) % DEFAULT_DEALS.length);
  }, []);

  // Auto-rotation every 6 seconds unless user is hovering
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  const handleCopy = (e: React.MouseEvent, code?: string) => {
    e.stopPropagation();
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCtaClick = (target?: string) => {
    if (onSelectFilter && target) {
      onSelectFilter(target);
    }
  };

  const currentDeal = DEFAULT_DEALS[currentIndex];

  // Slide transition variants
  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden shadow-lg border border-border/70 dark:border-[#332922] select-none transition-all duration-500 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Running Deals and Boutique Privileges"
    >
      {/* Background Animated Gradient Layer */}
      <div className="relative min-h-[200px] sm:min-h-[190px] md:min-h-[175px] flex items-center overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentDeal.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className={`absolute inset-0 w-full h-full bg-gradient-to-r ${currentDeal.gradientBgLight} dark:${currentDeal.gradientBgDark} transition-colors duration-700 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-6 sm:py-7`}
          >
            {/* Ambient luxury light aura */}
            <div
              className="absolute -right-16 -top-16 w-80 h-80 rounded-full blur-3xl opacity-30 dark:opacity-20 pointer-events-none"
              style={{ backgroundColor: currentDeal.accentColor }}
            />
            <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[radial-gradient(#8D867F_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 lg:gap-8">
              {/* Left Content */}
              <div className="space-y-2 max-w-2xl">
                {/* Badge & Highlight Tag */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10 text-[10px] font-bold tracking-[0.25em] uppercase text-primary dark:text-[#D4AF37] shadow-xs">
                    {currentDeal.badgeIcon}
                    {currentDeal.badge}
                  </span>

                  {currentDeal.highlightText && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-400/15 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold">
                      <Clock size={10} />
                      {currentDeal.highlightText}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-2xl lg:text-[26px] font-serif font-light text-primary dark:text-white leading-tight tracking-tight">
                  {currentDeal.title}
                </h3>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-secondary dark:text-white/70 font-light leading-relaxed line-clamp-2">
                  {currentDeal.subtitle}
                </p>
              </div>

              {/* Right Action & Coupon Box */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0 flex-wrap">
                {currentDeal.code && (
                  <button
                    onClick={(e) => handleCopy(e, currentDeal.code)}
                    title="Click to copy coupon code"
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#201A16] border border-dashed border-[#C6A96B] dark:border-[#D4AF37]/60 text-xs font-mono font-bold text-primary dark:text-[#D4AF37] hover:scale-105 active:scale-95 transition-all shadow-xs group/code"
                  >
                    <Tag size={13} className="text-[#C6A96B] dark:text-[#D4AF37]" />
                    <span className="tracking-wider">{currentDeal.code}</span>
                    <span className="ml-1 pl-2 border-l border-black/10 dark:border-white/10 text-[10px] font-sans font-medium text-secondary dark:text-white/60 group-hover/code:text-primary dark:group-hover/code:text-white flex items-center gap-1">
                      {copiedCode === currentDeal.code ? (
                        <>
                          <Check size={12} className="text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Copy</span>
                        </>
                      )}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => handleCtaClick(currentDeal.filterTarget)}
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold uppercase tracking-widest hover:opacity-95 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{currentDeal.ctaText}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous deal"
        className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur-md border border-black/5 dark:border-white/15 flex items-center justify-center text-primary dark:text-white hover:bg-white dark:hover:bg-black/70 hover:scale-110 active:scale-95 transition-all shadow-md z-20"
      >
        <ChevronLeft size={16} />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next deal"
        className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur-md border border-black/5 dark:border-white/15 flex items-center justify-center text-primary dark:text-white hover:bg-white dark:hover:bg-black/70 hover:scale-110 active:scale-95 transition-all shadow-md z-20"
      >
        <ChevronRight size={16} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/10 dark:bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full">
        {DEFAULT_DEALS.map((deal, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={deal.id}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${isActive
                  ? 'w-6 bg-primary dark:bg-[#D4AF37]'
                  : 'w-1.5 bg-black/30 dark:bg-white/30 hover:bg-black/60 dark:hover:bg-white/60'
                }`}
            />
          );
        })}
      </div>
    </div>
  );
}
