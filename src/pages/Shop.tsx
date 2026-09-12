import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, X, Sparkles, Layers, RotateCcw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { productService } from '../lib/api/products';
import { Product } from '../types';
import ShopDealsBannerCarousel from '../components/ShopDealsBannerCarousel';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';
import LoadingMasterpiece from '../components/LoadingMasterpiece';
import {
  CORE_BRAND_COLLECTIONS,
  isProductInCollection,
  getCollectionTheme,
} from '../lib/constants/collections';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const collectionParam = searchParams.get('collection');
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [badges, setBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active filters
  const [selectedCollection, setSelectedCollection] = useState<string>(collectionParam || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'All');
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    if (collectionParam) {
      setSelectedCollection(collectionParam.toLowerCase());
    } else {
      setSelectedCollection('all');
    }
  }, [collectionParam]);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
  }, [categoryParam]);

  // Fetch initial product and category data
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

        // Derive unique storefront status badges (excluding brand collection names to prevent duplicate selectors)
        const collectionKeywords = ['essential', 'signature', 'luxe', 'souvenir', 'hospitality', 'jorique'];
        const uniqueBadges = Array.from(
          new Set(prodData.map((p) => p.badge).filter((b): b is string => !!b))
        ).filter(
          (b) => !collectionKeywords.some((k) => b.toLowerCase().includes(k))
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

  // Filter products whenever collection, category, badge, search or raw product list changes
  useEffect(() => {
    let filtered = products;

    // 1. Collection Filter (Essential, Signature, Luxe, etc.)
    if (selectedCollection && selectedCollection !== 'all') {
      filtered = filtered.filter((p) => isProductInCollection(p, selectedCollection));
    }

    // 2. Category Filter (Suits, Bedsheet, Cushion Cover, Towel, etc.)
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 3. Badge Filter
    if (selectedBadge) {
      filtered = filtered.filter(
        (p) => p.badge && p.badge.toLowerCase() === selectedBadge.toLowerCase()
      );
    }

    // 4. Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.category && p.category.toLowerCase().includes(query)) ||
          (p.sku && p.sku.toLowerCase().includes(query)) ||
          (p.badge && p.badge.toLowerCase().includes(query)) ||
          (p.description && p.description.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCollection, selectedCategory, selectedBadge, searchQuery, products]);

  // Compute products that belong to the active collection to determine available categories & counts
  const collectionProducts = useMemo(() => {
    if (!selectedCollection || selectedCollection === 'all') return products;
    return products.filter((p) => isProductInCollection(p, selectedCollection));
  }, [products, selectedCollection]);

  // Categories present within the current collection
  const availableCategoriesForCollection = useMemo(() => {
    const presentCats = Array.from(
      new Set(collectionProducts.map((p) => p.category).filter(Boolean))
    );
    // If no products in collection yet, show all categories as fallback
    const baseList = presentCats.length > 0 ? presentCats : categories.filter((c) => c !== 'All');
    return ['All', ...baseList.sort()];
  }, [collectionProducts, categories]);

  // Calculate count for a category within the current collection
  const getCategoryCount = (catName: string) => {
    if (catName === 'All') return collectionProducts.length;
    return collectionProducts.filter(
      (p) => p.category?.toLowerCase() === catName.toLowerCase()
    ).length;
  };

  // Switch Collection
  const handleCollectionChange = (colId: string) => {
    setSelectedCollection(colId);
    const newParams = new URLSearchParams(searchParams);
    if (colId === 'all') {
      newParams.delete('collection');
    } else {
      newParams.set('collection', colId);
    }

    // Check if current category still has products in the newly selected collection
    if (selectedCategory !== 'All') {
      const remainingForCol =
        colId === 'all'
          ? products
          : products.filter((p) => isProductInCollection(p, colId));
      const hasMatch = remainingForCol.some(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
      if (!hasMatch) {
        setSelectedCategory('All');
        newParams.delete('category');
      }
    }

    setSearchParams(newParams, { replace: true });
    setShowMobileFilters(false);
  };

  // Switch Category
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams, { replace: true });
    setShowMobileFilters(false);
  };

  const handleBadgeToggle = (badge: string) => {
    setSelectedBadge((prev) => (prev === badge ? null : badge));
    setShowMobileFilters(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearAllFilters = () => {
    setSelectedCollection('all');
    setSelectedCategory('All');
    setSelectedBadge(null);
    setSearchQuery('');
    setSearchParams({}, { replace: true });
  };

  // Active collection metadata
  const currentCollectionTheme = useMemo(() => {
    if (!selectedCollection || selectedCollection === 'all') return null;
    return getCollectionTheme(selectedCollection);
  }, [selectedCollection]);

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

  // SEO dynamic metadata
  const pageTitle = currentCollectionTheme
    ? selectedCategory && selectedCategory !== 'All'
      ? `${selectedCategory} | ${currentCollectionTheme.name} | JORIQUE`
      : `${currentCollectionTheme.name} | JORIQUE Luxury Essentials`
    : selectedCategory && selectedCategory !== 'All'
      ? `${selectedCategory} Collection | JORIQUE Luxury Essentials`
      : 'Shop Luxury Bed Linens, Cushions, Apparel & Bath | JORIQUE';

  const pageDescription = currentCollectionTheme
    ? currentCollectionTheme.description
    : selectedCategory && selectedCategory !== 'All'
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
          item: 'https://jorique.in/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Shop',
          item: 'https://jorique.in/shop',
        },
      ],
    },
  };

  const hasActiveFilters =
    (selectedCollection && selectedCollection !== 'all') ||
    (selectedCategory && selectedCategory !== 'All') ||
    selectedBadge !== null ||
    searchQuery.trim().length > 0;

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
                  handleCategoryChange(matched);
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

        {/* Dynamic Parallax Atmospheric Header */}
        <div className="relative overflow-hidden bg-transparent text-primary dark:text-white py-10 lg:py-14 px-6 transition-colors duration-300">
          <div className="absolute inset-0 opacity-15 dark:opacity-20 pointer-events-none bg-[radial-gradient(#8D867F_1px,transparent_1px)] [background-size:24px_24px]" />
          
          {/* Subtle Ambient Radial Glow tailored to collection */}
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-30 transition-all duration-700"
            style={{
              backgroundColor: currentCollectionTheme
                ? currentCollectionTheme.background
                : '#D4AF37',
            }}
          />

          <div className="max-w-7xl mx-auto lg:px-6 relative z-10">
            <motion.div
              key={selectedCollection}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md border text-[11px] font-bold tracking-[0.25em] uppercase mb-3 shadow-xs transition-colors"
                style={{
                  backgroundColor: currentCollectionTheme
                    ? `${currentCollectionTheme.background}18`
                    : 'rgba(255,255,255,0.85)',
                  borderColor: currentCollectionTheme
                    ? `${currentCollectionTheme.background}40`
                    : 'rgba(0,0,0,0.1)',
                  color: currentCollectionTheme
                    ? currentCollectionTheme.background
                    : '#0B5F61',
                }}
              >
                <Sparkles size={12} />
                <span>
                  {currentCollectionTheme
                    ? currentCollectionTheme.name
                    : 'Curated Living Catalog'}
                </span>
              </div>

              <h1 className="font-mainlogo text-3xl sm:text-4xl lg:text-5xl font-normal text-primary dark:text-white tracking-[0.20em] uppercase">
                {currentCollectionTheme
                  ? currentCollectionTheme.name
                  : selectedCategory !== 'All'
                  ? `${selectedCategory} Collection`
                  : 'All Collections'}
              </h1>

              <p className="text-secondary dark:text-white/70 text-sm sm:text-base font-light mt-3 leading-relaxed max-w-2xl">
                {currentCollectionTheme
                  ? currentCollectionTheme.description
                  : 'Discover bespoke bedding, artisanal decor, and textural essentials designed to elevate your everyday living.'}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Catalog Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 lg:py-8">

          {/* ─────────────────────────────────────────────────────────────
              1. FLAGSHIP COLLECTION SWITCHER TABS
          ───────────────────────────────────────────────────────────── */}
          <div className="mb-6 pb-2 border-b border-border/60 dark:border-[#2E2925]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-secondary/60 dark:text-white/40 flex items-center gap-1.5">
                <Layers size={13} />
                Collection Filter
              </span>
              {selectedCollection !== 'all' && (
                <button
                  onClick={() => handleCollectionChange('all')}
                  className="text-[11px] font-semibold text-[#0B5F61] dark:text-[#D4AF37] hover:underline"
                >
                  View All Collections
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {/* All Collections tab */}
              <button
                id="collection-filter-all"
                onClick={() => handleCollectionChange('all')}
                className={`relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 border ${
                  selectedCollection === 'all'
                    ? 'border-primary bg-primary text-white dark:bg-[#D4AF37] dark:text-black shadow-md'
                    : 'border-border dark:border-[#2E2925] bg-white/70 dark:bg-white/5 text-secondary dark:text-white/70 hover:border-primary/40 hover:text-primary dark:hover:text-white'
                }`}
              >
                <span>All Collections</span>
                <span className="ml-1.5 text-[10px] opacity-75">({products.length})</span>
              </button>

              {/* Core Collections (Essential, Signature, Luxe) */}
              {CORE_BRAND_COLLECTIONS.map((col) => {
                const isActive = selectedCollection === col.id;
                const count = products.filter((p) => isProductInCollection(p, col.id)).length;

                return (
                  <button
                    key={col.id}
                    id={`collection-filter-${col.id}`}
                    onClick={() => handleCollectionChange(col.id)}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 border ${
                      isActive
                        ? 'border-transparent text-white shadow-md'
                        : 'border-border dark:border-[#2E2925] bg-white/70 dark:bg-white/5 text-secondary dark:text-white/70 hover:border-primary/40 hover:text-primary dark:hover:text-white'
                    }`}
                    style={{
                      backgroundColor: isActive ? col.accent : undefined,
                      borderColor: isActive ? col.accent : undefined,
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-xs shrink-0"
                      style={{
                        backgroundColor: isActive ? '#FFFFFF' : col.accent,
                      }}
                    />
                    <span>{col.name}</span>
                    <span className={`text-[10px] ${isActive ? 'text-white/80' : 'text-secondary/60 dark:text-white/40'}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              2. DEDICATED CATEGORY FILTER BAR ("filter of selecting category")
          ───────────────────────────────────────────────────────────── */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-secondary/60 dark:text-white/40">
                Select Category {selectedCollection !== 'all' ? `in ${currentCollectionTheme?.shortName || ''}` : ''}
              </span>
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => handleCategoryChange('All')}
                  className="text-[11px] font-semibold text-[#0B5F61] dark:text-[#D4AF37] hover:underline"
                >
                  Show All Categories
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {availableCategoriesForCollection.map((cat) => {
                const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                const count = getCategoryCount(cat);

                return (
                  <button
                    key={cat}
                    id={`category-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => handleCategoryChange(cat)}
                    className={`relative inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 shrink-0 border ${
                      isActive
                        ? 'border-[#0B5F61] dark:border-[#D4AF37] bg-[#0B5F61] text-white dark:bg-[#D4AF37] dark:text-black shadow-sm font-bold'
                        : 'border-border/70 dark:border-[#2E2925] bg-cream/40 dark:bg-white/5 text-secondary dark:text-white/70 hover:border-primary/40 hover:text-primary dark:hover:text-white'
                    }`}
                  >
                    <span>{cat === 'All' ? 'All Categories' : cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white dark:bg-black/15 dark:text-black'
                          : 'bg-black/5 dark:bg-white/10 text-secondary dark:text-white/60'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              3. SEARCH & SECONDARY CONTROLS BAR
          ───────────────────────────────────────────────────────────── */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search products, fabrics, collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-2xl text-sm focus:outline-none focus:border-primary dark:focus:border-[#D4AF37] text-primary dark:text-[#F5F2EB] placeholder:text-secondary/60 dark:placeholder:text-white/40 shadow-xs transition-all"
              />
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary dark:text-white/50"
              />
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
            {badges.length > 0 && (
              <div className="hidden lg:flex items-center gap-2 flex-wrap">
                {badges.map((badge) => {
                  const isActive = selectedBadge === badge;
                  return (
                    <button
                      key={badge}
                      id={`badge-filter-${badge.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => handleBadgeToggle(badge)}
                      className={`relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-[0.08em] transition-all duration-200 border ${
                        isActive
                          ? 'border-transparent text-white dark:text-[#100E0D] shadow-md shadow-[#0B5F61]/20 dark:shadow-[#D4AF37]/20'
                          : 'border-[#E0D8CE] dark:border-white/10 bg-white/60 dark:bg-white/5 text-[#5C5248] dark:text-white/60 hover:border-[#0B5F61]/40 hover:text-[#0B5F61] dark:hover:text-[#D4AF37]'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeShopBadge"
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0B5F61] to-[#0E7A7D] dark:from-[#D4AF37] dark:to-[#C09A30]"
                          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        />
                      )}
                      <span
                        className={`relative z-10 text-[9px] ${
                          isActive ? 'opacity-100' : 'opacity-40'
                        }`}
                      >
                        ✦
                      </span>
                      <span className="relative z-10 uppercase">{badge}</span>
                      {isActive && (
                        <span className="relative z-10 text-[10px] opacity-70">✕</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center justify-between gap-2 px-5 py-3 bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-2xl text-sm shadow-xs"
            >
              <span className="flex items-center gap-2 text-primary dark:text-white">
                <Filter size={15} /> Filters & Badges: <strong className="text-[#0B5F61] dark:text-[#D4AF37]">{selectedBadge ?? 'All'}</strong>
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
                        ? 'bg-gradient-to-r from-[#0B5F61] to-[#0E7A7D] dark:from-[#D4AF37] dark:to-[#C09A30] text-white dark:text-black shadow-md'
                        : 'bg-white/60 dark:bg-white/5 text-[#0B5F61] dark:text-[#D4AF37]/80 border border-[#E0D8CE] dark:border-white/10 hover:border-[#0B5F61]/40'
                    }`}
                  >
                    {badge}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filter Chips Bar */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap mb-6 p-3 rounded-2xl bg-cream/30 dark:bg-white/[0.02] border border-border/50 dark:border-[#2E2925]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary/60 dark:text-white/40 mr-1">
                Active Filters:
              </span>

              {/* Collection Chip */}
              {selectedCollection !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-[#1F1C19] border border-border dark:border-[#2E2925] text-primary dark:text-white shadow-xs">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: currentCollectionTheme?.background || '#7A8B72' }}
                  />
                  <span>{currentCollectionTheme?.name || selectedCollection}</span>
                  <button
                    onClick={() => handleCollectionChange('all')}
                    className="hover:opacity-75 text-secondary dark:text-white/60 ml-0.5 cursor-pointer"
                    aria-label="Remove collection filter"
                  >
                    ✕
                  </button>
                </span>
              )}

              {/* Category Chip */}
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-[#1F1C19] border border-border dark:border-[#2E2925] text-primary dark:text-white shadow-xs">
                  <span>Category: {selectedCategory}</span>
                  <button
                    onClick={() => handleCategoryChange('All')}
                    className="hover:opacity-75 text-secondary dark:text-white/60 ml-0.5 cursor-pointer"
                    aria-label="Remove category filter"
                  >
                    ✕
                  </button>
                </span>
              )}

              {/* Badge Chip */}
              {selectedBadge && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-[#1F1C19] border border-border dark:border-[#2E2925] text-primary dark:text-white shadow-xs">
                  <span>Badge: {selectedBadge}</span>
                  <button
                    onClick={() => setSelectedBadge(null)}
                    className="hover:opacity-75 text-secondary dark:text-white/60 ml-0.5 cursor-pointer"
                    aria-label="Remove badge filter"
                  >
                    ✕
                  </button>
                </span>
              )}

              {/* Search Query Chip */}
              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-[#1F1C19] border border-border dark:border-[#2E2925] text-primary dark:text-white shadow-xs">
                  <span>Search: &ldquo;{searchQuery}&rdquo;</span>
                  <button
                    onClick={clearSearch}
                    className="hover:opacity-75 text-secondary dark:text-white/60 ml-0.5 cursor-pointer"
                    aria-label="Remove search filter"
                  >
                    ✕
                  </button>
                </span>
              )}

              {/* Clear All Button */}
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 hover:underline ml-auto cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset All</span>
              </button>
            </div>
          )}

          {/* Results Count & Grid Anchor */}
          <div id="shop-catalog-grid" className="flex items-center justify-between mb-8 scroll-mt-24">
            <p className="text-xs font-semibold tracking-wider uppercase text-secondary dark:text-white/60">
              Showing {filteredProducts.length} Crafted Product{filteredProducts.length !== 1 ? 's' : ''}
              {selectedCollection !== 'all' && (
                <span> in <strong className="text-primary dark:text-white">{currentCollectionTheme?.name}</strong></span>
              )}
              {selectedCategory !== 'All' && (
                <span> &bull; <strong className="text-primary dark:text-white">{selectedCategory}</strong></span>
              )}
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <LoadingMasterpiece fullScreen={false} className="py-24" />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-[#1A1816] rounded-3xl border border-dashed border-border dark:border-[#2E2925] p-12">
              <p className="text-primary dark:text-white text-base font-medium mb-1">
                No matching products found
              </p>
              <p className="text-xs text-secondary dark:text-white/60 mb-6">
                {selectedCollection !== 'all' && selectedCategory !== 'All'
                  ? `There are currently no products in "${selectedCategory}" for ${currentCollectionTheme?.name || 'this collection'}. Try selecting "All Categories" or reset filters.`
                  : 'Try searching with different keywords or reset filters.'}
              </p>
              <div className="flex items-center justify-center gap-3">
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => handleCategoryChange('All')}
                    className="px-4 py-2 rounded-xl bg-primary text-white dark:bg-[#D4AF37] dark:text-black text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
                  >
                    View All {currentCollectionTheme?.shortName || ''} Categories
                  </button>
                )}
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 rounded-xl border border-border dark:border-[#2E2925] text-xs font-semibold uppercase tracking-wider text-primary dark:text-[#D4AF37] hover:bg-cream dark:hover:bg-white/5 transition-all"
                >
                  Reset All Filters
                </button>
              </div>
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