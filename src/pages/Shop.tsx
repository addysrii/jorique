import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, X, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { productService } from '../lib/api/products';
import { Product } from '../types';

const categories = ['All', 'Bedsheets', 'Home Decor', 'Bath', 'Kitchen', 'Accessories'];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products when category or search changes
  useEffect(() => {
    let filtered = products;

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.sku && p.sku.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setShowMobileFilters(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB]">
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
    <div className="min-h-screen bg-background dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB] transition-colors duration-300">
      <Navbar />

      <div className="pt-20 lg:pt-24">
        {/* Parallax Atmospheric Header */}
        <div className="relative overflow-hidden bg-cream/70 dark:bg-[#0D0B0A] text-primary dark:text-white py-14 lg:py-20 px-6 border-b border-border/80 dark:border-[#2E2925] transition-colors duration-300">
          <div className="absolute inset-0 opacity-15 dark:opacity-20 pointer-events-none bg-[radial-gradient(#8D867F_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/10 dark:bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto lg:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-border dark:border-white/15 text-[11px] font-bold tracking-[0.3em] uppercase text-primary dark:text-[#D4AF37] mb-3 shadow-sm">
                <Sparkles size={12} className="text-[#D4AF37]" />
                Curated Living Catalog
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-primary dark:text-white tracking-wide">
                All Collections
              </h1>
              <p className="text-secondary dark:text-white/70 text-sm sm:text-base font-light mt-3 leading-relaxed">
                Discover bespoke bedding, artisanal decor, and textural essentials designed to elevate your everyday living.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-10">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search products, fabrics, collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-2xl text-sm focus:outline-none focus:border-primary dark:focus:border-[#D4AF37] text-primary dark:text-[#F5F2EB] placeholder:text-secondary/60 dark:placeholder:text-white/40 shadow-sm transition-all"
              />
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary dark:text-white/50" />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary dark:text-white/50 hover:text-primary dark:hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* 3D Category Pills - Desktop */}
            <div className="hidden lg:flex items-center gap-2 bg-cream/60 dark:bg-[#1A1816] p-1.5 rounded-2xl border border-border dark:border-[#2E2925]">
              {categories.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-200 relative ${
                      isSelected
                        ? 'text-white dark:text-black shadow-md'
                        : 'text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeShopCategory"
                        className="absolute inset-0 bg-primary dark:bg-[#D4AF37] rounded-xl"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{category}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center justify-between gap-2 px-5 py-3 bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-2xl text-sm shadow-sm"
            >
              <span className="flex items-center gap-2 text-primary dark:text-white">
                <Filter size={15} /> Filter: <strong className="text-primary dark:text-[#D4AF37]">{selectedCategory}</strong>
              </span>
            </button>
          </div>

          {/* Mobile Filters Accordion */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden flex flex-wrap gap-2 mb-8 pb-6 border-b border-border dark:border-[#2E2925]"
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-primary dark:bg-[#D4AF37] text-white dark:text-black shadow-md'
                        : 'bg-cream dark:bg-white/5 text-secondary dark:text-white/70 hover:bg-cream/80'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-xs font-semibold tracking-wider uppercase text-secondary dark:text-white/60">
              Showing {filteredProducts.length} Crafted Product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* 3D Products Grid */}
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-10 h-10 border-2 border-primary dark:border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-[#1A1816] rounded-3xl border border-dashed border-border dark:border-[#2E2925] p-12">
              <p className="text-primary dark:text-white text-base font-medium mb-1">No matching products found</p>
              <p className="text-xs text-secondary dark:text-white/60 mb-6">Try searching with different keywords or reset category filters</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-[#D4AF37] border-b border-primary dark:border-[#D4AF37] pb-0.5"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}