import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, ShoppingBag, Heart, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productService } from '../../lib/api/products';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface CuratedExhibit {
  id: string;
  sku: string;
  name: string;
  category: string;
  collectionTier: 'essential' | 'signature' | 'luxe';
  tierLabel: string;
  tierColor: string;
  price: number;
  discount_price?: number;
  image: string;
  weaveDetail: string;
}

// Fallback exhibits reflecting real JORIQUE product archive
const FALLBACK_EXHIBITS: CuratedExhibit[] = [
  {
    id: 'f-1',
    sku: 'JR-BED-2026-001',
    name: 'Air-Washed Pure Cotton Bed Sanctuary',
    category: 'Bedsheet',
    collectionTier: 'essential',
    tierLabel: 'Essential',
    tierColor: '#7A8B72',
    price: 2999,
    image: '/Products/2.jpg',
    weaveDetail: '100% Certified Long-Staple Cotton • Percale',
  },
  {
    id: 'f-2',
    sku: 'JR-SIR-WU-001',
    name: 'Premium Ghatchola Dola Silk Unstitched Suit',
    category: 'Suits',
    collectionTier: 'signature',
    tierLabel: 'Signature',
    tierColor: '#243B64',
    price: 2999,
    image: '/Products/3.jpg',
    weaveDetail: 'Fine Dola Silk Jacquard • Hand-Loomed',
  },
  {
    id: 'f-3',
    sku: 'JR-LUX-WU-001',
    name: 'Designer Raw Silk Suite - Royal Navy Blue',
    category: 'Suits',
    collectionTier: 'luxe',
    tierLabel: 'Luxe',
    tierColor: '#641F2D',
    price: 4299,
    image: '/images/collections/signature.jpg',
    weaveDetail: 'Couture Mulberry Silk • Liquid Sheen Finish',
  },
  {
    id: 'f-4',
    sku: 'JR-PIL-2026-001',
    name: 'Botanical Gold Embroidered Cushion Pair',
    category: 'Cushion Cover',
    collectionTier: 'essential',
    tierLabel: 'Essential',
    tierColor: '#7A8B72',
    price: 1223,
    image: '/Products/1.jpg',
    weaveDetail: 'Natural Linen & Cotton Blend • Mitered Flange',
  },
  {
    id: 'f-5',
    sku: 'JR-TOW-2026-001',
    name: 'Cloud-Woven Waffle Plush Bath Linen',
    category: 'Towel',
    collectionTier: 'signature',
    tierLabel: 'Signature',
    tierColor: '#243B64',
    price: 2999,
    image: '/images/luxury-products/towel_clean.png',
    weaveDetail: '700 GSM Zero-Twist Organic Cotton',
  },
  {
    id: 'f-6',
    sku: 'JR-ESS-WU-004',
    name: 'Designer Bandhani Digital Unstitched Suit',
    category: 'Suits',
    collectionTier: 'essential',
    tierLabel: 'Essential',
    tierColor: '#7A8B72',
    price: 1999,
    image: '/Products/4.jpg',
    weaveDetail: 'Artisanal Bandhani Loom • Natural Dye',
  },
  {
    id: 'f-7',
    sku: 'JR-LUX-BED-002',
    name: 'Velvet Wine Liquid Sateen Presidential Set',
    category: 'Bedsheet',
    collectionTier: 'luxe',
    tierLabel: 'Luxe',
    tierColor: '#641F2D',
    price: 6499,
    image: '/images/collections/luxe.jpg',
    weaveDetail: '800 Thread Count Liquid Mirror Sateen',
  },
  {
    id: 'f-8',
    sku: 'JR-ESS-WU-001',
    name: 'Designer Ajrak Digital Unstitched Ensemble',
    category: 'Suits',
    collectionTier: 'essential',
    tierLabel: 'Essential',
    tierColor: '#7A8B72',
    price: 1999,
    image: '/Products/5.jpg',
    weaveDetail: 'Heritage Ajrak Block Motif • Breathable Weave',
  },
];

const CATEGORY_TABS = [
  { id: 'all', label: 'All Exhibits' },
  { id: 'bedsheet', label: 'Bedding Sanctuary' },
  { id: 'suits', label: 'Tailored Suits' },
  { id: 'cushion', label: 'Cushions & Covers' },
  { id: 'towel', label: 'Towels & Bath' },
];

export default function ProductExhibitionSection() {
  const [exhibits, setExhibits] = useState<CuratedExhibit[]>(FALLBACK_EXHIBITS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const dbProducts = await productService.getProducts();
        if (dbProducts && dbProducts.length > 0) {
          const mapped: CuratedExhibit[] = dbProducts.map((p, idx) => {
            const skuUpper = (p.sku || '').toUpperCase();
            let tier: 'essential' | 'signature' | 'luxe' = 'essential';
            let tierLabel = 'Essential';
            let tierColor = '#7A8B72';

            if (skuUpper.includes('SIR') || skuUpper.includes('SIGNATURE')) {
              tier = 'signature';
              tierLabel = 'Signature';
              tierColor = '#243B64';
            } else if (skuUpper.includes('LUX') || skuUpper.includes('LUXE') || p.price > 4000) {
              tier = 'luxe';
              tierLabel = 'Luxe';
              tierColor = '#641F2D';
            }

            const img = (Array.isArray(p.images) && p.images.length > 0 && p.images[0])
              ? p.images[0]
              : FALLBACK_EXHIBITS[idx % FALLBACK_EXHIBITS.length].image;

            return {
              id: p.id,
              sku: p.sku || `JR-${idx + 1}`,
              name: p.name,
              category: p.category,
              collectionTier: tier,
              tierLabel,
              tierColor,
              price: p.price,
              discount_price: p.discount_price,
              image: img,
              weaveDetail: p.description?.slice(0, 50) || 'Fine Certified Organic Weave',
            };
          });

          // Merge db products with high-res editorial fallbacks for balanced presentation
          setExhibits(mapped.length >= 6 ? mapped : [...mapped, ...FALLBACK_EXHIBITS.slice(mapped.length)]);
        }
      } catch (err) {
        console.warn('Exhibition load fallback:', err);
      }
    };
    loadProducts();
  }, []);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleQuickAdd = (exhibit: CuratedExhibit, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const mockProduct: Product = {
      id: exhibit.id,
      sku: exhibit.sku,
      name: exhibit.name,
      category: exhibit.category,
      price: exhibit.price,
      discount_price: exhibit.discount_price,
      quantity: 10,
      description: exhibit.weaveDetail,
      images: [exhibit.image],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addToCart(mockProduct, 1);
    setAddedItem(exhibit.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  const filteredExhibits = exhibits.filter((item) => {
    if (selectedCategory === 'all') return true;
    const cat = (item.category || '').toLowerCase();
    if (selectedCategory === 'bedsheet') return cat.includes('bed');
    if (selectedCategory === 'suits') return cat.includes('suit');
    if (selectedCategory === 'cushion') return cat.includes('cushion') || cat.includes('pillow') || cat.includes('cover');
    if (selectedCategory === 'towel') return cat.includes('towel') || cat.includes('bath');
    return true;
  });

  return (
    <section 
      id="exhibition" 
      className="py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] dark:bg-[#100E0D] text-primary dark:text-[#FCFAF7] transition-colors duration-500 border-t border-[#E8DFD3] dark:border-[#2E2925]"
    >
      <div className="max-w-[1440px] mx-auto space-y-12 sm:space-y-16">
        
        {/* Exhibition Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[#E8DFD3] dark:border-[#2E2925] pb-10">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-[#C6A96B]/30 text-[#851C25] dark:text-[#D4AF37] text-[10px] sm:text-[11px] font-mono tracking-[0.3em] uppercase shadow-xs">
              <Sparkles size={12} className="text-[#C6A96B]" />
              <span>THE JORIQUE EXHIBITION</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-primary dark:text-white leading-[1.1]">
              Exhibition of Tactile Form & Craft
            </h2>

            <p className="text-xs sm:text-sm text-secondary dark:text-white/70 font-light leading-relaxed max-w-xl">
              An atelier curation of our finest weaves, architectural silhouettes, and everyday luxuries — displayed across Essential, Signature, and Luxe collections.
            </p>
          </div>

          {/* Collection Tier Legend */}
          <div className="flex items-center gap-4 text-[10px] font-mono tracking-widest uppercase text-secondary dark:text-white/60">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7A8B72]" />
              <span>Essential</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#243B64]" />
              <span>Signature</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#641F2D]" />
              <span>Luxe</span>
            </span>
          </div>
        </div>

        {/* Gallery Salon Filter Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white dark:bg-[#C6A96B] dark:text-black shadow-md'
                    : 'bg-white/60 dark:bg-white/5 text-secondary dark:text-white/70 hover:text-primary dark:hover:text-white border border-[#E8DFD3] dark:border-[#332922]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Gallery Exhibition Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredExhibits.map((exhibit, idx) => (
              <motion.div
                layout
                key={exhibit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                className="group relative flex flex-col justify-between rounded-3xl overflow-hidden bg-white/75 dark:bg-[#1C1613] border border-[#E8DFD3] dark:border-[#332922] shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                {/* Visual Showcase Frame */}
                <Link to={`/product/${exhibit.sku || exhibit.id}`} className="block relative aspect-[4/5] overflow-hidden bg-[#F5EDE3]/60 dark:bg-[#14100D]">
                  <img
                    src={exhibit.image}
                    alt={exhibit.name}
                    className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out select-none"
                    loading="lazy"
                  />
                  
                  {/* Subtle Top-to-Bottom Shadow Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20 opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none" />

                  {/* Top-Left Tier Pill Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-mono tracking-[0.2em] uppercase text-white shadow-md font-semibold backdrop-blur-xs"
                      style={{ backgroundColor: exhibit.tierColor }}
                    >
                      {exhibit.tierLabel}
                    </span>
                  </div>

                  {/* Top-Right Wishlist Toggle */}
                  <button
                    onClick={(e) => toggleWishlist(exhibit.id, e)}
                    aria-label="Wishlist"
                    className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-white/85 dark:bg-black/60 backdrop-blur-md flex items-center justify-center text-primary dark:text-white shadow-md hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Heart
                      size={14}
                      className={wishlist[exhibit.id] ? 'fill-[#851C25] text-[#851C25]' : 'text-current'}
                    />
                  </button>

                  {/* Exhibit Number Watermark (Bottom Right) */}
                  <div className="absolute bottom-3 right-3.5 z-10">
                    <span className="text-[9px] font-mono tracking-widest text-white/85 uppercase drop-shadow">
                      EXHIBIT {idx < 9 ? `0${idx + 1}` : idx + 1}
                    </span>
                  </div>
                </Link>

                {/* Museum Exhibition Placard Content */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-secondary dark:text-white/60">
                      <span>{exhibit.category}</span>
                      <span className="text-[#C6A96B] font-semibold">{exhibit.sku}</span>
                    </div>

                    <Link to={`/product/${exhibit.sku || exhibit.id}`} className="block group-hover:text-[#851C25] dark:group-hover:text-[#C6A96B] transition-colors">
                      <h3 className="font-serif text-lg sm:text-xl font-normal text-primary dark:text-white leading-snug line-clamp-2">
                        {exhibit.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-secondary dark:text-white/60 font-light line-clamp-1">
                      {exhibit.weaveDetail}
                    </p>
                  </div>

                  {/* Pricing & Quick Bag Action */}
                  <div className="pt-3 border-t border-[#E8DFD3] dark:border-[#332922] flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono tracking-wider text-secondary dark:text-white/50 uppercase block">
                        Price
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base sm:text-lg font-serif font-medium text-primary dark:text-white">
                          ₹{(exhibit.discount_price || exhibit.price).toLocaleString('en-IN')}
                        </span>
                        {exhibit.discount_price && (
                          <span className="text-xs text-secondary/60 line-through">
                            ₹{exhibit.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Add To Bag Pill */}
                    <button
                      onClick={(e) => handleQuickAdd(exhibit, e)}
                      aria-label="Add to Bag"
                      className="px-3.5 py-2 rounded-full border border-[#E8DFD3] dark:border-[#332922] bg-white/80 dark:bg-white/5 hover:bg-[#1A1A1A] hover:text-white dark:hover:bg-[#C6A96B] dark:hover:text-black text-primary dark:text-white text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {addedItem === exhibit.id ? (
                        <>
                          <Check size={13} className="text-[#7A8B72]" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={13} />
                          <span>Curate</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Callout: Explore Full Archive */}
        <div className="pt-8 text-center">
          <Link to="/shop">
            <button className="group inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-full bg-[#1A1A1A] hover:bg-[#851C25] dark:bg-[#C6A96B] dark:hover:bg-[#E5C158] text-white dark:text-black text-xs font-semibold uppercase tracking-[0.25em] transition-all duration-300 shadow-xl cursor-pointer">
              <span>EXPLORE COMPLETE ATELIER ARCHIVE</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
