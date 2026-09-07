import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { ArrowRight, Truck, RefreshCw, Shield, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import Parallax3DShowcase from '../components/Parallax3DShowcase';
import Spatial3DCarousel from '../components/Spatial3DCarousel';
import FabricExploded3D from '../components/FabricExploded3D';
import AtelierParallaxThemes from '../components/AtelierParallaxThemes';
import PopOutProductDeck from '../components/PopOutProductDeck';
import CraftsmanshipHeritageSection from '../components/CraftsmanshipHeritageSection';
import HandcraftedFloralBackground, { HandcraftedFloralDivider } from '../components/HandcraftedFloralBackground';
import { productService } from '../lib/api/products';
import { Product } from '../types';

const HERO_IMAGE = '/images/hero.png';
const HERO_VIDEO = '/videos/bedsheet-spread.mp4';

const perks = [
  { icon: <Truck size={18} strokeWidth={1.5} />, title: 'Free Express Shipping', label: 'On all orders above ₹1,999' },
  { icon: <ShieldCheck size={18} strokeWidth={1.5} />, title: 'Pre-Dispatch Inspected', label: '48-Hour defect exchange guarantee' },
  { icon: <Shield size={18} strokeWidth={1.5} />, title: 'Heirloom Quality Guarantee', label: '100% Certified Organic Fibers' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hero Section 3D Mouse Parallax
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const heroSpringConfig = { stiffness: 140, damping: 18, mass: 0.6 };
  const smoothHeroX = useSpring(mouseX, heroSpringConfig);
  const smoothHeroY = useSpring(mouseY, heroSpringConfig);

  // Multi-axis 3D transforms for hero layers
  const bgTranslateX = useTransform(smoothHeroX, [-0.5, 0.5], ['-35px', '35px']);
  const bgTranslateY = useTransform(smoothHeroY, [-0.5, 0.5], ['-35px', '35px']);
  const bgScale = useTransform(smoothHeroX, [-0.5, 0.5], [1.1, 1.1]);

  // Flashlight aura position
  const flashlightX = useTransform(smoothHeroX, [-0.5, 0.5], ['20%', '80%']);
  const flashlightY = useTransform(smoothHeroY, [-0.5, 0.5], ['20%', '80%']);

  const flashlightBackground = useTransform(
    [flashlightX, flashlightY],
    ([x, y]) =>
      `radial-gradient(circle 500px at ${x} ${y}, rgba(212, 175, 55, 0.18) 0%, rgba(196, 164, 130, 0.08) 40%, transparent 80%)`
  );

  // Scroll parallax for home hero
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroTextY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleHeroMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const products = await productService.getFeaturedProducts(6);
        setFeaturedProducts(products);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-background dark:bg-[#12100E] text-primary dark:text-[#FCFAF7] transition-colors duration-300">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
          <p className="text-secondary dark:text-white/60 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary dark:text-[#D4AF37] border-b border-primary dark:border-[#D4AF37] pb-0.5 text-sm font-medium"
          >
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-[#12100E] text-primary dark:text-[#FCFAF7] overflow-hidden transition-colors duration-300">
      <Navbar />

      {/* 🌸 Handcrafted Artisanal Floral & Botanical Background Tapestry */}
      <HandcraftedFloralBackground variant="full" showFloatingPetals={true} />

      {/* 🌌 CRAZY 3D MULTI-LAYER SPATIAL HERO */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative z-20 h-screen min-h-[720px] overflow-hidden select-none perspective-2000 bg-[#0E0D0C]"
      >
        {/* Layer 0: Real-time 3D Dynamic Ambient Flashlight Aura */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: flashlightBackground,
          }}
        />

        {/* Layer 1: 3D Depth Background with Mouse Tracking Velocity */}
        <motion.div
          className="absolute -inset-16 will-change-transform"
          style={{
            x: bgTranslateX,
            y: bgTranslateY,
            scale: bgScale,
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={HERO_IMAGE}
            className="w-full h-full object-cover brightness-[0.82] contrast-[1.08] pointer-events-none"
          >
            <source src={HERO_VIDEO} type="video/mp4" />
            <img
              src={HERO_IMAGE}
              alt="Luxury bedsheet spreading"
              className="w-full h-full object-cover brightness-[0.82] contrast-[1.1]"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/85 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />
        </motion.div>

        {/* Layer 2: Foreground 3D Spatial Typography */}
        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6 transform-style-3d"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-mainlogo text-white text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-[0.20em] uppercase mb-4 sm:mb-6 drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
          >
            JORIQUE
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="h-[1px] w-28 sm:w-40 bg-[#C6A96B] mb-5 sm:mb-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-white/95 text-xl sm:text-2xl md:text-3xl font-semibold tracking-[0.08em] mb-2 sm:mb-3 max-w-xl drop-shadow-lg px-2"
          >
            Where Comfort Meets Design.
          </motion.p>

          {/* <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-white/75 text-xs sm:text-sm md:text-base font-normal max-w-md mb-8 sm:mb-10 leading-relaxed drop-shadow px-2"
          >
            Meticulously engineered home textiles crafted for beautiful living.
          </motion.p> */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0 max-w-xs sm:max-w-none py-8"
          >
            <Link to="/shop" className="w-full sm:w-auto top-4">
              <Button size="lg" className="w-full sm:w-auto shadow-2xl hover:shadow-white/30 transition-all font-semibold uppercase tracking-widest text-xs px-8 sm:px-9 py-3.5 sm:py-4">
                Explore Collection
              </Button>
            </Link>
            <Link to="/about" className="w-full sm:w-auto ">
              <button className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 margintop rounded-xl border border-white/25 bg-black/30 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all duration-300 text-xs font-semibold uppercase tracking-widest">
                Our Weave Philosophy
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {/* <span className="text-[10px] text-white/50 uppercase tracking-widest">Explore Parallax</span> */}
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-[#D4AF37] to-transparent"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top' }}
          />
        </motion.div>
      </section>

      {/* 🎬 Scroll-Driven Video Parallax Section */}
      {/* <ScrollVideoSection /> */}

      {/* Perks bar with 3D Float Cards */}
      <section className="bg-transparent border-b border-border/80 dark:border-[#2E2925] relative z-20 py-8 px-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-xs border border-border/70 dark:border-[#2E2925] hover:border-primary/20 dark:hover:border-[#D4AF37]/30 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-white/80 dark:bg-[#201D1B] flex items-center justify-center text-primary dark:text-[#D4AF37] shadow-sm shrink-0">
                  {perk.icon}
                </div>
                <div>
                  <h4 className="text-xs font-semibold tracking-wider uppercase text-primary dark:text-white mb-0.5">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-secondary dark:text-white/60">{perk.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🌌 3D SPATIAL CURVED CAROUSEL SHOWCASE */}
      <Spatial3DCarousel />

      {/* 👑 INTERACTIVE 3D LOOKBOOK ROOM STAGE */}
      <Parallax3DShowcase />

      {/* 📜 WHY JORIQUE: CRAFTSMANSHIP, THREAD COUNTS & 48-HR VIDEO GUARANTEE */}
      {/* <CraftsmanshipHeritageSection /> */}

      {/* Featured Products with 3D Parallax Tilt Cards */}
      <section className="py-24 lg:py-32 px-6 transition-colors duration-300 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Handcrafted Floral Filigree Ornament */}
            <div className="flex items-center justify-center gap-3 mb-3 text-[#C6A96B]">
              <span className="w-10 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#C6A96B]/60" />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
                <path d="M12 2 C10 6, 6 10, 2 12 C6 14, 10 18, 12 22 C14 18, 18 14, 22 12 C18 10, 14 6, 12 2 Z" />
              </svg>
              <span className="w-10 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#C6A96B]/60" />
            </div>

            <p className="text-xs font-medium tracking-[0.3em] uppercase text-secondary dark:text-[#D4AF37] mb-2">
              Curated Selection
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-light text-primary dark:text-white tracking-wide uppercase">
              Featured Products
            </h2>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-black/5 dark:bg-white/5 aspect-[4/5] animate-pulse border border-border/50 dark:border-white/5" />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <p className="text-center text-secondary dark:text-white/60 py-12">No products available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}

          <motion.div
            className="text-center mt-14"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/shop">
              <button className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-primary dark:text-[#D4AF37] border-b border-primary/30 dark:border-[#D4AF37]/40 pb-0.5 hover:border-primary dark:hover:border-[#D4AF37] transition-colors duration-200">
                View All Products
                <ArrowRight size={12} strokeWidth={1.5} />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Luxury CTA Banner */}
      <section className="py-12 px-6 max-w-7xl mx-auto bg-transparent">
        <div className="relative rounded-3xl overflow-hidden py-24 lg:py-32 px-6 text-center bg-primary dark:bg-[#1A1816] border border-border/20 dark:border-[#2E2925] shadow-2xl">
          <div className="absolute inset-0">
            <img
              src={featuredProducts[0]?.images?.[0] || '/Products/1.jpg'}
              alt="Transform your space"
              className="w-full h-full object-cover opacity-35 dark:opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/75" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#D4AF37] text-xs font-semibold tracking-[0.3em] uppercase mb-4"
            >
              Elevate Your Space
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-wide mb-8 leading-tight drop-shadow-lg"
            >
              Transform Your Space Today
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 bg-white dark:bg-[#D4AF37] text-primary dark:text-black text-xs font-bold tracking-widest uppercase px-10 py-4 rounded-xl hover:bg-cream shadow-xl hover:shadow-white/20 transition-all duration-200"
                >
                  Shop Now
                  <ArrowRight size={14} strokeWidth={1.5} />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6 bg-transparent border-t border-border/60 dark:border-[#2E2925] transition-colors duration-300">
        <motion.div
          className="max-w-lg mx-auto text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-secondary dark:text-[#D4AF37] mb-4">
            Newsletter
          </p>
          <h2 className="text-2xl font-light text-primary dark:text-white mb-3">
            Join the JORIQUE Community
          </h2>
          <p className="text-sm text-secondary dark:text-white/60 mb-8 leading-relaxed">
            Be the first to know about new collections, exclusive offers, and interior inspiration.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 max-w-full shadow-sm rounded-xl overflow-hidden">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full flex-1 border border-border dark:border-[#2E2925] sm:border-r-0 px-4 sm:px-5 py-3.5 text-sm text-text dark:text-white placeholder:text-secondary/50 dark:placeholder:text-white/40 bg-white dark:bg-[#1F1C1A] focus:outline-none focus:border-primary dark:focus:border-[#D4AF37] transition-colors duration-200"
            />
            <button className="w-full sm:w-auto bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold tracking-widest uppercase px-6 py-3.5 hover:bg-[#2a2623] dark:hover:bg-[#E5C158] transition-colors duration-200 whitespace-nowrap shrink-0">
              Subscribe
            </button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}