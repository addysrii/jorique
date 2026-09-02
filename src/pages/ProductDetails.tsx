import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, Truck, RefreshCw, Shield, ChevronLeft, ChevronRight, Check, Sparkles, Compass } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Parallax3DCard from '../components/Parallax3DCard';
import { productService } from '../lib/api/products'; 
import { Product } from '../types';

const shippingInfo = [
  { icon: <Truck size={15} strokeWidth={1.5} />, text: 'Free Express Shipping on orders above ₹1,999' },
  { icon: <RefreshCw size={15} strokeWidth={1.5} />, text: '15-Day Easy Returns & Exchange' },
  { icon: <Shield size={15} strokeWidth={1.5} />, text: '100% Heirloom Quality Guaranteed' },
];

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>(); // This is the SKU
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeImage, setActiveImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          setError('Product not found');
          return;
        }
        
        const data = await productService.getProductBySku(id);
        
        if (!data) {
          setError('Product not found');
          return;
        }

        setProduct(data);
        setActiveImage(0);

        // Fetch related products
        const allProducts = await productService.getProducts();
        const related = allProducts.filter((p) => p.id !== data.id && p.category === data.category).slice(0, 3);
        const fallback = allProducts.filter((p) => p.id !== data.id).slice(0, 3);
        setRelatedProducts(related.length >= 2 ? related : fallback);

      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-primary dark:border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs tracking-widest uppercase text-secondary dark:text-white/60">Loading Masterpiece...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <p className="text-secondary dark:text-white/60 mb-6">{error || 'Product not found'}</p>
          <Link
            to="/shop"
            className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-[#D4AF37] border-b border-primary dark:border-[#D4AF37] pb-1"
          >
            Return to Collection
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const discountPercentage =
    product.discount_price && product.discount_price < product.price
      ? Math.round(((product.price - product.discount_price) / product.price) * 100)
      : 0;

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB] transition-colors duration-300">
      <Navbar />

      <div className="pt-20 lg:pt-24">
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 border-b border-border/80 dark:border-[#2E2925]">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-secondary dark:text-white/60 hover:text-primary dark:hover:text-[#D4AF37] transition-colors duration-200"
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              Back
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-secondary dark:text-white/50">
              <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/shop')}>Catalog</span>
              <span>/</span>
              <span className="text-primary dark:text-white font-medium truncate max-w-[200px]">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Product Visualizer & Info Section */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Left Column: 3D Perspective Visualizer Stage (lg:col-span-7) */}
            <div className="lg:col-span-7">
              {/* Interactive hint */}
              <div className="flex items-center justify-between text-xs text-secondary/70 dark:text-white/50 mb-3 px-1">
                <span className="inline-flex items-center gap-1.5">
                  <Compass size={13} className="text-primary dark:text-[#D4AF37]" />
                  Interactive 3D Stage • Tilt & hover to inspect weave
                </span>
                <span className="text-[11px] font-mono">
                  {activeImage + 1} / {product.images.length}
                </span>
              </div>

              {/* 3D Visualizer Card */}
              <Parallax3DCard
                maxRotation={12}
                perspective={1400}
                glareEffect={true}
                scaleOnHover={1.01}
                className="w-full aspect-[4/5] sm:aspect-[1/1] rounded-3xl shadow-2xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] overflow-visible"
              >
                <div className="w-full h-full relative rounded-3xl overflow-hidden transform-style-3d bg-cream/30 dark:bg-black/40">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImage}
                      src={product.images[activeImage]}
                      alt={`${product.name} - view ${activeImage + 1}`}
                      className="w-full h-full object-cover will-change-transform brightness-[0.97] dark:brightness-[0.88]"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      style={{ transform: 'translateZ(0px)' }}
                    />
                  </AnimatePresence>

                  {/* 3D Floating Badge */}
                  {product.badge && (
                    <div
                      className="absolute top-5 left-5 bg-primary/95 dark:bg-[#D4AF37] dark:text-black backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full shadow-lg z-20 pointer-events-none"
                      style={{ transform: 'translateZ(40px)' }}
                    >
                      {product.badge}
                    </div>
                  )}

                  {/* 3D Discount Badge */}
                  {discountPercentage > 0 && (
                    <div
                      className="absolute top-5 right-5 bg-red-600 text-white text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full shadow-lg z-20 pointer-events-none"
                      style={{ transform: 'translateZ(40px)' }}
                    >
                      {discountPercentage}% OFF
                    </div>
                  )}

                  {/* 3D Layer Indicator */}
                  <div
                    className="absolute bottom-5 left-5 z-20 pointer-events-none hidden sm:block"
                    style={{ transform: 'translateZ(35px)' }}
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-light tracking-wider border border-white/10">
                      <Sparkles size={11} className="text-[#D4AF37]" />
                      High Density Weave
                    </div>
                  </div>

                  {/* Image Navigation Arrows */}
                  {product.images.length > 1 && (
                    <div
                      className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-30 pointer-events-auto"
                      style={{ transform: 'translateZ(45px)' }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        aria-label="Previous image"
                        className="p-3 bg-white/95 dark:bg-[#1A1816]/95 backdrop-blur-md text-primary dark:text-white rounded-full shadow-xl hover:bg-white hover:scale-110 transition-all"
                      >
                        <ChevronLeft size={16} strokeWidth={2} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        aria-label="Next image"
                        className="p-3 bg-white/95 dark:bg-[#1A1816]/95 backdrop-blur-md text-primary dark:text-white rounded-full shadow-xl hover:bg-white hover:scale-110 transition-all"
                      >
                        <ChevronRight size={16} strokeWidth={2} />
                      </button>
                    </div>
                  )}
                </div>
              </Parallax3DCard>

              {/* Thumbnails Strip */}
              {product.images.length > 1 && (
                <div className="flex gap-3.5 mt-5 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 shadow-sm ${
                        activeImage === i
                          ? 'border-primary dark:border-[#D4AF37] ring-2 ring-primary/20 dark:ring-[#D4AF37]/20 scale-105'
                          : 'border-transparent hover:border-border dark:hover:border-[#2E2925] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Info & Order Configuration (lg:col-span-5) */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 flex flex-col justify-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream dark:bg-white/5 text-secondary dark:text-[#D4AF37] text-[10px] font-semibold tracking-[0.25em] uppercase mb-4 w-fit border border-border dark:border-[#2E2925]">
                {product.category || 'Luxury Collection'}
              </div>

              <h1 className="text-3xl lg:text-4xl font-light text-primary dark:text-white leading-tight mb-4">
                {product.name}
              </h1>
              
              {/* Price Display with 3D elevation */}
              <div className="flex items-baseline gap-3 mb-6 p-4 rounded-2xl bg-cream/40 dark:bg-[#1A1816] border border-border/60 dark:border-[#2E2925]">
                {product.discount_price ? (
                  <>
                    <p className="text-3xl font-semibold text-primary dark:text-[#D4AF37]">
                      ₹ {product.discount_price.toLocaleString('en-IN')}
                    </p>
                    <p className="text-base text-secondary/60 dark:text-white/40 line-through">
                      ₹ {product.price.toLocaleString('en-IN')}
                    </p>
                    <span className="ml-auto text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-full">
                      Save ₹ {(product.price - product.discount_price).toLocaleString('en-IN')}
                    </span>
                  </>
                ) : (
                  <p className="text-3xl font-semibold text-primary dark:text-[#D4AF37]">
                    ₹ {product.price.toLocaleString('en-IN')}
                  </p>
                )}
              </div>

              {/* Stock status */}
              <div className="mb-6">
                {Number(product.quantity) > 0 ? (
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <Check size={13} strokeWidth={2.5} /> In Stock & Ready to Ship
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-1.5 rounded-full border border-rose-200 dark:border-rose-800">
                    <Check size={13} strokeWidth={2.5} /> Made to Order / Out of Stock
                  </span>
                )}
              </div>

              <p className="text-sm text-secondary dark:text-white/70 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Tags & Features */}
              {product.tags && product.tags.length > 0 && (
                <div className="mb-8 p-4 rounded-2xl bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925]">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary dark:text-white mb-3">
                    Craftsmanship Highlights
                  </h4>
                  <ul className="space-y-2.5">
                    {product.tags.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-xs text-secondary dark:text-white/70 font-medium">
                        <span className="w-4 h-4 rounded-full bg-cream dark:bg-white/10 flex items-center justify-center shrink-0">
                          <Check size={10} strokeWidth={2.5} className="text-primary dark:text-[#D4AF37]" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications Card */}
              <div className="border-t border-border dark:border-[#2E2925] pt-6 mb-8 grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-cream/30 dark:bg-[#1A1816] border border-border/60 dark:border-[#2E2925] text-center">
                  <span className="text-[10px] text-secondary dark:text-white/50 uppercase tracking-widest block mb-0.5">SKU</span>
                  <span className="text-xs font-semibold text-primary dark:text-white font-mono">{product.sku}</span>
                </div>
                <div className="p-3 rounded-xl bg-cream/30 dark:bg-[#1A1816] border border-border/60 dark:border-[#2E2925] text-center">
                  <span className="text-[10px] text-secondary dark:text-white/50 uppercase tracking-widest block mb-0.5">Origin</span>
                  <span className="text-xs font-semibold text-primary dark:text-white">{product.brand_id || 'Portugal'}</span>
                </div>
                <div className="p-3 rounded-xl bg-cream/30 dark:bg-[#1A1816] border border-border/60 dark:border-[#2E2925] text-center">
                  <span className="text-[10px] text-secondary dark:text-white/50 uppercase tracking-widest block mb-0.5">Year</span>
                  <span className="text-xs font-semibold text-primary dark:text-white">{product.year || '2026'}</span>
                </div>
              </div>

              {/* Shipping & Returns Perks */}
              <div className="border-t border-border dark:border-[#2E2925] pt-6 space-y-3">
                {shippingInfo.map((info) => (
                  <div key={info.text} className="flex items-center gap-3 text-secondary dark:text-white/70 text-xs">
                    <div className="w-7 h-7 rounded-lg bg-cream dark:bg-white/10 flex items-center justify-center text-primary dark:text-[#D4AF37] shrink-0">
                      {info.icon}
                    </div>
                    <span className="tracking-wide font-medium">{info.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* 3D Related Products Grid */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-border dark:border-[#2E2925] py-16 lg:py-24 px-6 bg-warm-white dark:bg-[#0D0B0A] transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-xs font-medium tracking-[0.3em] uppercase text-secondary dark:text-[#D4AF37] mb-3">
                  Complementary Textures
                </p>
                <h2 className="text-2xl sm:text-3xl font-light text-primary dark:text-white tracking-wide">
                  You Might Also Admire
                </h2>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
                {relatedProducts.map((p, index) => (
                  <ProductCard key={p.id} product={p} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}