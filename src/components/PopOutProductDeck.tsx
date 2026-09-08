import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Hand,
  Layers,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  ExternalLink,
  Tag,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { productService } from '../lib/api/products';
import { Product } from '../types';

interface PopOutProduct {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  tag: string;
  description: string;
  image: string;
  price?: number;
  discountPrice?: number;
  headerBg: string;
  cardGradient: string;
  accentGlow: string;
  textColor: string;
  particles: {
    icon: 'sparkle' | 'thread' | 'petal' | 'star' | 'ember';
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
    burstX: number;
    burstY: number;
  }[];
}

// Bespoke Color Themes with harmonic palette & particles
const COLOR_THEMES = [
  {
    headerBg: '#081C14',
    cardGradient: 'from-[#194E3B] via-[#123B2C] to-[#0A241A]',
    accentGlow: 'rgba(25, 78, 59, 0.55)',
    textColor: '#52C798',
    particles: [
      { icon: 'sparkle' as const, x: 12, y: 14, size: 16, delay: 0.1, duration: 3.2, burstX: -20, burstY: -25 },
      { icon: 'thread' as const, x: 84, y: 18, size: 20, delay: 0.25, duration: 3.8, burstX: 25, burstY: -20 },
      { icon: 'star' as const, x: 18, y: 76, size: 14, delay: 0.2, duration: 2.9, burstX: -25, burstY: 20 },
      { icon: 'ember' as const, x: 88, y: 72, size: 12, delay: 0.35, duration: 3.5, burstX: 25, burstY: 25 },
      { icon: 'sparkle' as const, x: 48, y: 8, size: 15, delay: 0.15, duration: 3.0, burstX: 0, burstY: -35 },
    ],
  },
  {
    headerBg: '#26080F',
    cardGradient: 'from-[#731A29] via-[#480E18] to-[#2B070E]',
    accentGlow: 'rgba(115, 26, 41, 0.55)',
    textColor: '#F87171',
    particles: [
      { icon: 'petal' as const, x: 10, y: 16, size: 18, delay: 0.1, duration: 3.4, burstX: -22, burstY: -30 },
      { icon: 'sparkle' as const, x: 88, y: 14, size: 16, delay: 0.2, duration: 2.8, burstX: 30, burstY: -25 },
      { icon: 'star' as const, x: 14, y: 80, size: 14, delay: 0.3, duration: 3.6, burstX: -24, burstY: 22 },
      { icon: 'thread' as const, x: 86, y: 78, size: 19, delay: 0.15, duration: 4.1, burstX: 26, burstY: 26 },
      { icon: 'petal' as const, x: 50, y: 6, size: 16, delay: 0.25, duration: 3.2, burstX: 5, burstY: -35 },
    ],
  },
  {
    headerBg: '#091322',
    cardGradient: 'from-[#17325D] via-[#0E203C] to-[#07101E]',
    accentGlow: 'rgba(23, 50, 93, 0.55)',
    textColor: '#60A5FA',
    particles: [
      { icon: 'sparkle' as const, x: 12, y: 16, size: 16, delay: 0.1, duration: 3.3, burstX: -24, burstY: -26 },
      { icon: 'thread' as const, x: 88, y: 18, size: 19, delay: 0.2, duration: 4.0, burstX: 28, burstY: -22 },
      { icon: 'star' as const, x: 16, y: 78, size: 14, delay: 0.3, duration: 3.5, burstX: -24, burstY: 24 },
      { icon: 'sparkle' as const, x: 86, y: 70, size: 15, delay: 0.15, duration: 3.0, burstX: 26, burstY: 24 },
      { icon: 'thread' as const, x: 50, y: 6, size: 17, delay: 0.25, duration: 3.7, burstX: -4, burstY: -30 },
    ],
  },
  {
    headerBg: '#20140A',
    cardGradient: 'from-[#613D1C] via-[#402711] to-[#221307]',
    accentGlow: 'rgba(97, 61, 28, 0.55)',
    textColor: '#FBBF24',
    particles: [
      { icon: 'thread' as const, x: 12, y: 18, size: 18, delay: 0.1, duration: 3.9, burstX: -26, burstY: -25 },
      { icon: 'sparkle' as const, x: 86, y: 16, size: 15, delay: 0.2, duration: 3.2, burstX: 28, burstY: -26 },
      { icon: 'star' as const, x: 18, y: 74, size: 14, delay: 0.3, duration: 3.4, burstX: -22, burstY: 24 },
      { icon: 'thread' as const, x: 84, y: 82, size: 17, delay: 0.15, duration: 4.2, burstX: 24, burstY: 26 },
      { icon: 'ember' as const, x: 48, y: 6, size: 13, delay: 0.25, duration: 3.6, burstX: -5, burstY: -32 },
    ],
  },
  {
    headerBg: '#230A1E',
    cardGradient: 'from-[#6B1E52] via-[#451335] to-[#260A1D]',
    accentGlow: 'rgba(107, 30, 82, 0.55)',
    textColor: '#F472B6',
    particles: [
      { icon: 'petal' as const, x: 14, y: 12, size: 18, delay: 0.15, duration: 3.1, burstX: -24, burstY: -28 },
      { icon: 'sparkle' as const, x: 86, y: 20, size: 15, delay: 0.25, duration: 3.7, burstX: 28, burstY: -22 },
      { icon: 'petal' as const, x: 12, y: 68, size: 20, delay: 0.2, duration: 3.3, burstX: -28, burstY: 24 },
      { icon: 'star' as const, x: 90, y: 74, size: 15, delay: 0.35, duration: 4.0, burstX: 25, burstY: 25 },
      { icon: 'sparkle' as const, x: 52, y: 10, size: 14, delay: 0.1, duration: 3.5, burstX: 0, burstY: -30 },
    ],
  },
  {
    headerBg: '#280B1E',
    cardGradient: 'from-[#7A254D] via-[#4F1531] to-[#2E0B1D]',
    accentGlow: 'rgba(122, 37, 77, 0.55)',
    textColor: '#FB7185',
    particles: [
      { icon: 'petal' as const, x: 16, y: 15, size: 18, delay: 0.1, duration: 3.5, burstX: -25, burstY: -28 },
      { icon: 'sparkle' as const, x: 84, y: 20, size: 14, delay: 0.2, duration: 2.9, burstX: 26, burstY: -24 },
      { icon: 'star' as const, x: 12, y: 76, size: 15, delay: 0.3, duration: 3.8, burstX: -26, burstY: 22 },
      { icon: 'petal' as const, x: 88, y: 72, size: 17, delay: 0.15, duration: 3.1, burstX: 28, burstY: 25 },
      { icon: 'sparkle' as const, x: 50, y: 8, size: 14, delay: 0.25, duration: 3.3, burstX: 2, burstY: -32 },
    ],
  },
];

// Fallback curated products in case DB is empty or loading
const FALLBACK_PRODUCTS: PopOutProduct[] = [
  {
    id: 'emerald-velvet',
    category: 'THE ROYAL HEIRLOOM',
    title: 'EMERALD VELVET CUSHION',
    subtitle: 'Lustrous Micro-Pile Weave',
    tag: 'Hand-Corded Velvet',
    description: 'Tailored from high-density Mulberry velvet with hand-sewn corded piping. Delivers radiant sheen and peerless tactile depth under ambient room lighting.',
    image: '/JORIQUE/cutouts/green-pillow.png',
    price: 3499,
    discountPrice: 2999,
    headerBg: '#081C14',
    cardGradient: 'from-[#194E3B] via-[#123B2C] to-[#0A241A]',
    accentGlow: 'rgba(25, 78, 59, 0.55)',
    textColor: '#52C798',
    particles: COLOR_THEMES[0].particles,
  },
  {
    id: 'bedsheet-set',
    category: 'THE MASTER SUITE',
    title: 'IMPERIAL GIZA DUVET SET',
    subtitle: '1000 Thread Count Pure Sateen',
    tag: 'Giza Egyptian Cotton',
    description: 'Artisanal 1000-thread-count sateen weave draped for regal bedrooms. Silken skin-feel with natural temperature-regulating micro-pores for uninterrupted slumber.',
    image: '/JORIQUE/cutouts/bedsheet-set.png',
    price: 4999,
    discountPrice: 4299,
    headerBg: '#26080F',
    cardGradient: 'from-[#731A29] via-[#480E18] to-[#2B070E]',
    accentGlow: 'rgba(115, 26, 41, 0.55)',
    textColor: '#F87171',
    particles: COLOR_THEMES[1].particles,
  },
  {
    id: 'floral-pillow',
    category: 'BOTANICAL COUTURE',
    title: 'FLORAL JACQUARD ACCENT',
    subtitle: 'Raised Golden Yarn Brocade',
    tag: 'Antique Loom Weave',
    description: 'Inspired by royal botanical gardens, woven on antique jacquard looms with raised relief embroidery and opulent luminous spun gold filament.',
    image: '/JORIQUE/cutouts/floral-pillow.png',
    price: 2499,
    discountPrice: 1999,
    headerBg: '#230A1E',
    cardGradient: 'from-[#6B1E52] via-[#451335] to-[#260A1D]',
    accentGlow: 'rgba(107, 30, 82, 0.55)',
    textColor: '#F472B6',
    particles: COLOR_THEMES[4].particles,
  },
  {
    id: 'rolled-blanket',
    category: 'ARTISANAL WEAVE',
    title: 'HERITAGE CASHMERE THROW',
    subtitle: 'Grade-A Cloud-Lofted Wool',
    tag: 'Mongolian Cashmere',
    description: 'Featherweight warmth loomed with traditional teazle-brushed techniques for a cloud-like fluff that naturally breathes through all four seasons.',
    image: '/JORIQUE/cutouts/rolled-blanket.png',
    price: 7999,
    discountPrice: 6499,
    headerBg: '#20140A',
    cardGradient: 'from-[#613D1C] via-[#402711] to-[#221307]',
    accentGlow: 'rgba(97, 61, 28, 0.55)',
    textColor: '#FBBF24',
    particles: COLOR_THEMES[3].particles,
  },
];

function formatDbDescription(desc?: string, category?: string): string {
  if (!desc || desc.trim().length === 0) {
    return `Exquisite ${category || 'luxury'} creation from the JORIQUE atelier, crafted with heirloom-grade fibers and artisanal finish.`;
  }
  const lines = desc
    .split('\n')
    .map((l) => l.trim())
    .filter(
      (l) =>
        l.length > 0 &&
        !l.toLowerCase().startsWith('care') &&
        !l.toLowerCase().startsWith('colour disclaimer') &&
        !l.toLowerCase().startsWith('do not')
    );

  if (lines.length > 1) {
    const summary = lines.slice(0, 3).join(' • ');
    return summary.length > 165 ? summary.slice(0, 162) + '...' : summary;
  }
  return desc.length > 165 ? desc.slice(0, 162) + '...' : desc;
}

const SLIDE_DURATION_MS = 5200;

const cardTransitionVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 210 : -210,
    opacity: 0,
    scale: 0.9,
    rotateY: dir > 0 ? 15 : -15,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      type: 'spring',
      stiffness: 340,
      damping: 26,
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -210 : 210,
    opacity: 0,
    scale: 0.9,
    rotateY: dir > 0 ? -15 : 15,
    transition: { duration: 0.2 },
  }),
};

export default function PopOutProductDeck() {
  const [products, setProducts] = useState<PopOutProduct[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [stageMode, setStageMode] = useState<'standard' | 'cinematic'>('standard');

  // Load products and content directly from user's database
  useEffect(() => {
    let isMounted = true;
    const fetchDbProducts = async () => {
      try {
        setLoading(true);
        // Call productService which queries the Supabase products table
        const dbProducts = await productService.getProducts();

        if (isMounted && dbProducts && dbProducts.length > 0) {
          // Filter products that have at least one valid image
          const validProducts = dbProducts.filter((p) => p.images && p.images.length > 0);

          if (validProducts.length > 0) {
            const mapped: PopOutProduct[] = validProducts.slice(0, 8).map((p: Product, idx: number) => {
              const theme = COLOR_THEMES[idx % COLOR_THEMES.length];
              
              // Calculate smart discount or badge tag
              let tagText = p.badge;
              if (!tagText) {
                if (p.discount_price && p.discount_price < p.price) {
                  const percentOff = Math.round(((p.price - p.discount_price) / p.price) * 100);
                  tagText = `${percentOff}% OFF Special`;
                } else {
                  tagText = 'Artisanal Original';
                }
              }

              return {
                id: p.id,
                category: p.category ? p.category.toUpperCase() : 'JORIQUE SIGNATURE',
                title: p.name.toUpperCase(),
                subtitle: p.badge || `Loomed in ${p.year || 2026}`,
                tag: tagText,
                description: formatDbDescription(p.description, p.category),
                image: p.images[0],
                price: p.price,
                discountPrice: p.discount_price,
                headerBg: theme.headerBg,
                cardGradient: theme.cardGradient,
                accentGlow: theme.accentGlow,
                textColor: theme.textColor,
                particles: theme.particles,
              };
            });

            setProducts(mapped);
          }
        }
      } catch (err) {
        console.warn('Could not load DB products directly, using cache:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDbProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeProduct = products[currentIndex] || products[0] || FALLBACK_PRODUCTS[0];

  const handleNext = useCallback(() => {
    setHasInteracted(true);
    setDirection(1);
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const handlePrev = useCallback(() => {
    setHasInteracted(true);
    setDirection(-1);
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  const goToIndex = useCallback(
    (idx: number) => {
      setHasInteracted(true);
      setDirection(idx > currentIndex ? 1 : -1);
      setProgress(0);
      setCurrentIndex(idx);
    },
    [currentIndex]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Smooth Auto-Scroller Timer loop & Progress Bar
  useEffect(() => {
    if (!isAutoPlaying || isHovered || products.length === 0) return;

    const intervalMs = 40;
    const step = (intervalMs / SLIDE_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isHovered, handleNext, products.length]);

  // Particle renderer with explosive initial pop burst
  const renderParticle = (p: (typeof activeProduct.particles)[0], idx: number) => {
    if (p.icon === 'sparkle') {
      return (
        <motion.div
          key={idx}
          className="absolute text-amber-300 drop-shadow-md pointer-events-none z-30"
          initial={{ left: '50%', top: '50%', scale: 0, opacity: 0 }}
          animate={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            scale: [0, 1.4, 1],
            opacity: [0, 1, 0.7],
            y: [0, -14, 0],
            rotate: [0, 90, 180, 0],
          }}
          transition={{
            scale: { duration: 0.5, delay: p.delay },
            opacity: { duration: 0.5, delay: p.delay },
            left: { type: 'spring', stiffness: 220, damping: 18, delay: p.delay },
            top: { type: 'spring', stiffness: 220, damping: 18, delay: p.delay },
            y: { repeat: Infinity, duration: p.duration, ease: 'easeInOut', delay: 0.6 },
            rotate: { repeat: Infinity, duration: p.duration * 1.5, ease: 'linear' },
          }}
        >
          <Sparkles size={p.size} />
        </motion.div>
      );
    }
    if (p.icon === 'thread') {
      return (
        <motion.div
          key={idx}
          className="absolute text-white/50 pointer-events-none z-30"
          initial={{ left: '50%', top: '50%', scale: 0, opacity: 0 }}
          animate={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            scale: [0, 1.3, 1],
            opacity: [0, 0.9, 0.45],
            y: [0, -16, 0],
            rotate: [0, 25, -20, 0],
          }}
          transition={{
            scale: { duration: 0.45, delay: p.delay },
            opacity: { duration: 0.45, delay: p.delay },
            left: { type: 'spring', stiffness: 200, damping: 20, delay: p.delay },
            top: { type: 'spring', stiffness: 200, damping: 20, delay: p.delay },
            y: { repeat: Infinity, duration: p.duration, ease: 'easeInOut', delay: 0.6 },
            rotate: { repeat: Infinity, duration: p.duration + 1, ease: 'easeInOut' },
          }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 14 C 7 3, 17 21, 21 10" strokeLinecap="round" />
          </svg>
        </motion.div>
      );
    }
    if (p.icon === 'petal') {
      return (
        <motion.div
          key={idx}
          className="absolute text-rose-300/85 pointer-events-none z-30"
          initial={{ left: '50%', top: '50%', scale: 0, opacity: 0 }}
          animate={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            scale: [0, 1.35, 1],
            opacity: [0, 1, 0.65],
            y: [0, -18, 0],
            rotate: [-20, 30, -20],
          }}
          transition={{
            scale: { duration: 0.5, delay: p.delay },
            opacity: { duration: 0.5, delay: p.delay },
            left: { type: 'spring', stiffness: 210, damping: 19, delay: p.delay },
            top: { type: 'spring', stiffness: 210, damping: 19, delay: p.delay },
            y: { repeat: Infinity, duration: p.duration, ease: 'easeInOut', delay: 0.6 },
            rotate: { repeat: Infinity, duration: p.duration + 0.5, ease: 'easeInOut' },
          }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C9 7 6 12 12 22C18 12 15 7 12 2Z" />
          </svg>
        </motion.div>
      );
    }
    return (
      <motion.div
        key={idx}
        className="absolute w-2.5 h-2.5 rounded-full bg-amber-300/80 blur-[1px] pointer-events-none z-30"
        initial={{ left: '50%', top: '50%', scale: 0, opacity: 0 }}
        animate={{
          left: `${p.x}%`,
          top: `${p.y}%`,
          scale: [0, 1.4, 1],
          opacity: [0, 0.95, 0.5],
          y: [0, -12, 0],
        }}
        transition={{
          scale: { duration: 0.4, delay: p.delay },
          opacity: { duration: 0.4, delay: p.delay },
          left: { type: 'spring', stiffness: 230, damping: 20, delay: p.delay },
          top: { type: 'spring', stiffness: 230, damping: 20, delay: p.delay },
          y: { repeat: Infinity, duration: p.duration, ease: 'easeInOut', delay: 0.6 },
        }}
      />
    );
  };

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-[#FAF7F2] dark:bg-[#0D0B0A] transition-colors duration-500">
      {/* Dynamic Ambient Glow morphing to active product palette */}
      <motion.div
        className="absolute -top-36 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] rounded-full blur-[150px] pointer-events-none opacity-45 dark:opacity-40 transition-colors duration-700"
        animate={{ backgroundColor: activeProduct.headerBg }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Presentation Mode Badge */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream dark:bg-white/5 border border-border dark:border-white/10 text-xs font-bold uppercase tracking-[0.25em] text-[#851C25] dark:text-[#D4AF37]">
            <Layers size={13} />
            <span>Keynote 3D Pop-Out Presentation</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-primary dark:text-white tracking-tight leading-tight">
            Sensory Masterpieces In Motion
          </h2>

          <p className="text-xs sm:text-sm text-secondary dark:text-white/70 max-w-lg mx-auto font-sans leading-relaxed">
            Live creations loaded directly from our atelier database, bursting forward into physical space.
          </p>
        </div>

        {/* 🎬 PRESENTATION CONTROL BAR & STORY PROGRESS SEGMENTS */}
        <div className="max-w-[540px] sm:max-w-[640px] md:max-w-[720px] lg:max-w-[760px] mx-auto mb-5 px-3">
          {/* Multi-segment story progress indicators */}
          <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}>
            {products.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => goToIndex(idx)}
                className="h-1.5 rounded-full bg-black/15 dark:bg-white/15 overflow-hidden transition-all relative group"
                title={`Jump to ${p.title}`}
              >
                {/* Active progress fill */}
                {idx === currentIndex && (
                  <motion.div
                    className="h-full bg-primary dark:bg-[#D4AF37] rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                )}
                {/* Past completed fill */}
                {idx < currentIndex && (
                  <div className="h-full w-full bg-primary/70 dark:bg-[#D4AF37]/80 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Presentation Status & Quick Toggles */}
          <div className="flex items-center justify-between text-xs text-secondary dark:text-white/70 px-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  isAutoPlaying
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                }`}
              >
                {isAutoPlaying ? <Pause size={10} /> : <Play size={10} />}
                <span>{isAutoPlaying ? (isHovered ? 'Paused (Inspecting)' : 'Auto-Scroller Active') : 'Presentation Paused'}</span>
              </button>

              <span className="hidden sm:inline text-[10px] text-secondary/50 dark:text-white/40">
                • Press Space to pause
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="font-bold text-primary dark:text-white">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span className="opacity-40">/</span>
              <span className="opacity-60">{String(products.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* MAIN STAGE: Generous Wide 3D Pop-Out Card Shell */}
        <div className="flex items-center justify-center">
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative w-full transition-all duration-500 ${
              stageMode === 'cinematic'
                ? 'max-w-[620px] sm:max-w-[740px] lg:max-w-[840px]'
                : 'max-w-[540px] sm:max-w-[640px] md:max-w-[720px] lg:max-w-[760px]'
            } rounded-[42px] sm:rounded-[52px] shadow-[0_35px_100px_rgba(0,0,0,0.28)] dark:shadow-[0_35px_115px_rgba(0,0,0,0.8)] overflow-hidden border border-border/80 dark:border-white/10 select-none bg-white dark:bg-[#141210]`}
          >
            
            {/* TOP DYNAMIC BACKGROUND CONTAINER */}
            <motion.div
              className="relative w-full h-[390px] sm:h-[450px] md:h-[480px] transition-colors duration-700 flex flex-col items-center justify-start pt-6 px-6 sm:px-10 overflow-visible"
              animate={{ backgroundColor: activeProduct.headerBg }}
            >
              {/* Radial Highlight Glow */}
              <div
                className="absolute inset-0 opacity-50 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 45%, ${activeProduct.textColor} 0%, transparent 68%)`,
                }}
              />

              {/* Mobile / Keynote Status Bar */}
              <div className="w-full flex items-center justify-between text-white/90 z-20 pointer-events-none">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-5 flex flex-col justify-between py-0.5">
                    <span className="w-full h-0.5 bg-white/90 rounded-full" />
                    <span className="w-3/4 h-0.5 bg-white/90 rounded-full" />
                    <span className="w-full h-0.5 bg-white/90 rounded-full" />
                  </div>
                  <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-white font-serif">
                    JORIQUE ATELIER
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300">
                    ATELIER SHOWCASE
                  </span>
                </div>
              </div>

              {/* CARD CONTAINER WITH DRAG / SWIPE GESTURE */}
              <motion.div
                className="absolute top-16 sm:top-20 w-[88%] sm:w-[86%] h-[285px] sm:h-[330px] md:h-[360px] z-10 cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -40 || info.velocity.x < -300) {
                    handleNext();
                  } else if (info.offset.x > 40 || info.velocity.x > 300) {
                    handlePrev();
                  }
                }}
              >
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={activeProduct.id}
                    custom={direction}
                    variants={cardTransitionVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="relative w-full h-full"
                  >
                    {/* The Rounded Card Frame - Everything fits completely inside */}
                    <div
                      className={`w-full h-full rounded-[28px] sm:rounded-[36px] bg-gradient-to-b ${activeProduct.cardGradient} shadow-2xl border border-white/20 relative overflow-hidden flex items-center justify-center p-3 sm:p-5`}
                    >
                      {/* Glass Sheen Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" />
                      
                      {/* Inner Ambient Base Glow */}
                      <div
                        className="absolute bottom-0 inset-x-0 h-28 pointer-events-none opacity-60"
                        style={{
                          background: `radial-gradient(circle at 50% 100%, ${activeProduct.textColor} 0%, transparent 70%)`,
                        }}
                      />

                      {/* Floating Parallax Micro-Particles */}
                      {activeProduct.particles.map((p, idx) => renderParticle(p, idx))}

                      {/* Perfectly Framed Product Image */}
                      <motion.div
                        className="relative z-20 w-full h-full flex items-center justify-center pointer-events-none"
                        initial={{
                          scale: 0.88,
                          opacity: 0,
                          y: 16,
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 320,
                          damping: 24,
                          delay: 0.08,
                        }}
                      >
                        <motion.div
                          className="w-full h-full flex items-center justify-center"
                          animate={{
                            y: [0, -6, 0],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 4.5,
                            ease: 'easeInOut',
                          }}
                        >
                          <img
                            src={activeProduct.image}
                            alt={activeProduct.title}
                            className="max-w-full max-h-full object-contain rounded-2xl drop-shadow-[0_18px_35px_rgba(0,0,0,0.55)] filter contrast-[1.04]"
                            onError={(e) => {
                              // Fallback to local cutout if remote URL is blocked
                              (e.currentTarget as HTMLImageElement).src = '/JORIQUE/cutouts/green-pillow.png';
                            }}
                          />
                        </motion.div>
                      </motion.div>
                    </div>

                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* PULSATING SWIPE / DRAG HINT */}
              {!hasInteracted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: [0, 0.9, 0],
                    scale: [0.85, 1.3, 0.85],
                    x: [0, -32, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.2,
                    ease: 'easeInOut',
                  }}
                  className="absolute bottom-6 right-10 w-16 h-16 rounded-full border-2 border-white/70 bg-white/20 backdrop-blur-xs pointer-events-none z-40 flex items-center justify-center shadow-xl"
                >
                  <Hand size={20} className="text-white drop-shadow" />
                </motion.div>
              )}
            </motion.div>

            {/* BOTTOM CONTENT SLATE - Generous wide layout with typography */}
            <div className="relative bg-white dark:bg-[#141210] px-8 sm:px-14 pt-8 pb-10 text-center transition-colors duration-500">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProduct.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.24, delay: 0.08 }}
                  className="space-y-3.5"
                >
                  {/* Category Tracker */}
                  <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-secondary/70 dark:text-[#D4AF37] block font-sans">
                    {activeProduct.category}
                  </span>

                  {/* Main Punchy Title */}
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-primary dark:text-white tracking-tight uppercase leading-snug">
                    {activeProduct.title}
                  </h3>

                  {/* Pricing Callout if available */}
                  {activeProduct.price && (
                    <div className="flex items-baseline justify-center gap-2 pt-0.5">
                      <span className="text-xl font-times font-bold text-primary dark:text-[#D4AF37] tabular-nums">
                        ₹{(activeProduct.discountPrice || activeProduct.price).toLocaleString('en-IN')}
                      </span>
                      {activeProduct.discountPrice && activeProduct.discountPrice < activeProduct.price && (
                        <span className="text-xs font-times text-secondary/60 dark:text-white/40 line-through tabular-nums">
                          ₹{activeProduct.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  )}

                  {/* ✨ SIGNATURE ZIGZAG ACCENT DIVIDER (Exact match from video) ✨ */}
                  <div className="flex justify-center py-1">
                    <svg
                      width="64"
                      height="14"
                      viewBox="0 0 54 12"
                      fill="none"
                      className="text-secondary/40 dark:text-white/30"
                    >
                      <path
                        d="M2 10L10 2L18 10L26 2L34 10L42 2L50 10"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {/* Narrative Body Text from Database */}
                  <p className="text-xs sm:text-sm text-secondary/80 dark:text-white/70 leading-relaxed font-sans max-w-md mx-auto">
                    {activeProduct.description}
                  </p>

                  {/* Pill Tag */}
                  <div className="pt-1.5">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cream dark:bg-white/5 border border-border/80 dark:border-white/10 text-[11px] font-bold tracking-wider uppercase text-primary dark:text-white/90">
                      <ShieldCheck size={12} className="text-[#851C25] dark:text-[#D4AF37]" />
                      {activeProduct.tag}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* PAGINATION PILLS */}
              <div className="flex items-center justify-center gap-2 pt-7 pb-2">
                {products.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => goToIndex(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentIndex
                        ? 'w-8 h-1.5 bg-primary dark:bg-[#D4AF37]'
                        : 'w-2 h-1.5 bg-secondary/30 dark:bg-white/20 hover:bg-secondary/60'
                    }`}
                    aria-label={`Go to ${p.title}`}
                  />
                ))}
              </div>

              {/* ACTION & NAVIGATION BUTTONS */}
              <div className="pt-4 flex items-center justify-between gap-4 max-w-lg mx-auto">
                <button
                  onClick={handlePrev}
                  className="w-11 h-11 rounded-full bg-cream dark:bg-white/5 hover:bg-primary hover:text-white dark:hover:bg-[#D4AF37] dark:hover:text-black transition-all flex items-center justify-center text-primary dark:text-white border border-border dark:border-white/10 shadow-xs active:scale-95 shrink-0"
                  aria-label="Previous Product"
                >
                  <ChevronLeft size={18} />
                </button>

                <Link
                  to={activeProduct.id.includes('-') ? `/product/${activeProduct.id}` : '/shop'}
                  className="flex-1 py-3 px-6 rounded-full bg-primary hover:bg-[#851C25] dark:bg-[#D4AF37] dark:hover:bg-[#B89628] text-white dark:text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md group"
                >
                  <span>Acquire Masterpiece</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>

                <button
                  onClick={handleNext}
                  className="w-11 h-11 rounded-full bg-cream dark:bg-white/5 hover:bg-primary hover:text-white dark:hover:bg-[#D4AF37] dark:hover:text-black transition-all flex items-center justify-center text-primary dark:text-white border border-border dark:border-white/10 shadow-xs active:scale-95 shrink-0"
                  aria-label="Next Product"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* PRESENTATION CONTROLS BAR: Thumbnails & Reset / Mode */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              setProgress(0);
              setCurrentIndex(0);
            }}
            className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 border border-border dark:border-white/10 bg-white dark:bg-white/5 text-secondary dark:text-white/70 hover:border-primary"
            title="Restart Presentation"
          >
            <RotateCcw size={12} />
            <span>Restart</span>
          </button>

          <button
            onClick={() => setStageMode(stageMode === 'standard' ? 'cinematic' : 'standard')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 border ${
              stageMode === 'cinematic'
                ? 'bg-[#851C25] text-white border-[#851C25] dark:bg-[#D4AF37] dark:text-black dark:border-[#D4AF37]'
                : 'bg-white dark:bg-white/5 text-secondary dark:text-white/70 border-border dark:border-white/10 hover:border-primary'
            }`}
          >
            <Maximize2 size={12} />
            <span>{stageMode === 'cinematic' ? 'Standard Size' : 'Expanded Theater'}</span>
          </button>

          {/* Quick Select Thumbnails */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-md">
            {products.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => goToIndex(idx)}
                className={`w-9 h-9 rounded-xl border p-1 transition-all flex items-center justify-center shrink-0 ${
                  idx === currentIndex
                    ? 'border-primary dark:border-[#D4AF37] scale-110 shadow-md bg-white dark:bg-white/10 ring-2 ring-primary/20 dark:ring-[#D4AF37]/30'
                    : 'border-border/60 dark:border-white/10 opacity-60 hover:opacity-100 bg-cream/40 dark:bg-white/5'
                }`}
                title={p.title}
              >
                <img src={p.image} alt={p.title} className="w-full h-full object-contain rounded-sm" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
