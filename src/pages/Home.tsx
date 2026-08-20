import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, RefreshCw, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { productService } from '../lib/api/products';
import { Product } from '../types';

const HERO_IMAGE = '/images/hero.png';

const perks = [
  { icon: <Truck size={16} strokeWidth={1.5} />, label: 'Free Shipping' },
  { icon: <RefreshCw size={16} strokeWidth={1.5} />, label: '15 Day Returns' },
  { icon: <Shield size={16} strokeWidth={1.5} />, label: 'Quality Guarantee' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch only 3 products for featured section
        const products = await productService.getFeaturedProducts(3);
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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
          <p className="text-secondary mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary border-b border-primary pb-0.5 text-sm font-medium"
          >
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Luxury bedroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/55" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/70 text-xs font-medium tracking-[0.35em] uppercase mb-6"
          >
            Luxury Home Textiles
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-white text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-[0.15em] uppercase mb-6"
          >
            JORIQUE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/90 text-lg sm:text-xl font-light tracking-wide mb-3"
          >
            Where Comfort Meets Design
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/60 text-sm font-light max-w-xs mb-10 leading-relaxed"
          >
            Premium bedding crafted for the modern home
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/shop">
              <Button size="lg">Shop Collection</Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <motion.div
            className="w-px h-12 bg-white/40"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top' }}
          />
        </motion.div>
      </section>

      {/* Perks bar */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center justify-center gap-8 lg:gap-16 flex-wrap">
            {perks.map((perk) => (
              <div key={perk.label} className="flex items-center gap-2 text-secondary">
                {perk.icon}
                <span className="text-xs font-medium tracking-widest uppercase">{perk.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tagline */}
      <section className="py-20 lg:py-28 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-secondary mb-5">
            Our Promise
          </p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-light text-primary max-w-2xl mx-auto leading-relaxed">
            Designed to bring comfort,<br className="hidden sm:block" /> crafted to elevate your everyday living.
          </p>
        </motion.div>
      </section>

      {/* Featured Products - Only 3 Products */}
      <section className="pb-24 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-secondary mb-3">
              Curated Selection
            </p>
            <h2 className="text-2xl lg:text-3xl font-light text-primary tracking-wide">
              Featured Products
            </h2>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <p className="text-center text-secondary py-12">No products available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8 max-w-5xl mx-auto">
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
              <button className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-primary border-b border-primary/30 pb-0.5 hover:border-primary transition-colors duration-200">
                View All Products
                <ArrowRight size={12} strokeWidth={1.5} />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/Products/1.jpg"
            alt="Transform your space"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/75" />
        </div>
        <div className="relative z-10 py-28 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-white/60 text-xs font-medium tracking-[0.3em] uppercase mb-5">
              Elevate Your Space
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-wide mb-8">
              Transform Your Space Today
            </h2>
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 bg-white text-primary text-xs font-medium tracking-widest uppercase px-10 py-4 hover:bg-cream transition-colors duration-200"
              >
                Shop Now
                <ArrowRight size={14} strokeWidth={1.5} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-6 bg-warm-white">
        <motion.div
          className="max-w-lg mx-auto text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-secondary mb-4">
            Newsletter
          </p>
          <h2 className="text-2xl font-light text-primary mb-3">
            Join the JORIQUE Community
          </h2>
          <p className="text-sm text-secondary mb-8 leading-relaxed">
            Be the first to know about new collections, exclusive offers, and interior inspiration.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 max-w-full">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full flex-1 border border-border sm:border-r-0 px-4 sm:px-5 py-3.5 text-sm text-text placeholder:text-secondary/50 bg-white focus:outline-none focus:border-primary transition-colors duration-200"
            />
            <button className="w-full sm:w-auto bg-primary text-white text-xs font-medium tracking-widest uppercase px-6 py-3.5 hover:bg-[#2a2623] transition-colors duration-200 whitespace-nowrap shrink-0">
              Subscribe
            </button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}