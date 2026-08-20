import { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Layers, Clock, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import FeatureCard from '../components/FeatureCard';
import { products } from '../data/products';

const categories = ['All', 'Bedsheets', 'Towels', 'Cushions', 'Blankets', 'Bathrobes'];

const features = [
  {
    icon: <Layers size={20} strokeWidth={1.5} />,
    title: 'Premium Fabric',
    description: 'Sourced from the finest mills around the world, our textiles are made to last and delight.',
  },
  {
    icon: <Clock size={20} strokeWidth={1.5} />,
    title: 'Timeless Design',
    description: 'Every piece is designed with a timeless Scandinavian aesthetic that fits any interior style.',
  },
  {
    icon: <Heart size={20} strokeWidth={1.5} />,
    title: 'Everyday Comfort',
    description: 'Engineered for daily use, our products maintain their softness and shape wash after wash.',
  },
];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 lg:pt-40 lg:pb-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-secondary mb-4">
            Our Collection
          </p>
          <h1 className="text-3xl lg:text-5xl font-light text-primary tracking-wide">
            All Products
          </h1>
        </motion.div>
      </section>

      {/* Filter bar */}
      <section className="px-6 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <SlidersHorizontal size={14} strokeWidth={1.5} className="text-secondary mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full border transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-secondary border-border hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8"
          >
            {filtered.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-secondary text-sm tracking-wide">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="pb-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center py-16 lg:py-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-secondary mb-4">
              The JORIQUE Standard
            </p>
            <h2 className="text-2xl lg:text-3xl font-light text-primary">
              Why Choose JORIQUE
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
