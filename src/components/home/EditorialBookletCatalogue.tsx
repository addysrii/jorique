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
  Play,
  Pause,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';

interface CataloguePage {
  pageNumber: number;
  sku: string;
  name: string;
  tier: 'essential' | 'signature' | 'luxe';
  tierLabel: string;
  tierColor: string;
  category: string;
  price: number;
  discountPrice?: number;
  image: string;
  quote: string;
  specs: { label: string; val: string }[];
  swatches: { name: string; hex: string }[];
  fabricNote: string;
}

const CATALOGUE_PAGES: CataloguePage[] = [
  {
    pageNumber: 1,
    sku: 'JR-BED-2026-001',
    name: 'Air-Washed Percale Bedding Set',
    tier: 'essential',
    tierLabel: 'JORIQUE Essential',
    tierColor: '#7A8B72',
    category: 'Bedding Sanctuary',
    price: 2999,
    discountPrice: 2499,
    image: '/Products/2.jpg',
    quote: 'Cloud-soft thermoregulation for real homes and everyday moments.',
    specs: [
      { label: 'Fiber', val: '100% Certified Organic Cotton' },
      { label: 'Weave', val: 'Cool Air-Washed Percale' },
      { label: 'Thread Count', val: '400 TC High-Tensile' },
      { label: 'Care', val: 'Machine Wash • Softens Over Time' },
    ],
    swatches: [
      { name: 'Sage Green', hex: '#7A8B72' },
      { name: 'Warm Ivory', hex: '#F5EDE3' },
      { name: 'Sand', hex: '#D8CEBE' },
    ],
    fabricNote:
      'Engineered for effortless breathability. Our signature air-washed finish mimics the softness of vintage heirloom linens from the very first night.',
  },
  {
    pageNumber: 2,
    sku: 'JR-ESS-WU-001',
    name: 'Designer Ajrak Digital Unstitched Suit',
    tier: 'essential',
    tierLabel: 'JORIQUE Essential',
    tierColor: '#7A8B72',
    category: 'Tailored Apparel',
    price: 1999,
    image: '/Products/5.jpg',
    quote: 'Heritage geometric block motifs woven for daylong comfort.',
    specs: [
      { label: 'Fabric', val: 'Pure Breathable Cambric Cotton' },
      { label: 'Craft', val: 'Digital Ajrak Artisan Print' },
      { label: 'Dupatta', val: 'Featherlight Chiffon Border' },
      { label: 'Length', val: 'Unstitched 3-Piece Suite' },
    ],
    swatches: [
      { name: 'Indigo Flora', hex: '#243B64' },
      { name: 'Ochre Sand', hex: '#C6A96B' },
      { name: 'Deep Madder', hex: '#641F2D' },
    ],
    fabricNote:
      'Rooted in centuries-old Indus Valley resist-dye geometry. Tailored for women who demand graceful movement and natural botanical cooling.',
  },
  {
    pageNumber: 3,
    sku: 'JR-SIR-WU-001',
    name: 'Premium Ghatchola Dola Silk Ensemble',
    tier: 'signature',
    tierLabel: 'JORIQUE Signature',
    tierColor: '#243B64',
    category: 'Masterpiece Weave',
    price: 2999,
    image: '/Products/3.jpg',
    quote: 'Luminous gold zari grids loomed with aristocratic poise.',
    specs: [
      { label: 'Fabric', val: 'Heavy Dola Mulberry Silk Blend' },
      { label: 'Embroidery', val: 'Fine Thread & Sequence Gilt' },
      { label: 'Loom', val: 'Bespoke Dobby Jacquard' },
      { label: 'Finish', val: 'Lustrous Soft-Silk Drape' },
    ],
    swatches: [
      { name: 'Imperial Emerald', hex: '#1E4A38' },
      { name: 'Royal Gold', hex: '#C6A96B' },
      { name: 'Ivory Gilt', hex: '#FCFAF7' },
    ],
    fabricNote:
      'Where Indian royalty meets modern architecture. Intricate gold zari squares frame delicate floral hand-embroidery across a sumptuous silk canvas.',
  },
  {
    pageNumber: 4,
    sku: 'JR-LUX-WU-001',
    name: 'Designer Raw Silk Suite — Royal Navy',
    tier: 'luxe',
    tierLabel: 'JORIQUE Luxe',
    tierColor: '#641F2D',
    category: 'Couture Living',
    price: 4299,
    image: '/images/collections/signature.jpg',
    quote: 'Uncompromising tactile opulence for sovereign celebrations.',
    specs: [
      { label: 'Fiber', val: 'Handspun Textured Raw Silk' },
      { label: 'Detail', val: 'French Mitered Flange & Zari' },
      { label: 'Weight', val: 'Structured Substantial Feel' },
      { label: 'Standard', val: 'Museum Collection Edition' },
    ],
    swatches: [
      { name: 'Royal Navy', hex: '#19283E' },
      { name: 'Champagne', hex: '#E5D6BA' },
      { name: 'Obsidian', hex: '#1A1A1A' },
    ],
    fabricNote:
      'Created for state dinners and monumental evenings. The raw silk slub catches evening light with rich multidimensional luster.',
  },
  {
    pageNumber: 5,
    sku: 'JR-LUX-BED-002',
    name: 'Velvet Wine Liquid Sateen Presidential Suite',
    tier: 'luxe',
    tierLabel: 'JORIQUE Luxe',
    tierColor: '#641F2D',
    category: 'Presidential Sanctuary',
    price: 6499,
    image: '/images/collections/luxe.jpg',
    quote: 'Our most decadent weave, designed for a life of quiet indulgence.',
    specs: [
      { label: 'Weave', val: 'Liquid Mirror Sateen (800 TC)' },
      { label: 'Accents', val: 'Plush Silk Velvet Flange' },
      { label: 'Feel', val: 'Fluid Silk & Decadent Weight' },
      { label: 'Occasion', val: 'Five-Star Master Suite' },
    ],
    swatches: [
      { name: 'Burgundy Wine', hex: '#641F2D' },
      { name: 'Champagne Gilt', hex: '#C6A96B' },
      { name: 'Smoked Teak', hex: '#2A1B18' },
    ],
    fabricNote:
      'An unforgettable sensory caress. Sourced from the highest grade Giza cotton yarns, polished through hot calendar rollers for a mirror-like fluid drape.',
  },
  {
    pageNumber: 6,
    sku: 'JR-PIL-2026-001',
    name: 'Botanical Gold Embroidered Cushion Pair',
    tier: 'essential',
    tierLabel: 'JORIQUE Essential',
    tierColor: '#7A8B72',
    category: 'Living Accents',
    price: 1223,
    image: '/Products/1.jpg',
    quote: 'Thoughtful details that transform the character of an entire room.',
    specs: [
      { label: 'Fabric', val: 'Natural Slub Linen Blend' },
      { label: 'Motif', val: 'Botanical Wildflower Trail' },
      { label: 'Closure', val: 'Concealed YKK Antique Brass' },
      { label: 'Dimension', val: '18 x 18 in • Mitered Edge' },
    ],
    swatches: [
      { name: 'Warm Cream', hex: '#F5EDE3' },
      { name: 'Antique Gold', hex: '#C6A96B' },
      { name: 'Forest Olive', hex: '#4A553F' },
    ],
    fabricNote:
      'The quiet focal point of your salon. Hand-guided botanical embroidery reflects the delicate flora of Northern hills on rustic linen.',
  },
  {
    pageNumber: 7,
    sku: 'JR-TOW-2026-001',
    name: 'Cloud-Woven Waffle Plush Bath Sheet',
    tier: 'signature',
    tierLabel: 'JORIQUE Signature',
    tierColor: '#243B64',
    category: 'Bath & Wellness',
    price: 2999,
    image: '/images/luxury-products/towel_clean.png',
    quote: 'Everyday rituals, elevated through sculpted texture and rapid absorption.',
    specs: [
      { label: 'Weight', val: '700 GSM Heavy Density' },
      { label: 'Fiber', val: 'Zero-Twist Aegean Cotton' },
      { label: 'Structure', val: 'Honeycomb Dual-Pile Waffle' },
      { label: 'Dry Time', val: 'Accelerated Air-Dry Weave' },
    ],
    swatches: [
      { name: 'Natural Ecru', hex: '#EBE5D8' },
      { name: 'Slate Grey', hex: '#8A847D' },
      { name: 'Deep Royal', hex: '#243B64' },
    ],
    fabricNote:
      'Turn your bathroom into a private thermal spa. Zero-twist cotton loops provide unmatched loft, soaking up moisture in a single gentle touch.',
  },
  {
    pageNumber: 8,
    sku: 'JR-ESS-WU-004',
    name: 'Designer Bandhani Digital Unstitched Suit',
    tier: 'essential',
    tierLabel: 'JORIQUE Essential',
    tierColor: '#7A8B72',
    category: 'Tailored Apparel',
    price: 1999,
    image: '/Products/4.jpg',
    quote: 'Rhythmic tie-dye constellations celebrating heritage craft.',
    specs: [
      { label: 'Fabric', val: '100% Long-Staple Cotton' },
      { label: 'Pattern', val: 'Bandhani Micro-Constellations' },
      { label: 'Feel', val: 'Crisp, Airy & Unrestricted' },
      { label: 'Season', val: 'All-Season Breathability' },
    ],
    swatches: [
      { name: 'Terracotta', hex: '#A85D52' },
      { name: 'Warm Cream', hex: '#FCFAF7' },
      { name: 'Antique Gold', hex: '#C6A96B' },
    ],
    fabricNote:
      'A joyful homage to Western Indian tie-dye mastery. Breathable cambric cotton keeps you cool through warm summer afternoons.',
  },
];

export default function EditorialBookletCatalogue() {
  const [currentPageIdx, setCurrentPageIdx] = useState<number>(0);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [addedSku, setAddedSku] = useState<string | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { addToCart } = useCart();

  const totalPages = CATALOGUE_PAGES.length;
  const currentItem = CATALOGUE_PAGES[currentPageIdx];

  // Auto-flip timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    autoPlayTimerRef.current = setInterval(() => {
      setFlipDirection('next');
      setCurrentPageIdx((prev) => (prev + 1) % totalPages);
    }, 4500);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, totalPages]);

  const handleNext = () => {
    setFlipDirection('next');
    setCurrentPageIdx((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setFlipDirection('prev');
    setCurrentPageIdx((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleQuickAdd = () => {
    const mockProduct: Product = {
      id: currentItem.sku,
      sku: currentItem.sku,
      name: currentItem.name,
      category: currentItem.category,
      price: currentItem.price,
      discount_price: currentItem.discountPrice,
      quantity: 10,
      description: currentItem.fabricNote,
      images: [currentItem.image],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addToCart(mockProduct, 1);
    setAddedSku(currentItem.sku);
    setTimeout(() => setAddedSku(null), 2000);
  };

  return (
    <section 
      id="catalogue-booklet"
      className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-12 bg-[#F3ECE1] dark:bg-[#0E0C0B] text-primary dark:text-[#FCFAF7] transition-colors duration-500 overflow-hidden relative border-t border-[#E8DFD3] dark:border-[#2E2925]"
    >
      {/* Delicate background ambiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-radial from-[#C6A96B]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-14 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-[#C6A96B]/30 text-[#0B5F61] dark:text-[#D4AF37] text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase shadow-xs">
            <BookOpen size={13} className="text-[#C6A96B]" />
            <span>JORIQUE ATELIER LOOKBOOK • VOL. 2026</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-primary dark:text-white leading-[1.15]">
            The Tactile Catalogue
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-secondary dark:text-white/70 font-light max-w-xl mx-auto leading-relaxed">
            Turn the pages to discover our signature weaves, architectural silhouettes, and sanctuary living editions.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            THE 3D OPEN BOOK SPREAD (Left Plate + Right Dossier)
        ───────────────────────────────────────────────────────────── */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Real Hardcover Book Shadow Drop & Table Perspective */}
          <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#F5EDE3] dark:bg-[#181412] p-2 sm:p-4 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)] dark:shadow-[0_35px_80px_-20px_rgba(0,0,0,0.8)] border border-[#E8DFD3] dark:border-[#332922]">
            
            {/* Leather Hardcover Border Bevel */}
            <div className="relative rounded-[22px] sm:rounded-[30px] bg-[#F7F3EB] dark:bg-[#1C1714] p-2 sm:p-6 lg:p-8 overflow-hidden">
              
              {/* Center Spine Stitch & Fold Crease (Only visible on tablet & desktop) */}
              <div className="hidden lg:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 pointer-events-none z-30">
                {/* Center spine gutter shadow */}
                <div className="w-full h-full bg-gradient-to-r from-black/15 via-black/30 to-black/15 opacity-60 dark:opacity-80" />
                {/* Book spine stitch highlight */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#C6A96B]/50" />
              </div>

              {/* Decorative Gold Bookmark Ribbon Tassel */}
              <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-4 h-16 bg-[#C6A96B] shadow-md z-40 rounded-b-sm">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[#F7F3EB] dark:border-b-[#1C1714] absolute bottom-0" />
              </div>

              {/* ─────────────────────────────────────────────────────────
                  FLIPPING PAGES CONTENT SPREAD
              ───────────────────────────────────────────────────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-stretch min-h-[560px] lg:min-h-[580px]">
                
                {/* ── LEFT PAGE: THE VISUAL ARTISAN PLATE ── */}
                <div className="relative rounded-2xl bg-white dark:bg-[#151210] p-5 sm:p-7 border border-[#E8DFD3] dark:border-[#2E2925] shadow-inner flex flex-col justify-between overflow-hidden">
                  
                  {/* Page Header Stamp */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3]/80 dark:border-[#2E2925] text-[10px] font-mono tracking-[0.25em] uppercase text-secondary dark:text-white/50">
                    <span>JORIQUE ATELIER</span>
                    <span>PLATE No. 0{currentItem.pageNumber}</span>
                  </div>

                  {/* Main Product Photography */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentItem.pageNumber}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.04 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="relative my-4 aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-[#F5EDE3] dark:bg-[#201B17]"
                    >
                      <img
                        src={currentItem.image}
                        alt={currentItem.name}
                        className="w-full h-full object-cover select-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

                      {/* Collection Tier Corner Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className="px-3 py-1 rounded-full text-[9px] font-mono tracking-[0.2em] uppercase text-white shadow-md font-semibold"
                          style={{ backgroundColor: currentItem.tierColor }}
                        >
                          {currentItem.tierLabel}
                        </span>
                      </div>

                      {/* Plate Watermark */}
                      <div className="absolute bottom-3 left-3 text-white text-[10px] font-mono tracking-widest uppercase drop-shadow">
                        ARCHIVE REF. {currentItem.sku}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Left Page Footer Quote */}
                  <div className="pt-2 border-t border-[#E8DFD3]/80 dark:border-[#2E2925] text-center space-y-1">
                    <p className="font-serif italic text-xs sm:text-sm text-secondary dark:text-white/70 font-light leading-relaxed">
                      “{currentItem.quote}”
                    </p>
                    <span className="text-[9px] font-mono tracking-widest uppercase text-[#C6A96B] block">
                      PAGE 0{currentItem.pageNumber} OF 0{totalPages}
                    </span>
                  </div>

                </div>

                {/* ── RIGHT PAGE: CRAFT SPECIFICATION & ACTIONS ── */}
                <div className="relative rounded-2xl bg-white dark:bg-[#151210] p-6 sm:p-8 border border-[#E8DFD3] dark:border-[#2E2925] shadow-inner flex flex-col justify-between space-y-6">
                  
                  {/* Right Page Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3]/80 dark:border-[#2E2925] text-[10px] font-mono tracking-[0.25em] uppercase text-secondary dark:text-white/50">
                    <span>EDITION MMXXVI</span>
                    <span className="text-[#C6A96B] font-bold">TACTILE SPECIFICATION</span>
                  </div>

                  {/* Main Product Title & Category */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentItem.pageNumber}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-4"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-secondary dark:text-white/60 block">
                          {currentItem.category}
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-primary dark:text-white tracking-tight leading-snug">
                          {currentItem.name}
                        </h3>
                      </div>

                      <p className="text-xs sm:text-sm text-secondary dark:text-white/75 font-light leading-relaxed">
                        {currentItem.fabricNote}
                      </p>

                      {/* Technical Specs Grid */}
                      <div className="grid grid-cols-2 gap-2.5 pt-2">
                        {currentItem.specs.map((spec, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-2.5 rounded-xl bg-[#F5EDE3] dark:bg-[#1C1714] border border-[#E8DFD3] dark:border-[#332922]"
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

                      {/* Curated Swatches */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-secondary dark:text-white/60 block">
                          Tonal Palette:
                        </span>
                        <div className="flex items-center gap-3">
                          {currentItem.swatches.map((swatch, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/20 shadow-xs"
                                style={{ backgroundColor: swatch.hex }}
                              />
                              <span className="text-[11px] text-secondary dark:text-white/80 font-medium">
                                {swatch.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </motion.div>
                  </AnimatePresence>

                  {/* Price & Action Row */}
                  <div className="pt-4 border-t border-[#E8DFD3]/80 dark:border-[#2E2925] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[9px] font-mono tracking-widest text-secondary dark:text-white/50 uppercase block">
                        Atelier Price
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-2xl sm:text-3xl font-medium text-primary dark:text-white">
                          ₹{(currentItem.discountPrice || currentItem.price).toLocaleString('en-IN')}
                        </span>
                        {currentItem.discountPrice && (
                          <span className="text-xs text-secondary/60 line-through">
                            ₹{currentItem.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {/* Curate to Bag Button */}
                      <button
                        onClick={handleQuickAdd}
                        className="flex-1 sm:flex-none px-5 py-3 rounded-full bg-[#1A1A1A] hover:bg-[#0B5F61] dark:bg-[#C6A96B] dark:hover:bg-[#E5C158] text-white dark:text-black text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {addedSku === currentItem.sku ? (
                          <>
                            <Check size={14} className="text-[#7A8B72]" />
                            <span>Curated</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} />
                            <span>Curate Piece</span>
                          </>
                        )}
                      </button>

                      {/* Inspect Link */}
                      <Link to={`/product/${currentItem.sku}`}>
                        <button
                          className="w-10 h-10 rounded-full border border-[#E8DFD3] dark:border-[#332922] bg-cream/40 dark:bg-white/5 flex items-center justify-center text-primary dark:text-white hover:border-[#C6A96B] transition-colors cursor-pointer"
                          title="Inspect Product Page"
                        >
                          <Eye size={15} />
                        </button>
                      </Link>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ─────────────────────────────────────────────────────────
              BOOKLET CONTROLS & FLIP BUTTONS
          ───────────────────────────────────────────────────────── */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
            
            {/* Auto Play Flip Control */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] text-xs font-mono tracking-wider uppercase text-secondary dark:text-white/70 hover:text-primary transition-colors cursor-pointer"
            >
              {isAutoPlaying ? <Pause size={12} /> : <Play size={12} />}
              <span>{isAutoPlaying ? 'Pause Catalogue' : 'Auto-Turn Pages'}</span>
            </button>

            {/* Quick Page Slider / Dots */}
            <div className="flex items-center gap-1.5">
              {CATALOGUE_PAGES.map((page, idx) => (
                <button
                  key={page.pageNumber}
                  onClick={() => {
                    setFlipDirection(idx > currentPageIdx ? 'next' : 'prev');
                    setCurrentPageIdx(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentPageIdx
                      ? 'w-8 bg-[#C6A96B]'
                      : 'w-2 bg-[#E8DFD3] dark:bg-white/20 hover:bg-[#8A847D]'
                  }`}
                  title={`Go to page ${idx + 1}`}
                />
              ))}
            </div>

            {/* Turn Page Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-white/5 border border-[#E8DFD3] dark:border-[#332922] hover:border-[#C6A96B] text-primary dark:text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Previous Page</span>
              </button>

              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A1A1A] dark:bg-[#C6A96B] text-white dark:text-black text-xs font-semibold uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Next Page</span>
                <ChevronRight size={16} />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
