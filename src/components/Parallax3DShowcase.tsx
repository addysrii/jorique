import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, type Variants } from 'framer-motion';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Camera,
  Check,
  Eye,
  Table as TableIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { productService } from '../lib/api/products';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { getBadgeColors } from '../lib/constants/collections';
import ViewInYourRoomModal from './ViewInYourRoomModal';
import { parseProductDescription } from './ProductDescriptionTable';

interface CategoryRow {
  key: string;
  label: string;
  tagline: string;
  categoryQuery: string;
  products: Product[];
}

function normalizeCategory(cat: string): { key: string; label: string; tagline: string; categoryQuery: string } {
  const c = (cat || '').toLowerCase().trim();
  if (c.includes('suit')) {
    return {
      key: 'suits',
      label: 'Designer Suits',
      tagline: 'Handcrafted Maheshwari silks, digital Ikat, Bandhani & Ajrak unstitched suits with mirror work.',
      categoryQuery: 'Suits',
    };
  }
  if (c.includes('bedsheet')) {
    return {
      key: 'bedsheets',
      label: 'Luxury Bedsheets',
      tagline: 'High thread-count satin weaves, premium soft cottons, and heirloom comfort for restful sleep.',
      categoryQuery: 'Bedsheets',
    };
  }
  if (c.includes('mattress')) {
    return {
      key: 'mattresses',
      label: 'Orthopedic Mattresses',
      tagline: 'Ergonomically engineered memory foam and supportive multi-layer mattresses for restorative rest.',
      categoryQuery: 'Mattress',
    };
  }
  if (c.includes('pillow') || c.includes('decor')) {
    return {
      key: 'pillows',
      label: 'Pillows & Home Accents',
      tagline: 'Ultra-plush fiber fills, artisanal covers, and aesthetic accent cushions.',
      categoryQuery: 'Pillow',
    };
  }
  if (c.includes('towel')) {
    return {
      key: 'towels',
      label: 'Artisan Towels',
      tagline: 'Zero-twist combed cotton towels with ultra-absorbent weave and plush softness.',
      categoryQuery: 'Towel',
    };
  }
  return {
    key: c || 'other',
    label: cat || 'Collections',
    tagline: 'Meticulously crafted home and lifestyle textiles.',
    categoryQuery: cat,
  };
}

// ---------------------------------------------------------
// Ultra-Luxury Animated Full-Width Category Carousel
// ---------------------------------------------------------
// ---------------------------------------------------------
// Ultra-Luxury Animated Full-Width Category Carousel
// ---------------------------------------------------------
function FullWidthCategoryCarousel({
  category,
  onOpenAR,
}: {
  category: CategoryRow;
  onOpenAR: (product: Product) => void;
}) {
  const { addToCart } = useCart();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Parallax Tilt state for the category card
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springTiltConfig = { stiffness: 220, damping: 22 };
  const smoothX = useSpring(mouseX, springTiltConfig);
  const smoothY = useSpring(mouseY, springTiltConfig);

  const tiltRotateX = useTransform(smoothY, [-0.5, 0.5], ['3deg', '-3deg']);
  const tiltRotateY = useTransform(smoothX, [-0.5, 0.5], ['-3deg', '3deg']);
  const imageCounterX = useTransform(smoothX, [-0.5, 0.5], ['8px', '-8px']);
  const imageCounterY = useTransform(smoothY, [-0.5, 0.5], ['8px', '-8px']);
  const glareSpotX = useTransform(smoothX, [-0.5, 0.5], ['15%', '85%']);
  const glareSpotY = useTransform(smoothY, [-0.5, 0.5], ['15%', '85%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  // Curate 3 to 4 products
  const curatedProducts = useMemo(() => {
    return category.products.slice(0, 4);
  }, [category.products]);

  const total = curatedProducts.length;

  // Auto advance every 6 seconds if not hovered
  useEffect(() => {
    if (isHovered || total <= 1) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % total);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered, total, activeIndex]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeIndex]);

  const currentProduct = curatedProducts[activeIndex] || curatedProducts[0];
  if (!currentProduct) return null;

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };
  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const displayPrice = currentProduct.discount_price || currentProduct.price;
  const originalPrice = currentProduct.price;
  const hasDiscount = currentProduct.discount_price && currentProduct.discount_price < originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;

  const parsed = parseProductDescription(currentProduct.description);
  const keySpecs = parsed.specs.slice(0, 4);

  const images = currentProduct.images && currentProduct.images.length > 0
    ? currentProduct.images
    : ['/placeholder-image.jpg'];
  const currentImage = images[activeImageIndex] || images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(currentProduct, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  // Cinematic 3D Motion Variants with depth perspective
  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 90 : -90,
      rotateY: dir > 0 ? 8 : -8,
      opacity: 0,
      scale: 0.95,
      filter: 'blur(8px)',
    }),
    center: {
      x: 0,
      rotateY: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -90 : 90,
      rotateY: dir > 0 ? -8 : 8,
      opacity: 0,
      scale: 0.95,
      filter: 'blur(8px)',
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <div
      id={`category-${category.key}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="space-y-6 scroll-mt-28 relative"
    >
      {/* Category Header with Enhanced Micro-Interactions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/70 dark:border-[#2E2925] pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl sm:text-3xl font-serif font-normal text-primary dark:text-white tracking-tight">
              {category.label}
            </h3>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EFE9DF] dark:bg-white/10 text-secondary dark:text-[#D4AF37] border border-border dark:border-white/10 shadow-2xs">
              {activeIndex + 1} of {total} Curated
            </span>
          </div>
          <p className="text-xs sm:text-[13px] text-secondary dark:text-white/60 font-sans mt-1.5 max-w-2xl leading-relaxed">
            {category.tagline}
          </p>
        </div>

        {/* Carousel Navigation Controls with Floating Arrow Effects & Status */}
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <Link
            to={`/shop?category=${encodeURIComponent(category.categoryQuery)}`}
            className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-[#D4AF37] hover:underline flex items-center gap-1.5 mr-2 transition-transform hover:translate-x-0.5"
          >
            <span>Explore Collection</span>
            <ArrowRight size={13} />
          </Link>

          {/* Prev / Next Magnetic Buttons */}
          <div className="flex items-center gap-2 pl-3 border-l border-border/80 dark:border-white/10">
            <motion.button
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.92 }}
              onClick={handlePrev}
              aria-label={`Previous ${category.label}`}
              className="w-10 h-10 rounded-full border border-border dark:border-[#2E2925] bg-white dark:bg-[#1C1A18] text-primary dark:text-white hover:bg-[#D4AF37] hover:text-black dark:hover:bg-[#D4AF37] dark:hover:text-black transition-colors shadow-xs flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleNext}
              aria-label={`Next ${category.label}`}
              className="w-10 h-10 rounded-full border border-border dark:border-[#2E2925] bg-white dark:bg-[#1C1A18] text-primary dark:text-white hover:bg-[#D4AF37] hover:text-black dark:hover:bg-[#D4AF37] dark:hover:text-black transition-colors shadow-xs flex items-center justify-center cursor-pointer"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH CARD STAGE: One Product Visible at a Time with 3D Tilt & Drag */}
      <div style={{ perspective: 1400 }} className="w-full">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          style={{
            rotateX: tiltRotateX,
            rotateY: tiltRotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full overflow-hidden rounded-[32px] p-[1.5px] bg-gradient-to-r from-[#D4AF37]/35 via-border/50 dark:via-white/10 to-[#D4AF37]/25 shadow-2xl transition-shadow duration-500 hover:shadow-[#D4AF37]/10"
        >
          {/* Top Auto-Advance Timeline Line (Animated Fill) */}
          <div className="absolute top-0 inset-x-8 h-1 overflow-hidden rounded-t-[32px] z-30 pointer-events-none">
            <motion.div
              key={activeIndex}
              initial={{ width: '0%' }}
              animate={{ width: isHovered ? undefined : '100%' }}
              transition={{ duration: 6, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]"
            />
          </div>

          {/* Dynamic Cursor Light Glare Overlay */}
          <motion.div
            style={{
              left: glareSpotX,
              top: glareSpotY,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-[#D4AF37]/15 to-transparent blur-3xl pointer-events-none z-20"
          />

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentProduct.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) handleNext();
                else if (info.offset.x > 60) handlePrev();
              }}
              className="w-full rounded-[31px] bg-white dark:bg-[#161412] overflow-hidden cursor-grab active:cursor-grabbing"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                
                {/* Left Visual Half (lg:col-span-7) with Ken-Burns Motion & Counter Parallax */}
                <div className="lg:col-span-7 relative bg-[#F5F0E8] dark:bg-[#0E0D0C] overflow-hidden min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] flex flex-col justify-between p-5 sm:p-7 group">
                  <Link to={`/product/${currentProduct.sku}`} className="absolute inset-0 block overflow-hidden">
                    <motion.img
                      key={currentImage}
                      initial={{ scale: 1.1, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] as const }}
                      style={{
                        x: imageCounterX,
                        y: imageCounterY,
                      }}
                      src={currentImage}
                      alt={currentProduct.name}
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-106"
                    />
                    {/* Atmospheric Vignettes */}
                    <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/65 via-black/20 to-transparent pointer-events-none" />
                  </Link>

                  {/* Top Floating Glass Badges */}
                  <div className="relative z-10 flex items-center justify-between gap-2 pointer-events-none">
                    <motion.div
                      initial={{ opacity: 0, y: -14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {currentProduct.badge ? (
                        (() => {
                          const bCol = getBadgeColors(currentProduct.badge);
                          return (
                            <div
                              className="backdrop-blur-md text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full shadow-lg border"
                              style={{
                                backgroundColor: bCol.bg,
                                color: bCol.text,
                                borderColor: bCol.border || 'rgba(255,255,255,0.25)',
                              }}
                            >
                              {currentProduct.badge}
                            </div>
                          );
                        })()
                      ) : (
                        <div className="backdrop-blur-md bg-black/65 text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full shadow-lg">
                          Jorique Atelier
                        </div>
                      )}
                    </motion.div>

                    {hasDiscount && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15, type: 'spring' }}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-[#8E1B24] text-white text-[10px] font-bold tracking-wider uppercase shadow-lg border border-white/20"
                      >
                        {discountPercent}% OFF
                      </motion.span>
                    )}
                  </div>

                  {/* Bottom Overlay: AR Studio Pill & Image Dots */}
                  <div className="relative z-10 flex items-end justify-between gap-3 pt-24">
                    {/* Floating AR Studio Button with Pulsing Radar Ring */}
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onOpenAR(currentProduct);
                      }}
                      title="View in Your Room (AR Studio)"
                      className="px-4 py-2 rounded-full bg-black/85 hover:bg-[#D4AF37] text-white hover:text-black text-xs font-semibold backdrop-blur-md border border-[#D4AF37]/50 shadow-xl flex items-center gap-2 transition-all cursor-pointer group/ar"
                    >
                      <Camera size={14} className="text-[#D4AF37] group-hover/ar:text-black transition-colors" />
                      <span className="tracking-wider uppercase text-[10px] font-bold">AR Room Studio</span>
                    </motion.button>

                    {/* Multi-Image Thumbnail Switcher */}
                    {images.length > 1 && (
                      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 shadow-lg">
                        {images.slice(0, 4).map((imgUrl, imgIdx) => (
                          <button
                            key={imgIdx}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveImageIndex(imgIdx);
                            }}
                            className={`w-7 h-7 rounded-full overflow-hidden border transition-all ${
                              activeImageIndex === imgIdx
                                ? 'border-[#D4AF37] scale-110 shadow-md ring-2 ring-[#D4AF37]'
                                : 'border-white/30 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Details Half (lg:col-span-5) with Staggered Cascades */}
                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-[#FAF8F5] dark:bg-[#161412]">
                  <div className="space-y-4">
                    {/* Category Tracker Eyebrow */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C6A96B] dark:text-[#D4AF37]">
                        {currentProduct.category}
                      </span>
                      <span className="text-secondary/40 dark:text-white/30">•</span>
                      <span className="text-[10px] font-mono text-secondary dark:text-white/60">
                        {currentProduct.sku || 'JR-ATELIER'}
                      </span>
                    </motion.div>

                    {/* Product Title */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.16 }}
                    >
                      <Link to={`/product/${currentProduct.sku}`} className="block group/title">
                        <h4 className="text-2xl sm:text-3xl font-serif font-light text-primary dark:text-white leading-snug group-hover/title:text-[#C6A96B] dark:group-hover/title:text-[#D4AF37] transition-colors">
                          {currentProduct.name}
                        </h4>
                      </Link>
                    </motion.div>

                    {/* Overview excerpt */}
                    {parsed.overview && (
                      <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xs text-secondary dark:text-white/70 leading-relaxed line-clamp-2 font-light"
                      >
                        {parsed.overview}
                      </motion.p>
                    )}

                    {/* Compact Tabular Specifications Table with Staggered Row Animation */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.24 }}
                      className="pt-2"
                    >
                      <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold uppercase tracking-wider text-secondary dark:text-white/60">
                        <TableIcon size={12} className="text-[#C6A96B] dark:text-[#D4AF37]" />
                        <span>Specifications Table</span>
                      </div>

                      <div className="overflow-hidden rounded-xl border border-border/80 dark:border-[#2E2925] bg-white dark:bg-[#1C1A18] text-xs shadow-2xs">
                        <table className="w-full text-left border-collapse">
                          <tbody className="divide-y divide-border/60 dark:divide-white/5">
                            {keySpecs.length > 0 ? (
                              keySpecs.map((spec, idx) => (
                                <motion.tr
                                  key={idx}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.22 + idx * 0.05 }}
                                  className={idx % 2 === 0 ? 'bg-transparent' : 'bg-cream/30 dark:bg-white/[0.02]'}
                                >
                                  <td className="py-2 px-3 font-medium text-[11px] text-secondary/80 dark:text-white/60 w-2/5">
                                    {spec.key}
                                  </td>
                                  <td className="py-2 px-3 font-semibold text-[11px] text-primary dark:text-white w-3/5">
                                    {spec.value}
                                  </td>
                                </motion.tr>
                              ))
                            ) : (
                              <>
                                <motion.tr
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.24 }}
                                  className="bg-transparent"
                                >
                                  <td className="py-2 px-3 font-medium text-[11px] text-secondary/80 dark:text-white/60 w-2/5">
                                    Category
                                  </td>
                                  <td className="py-2 px-3 font-semibold text-[11px] text-primary dark:text-white w-3/5">
                                    {currentProduct.category}
                                  </td>
                                </motion.tr>
                                <motion.tr
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.28 }}
                                  className="bg-cream/30 dark:bg-white/[0.02]"
                                >
                                  <td className="py-2 px-3 font-medium text-[11px] text-secondary/80 dark:text-white/60 w-2/5">
                                    Heritage
                                  </td>
                                  <td className="py-2 px-3 font-semibold text-[11px] text-primary dark:text-white w-3/5">
                                    Handcrafted in India
                                  </td>
                                </motion.tr>
                                <motion.tr
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.32 }}
                                  className="bg-transparent"
                                >
                                  <td className="py-2 px-3 font-medium text-[11px] text-secondary/80 dark:text-white/60 w-2/5">
                                    Stock
                                  </td>
                                  <td className="py-2 px-3 font-semibold text-[11px] text-emerald-600 dark:text-emerald-400 w-3/5">
                                    Ready to Ship
                                  </td>
                                </motion.tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  </div>

                  {/* Price & Action Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 }}
                    className="pt-4 border-t border-border/70 dark:border-white/10 space-y-4"
                  >
                    {/* Price Row */}
                    <div className="flex items-baseline justify-between gap-4">
                      <div>
                        <div className="flex items-baseline gap-2.5">
                          <span className="text-2xl sm:text-3xl font-serif font-bold text-primary dark:text-white">
                            ₹{displayPrice.toLocaleString('en-IN')}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-secondary/60 dark:text-white/40 line-through font-sans">
                              ₹{originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-secondary/70 dark:text-white/50 font-sans tracking-wide">
                          All taxes included • Free Express Shipping
                        </span>
                      </div>

                      {/* In Stock Badge with Animated Radar Beacon */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/20">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>In Stock</span>
                      </div>
                    </div>

                    {/* Action Buttons with Light-Streak Shimmer */}
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleQuickAdd}
                        className={`relative overflow-hidden flex-1 h-11 px-5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer group/quickbtn ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-primary text-white hover:bg-primary/90 dark:bg-[#D4AF37] dark:text-black dark:hover:bg-[#E5C158]'
                        }`}
                      >
                        {/* Metallic light streak shimmer */}
                        <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover/quickbtn:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

                        {isAdded ? (
                          <>
                            <Check size={16} className="stroke-[2.5]" />
                            <span>Added to Bag ✓</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={15} />
                            <span>Add to Shopping Bag</span>
                          </>
                        )}
                      </motion.button>

                      <Link
                        to={`/product/${currentProduct.sku}`}
                        className="h-11 px-4 rounded-xl border border-border dark:border-white/15 bg-white dark:bg-[#1C1A18] text-primary dark:text-white hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all flex items-center justify-center gap-1.5 text-xs font-semibold shadow-xs"
                        title="View Complete Specifications"
                      >
                        <Eye size={14} />
                        <span className="hidden sm:inline">Details</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </motion.div>

                </div>

              </div>

              {/* Bottom Quick-Switch Thumbnail Rail with Product Avatars & Spring Highlight */}
              <div className="bg-[#F4EFE6] dark:bg-[#13110F] px-4 sm:px-6 py-3 border-t border-border/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary dark:text-white/60 flex items-center gap-1.5">
                  <Sparkles size={11} className="text-[#C6A96B] dark:text-[#D4AF37]" />
                  <span>Switch {category.label}:</span>
                </span>

                <div className="flex items-center gap-2 overflow-x-auto relative max-w-full pb-1 sm:pb-0">
                  {curatedProducts.map((p, idx) => {
                    const isSelected = idx === activeIndex;
                    const thumbImg = p.images?.[0] || '/placeholder-image.jpg';
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setDirection(idx > activeIndex ? 1 : -1);
                          setActiveIndex(idx);
                        }}
                        className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer z-10 shrink-0 ${
                          isSelected
                            ? 'text-white dark:text-black font-bold shadow-md'
                            : 'text-secondary dark:text-white/70 hover:text-primary dark:hover:text-white bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10'
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId={`activeCategoryPill-${category.key}`}
                            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                            className="absolute inset-0 rounded-full bg-primary dark:bg-[#D4AF37] shadow-sm -z-10"
                          />
                        )}
                        <img
                          src={thumbImg}
                          alt=""
                          className="w-5 h-5 rounded-full object-cover border border-black/20 dark:border-white/20"
                        />
                        <span className="max-w-[100px] sm:max-w-[140px] truncate">{p.name}</span>
                        <span className="text-[10px] opacity-75 font-mono">
                          ₹{(p.discount_price || p.price).toLocaleString('en-IN')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Main Showcase Component
// ---------------------------------------------------------
export default function Parallax3DShowcase() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [arProduct, setArProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadRealProducts() {
      try {
        const data = await productService.getProducts();
        if (data && data.length > 0) {
          setAllProducts(data);
        }
      } catch (err) {
        console.error('Failed to load products for carousels:', err);
      }
    }
    loadRealProducts();
  }, []);

  // Group real products into distinct category carousels
  const categoryRows: CategoryRow[] = useMemo(() => {
    if (allProducts.length === 0) return [];

    const map = new Map<string, CategoryRow>();
    const priorityOrder = ['suits', 'bedsheets', 'mattresses', 'pillows', 'towels'];

    allProducts.forEach((prod) => {
      if (!prod.images || prod.images.length === 0) return;

      const { key, label, tagline, categoryQuery } = normalizeCategory(prod.category);
      if (!map.has(key)) {
        map.set(key, { key, label, tagline, categoryQuery, products: [] });
      }
      map.get(key)!.products.push(prod);
    });

    const rows = Array.from(map.values());
    rows.sort((a, b) => {
      const aIdx = priorityOrder.indexOf(a.key);
      const bIdx = priorityOrder.indexOf(b.key);
      const prioA = aIdx === -1 ? 99 : aIdx;
      const prioB = bIdx === -1 ? 99 : bIdx;
      return prioA - prioB;
    });

    return rows;
  }, [allProducts]);

  if (categoryRows.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-transparent text-primary dark:text-white border-y border-border/80 dark:border-[#2E2925] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16 lg:space-y-24">
        
        {/* Main Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/80 dark:border-white/15 bg-white/40 dark:bg-white/5 backdrop-blur-md mb-3.5 shadow-xs">
              <Sparkles size={13} className="text-[#C6A96B] dark:text-[#D4AF37]" />
              <span className="text-[10px] font-bold tracking-[0.28em] uppercase text-secondary dark:text-[#D4AF37]">
                Curated Category Showcases
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light tracking-tight text-primary dark:text-white">
              Explore By Category
            </h2>
            <p className="text-secondary dark:text-white/60 text-xs sm:text-sm font-sans max-w-xl mt-2.5 leading-relaxed">
              Browse our handcrafted collections through full-width dedicated showcases for each product line.
            </p>
          </div>

          {/* Category Jump Navigation Chips */}
          <div className="flex flex-wrap gap-2">
            {categoryRows.map((row) => (
              <a
                key={row.key}
                href={`#category-${row.key}`}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-[#1C1A18] border border-border/70 dark:border-white/10 text-secondary dark:text-white/80 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all shadow-2xs"
              >
                {row.label}
              </a>
            ))}
          </div>
        </div>

        {/* Distinct Full-Width Carousel for Each Category (One Product Visible at a Time) */}
        <div className="space-y-16 lg:space-y-24">
          {categoryRows.map((category) => (
            <FullWidthCategoryCarousel
              key={category.key}
              category={category}
              onOpenAR={(prod) => setArProduct(prod)}
            />
          ))}
        </div>

      </div>

      {/* AR Studio Modal */}
      {arProduct && (
        <ViewInYourRoomModal
          product={arProduct}
          isOpen={!!arProduct}
          onClose={() => setArProduct(null)}
        />
      )}
    </section>
  );
}
