import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  BookOpen,
  Eye,
  Check,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';

// Synthesize authentic soft paper rustle using Web Audio API
function playPaperTurnSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const bufferSize = ctx.sampleRate * 0.25; // 250ms rustle
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Pink/filtered noise
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.22);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch (e) {
    // AudioContext blocked or not allowed
  }
}

interface CatalogueSpread {
  spreadIndex: number;
  title: string;
  collection: string;
  tierColor: string;
  leftPage: {
    plateNumber: string;
    image: string;
    caption: string;
    motifStamp: string;
    subline: string;
  };
  rightPage: {
    sku: string;
    productName: string;
    subtitle: string;
    story: string;
    specs: { label: string; val: string }[];
    swatches: { name: string; hex: string }[];
    price: number;
    discountPrice?: number;
    badge: string;
  };
}

const CATALOGUE_SPREADS: CatalogueSpread[] = [
  {
    spreadIndex: 0,
    title: 'Sanctuary Percale & Organic Linens',
    collection: 'JORIQUE Essential',
    tierColor: '#7A8B72',
    leftPage: {
      plateNumber: 'PLATE 01',
      image: '/Products/2.jpg',
      caption: 'The Organic Sanctuary: 400 TC Air-Washed Percale Bed Suite',
      motifStamp: 'CERTIFIED ORGANIC COTTON',
      subline: 'Real homes. Everyday moments. Quiet elegance.',
    },
    rightPage: {
      sku: 'JR-BED-2026-001',
      productName: 'Air-Washed Percale Bed Sanctuary',
      subtitle: 'Everyday comfort, thoughtfully designed.',
      story:
        'Sourced from 100% certified long-staple organic cotton. Hand-finished with an air-washed enzyme treatment that relaxes every fiber, delivering cloud-like thermoregulation that grows softer with every wash.',
      specs: [
        { label: 'Fiber', val: 'Long-Staple Giza Cotton' },
        { label: 'Weave', val: 'Air-Washed Crisp Percale' },
        { label: 'Thread Count', val: '400 TC High-Tensile' },
        { label: 'Fit', val: 'Deep 16" Pocket Fitting' },
      ],
      swatches: [
        { name: 'Sage Green', hex: '#7A8B72' },
        { name: 'Warm Ivory', hex: '#F5EDE3' },
        { name: 'Sand Drift', hex: '#D8CEBE' },
      ],
      price: 2999,
      discountPrice: 2499,
      badge: 'Bestseller Sanctuary',
    },
  },
  {
    spreadIndex: 1,
    title: 'Royal Indigo & Dola Silk Jacquards',
    collection: 'JORIQUE Signature',
    tierColor: '#243B64',
    leftPage: {
      plateNumber: 'PLATE 02',
      image: '/Products/3.jpg',
      caption: 'Aristocratic Loom: Fine Ghatchola Dola Silk Ensemble',
      motifStamp: 'MASTER ARTISAN LOOMED',
      subline: 'Architectural heirloom weaves blending past & present.',
    },
    rightPage: {
      sku: 'JR-SIR-WU-001',
      productName: 'Premium Ghatchola Dola Silk Ensemble',
      subtitle: 'Refined comfort, distinctive living.',
      story:
        'An homage to imperial Indian court textiles. Precision-loomed gold zari grids intersect with delicate floral embroidery across an airy dola silk drape, tailored for connoisseurs of timeless formal elegance.',
      specs: [
        { label: 'Silk Grade', val: 'Mulberry & Dola Blend' },
        { label: 'Zari', val: 'Anti-Tarnish Metallic Gilt' },
        { label: 'Dupatta', val: 'Pure Organza Bordered' },
        { label: 'Cut', val: 'Unstitched 3-Piece Suite' },
      ],
      swatches: [
        { name: 'Imperial Emerald', hex: '#1E4A38' },
        { name: 'Royal Gold', hex: '#C6A96B' },
        { name: 'Royal Indigo', hex: '#243B64' },
      ],
      price: 2999,
      badge: 'Heritage Masterpiece',
    },
  },
  {
    spreadIndex: 2,
    title: 'Mulberry Silk & Liquid Sateen',
    collection: 'JORIQUE Luxe',
    tierColor: '#641F2D',
    leftPage: {
      plateNumber: 'PLATE 03',
      image: '/images/collections/luxe.jpg',
      caption: 'The Presidential Suite: 800 TC Calendered Mirror Sateen',
      motifStamp: 'ULTRA-HIGH DENSITY COUTURE',
      subline: 'Designed for a life of quiet indulgence.',
    },
    rightPage: {
      sku: 'JR-LUX-BED-002',
      productName: 'Velvet Wine Liquid Sateen Presidential Suite',
      subtitle: 'Elevated comfort, exceptional detail.',
      story:
        'Our most luxurious bed linen creation. Crafted from hand-combed extra-long staple Egyptian fibers and calendered through heated steel rollers to yield a liquid mirror finish with heavy velvet flange borders.',
      specs: [
        { label: 'Density', val: '800 Thread Count' },
        { label: 'Borders', val: 'Plush Silk Velvet Flange' },
        { label: 'Drape', val: 'Fluid Decadent Weight' },
        { label: 'Setting', val: 'Presidential Penthouse' },
      ],
      swatches: [
        { name: 'Burgundy Wine', hex: '#641F2D' },
        { name: 'Champagne Gilt', hex: '#C6A96B' },
        { name: 'Deep Obsidian', hex: '#1C1917' },
      ],
      price: 6499,
      discountPrice: 5999,
      badge: 'Luxe Couture Edition',
    },
  },
  {
    spreadIndex: 3,
    title: 'Digital Ajrak & Artisanal Motifs',
    collection: 'JORIQUE Essential',
    tierColor: '#7A8B72',
    leftPage: {
      plateNumber: 'PLATE 04',
      image: '/Products/5.jpg',
      caption: 'Timeless Geometry: Digital Ajrak Indigo Ensemble',
      motifStamp: 'HERITAGE GEOMETRIC PRINT',
      subline: 'Natural breathable comfort for everyday sanctuaries.',
    },
    rightPage: {
      sku: 'JR-ESS-WU-001',
      productName: 'Designer Ajrak Digital Unstitched Suite',
      subtitle: 'Thoughtful pieces for meaningful moments.',
      story:
        'Inspired by centuries-old mud-resist block printing from Kutch. Engineered onto featherlight cambric cotton for maximum airflow and effortless everyday wear in warm climates.',
      specs: [
        { label: 'Fabric', val: 'Pure Cambric Cotton' },
        { label: 'Technique', val: 'Artisanal Block Symmetry' },
        { label: 'Care', val: 'Colorfast Easy Care' },
        { label: 'Feel', val: 'Crisp, Airy & Breathable' },
      ],
      swatches: [
        { name: 'Indigo Flora', hex: '#243B64' },
        { name: 'Ochre Sand', hex: '#C6A96B' },
        { name: 'Deep Terracotta', hex: '#A85D52' },
      ],
      price: 1999,
      badge: 'Artisan Heritage',
    },
  },
  {
    spreadIndex: 4,
    title: 'Sculpted Zero-Twist Spa Linens',
    collection: 'JORIQUE Signature',
    tierColor: '#243B64',
    leftPage: {
      plateNumber: 'PLATE 05',
      image: '/images/luxury-products/towel_clean.png',
      caption: 'Thermal Rituals: 700 GSM Cloud Waffle Bath Linen',
      motifStamp: 'ZERO-TWIST RAPID ABSORPTION',
      subline: 'Everyday rituals, elevated through texture and detail.',
    },
    rightPage: {
      sku: 'JR-TOW-2026-001',
      productName: 'Cloud-Woven Waffle Plush Bath Sheet',
      subtitle: 'Considered pieces for restorative moments.',
      story:
        'Transform your daily bath into a private sanctuary ritual. 700 GSM zero-twist cotton loops provide unmatched loft, soaking up moisture in a single gentle touch while drying twice as fast as standard terry.',
      specs: [
        { label: 'Density', val: '700 GSM Heavyweight' },
        { label: 'Cotton', val: '100% Certified Aegean' },
        { label: 'Texture', val: 'Dual Honeycomb Pile' },
        { label: 'Standard', val: 'OEKO-TEX® Tested' },
      ],
      swatches: [
        { name: 'Natural Ecru', hex: '#EBE5D8' },
        { name: 'Slate Grey', hex: '#8A847D' },
        { name: 'Deep Royal', hex: '#243B64' },
      ],
      price: 2999,
      badge: 'Spa Grade Luxury',
    },
  },
];

export default function Proper3DCatalogueBook() {
  const [currentSpread, setCurrentSpread] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [addedSku, setAddedSku] = useState<string | null>(null);
  const { addToCart } = useCart();

  const totalSpreads = CATALOGUE_SPREADS.length;
  const spread = CATALOGUE_SPREADS[currentSpread];

  // Turn page forward
  const turnNext = () => {
    if (isFlipping || currentSpread >= totalSpreads - 1) return;
    setIsFlipping(true);
    setFlipDirection('next');
    if (soundEnabled) playPaperTurnSound();

    setTimeout(() => {
      setCurrentSpread((prev) => prev + 1);
      setIsFlipping(false);
    }, 650);
  };

  // Turn page backward
  const turnPrev = () => {
    if (isFlipping || currentSpread <= 0) return;
    setIsFlipping(true);
    setFlipDirection('prev');
    if (soundEnabled) playPaperTurnSound();

    setTimeout(() => {
      setCurrentSpread((prev) => prev - 1);
      setIsFlipping(false);
    }, 650);
  };

  const handleQuickAdd = () => {
    const mockProduct: Product = {
      id: spread.rightPage.sku,
      sku: spread.rightPage.sku,
      name: spread.rightPage.productName,
      category: spread.collection,
      price: spread.rightPage.price,
      discount_price: spread.rightPage.discountPrice,
      quantity: 10,
      description: spread.rightPage.story,
      images: [spread.leftPage.image],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addToCart(mockProduct, 1);
    setAddedSku(spread.rightPage.sku);
    setTimeout(() => setAddedSku(null), 2000);
  };

  return (
    <section
      id="3d-catalogue-book"
      className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-12 bg-[#F1ECE3] dark:bg-[#0C0A09] text-primary dark:text-[#FCFAF7] transition-colors duration-500 overflow-hidden relative border-t border-[#E8DFD3] dark:border-[#2E2925]"
    >
      {/* Subtle Warm Amber Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-radial from-[#C6A96B]/12 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-[1300px] mx-auto space-y-10 sm:space-y-14 relative z-10">
        
        {/* Section Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-[#C6A96B]/30 text-[#0B5F61] dark:text-[#D4AF37] text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase shadow-xs">
            <BookOpen size={13} className="text-[#C6A96B]" />
            <span>INTERACTIVE ATELIER CATALOGUE</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-primary dark:text-white leading-[1.15]">
            The Bound Lookbook
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-secondary dark:text-white/70 font-light max-w-lg mx-auto leading-relaxed">
            Flip through genuine archival pages. Each spread showcases an architectural sanctuary plate alongside technical tailoring specifications.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            THE REALISTIC 3D PHYSICAL BOOK STAGE
        ───────────────────────────────────────────────────────────── */}
        <div className="relative max-w-5xl mx-auto select-none" style={{ perspective: '2200px' }}>
          
          {/* Stacked Paper Edge Shadows (Multi-sheet book depth effect) */}
          <div className="absolute -inset-2.5 sm:-inset-4 rounded-[32px] sm:rounded-[40px] bg-[#E3DDD1] dark:bg-[#15110E] shadow-[0_35px_80px_-15px_rgba(0,0,0,0.45)] dark:shadow-[0_40px_90px_-20px_rgba(0,0,0,0.85)] border border-[#D5CCC0] dark:border-[#2A211B]" />

          {/* Hardcover Leather Bevel Frame */}
          <div className="relative rounded-[26px] sm:rounded-[34px] bg-[#EFE9DF] dark:bg-[#1A1613] p-2.5 sm:p-5 lg:p-6 border-2 border-[#D8CFC2] dark:border-[#352B24] overflow-hidden">
            
            {/* Center Book Spine Stitch & Leather Crease */}
            <div className="hidden lg:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-12 pointer-events-none z-40">
              {/* Deep central gutter gradient */}
              <div className="w-full h-full bg-gradient-to-r from-black/25 via-black/45 to-black/25 opacity-70 dark:opacity-90" />
              {/* Gold spine center crease */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#C6A96B]/60 shadow-xs" />
            </div>

            {/* Hanging Silk Ribbon Bookmark (Gold Tassel) */}
            <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-4 h-20 bg-[#C6A96B] shadow-md z-50 rounded-b-sm">
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-[#EFE9DF] dark:border-b-[#1A1613] absolute bottom-0" />
            </div>

            {/* ─────────────────────────────────────────────────────────
                TWO FACING PAGES CONTAINER (Spread View)
            ───────────────────────────────────────────────────────── */}
            <div 
              className="relative w-full grid grid-cols-1 lg:grid-cols-2 rounded-2xl bg-[#FCFAF7] dark:bg-[#14100E] border border-[#E5DDD0] dark:border-[#2D2520] min-h-[580px] sm:min-h-[620px] lg:min-h-[600px] overflow-hidden shadow-inner"
              style={{ transformStyle: 'preserve-3d' }}
            >
              
              {/* ── LEFT FACING PAGE: PLATE VISUAL ── */}
              <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E8DFD3] dark:border-[#2E2925] bg-[#FCFAF7] dark:bg-[#14100E]">
                
                {/* Plate Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3] dark:border-[#2E2925] text-[10px] font-mono tracking-[0.25em] uppercase text-secondary dark:text-white/50">
                  <span>JORIQUE • ARCHIVAL EDITION</span>
                  <span className="text-[#C6A96B] font-bold">{spread.leftPage.plateNumber}</span>
                </div>

                {/* Main Plate Image with Gold Filigree Framing */}
                <div className="relative my-4 aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-[#E8DFD3] dark:border-[#2E2925] bg-black">
                  <img
                    src={spread.leftPage.image}
                    alt={spread.leftPage.caption}
                    className="w-full h-full object-cover select-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Corner Collection Pill */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-3 py-1 rounded-full text-[9px] font-mono tracking-[0.2em] uppercase text-white shadow-md font-semibold"
                      style={{ backgroundColor: spread.tierColor }}
                    >
                      {spread.collection}
                    </span>
                  </div>

                  {/* Bottom Plate Caption Tag */}
                  <div className="absolute bottom-3 left-3 right-3 text-white text-[10px] font-mono tracking-wider uppercase drop-shadow flex items-center justify-between">
                    <span className="truncate">{spread.leftPage.motifStamp}</span>
                    <span className="text-[#C6A96B] shrink-0">✦</span>
                  </div>
                </div>

                {/* Left Page Quote & Plate Subline */}
                <div className="pt-3 border-t border-[#E8DFD3] dark:border-[#2E2925] space-y-1 text-center">
                  <p className="font-serif italic text-xs sm:text-sm text-primary dark:text-white/80 font-normal leading-relaxed">
                    “{spread.leftPage.caption}”
                  </p>
                  <p className="text-[10px] font-mono tracking-widest text-[#8A847D] dark:text-white/40 uppercase">
                    {spread.leftPage.subline}
                  </p>
                </div>

                {/* Dog-ear Clickable Left Corner to Turn Previous */}
                {currentSpread > 0 && (
                  <button
                    onClick={turnPrev}
                    disabled={isFlipping}
                    className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-transparent to-[#E8DFD3]/80 dark:to-white/10 hover:to-[#C6A96B]/40 transition-colors cursor-pointer group flex items-end justify-start p-1.5"
                    title="Flip to previous page"
                  >
                    <span className="text-[9px] font-mono text-[#8A847D] group-hover:text-primary">◂ PREV</span>
                  </button>
                )}
              </div>

              {/* ── RIGHT FACING PAGE: SPECIFICATION DOSSIER ── */}
              <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#F5EDE3] dark:bg-[#161210]">
                
                {/* Right Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3] dark:border-[#2E2925] text-[10px] font-mono tracking-[0.25em] uppercase text-secondary dark:text-white/50">
                  <span>ATELIER SPECIFICATION</span>
                  <span className="text-primary dark:text-white font-semibold">{spread.rightPage.sku}</span>
                </div>

                {/* Product Title & Fabric Narrative */}
                <div className="space-y-4 my-auto">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#0B5F61] dark:text-[#C6A96B] font-bold block">
                      {spread.rightPage.badge}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-primary dark:text-white tracking-tight leading-snug">
                      {spread.rightPage.productName}
                    </h3>
                    <p className="font-serif italic text-xs sm:text-sm text-secondary dark:text-white/70">
                      {spread.rightPage.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-[13px] text-secondary dark:text-white/75 font-light leading-relaxed">
                    {spread.rightPage.story}
                  </p>

                  {/* Technical Specifications Matrix */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {spread.rightPage.specs.map((spec, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-white/70 dark:bg-white/5 border border-[#E8DFD3] dark:border-[#2E2925]"
                      >
                        <span className="text-[9px] font-mono uppercase tracking-widest text-secondary dark:text-white/50 block">
                          {spec.label}
                        </span>
                        <span className="text-xs font-semibold text-primary dark:text-white block mt-0.5 truncate">
                          {spec.val}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Swatches Bar */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-secondary dark:text-white/60 block">
                      Curated Colorway:
                    </span>
                    <div className="flex items-center gap-3">
                      {spread.rightPage.swatches.map((swatch, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15 dark:border-white/20 shadow-2xs"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <span className="text-[11px] text-secondary dark:text-white/80 font-medium">
                            {swatch.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Pricing & Action Button */}
                <div className="pt-4 border-t border-[#E8DFD3] dark:border-[#2E2925] flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-mono tracking-widest text-secondary dark:text-white/50 uppercase block">
                      Price
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-2xl sm:text-3xl font-medium text-primary dark:text-white">
                        ₹{(spread.rightPage.discountPrice || spread.rightPage.price).toLocaleString('en-IN')}
                      </span>
                      {spread.rightPage.discountPrice && (
                        <span className="text-xs text-secondary/60 line-through">
                          ₹{spread.rightPage.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleQuickAdd}
                      className="px-5 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#0B5F61] dark:bg-[#C6A96B] dark:hover:bg-[#E5C158] text-white dark:text-black text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      {addedSku === spread.rightPage.sku ? (
                        <>
                          <Check size={13} className="text-[#7A8B72]" />
                          <span>Curated</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={13} />
                          <span>Curate Piece</span>
                        </>
                      )}
                    </button>

                    <Link to={`/product/${spread.rightPage.sku}`}>
                      <button
                        className="w-9 h-9 rounded-full border border-[#E8DFD3] dark:border-[#332922] bg-white/70 dark:bg-white/5 flex items-center justify-center text-primary dark:text-white hover:border-[#C6A96B] transition-colors cursor-pointer"
                        title="View Detailed Product Page"
                      >
                        <Eye size={14} />
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Dog-ear Clickable Right Corner to Turn Next */}
                {currentSpread < totalSpreads - 1 && (
                  <button
                    onClick={turnNext}
                    disabled={isFlipping}
                    className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-transparent to-[#E8DFD3]/80 dark:to-white/10 hover:to-[#C6A96B]/40 transition-colors cursor-pointer group flex items-end justify-end p-1.5"
                    title="Flip to next page"
                  >
                    <span className="text-[9px] font-mono text-[#8A847D] group-hover:text-primary">NEXT ▸</span>
                  </button>
                )}
              </div>

              {/* ───────────────────────────────────────────────────────
                  3D ANIMATED TURNING LEAF OVERLAY (Real Page Turn)
              ─────────────────────────────────────────────────────── */}
              <AnimatePresence>
                {isFlipping && (
                  <motion.div
                    initial={{
                      rotateY: flipDirection === 'next' ? 0 : -180,
                    }}
                    animate={{
                      rotateY: flipDirection === 'next' ? -180 : 0,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.65,
                      ease: [0.65, 0.05, 0.36, 1], // Smooth paper bending curve
                    }}
                    style={{
                      transformOrigin: 'left center',
                      transformStyle: 'preserve-3d',
                    }}
                    className="absolute top-0 right-0 w-1/2 h-full z-50 pointer-events-none hidden lg:block shadow-2xl"
                  >
                    {/* Front Face of Turning Page (Shows current right page content) */}
                    <div
                      style={{ backfaceVisibility: 'hidden' }}
                      className="absolute inset-0 bg-[#F5EDE3] dark:bg-[#161210] p-8 border-l border-[#E8DFD3] dark:border-[#332922] shadow-2xl"
                    >
                      <div className="w-full h-full flex flex-col justify-between opacity-80">
                        <div className="text-[10px] font-mono tracking-widest text-[#8A847D] uppercase">
                          TURNING SPREAD...
                        </div>
                        <h4 className="font-serif text-2xl font-normal text-primary dark:text-white">
                          {spread.rightPage.productName}
                        </h4>
                        <div className="h-1 w-20 bg-[#C6A96B]" />
                      </div>
                    </div>

                    {/* Dynamic Moving Shadow Gradient Across Paper Surface */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.6, 0] }}
                      transition={{ duration: 0.65 }}
                      className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent pointer-events-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

          {/* ─────────────────────────────────────────────────────────────
              CATALOGUE CONTROLS & SPREAD TRACKER
          ───────────────────────────────────────────────────────────── */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
            
            {/* Audio Rustle Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] text-xs font-mono tracking-wider uppercase text-secondary dark:text-white/70 hover:text-primary transition-colors cursor-pointer"
              title="Toggle authentic paper rustle audio"
            >
              {soundEnabled ? <Volume2 size={13} className="text-[#C6A96B]" /> : <VolumeX size={13} />}
              <span>{soundEnabled ? 'Paper Sound: On' : 'Paper Sound: Mute'}</span>
            </button>

            {/* Center Spread Progress & Dots */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-secondary dark:text-white/60">
                SPREAD 0{currentSpread + 1} OF 0{totalSpreads}
              </span>
              <div className="flex items-center gap-1.5">
                {CATALOGUE_SPREADS.map((s, idx) => (
                  <button
                    key={s.spreadIndex}
                    onClick={() => {
                      if (idx === currentSpread || isFlipping) return;
                      setFlipDirection(idx > currentSpread ? 'next' : 'prev');
                      setIsFlipping(true);
                      if (soundEnabled) playPaperTurnSound();
                      setTimeout(() => {
                        setCurrentSpread(idx);
                        setIsFlipping(false);
                      }, 500);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentSpread
                        ? 'w-7 bg-[#C6A96B]'
                        : 'w-2 bg-[#E8DFD3] dark:bg-white/20 hover:bg-[#8A847D]'
                    }`}
                    title={`Go to Spread ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Turn Page Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={turnPrev}
                disabled={currentSpread === 0 || isFlipping}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  currentSpread === 0 || isFlipping
                    ? 'opacity-30 cursor-not-allowed border-[#E8DFD3] dark:border-[#332922] text-secondary'
                    : 'bg-white/80 dark:bg-white/5 border-[#E8DFD3] dark:border-[#332922] hover:border-[#C6A96B] text-primary dark:text-white shadow-xs hover:shadow-md'
                }`}
              >
                <ChevronLeft size={16} />
                <span>Turn Left</span>
              </button>

              <button
                onClick={turnNext}
                disabled={currentSpread === totalSpreads - 1 || isFlipping}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  currentSpread === totalSpreads - 1 || isFlipping
                    ? 'opacity-30 cursor-not-allowed bg-secondary/20 text-secondary'
                    : 'bg-[#1A1A1A] dark:bg-[#C6A96B] text-white dark:text-black shadow-md hover:shadow-lg'
                }`}
              >
                <span>Turn Right</span>
                <ChevronRight size={16} />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
