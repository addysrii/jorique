import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, X, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { productService } from '../lib/api/products';
import { Product } from '../types';
import ShopDealsBannerCarousel from '../components/ShopDealsBannerCarousel';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
  }, [categoryParam]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [prodData, catRes] = await Promise.all([
          productService.getProducts(),
          supabase.from('categories').select('name').order('name'),
        ]);

        setProducts(prodData);
        setFilteredProducts(prodData);

        // Derive unique real categories from DB and active products
        const dbCatNames = (catRes.data || []).map((c: { name: string }) => c.name).filter(Boolean);
        const prodCatNames = prodData.map((p) => p.category).filter(Boolean);
        const uniqueCats = Array.from(new Set([...dbCatNames, ...prodCatNames]));
        setCategories(['All', ...uniqueCats]);

        // Derive unique product badges
        const uniqueBadges = Array.from(
          new Set(prodData.map((p) => p.badge).filter((b): b is string => !!b))
        );
        setBadges(uniqueBadges);
      } catch (err) {
        console.error('Error fetching shop data:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products when category, badge or search changes
  useEffect(() => {
    let filtered = products;

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Apply badge filter
    if (selectedBadge) {
      filtered = filtered.filter(
        p => p.badge && p.badge.toLowerCase() === selectedBadge.toLowerCase()
      );
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
  }, [selectedCategory, selectedBadge, searchQuery, products]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedBadge(null); // clear badge when switching category
    if (category === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ category }, { replace: true });
    }
    setShowMobileFilters(false);
  };

  const handleBadgeToggle = (badge: string) => {
    setSelectedBadge(prev => (prev === badge ? null : badge));
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

  const pageTitle =
    selectedCategory && selectedCategory !== 'All'
      ? `${selectedCategory} Collection | JORIQUE Luxury Essentials`
      : 'Shop Luxury Bed Linens, Cushions, Apparel & Bath | JORIQUE';

  const pageDescription =
    selectedCategory && selectedCategory !== 'All'
      ? `Explore JORIQUE's luxury handcrafted ${selectedCategory} collection made from heirloom natural fibers.`
      : 'Explore JORIQUE’s curated collection of luxury bedsheets, artisanal cushions, plush cloud towels, and tailored apparel.';

  const shopStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: pageDescription,
    url: 'https://jorique.in/shop',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://jorique.in/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Shop',
          item: 'https://jorique.in/shop'
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB] transition-colors duration-300">
      <SEO
        title={pageTitle}
        description={pageDescription}
        canonical="https://jorique.in/shop"
        structuredData={shopStructuredData}
      />
      <Navbar />

      <div className="pt-20 lg:pt-24">
        {/* 🏷️ Top Running Deals Banner Carousel (At the very top of Shop) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-4 sm:pt-6 pb-4">
          <ShopDealsBannerCarousel
            onSelectFilter={(target) => {
              if (target === 'All') {
                setSelectedCategory('All');
                setSearchQuery('');
              } else {
                const matched = categories.find(
                  (c) => c.toLowerCase() === target.toLowerCase()
                );
                if (matched) {
                  setSelectedCategory(matched);
                } else {
                  setSearchQuery(target);
                }
              }
              const gridEl = document.getElementById('shop-catalog-grid');
              if (gridEl) {
                gridEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        </div>

        {/* Parallax Atmospheric Header */}
        <div className="relative overflow-hidden bg-transparent text-primary dark:text-white py-12 lg:py-16 px-6  transition-colors duration-300">
          <div className="absolute inset-0 opacity-15 dark:opacity-20 pointer-events-none bg-[radial-gradient(#8D867F_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute -top-24 -right-24 w-96 h-96  rounded-full blur-3xl pointer-events-none" />

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

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-10">
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

            {/* Badge Chips - Desktop */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              {badges.map((badge) => {
                const isActive = selectedBadge === badge;
                return (
                  <button
                    key={badge}
                    id={`badge-filter-${badge.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => handleBadgeToggle(badge)}
                    className={`relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.1em] transition-all duration-200 border ${
                      isActive
                        ? 'border-transparent text-white dark:text-[#100E0D] shadow-lg shadow-[#851C25]/20 dark:shadow-[#D4AF37]/20'
                        : 'border-[#E0D8CE] dark:border-white/10 bg-white/60 dark:bg-white/5 text-[#5C5248] dark:text-white/60 hover:border-[#851C25]/40 dark:hover:border-[#D4AF37]/40 hover:text-[#851C25] dark:hover:text-[#D4AF37]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeShopBadge"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#851C25] to-[#A0222C] dark:from-[#D4AF37] dark:to-[#C09A30]"
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      />
                    )}
                    <span className={`relative z-10 text-[10px] ${isActive ? 'opacity-100' : 'opacity-40'}`}>✦</span>
                    <span className="relative z-10 uppercase">{badge}</span>
                    {isActive && (
                      <span className="relative z-10 text-[10px] opacity-70">✕</span>
                    )}
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
                <Filter size={15} /> Filter: <strong className="text-[#851C25] dark:text-[#D4AF37]">{selectedBadge ?? 'All'}</strong>
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
                {badges.map((badge) => (
                  <button
                    key={badge}
                    onClick={() => handleBadgeToggle(badge)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 ${
                      selectedBadge === badge
                        ? 'bg-gradient-to-r from-[#851C25] to-[#A0222C] dark:from-[#D4AF37] dark:to-[#C09A30] text-white dark:text-black shadow-md'
                        : 'bg-white/60 dark:bg-white/5 text-[#851C25] dark:text-[#D4AF37]/80 border border-[#E0D8CE] dark:border-white/10 hover:border-[#851C25]/40'
                    }`}
                  >
                    <span className="text-[10px]">✦</span>
                    {badge}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>


          {/* Results Count & Grid Anchor */}
          <div id="shop-catalog-grid" className="flex items-center justify-between mb-8 scroll-mt-24">
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