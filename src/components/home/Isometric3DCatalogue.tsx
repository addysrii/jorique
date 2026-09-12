import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  BookOpen,
  Check,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { productService } from '../../lib/api/products';
import { Product } from '../../types';
import LoadingMasterpiece from '../LoadingMasterpiece';

// Synthesize authentic physical paper rustle sound using Web Audio API
function playPaperTurnSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const bufferSize = Math.floor(ctx.sampleRate * 0.48);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const envelope = Math.sin((i / bufferSize) * Math.PI) * Math.exp(-i / (bufferSize * 0.5));
      data[i] = (Math.random() * 2 - 1) * envelope;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.45);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.47);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch (e) {
    // blocked or audio not supported
  }
}

export interface IsometricSpread {
  id: number;
  collectionTier: string;
  tierColor: string;
  theme: string;
  rawProduct: Product;
  leftPage: {
    categoryLabel: string;
    headline: string;
    description: string;
    gridItems: { title: string; image: string; tag: string }[];
    bottomNote: string;
  };
  rightPage: {
    sku: string;
    productTitle: string;
    tagline: string;
    overview: string;
    steps: { num: number; title: string; desc: string; thumb: string }[];
    price: number;
    discountPrice?: number;
    productId: string;
  };
}

// Dynamically transform a real backend product into a luxury lookbook spread
function productToSpread(product: Product, index: number): IsometricSpread {
  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : ['/images/collections/signature.jpg'];

  const g0 = images[0];
  const g1 = images[1] || images[0];
  const g2 = images[2] || images[0];
  const g3 = images[3] || images[1] || images[0];

  const skuUpper = (product.sku || '').toUpperCase();
  let collectionTier = 'JORIQUE Essential';
  let tierColor = '#7A8B72';

  if (skuUpper.includes('SIR') || skuUpper.includes('SIGNATURE') || product.name.toLowerCase().includes('ghatchola')) {
    collectionTier = 'JORIQUE Signature';
    tierColor = '#243B64';
  } else if (skuUpper.includes('LUX') || skuUpper.includes('RAW SILK') || product.price > 4000) {
    collectionTier = 'JORIQUE Luxe';
    tierColor = '#641F2D';
  } else if (product.category?.toLowerCase() === 'bedsheet') {
    collectionTier = 'JORIQUE Living';
    tierColor = '#3A4D39';
  } else if (product.category?.toLowerCase() === 'towel') {
    collectionTier = 'JORIQUE Bath';
    tierColor = '#50655B';
  }

  // Parse lines from real database description
  const descLines = (product.description || '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.toLowerCase().includes('disclaimer') && !l.toLowerCase().includes('care instruction'));

  const steps = [
    {
      num: 1,
      title: descLines[0] ? descLines[0].replace(/^(fabric|type|design|size):\s*/i, '') : 'Heirloom Fabric Construction',
      desc: descLines[1] ? descLines[1].replace(/^(print|work|feel|thread count):\s*/i, '') : 'Woven with high tensile fibers and natural drape.',
      thumb: g0,
    },
    {
      num: 2,
      title: descLines[2] ? descLines[2].replace(/^(work|design|style):\s*/i, '') : 'Intricate Handwork & Detail',
      desc: descLines[3] ? descLines[3].replace(/^(type|style|feel):\s*/i, '') : 'Handcrafted precision by generational master artisans.',
      thumb: g1,
    },
    {
      num: 3,
      title: descLines[4] ? descLines[4].replace(/^(style|design|ideal for):\s*/i, '') : 'Tailored Silhouette & Finish',
      desc: descLines[5] ? descLines[5].replace(/^(ideal for|feel):\s*/i, '') : 'Structured grace engineered for modern sanctuaries.',
      thumb: g2,
    },
    {
      num: 4,
      title: 'Atelier Keepsake Presentation',
      desc: 'Delivered in rigid gold-foiled archival presentation box with certificate.',
      thumb: g3,
    },
  ];

  return {
    id: index + 1,
    collectionTier,
    tierColor,
    theme: product.name,
    rawProduct: product,
    leftPage: {
      categoryLabel: `0${index + 1} / ${product.category?.toUpperCase() || 'COLLECTION'}`,
      headline: product.name,
      description:
        descLines.slice(0, 3).join(' • ') ||
        'Crafted with certified natural fibers, reflecting contemporary elegance and sustainable luxury.',
      gridItems: [
        { title: 'Front Silhouette', image: g0, tag: product.category || 'Atelier' },
        { title: 'Textile Weave', image: g1, tag: 'Artisanal Craft' },
        { title: 'Artisan Detail', image: g2, tag: 'Signature Finish' },
        { title: 'Drape & Texture', image: g3, tag: 'Pure Texture' },
      ],
      bottomNote:
        descLines.find(
          (l) => l.toLowerCase().includes('care') || l.toLowerCase().includes('silk') || l.toLowerCase().includes('wash')
        ) || 'Dry clean or gentle hand wash recommended to preserve authentic natural fibers.',
    },
    rightPage: {
      sku: product.sku || `JR-00${index + 1}`,
      productTitle: product.name,
      tagline: 'Authentic Atelier Creation',
      overview: descLines.slice(0, 2).join('. ') || (product.description?.slice(0, 180) || ''),
      steps,
      price: product.price,
      discountPrice: product.discount_price,
      productId: product.id,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE LEFT PAGE VIEW (Dark Atelier Matrix Layout)
// ─────────────────────────────────────────────────────────────────────────────
function LeftPageView({
  spread,
  onPrev,
}: {
  spread: IsometricSpread;
  onPrev?: () => void;
}) {
  return (
    <div className="w-full h-full bg-[#121110] text-white p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-black/50 relative overflow-hidden select-none">
      {/* Center Spine Shadow Overlay */}
      <div className="hidden lg:block absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-black/70 via-black/25 to-transparent pointer-events-none z-20" />

      {/* Left Page Top Header */}
      <div className="space-y-2 pb-3 border-b border-white/15 relative z-10">
        <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.25em] text-[#C6A96B] uppercase">
          <span>{spread.leftPage.categoryLabel}</span>
          <span className="text-white/50">{spread.collectionTier}</span>
        </div>
        <h3 className="font-serif text-lg sm:text-2xl font-medium leading-snug text-white line-clamp-1">
          {spread.leftPage.headline}
        </h3>
        <p className="text-[11px] sm:text-xs text-white/70 font-normal leading-relaxed line-clamp-2 sm:line-clamp-none">
          {spread.leftPage.description}
        </p>
      </div>

      {/* 4-Grid Photo Matrix with Real Backend Images */}
      <div className="grid grid-cols-2 gap-2.5 my-3 sm:my-4 relative z-10">
        {spread.leftPage.gridItems.map((item, gIdx) => (
          <div
            key={gIdx}
            className="group/item relative rounded-xl overflow-hidden bg-black/60 border border-white/10 aspect-[4/3]"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover brightness-[0.88] group-hover/item:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-1.5 left-2 right-2 text-[9px] font-mono tracking-wider uppercase text-white/90 truncate">
              {item.title}
            </div>
          </div>
        ))}
      </div>

      {/* Left Page Bottom Text & URL Bar */}
      <div className="space-y-3 pt-2 border-t border-white/15 relative z-10">
        <p className="text-[10px] text-white/60 font-light leading-relaxed hidden sm:block truncate">
          {spread.leftPage.bottomNote}
        </p>

        {/* Footer Strip */}
        <div
          className="py-1.5 px-3 rounded-lg flex items-center justify-between text-[10px] font-mono tracking-widest text-white uppercase font-bold shadow-xs"
          style={{ backgroundColor: spread.tierColor }}
        >
          <span>jorique.in/collections</span>
          <span>PAGE 0{spread.id * 2 - 1}</span>
        </div>
      </div>

      {/* Interactive Dog-Ear Corner Peel on Bottom-Left */}
      {onPrev && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute bottom-0 left-0 w-12 h-12 group/dogear cursor-pointer z-30 overflow-hidden hidden sm:block"
          title="Turn to previous page"
        >
          <div className="absolute bottom-0 left-0 w-0 h-0 border-solid border-b-[38px] border-r-[38px] border-b-[#26221E] border-r-transparent drop-shadow-md group-hover/dogear:border-b-[48px] group-hover/dogear:border-r-[48px] transition-all duration-300">
            <div className="absolute -bottom-8 -left-3 text-[7px] font-mono tracking-tighter text-[#C6A96B] font-bold uppercase -rotate-45 pointer-events-none">
              PREV
            </div>
          </div>
        </div>
      )}

      {/* Page Texture Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REUSABLE RIGHT PAGE VIEW (Ivory Editorial Breakdown & Workflow)
// ─────────────────────────────────────────────────────────────────────────────
function RightPageView({
  spread,
  onAdd,
  isAdded,
  onNext,
}: {
  spread: IsometricSpread;
  onAdd: (e: React.MouseEvent) => void;
  isAdded: boolean;
  onNext?: () => void;
}) {
  const productTarget = spread.rightPage.productId || spread.rightPage.sku;

  return (
    <div className="w-full h-full bg-[#FCFAF7] text-[#1A1A1A] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Center Spine Highlight Overlay */}
      <div className="hidden lg:block absolute top-0 left-0 bottom-0 w-10 bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none z-20" />

      {/* Right Page Header: Logo & Overview */}
      <div className="space-y-2 pb-3 border-b border-[#E8DFD3] relative z-10">
        <div className="flex items-center justify-between">
          <span className="font-serif font-logo font-normal text-2xl sm:text-3xl tracking-[0.18em] uppercase text-primary">
            JORIQUE
          </span>
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#0B5F61]">
            {spread.rightPage.sku}
          </span>
        </div>

        <h4 className="font-serif font-semibold product-title text-base sm:text-xl leading-snug text-primary line-clamp-1">
          {spread.rightPage.productTitle}
        </h4>
        <p className="text-[11px] sm:text-xs text-secondary font-normal leading-relaxed line-clamp-2">
          {spread.rightPage.overview}
        </p>
      </div>

      {/* Numbered Workflow List */}
      <div className="space-y-2 my-2 sm:my-2.5 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono tracking-widest uppercase text-secondary font-semibold block">
            CRAFT SPECIFICATION:
          </span>
          <Link
            to={`/product/${productTarget}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[#0B5F61] hover:underline"
          >
            <span>Details</span>
            <ExternalLink size={10} />
          </Link>
        </div>

        {spread.rightPage.steps.map((step) => (
          <div
            key={step.num}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-white/95 border border-[#E8DFD3] shadow-2xs hover:border-[#C6A96B] transition-colors"
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              style={{ backgroundColor: spread.tierColor }}
            >
              {step.num}
            </span>

            <div className="flex-1 min-w-0">
              <h5 className="text-[11px] font-semibold text-primary truncate leading-tight">
                {step.title}
              </h5>
              <p className="text-[10px] text-secondary truncate font-normal">
                {step.desc}
              </p>
            </div>

            <img
              src={step.thumb}
              alt={step.title}
              className="w-9 h-9 rounded-lg object-cover border border-[#E8DFD3] shrink-0"
            />
          </div>
        ))}
      </div>

      {/* Pricing & Footer Strip */}
      <div className="space-y-3 pt-2 border-t border-[#E8DFD3] relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono tracking-widest uppercase text-secondary block">
              Atelier Price
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold text-primary">
                ₹{(spread.rightPage.discountPrice || spread.rightPage.price).toLocaleString('en-IN')}
              </span>
              {spread.rightPage.discountPrice && (
                <span className="text-xs text-secondary line-through">
                  ₹{spread.rightPage.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onAdd}
            className="px-4 py-2 rounded-full bg-[#1A1A1A] hover:bg-[#0B5F61] text-white text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            {isAdded ? (
              <>
                <Check size={12} className="text-[#7A8B72]" />
                <span>Curated</span>
              </>
            ) : (
              <>
                <ShoppingBag size={12} />
                <span>Curate Piece</span>
              </>
            )}
          </button>
        </div>

        <div
          className="p-2 rounded-xl text-white flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-widest uppercase font-bold shadow-xs"
          style={{ backgroundColor: spread.tierColor }}
        >
          <span>care@jorique.in</span>
          <span>PAGE 0{spread.id * 2}</span>
        </div>
      </div>

      {/* Interactive Dog-Ear Corner Peel on Bottom-Right */}
      {onNext && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute bottom-0 right-0 w-12 h-12 group/dogear cursor-pointer z-30 overflow-hidden hidden sm:block"
          title="Turn to next page"
        >
          <div className="absolute bottom-0 right-0 w-0 h-0 border-solid border-b-[38px] border-l-[38px] border-b-[#DDD5CA] border-l-transparent drop-shadow-md group-hover/dogear:border-b-[48px] group-hover/dogear:border-l-[48px] transition-all duration-300">
            <div className="absolute -bottom-8 -right-3 text-[7px] font-mono tracking-tighter text-[#0B5F61] font-bold uppercase rotate-45 pointer-events-none">
              FLIP
            </div>
          </div>
        </div>
      )}

      {/* Fine Paper Texture Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(#00000006_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN CATALOGUE COMPONENT (100% Live Backend Data)
// ─────────────────────────────────────────────────────────────────────────────
export default function Isometric3DCatalogue() {
  const [spreads, setSpreads] = useState<IsometricSpread[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isTurning, setIsTurning] = useState<boolean>(false);
  const [turnDirection, setTurnDirection] = useState<'next' | 'prev'>('next');
  const [targetIdx, setTargetIdx] = useState<number>(0);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [addedItem, setAddedItem] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const { addToCart } = useCart();
  const totalSpreads = spreads.length;
  const currentSpread = spreads[currentIdx] || null;

  // Direct asynchronous fetch call from Supabase backend
  useEffect(() => {
    let isMounted = true;

    const fetchBackendProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch products directly from backend via productService
        const dbProducts = await productService.getProducts();

        if (isMounted) {
          if (dbProducts && dbProducts.length > 0) {
            // Filter products with uploaded images
            const validProducts = dbProducts.filter(
              (p) => Array.isArray(p.images) && p.images.length > 0
            );

            const mapped = validProducts.map((p, idx) => productToSpread(p, idx));
            setSpreads(mapped);
          } else {
            setSpreads([]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch catalogue products from backend:', err);
        if (isMounted) {
          setError('Could not load products from backend.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBackendProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-flip timer
  useEffect(() => {
    if (!autoRotate || totalSpreads <= 1) return;
    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 6000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoRotate, currentIdx, isTurning, totalSpreads]);

  const handleNext = () => {
    if (isTurning || totalSpreads <= 1) return;
    const nextIndex = (currentIdx + 1) % totalSpreads;
    setTargetIdx(nextIndex);
    setTurnDirection('next');
    setIsTurning(true);
    if (soundOn) playPaperTurnSound();

    setTimeout(() => {
      setCurrentIdx(nextIndex);
      setIsTurning(false);
    }, 750);
  };

  const handlePrev = () => {
    if (isTurning || totalSpreads <= 1) return;
    const prevIndex = (currentIdx - 1 + totalSpreads) % totalSpreads;
    setTargetIdx(prevIndex);
    setTurnDirection('prev');
    setIsTurning(true);
    if (soundOn) playPaperTurnSound();

    setTimeout(() => {
      setCurrentIdx(prevIndex);
      setIsTurning(false);
    }, 750);
  };

  const handleAddCurrent = () => {
    if (!currentSpread) return;
    addToCart(currentSpread.rawProduct, 1);
    setAddedItem(true);
    setTimeout(() => setAddedItem(false), 2000);
  };

  return (
    <section
      id="isometric-catalogue"
      className="py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-12 bg-[#F5EDE3] dark:bg-[#100E0D] text-primary dark:text-[#FCFAF7] transition-colors duration-500 overflow-hidden relative border-t border-[#E8DFD3] dark:border-[#2E2925]"
    >
      <div className="max-w-[1300px] mx-auto space-y-10 sm:space-y-14 relative z-10">
        
        {/* Section Headline */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-[#C6A96B]/30 text-[#0B5F61] dark:text-[#D4AF37] text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase shadow-xs">
            <BookOpen size={13} className="text-[#C6A96B]" />
            <span>ATELIER CATALOGUE PUBLICATION</span>
          </div>

          <h2 className="font-serif font-medium text-3xl sm:text-5xl lg:text-6xl tracking-tight text-primary dark:text-white leading-[1.12]">
            The Atelier Lookbook
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-secondary dark:text-white/70 font-normal max-w-lg mx-auto leading-relaxed">
            Showcasing original JORIQUE creations fetched directly from our atelier database. Flip through each chapter to discover authentic weaves, hand-finished motifs, and direct curations.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            LOADING / ERROR STATE
        ───────────────────────────────────────────────────────────── */}
        {loading && (
          <LoadingMasterpiece fullScreen={false} message="LOADING ATELIER CATALOGUE" className="py-16" />
        )}

        {!loading && error && (
          <div className="max-w-md mx-auto py-10 text-center space-y-3">
            <p className="text-sm text-red-500 font-mono">{error}</p>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            THE GROUNDED OPEN TWO-PAGE MAGAZINE STAGE
        ───────────────────────────────────────────────────────────── */}
        {!loading && currentSpread && (
          <div
            className="relative max-w-5xl mx-auto py-4 select-none flex items-center justify-center"
            style={{ perspective: '2400px' }}
          >
            {/* Main Book Container */}
            <div className="relative w-full flex items-center justify-center">
              
              {/* Ground Contact Depth Shadow */}
              <div className="absolute inset-0 max-w-[940px] mx-auto rounded-3xl bg-black/20 dark:bg-black/70 filter blur-2xl transform translate-y-7 pointer-events-none" />

              {/* Left Page Edge Stack */}
              <div className="absolute top-2 bottom-2 left-[calc(50%-475px)] w-[6px] bg-gradient-to-l from-[#1C1A18] to-[#0A0908] rounded-l-xs shadow-md hidden lg:block z-0" />

              {/* Right Page Edge Stack */}
              <div className="absolute top-2 bottom-2 right-[calc(50%-475px)] w-[6px] bg-gradient-to-r from-[#D7CFBF] to-[#ABA08F] rounded-r-xs shadow-md hidden lg:block z-0" />

              {/* ─────────────────────────────────────────────────────────
                  THE MAIN OPEN TWO-PAGE MAGAZINE SPREAD
              ───────────────────────────────────────────────────────── */}
              <div
                className="relative w-[340px] sm:w-[620px] lg:w-[940px] min-h-[520px] sm:min-h-[580px] lg:min-h-[600px] rounded-2xl bg-[#1A1816] shadow-2xl flex flex-col lg:flex-row overflow-hidden border border-[#E8DFD3] dark:border-[#2E2925] z-10"
                style={{ transformStyle: 'preserve-3d' }}
              >
                
                {/* Center Spine Crease Binding Shadow */}
                <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/50 via-black/80 to-black/50 z-30 pointer-events-none shadow-inner" />

                {/* ── BASE LEFT PAGE ── */}
                <div
                  className="w-full lg:w-1/2 min-h-[520px] sm:min-h-[580px] lg:min-h-[600px] relative cursor-pointer"
                  onClick={handlePrev}
                  title="Click left page to turn back"
                >
                  <LeftPageView
                    spread={isTurning && turnDirection === 'prev' ? spreads[targetIdx] : currentSpread}
                    onPrev={handlePrev}
                  />

                  {/* Cast Shadow on base left page when leaf turns next onto it */}
                  {isTurning && turnDirection === 'next' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.2, 0.55] }}
                      transition={{ duration: 0.75, ease: [0.45, 0.05, 0.25, 1] }}
                      className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/30 to-transparent pointer-events-none z-25"
                    />
                  )}
                </div>

                {/* ── BASE RIGHT PAGE ── */}
                <div
                  className="w-full lg:w-1/2 min-h-[520px] sm:min-h-[580px] lg:min-h-[600px] relative cursor-pointer"
                  onClick={handleNext}
                  title="Click right page to turn forward"
                >
                  <RightPageView
                    spread={isTurning && turnDirection === 'next' ? spreads[targetIdx] : currentSpread}
                    onAdd={(e) => {
                      e.stopPropagation();
                      handleAddCurrent();
                    }}
                    isAdded={addedItem}
                    onNext={handleNext}
                  />

                  {/* Cast Shadow on base right page when leaf lifts away */}
                  {isTurning && turnDirection === 'next' && (
                    <motion.div
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: [0.6, 0.2, 0] }}
                      transition={{ duration: 0.55, ease: 'easeOut' }}
                      className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent pointer-events-none z-25"
                    />
                  )}
                </div>

                {/* ───────────────────────────────────────────────────────
                    3D DUAL-SIDED PHYSICAL TURNING LEAF (Desktop lg+)
                ─────────────────────────────────────────────────────── */}
                <AnimatePresence mode="wait">
                  {isTurning && (
                    <div
                      className="absolute inset-0 pointer-events-none hidden lg:block z-40"
                      style={{ perspective: '2400px', transformStyle: 'preserve-3d' }}
                    >
                      {/* LEAF TURNING FORWARD (Right to Left) */}
                      {turnDirection === 'next' && (
                        <motion.div
                          key="leaf-next"
                          initial={{ rotateY: 0 }}
                          animate={{ rotateY: -180 }}
                          exit={{ opacity: 0, transition: { duration: 0 } }}
                          transition={{
                            duration: 0.75,
                            ease: [0.45, 0.05, 0.25, 1],
                          }}
                          style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '50%',
                            height: '100%',
                            transformOrigin: 'left center',
                            transformStyle: 'preserve-3d',
                          }}
                          className="shadow-2xl"
                        >
                          {/* 1. FRONT FACE (Lifting current Right Page) */}
                          <div
                            className="absolute inset-0 overflow-hidden bg-[#FCFAF7] border-l border-[#E8DFD3]"
                            style={{
                              backfaceVisibility: 'hidden',
                              WebkitBackfaceVisibility: 'hidden',
                              transform: 'rotateY(0deg) translateZ(1px)',
                            }}
                          >
                            <RightPageView
                              spread={currentSpread}
                              onAdd={() => {}}
                              isAdded={false}
                            />

                            {/* Soft Shadow on paper face as it arches */}
                            <motion.div
                              className="absolute inset-0 pointer-events-none"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 0.35, 0.65] }}
                              transition={{ duration: 0.75, ease: [0.45, 0.05, 0.25, 1] }}
                              style={{
                                background:
                                  'linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 35%, transparent 100%)',
                              }}
                            />
                          </div>

                          {/* 2. BACK FACE (Landing target Left Page) */}
                          <div
                            className="absolute inset-0 overflow-hidden bg-[#121110] border-r border-black/50"
                            style={{
                              backfaceVisibility: 'hidden',
                              WebkitBackfaceVisibility: 'hidden',
                              transform: 'rotateY(180deg) translateZ(1px)',
                            }}
                          >
                            <LeftPageView spread={spreads[targetIdx]} />

                            {/* Paper Landing Shadow */}
                            <motion.div
                              className="absolute inset-0 pointer-events-none"
                              initial={{ opacity: 0.6 }}
                              animate={{ opacity: [0.6, 0.2, 0] }}
                              transition={{ duration: 0.75, ease: [0.45, 0.05, 0.25, 1] }}
                              style={{
                                background:
                                  'linear-gradient(to left, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 40%, transparent 100%)',
                              }}
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* LEAF TURNING BACKWARD (Left to Right) */}
                      {turnDirection === 'prev' && (
                        <motion.div
                          key="leaf-prev"
                          initial={{ rotateY: 0 }}
                          animate={{ rotateY: 180 }}
                          exit={{ opacity: 0, transition: { duration: 0 } }}
                          transition={{
                            duration: 0.75,
                            ease: [0.45, 0.05, 0.25, 1],
                          }}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '50%',
                            height: '100%',
                            transformOrigin: 'right center',
                            transformStyle: 'preserve-3d',
                          }}
                          className="shadow-2xl"
                        >
                          {/* 1. FRONT FACE (Lifting current Left Page) */}
                          <div
                            className="absolute inset-0 overflow-hidden bg-[#121110] border-r border-black/50"
                            style={{
                              backfaceVisibility: 'hidden',
                              WebkitBackfaceVisibility: 'hidden',
                              transform: 'rotateY(0deg) translateZ(1px)',
                            }}
                          >
                            <LeftPageView spread={currentSpread} />

                            {/* Paper Curvature Shadow as it rises */}
                            <motion.div
                              className="absolute inset-0 pointer-events-none"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 0.35, 0.65] }}
                              transition={{ duration: 0.75, ease: [0.45, 0.05, 0.25, 1] }}
                              style={{
                                background:
                                  'linear-gradient(to left, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 35%, transparent 100%)',
                              }}
                            />
                          </div>

                          {/* 2. BACK FACE (Landing target Right Page) */}
                          <div
                            className="absolute inset-0 overflow-hidden bg-[#FCFAF7] border-l border-[#E8DFD3]"
                            style={{
                              backfaceVisibility: 'hidden',
                              WebkitBackfaceVisibility: 'hidden',
                              transform: 'rotateY(180deg) translateZ(1px)',
                            }}
                          >
                            <RightPageView
                              spread={spreads[targetIdx]}
                              onAdd={() => {}}
                              isAdded={false}
                            />

                            {/* Paper Landing Shadow */}
                            <motion.div
                              className="absolute inset-0 pointer-events-none"
                              initial={{ opacity: 0.6 }}
                              animate={{ opacity: [0.6, 0.2, 0] }}
                              transition={{ duration: 0.75, ease: [0.45, 0.05, 0.25, 1] }}
                              style={{
                                background:
                                  'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 40%, transparent 100%)',
                              }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </AnimatePresence>

              </div>

            </div>

          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            CONTROLS: TURN BUTTONS, SPREAD TRACKER & SOUND
        ───────────────────────────────────────────────────────────── */}
        {!loading && totalSpreads > 0 && (
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 px-2">
            
            {/* Sound & Autoplay Controls */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setSoundOn(!soundOn)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/80 dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] text-xs font-mono tracking-wider uppercase text-secondary dark:text-white/70 hover:text-primary transition-colors cursor-pointer"
                title="Toggle paper flip audio"
              >
                {soundOn ? <Volume2 size={13} className="text-[#C6A96B]" /> : <VolumeX size={13} />}
                <span>{soundOn ? 'Sound On' : 'Muted'}</span>
              </button>

              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/80 dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] text-xs font-mono tracking-wider uppercase text-secondary dark:text-white/70 hover:text-primary transition-colors cursor-pointer"
              >
                {autoRotate ? <Pause size={13} className="text-[#0B5F61]" /> : <Play size={13} />}
                <span>{autoRotate ? 'Pause' : 'Auto-Play'}</span>
              </button>
            </div>

            {/* Chapter Spread Indicators */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {spreads.map((sp, idx) => {
                const active = idx === currentIdx;
                return (
                  <button
                    key={sp.id}
                    onClick={() => {
                      if (isTurning || idx === currentIdx) return;
                      if (idx > currentIdx) {
                        setTargetIdx(idx);
                        setTurnDirection('next');
                      } else {
                        setTargetIdx(idx);
                        setTurnDirection('prev');
                      }
                      setIsTurning(true);
                      if (soundOn) playPaperTurnSound();
                      setTimeout(() => {
                        setCurrentIdx(idx);
                        setIsTurning(false);
                      }, 750);
                    }}
                    className={`group flex items-center gap-2 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                      active
                        ? 'bg-primary text-white dark:bg-white dark:text-primary shadow-sm'
                        : 'bg-white/60 dark:bg-white/5 text-secondary hover:text-primary border border-[#E8DFD3] dark:border-white/10'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: sp.tierColor }}
                    />
                    <span className="text-[10px] font-mono tracking-wider uppercase font-medium">
                      0{sp.id}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Previous / Next Turn Triggers */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={isTurning || totalSpreads <= 1}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white dark:bg-[#1A1816] border border-[#E8DFD3] dark:border-[#332922] text-xs font-mono tracking-wider uppercase text-primary dark:text-white hover:bg-[#0B5F61] hover:text-white hover:border-[#0B5F61] transition-all cursor-pointer disabled:opacity-40 shadow-xs"
              >
                <ChevronLeft size={14} />
                <span>Turn Left</span>
              </button>

              <button
                onClick={handleNext}
                disabled={isTurning || totalSpreads <= 1}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-primary dark:bg-white text-white dark:text-primary hover:bg-[#0B5F61] dark:hover:bg-[#0B5F61] dark:hover:text-white text-xs font-mono tracking-wider uppercase transition-all cursor-pointer disabled:opacity-40 shadow-sm"
              >
                <span>Turn Right</span>
                <ChevronRight size={14} />
              </button>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
