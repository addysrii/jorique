import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Search,
  MessageCircle,
  Share2,
  Printer,
  ShoppingBag,
  ExternalLink,
  Sparkles,
  Filter,
  Check,
  ChevronRight,
  Layers,
  ArrowRight,
  Eye,
  ShieldCheck,
  Truck,
  Heart,
  Grid3X3,
  List,
  SlidersHorizontal,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import LoadingMasterpiece from '../components/LoadingMasterpiece';
import { productService } from '../lib/api/products';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { getBadgeColors, JORIQUE_COLLECTIONS } from '../lib/constants/collections';

export default function CatalogStore() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Controls
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'spec'>('grid');
  const [copiedSku, setCopiedSku] = useState<string | null>(null);

  const whatsappConciergeNumber = '919919388211';

  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);
        const data = await productService.getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load catalogue products:', err);
        setError('Unable to load catalogue at this time. Please try again shortly.');
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  // Distinct categories
  const categories = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return ['All', ...list];
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Collection filter
      if (selectedCollection !== 'All') {
        const badge = (p.badge || '').toLowerCase();
        if (!badge.includes(selectedCollection.toLowerCase())) {
          return false;
        }
      }
      // In-stock filter
      if (inStockOnly && Number(p.quantity || 0) <= 0) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name?.toLowerCase().includes(q);
        const matchesSku = p.sku?.toLowerCase().includes(q);
        const matchesDesc = p.description?.toLowerCase().includes(q);
        const matchesCategory = p.category?.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesDesc && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [products, selectedCategory, selectedCollection, inStockOnly, searchQuery]);

  const handleShareCatalog = () => {
    const shareUrl = window.location.href;
    const text = `⚜️ Explore JORIQUE Luxury Homeware & Bedding Catalogue:\n${shareUrl}`;
    if (navigator.share) {
      navigator.share({ title: 'JORIQUE Atelier Catalogue', url: shareUrl, text }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const getWhatsAppOrderLink = (product: Product) => {
    const text = `⚜️ *JORIQUE ATELIER ENQUIRY / ORDER*
I would like to order:
• *Item:* ${product.name}
• *SKU:* ${product.sku}
• *Price:* ₹${Number(product.price).toLocaleString('en-IN')}
• *Link:* ${window.location.origin}/product/${product.id}

Please confirm availability and dispatch timeline.`;
    return `https://wa.me/${whatsappConciergeNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#121110] text-primary dark:text-[#F3EFE6] transition-colors duration-300">
      <SEO
        title="Digital Atelier Catalogue Store | JORIQUE Luxury Homeware"
        description="Explore the complete JORIQUE interactive catalogue: Egyptian cotton bedsheets, tactile cushion covers, super-soft towels, and designer pieces. Order seamlessly via WhatsApp or online."
      />

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Atelier Catalogue Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-[#1F1B18] text-white p-8 sm:p-12 border border-[#D4AF37]/30 shadow-2xl mb-10">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-4">
              <BookOpen size={14} />
              <span>Official Atelier Lookbook & Catalogue</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-[#F9F6EE] mb-4">
              JORIQUE Digital Catalogue Store
            </h1>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl">
              Immerse yourself in our signature handcrafted creations. Every piece is woven from authentic extra-long staple Egyptian cotton, individually serialized with tamper-proof artisan authenticity tags.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={handleShareCatalog}
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-md text-xs uppercase tracking-wider"
              >
                <Share2 size={15} />
                <span>Share Catalogue on WhatsApp</span>
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2.5 rounded-xl transition-all border border-white/20 text-xs tracking-wider"
              >
                <Printer size={15} />
                <span>Print / Save Lookbook PDF</span>
              </button>

              <Link
                to="/souvenir"
                className="inline-flex items-center gap-2 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] font-semibold px-4 py-2.5 rounded-xl transition-all border border-[#D4AF37]/40 text-xs tracking-wider"
              >
                <Sparkles size={14} />
                <span>Complimentary Souvenir Gift</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Bar & View Mode Toggles */}
        <div className="bg-white/80 dark:bg-[#1A1816]/90 backdrop-blur-md border border-border/80 dark:border-[#2E2925] rounded-2xl p-4 sm:p-5 mb-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary/60 dark:text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalogue by design, SKU, or fabric..."
                className="w-full pl-10 pr-4 py-2 bg-stone-50 dark:bg-black/30 border border-border dark:border-[#2E2925] rounded-xl text-xs sm:text-sm text-primary dark:text-white placeholder:text-secondary/50 focus:outline-hidden focus:border-[#D4AF37]"
              />
            </div>

            {/* In-Stock & View Toggles */}
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#0B5F61] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="text-secondary dark:text-white/70">In Stock Ready to Ship</span>
              </label>

              <div className="h-4 w-px bg-border dark:bg-white/10" />

              <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800/60 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-stone-700 text-primary dark:text-white shadow-xs'
                      : 'text-secondary dark:text-white/50 hover:text-primary dark:hover:text-white'
                  }`}
                  title="Catalogue Grid View"
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('spec')}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === 'spec'
                      ? 'bg-white dark:bg-stone-700 text-primary dark:text-white shadow-xs'
                      : 'text-secondary dark:text-white/50 hover:text-primary dark:hover:text-white'
                  }`}
                  title="Wholesale Spec Sheet Table"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-4 pt-4 border-t border-border/60 dark:border-[#2E2925] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary/60 dark:text-white/40 mr-1 flex-shrink-0">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-primary dark:bg-[#D4AF37] text-white dark:text-black font-semibold shadow-xs'
                    : 'bg-stone-100 dark:bg-white/5 text-secondary dark:text-white/70 hover:bg-stone-200 dark:hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <LoadingMasterpiece fullScreen={false} message="CURATING ATELIER CATALOGUE" className="py-24" />
        ) : error ? (
          <div className="p-8 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-center text-rose-700 dark:text-rose-300">
            <p className="font-semibold">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925]">
            <BookOpen size={36} className="mx-auto text-secondary/40 stroke-1 mb-3" />
            <h3 className="text-base font-serif text-primary dark:text-white">No products found matching filters</h3>
            <p className="text-xs text-secondary dark:text-white/60 mt-1">Try clearing search or choosing another category.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedCollection('All');
                setSearchQuery('');
                setInStockOnly(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-primary dark:text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View Mode */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const inStock = Number(product.quantity || 0) > 0;
              const hasDiscount = product.discount_price && Number(product.discount_price) > Number(product.price);
              const badgeColors = getBadgeColors(product.badge);
              const mainImage = Array.isArray(product.images) && product.images[0] ? product.images[0] : '/placeholder.jpg';

              return (
                <div
                  key={product.id}
                  className="group bg-white dark:bg-[#1A1816] border border-border/80 dark:border-[#2E2925] rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container with Badges */}
                    <div className="relative aspect-4/3 bg-stone-100 dark:bg-stone-900 overflow-hidden">
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />

                      {/* Collection Badge */}
                      {product.badge && (
                        <div
                          className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs ${badgeColors.bg} ${badgeColors.text} border ${badgeColors.border}`}
                        >
                          {product.badge}
                        </div>
                      )}

                      {/* Stock Pill */}
                      <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md shadow-xs">
                        {inStock ? (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            In Stock ({product.quantity})
                          </span>
                        ) : (
                          <span className="text-stone-400">Sold Out</span>
                        )}
                      </div>

                      {/* SKU Overlay */}
                      <div className="absolute bottom-3 left-3 text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/60 text-white/90 backdrop-blur-md">
                        {product.sku}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <div className="flex items-center justify-between text-[11px] text-secondary dark:text-white/60 mb-1">
                        <span className="uppercase tracking-wider font-semibold">{product.category}</span>
                        {product.year && <span>Atelier {product.year}</span>}
                      </div>

                      <h3 className="text-base font-serif font-medium text-primary dark:text-[#E8DCC4] line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                      </h3>

                      {product.description && (
                        <p className="text-xs text-secondary/80 dark:text-white/60 line-clamp-2 mt-1.5 leading-relaxed">
                          {product.description}
                        </p>
                      )}

                      {/* Pricing */}
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-lg font-serif font-bold text-primary dark:text-white">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-secondary line-through">
                            ₹{Number(product.discount_price).toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold ml-auto">
                          Free Express Shipping
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                    <a
                      href={getWhatsAppOrderLink(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all shadow-xs"
                      title="Direct order with concierge via WhatsApp"
                    >
                      <MessageCircle size={14} />
                      <span>WhatsApp Order</span>
                    </a>

                    <Link
                      to={`/product/${product.id}`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-primary dark:bg-[#D4AF37] text-white dark:text-black hover:opacity-90 text-xs font-bold transition-all shadow-xs"
                    >
                      <ShoppingBag size={14} />
                      <span>View Piece</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Wholesale Spec Sheet Table View Mode */
          <div className="bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-white/5 border-b border-border/80 dark:border-[#2E2925] text-[11px] font-bold uppercase tracking-wider text-secondary dark:text-white/60">
                  <tr>
                    <th className="py-4 px-6">Product / Design</th>
                    <th className="py-4 px-4">SKU</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Collection</th>
                    <th className="py-4 px-4">Availability</th>
                    <th className="py-4 px-4">Atelier Price</th>
                    <th className="py-4 px-6 text-right">Concierge Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 dark:divide-[#2E2925]">
                  {filteredProducts.map((p) => {
                    const inStock = Number(p.quantity || 0) > 0;
                    const img = Array.isArray(p.images) && p.images[0] ? p.images[0] : '/placeholder.jpg';

                    return (
                      <tr key={p.id} className="hover:bg-stone-50/60 dark:hover:bg-white/2 transition-colors">
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <img src={img} alt={p.name} className="w-12 h-12 object-cover rounded-xl bg-stone-100 dark:bg-stone-800" />
                            <div>
                              <Link to={`/product/${p.id}`} className="font-serif font-medium text-primary dark:text-[#E8DCC4] hover:underline">
                                {p.name}
                              </Link>
                              {p.year && <p className="text-[10px] text-secondary/70">Atelier {p.year}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-stone-600 dark:text-stone-300">
                          {p.sku}
                        </td>
                        <td className="py-3 px-4 text-secondary dark:text-white/70">
                          {p.category}
                        </td>
                        <td className="py-3 px-4">
                          {p.badge ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-primary dark:text-white">
                              {p.badge}
                            </span>
                          ) : (
                            <span className="text-secondary/50">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {inStock ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {p.quantity} Units Ready
                            </span>
                          ) : (
                            <span className="text-stone-400 text-[11px]">Sold Out</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-serif font-bold text-sm text-primary dark:text-white">
                          ₹{Number(p.price).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-6 text-right">
                          <a
                            href={getWhatsAppOrderLink(p)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] text-white text-[11px] font-bold hover:bg-[#1EBE5D] transition-all shadow-xs"
                          >
                            <MessageCircle size={12} />
                            <span>WhatsApp Order</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
