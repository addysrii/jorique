import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Loader2, PackageCheck, Users, WalletCards, Plus, Boxes, Trash2, 
  Layers, ShoppingCart, Gift, Star, Truck, Barcode as BarcodeIcon, 
  Printer, CheckCircle2, AlertCircle, RefreshCw, Eye, Search, Filter
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Barcode128 from '../components/Barcode128';
import ProductPackagingLabel from '../components/ProductPackagingLabel';
import { useAuth } from '../context/AuthContext';
import { dashboardRequest } from '../lib/api';
import { productService } from '../lib/api/products';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import AdminProductModifyButton from '../components/AdminProductModifyButton';
import CategoryManager from '../components/CategoryManager';

type AdminTab = 'overview' | 'products' | 'inventory' | 'orders' | 'gifts' | 'reviews' | 'suppliers' | 'barcodes' | 'categories';

interface ProductSerialRow {
  id: string;
  product_id: string;
  serial_number: string;
  status: 'available' | 'reserved' | 'sold' | 'returned' | 'damaged';
  gift_claimed: boolean;
  created_at: string;
  product?: { name: string; sku: string; category: string };
}

interface OrderRow {
  id: string;
  order_number: string;
  customer_id?: string;
  status: string;
  total: number;
  items: Array<{ name?: string; quantity?: number; price?: number }>;
  created_at: string;
}

interface ReviewRow {
  id: string;
  product_id: string;
  customer_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
  product?: { name: string; sku: string };
}

interface GiftClaimRow {
  id: string;
  serial_id: string;
  customer_id?: string;
  redeemed_at: string;
  serial?: { serial_number: string };
  customer?: { email: string; full_name?: string };
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const [products, setProducts] = useState<Product[]>([]);
  const [serials, setSerials] = useState<ProductSerialRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [giftClaims, setGiftClaims] = useState<GiftClaimRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Barcode hub label print modal
  const [selectedProductForLabels, setSelectedProductForLabels] = useState<Product | null>(null);
  const [labelSerials, setLabelSerials] = useState<string[]>([]);
  const [loadingLabels, setLoadingLabels] = useState(false);
  const [labelShowChannels, setLabelShowChannels] = useState(true);
  const [labelShowQR, setLabelShowQR] = useState(true);
  const [labelCustomBadge, setLabelCustomBadge] = useState<string>('');

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // 1. Fetch Products
        const prodData = await productService.getProducts();
        setProducts(prodData);

        // 2. Fetch Serials with joined product data
        const { data: serialsData, error: sErr } = await supabase
          .from('product_serials')
          .select('*, product:products(name, sku, category)')
          .order('created_at', { ascending: false });
        if (!sErr && serialsData) setSerials(serialsData as unknown as ProductSerialRow[]);

        // 3. Fetch Orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (ordersData) setOrders(ordersData as OrderRow[]);

        // 4. Fetch Reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*, product:products(name, sku)')
          .order('created_at', { ascending: false });
        if (reviewsData) setReviews(reviewsData as unknown as ReviewRow[]);

        // 5. Fetch Gift Claims
        const { data: giftsData } = await supabase
          .from('gift_redemption')
          .select('*, serial:product_serials(serial_number), customer:profiles(email, full_name)')
          .order('redeemed_at', { ascending: false });
        if (giftsData) setGiftClaims(giftsData as unknown as GiftClaimRow[]);

      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleProductDeleted = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product and all associated serials?')) return;
    const result = await productService.deleteProduct(id);
    if (result.success) {
      setProducts(prev => prev.filter(p => p.id !== id));
      setSerials(prev => prev.filter(s => s.product_id !== id));
    } else {
      setError(result.message);
    }
  };

  // Update physical serial status
  const handleUpdateSerialStatus = async (serialId: string, newStatus: ProductSerialRow['status']) => {
    try {
      const { error: updateErr } = await supabase
        .from('product_serials')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', serialId);

      if (updateErr) throw updateErr;

      setSerials(prev => prev.map(s => s.id === serialId ? { ...s, status: newStatus } : s));
    } catch (err) {
      alert('Failed to update serial status: ' + (err as Error).message);
    }
  };

  // Open Barcode label preview for a product
  const handleOpenBarcodeHub = async (product: Product) => {
    try {
      setSelectedProductForLabels(product);
      setLabelCustomBadge(product.badge || '');
      setLoadingLabels(true);
      const { data: pSerials } = await supabase
        .from('product_serials')
        .select('serial_number')
        .eq('product_id', product.id);

      const serialStrings = (pSerials || []).map(s => s.serial_number);
      setLabelSerials(serialStrings);
    } catch (err) {
      console.error('Error fetching serials for labels:', err);
    } finally {
      setLoadingLabels(false);
    }
  };

  // Derived inventory metrics
  const totalStock = products.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  const totalSerialsCount = serials.length;
  const availableCount = serials.filter(s => s.status === 'available').length;
  const soldCount = serials.filter(s => s.status === 'sold').length;
  const reservedCount = serials.filter(s => s.status === 'reserved').length;
  const damagedCount = serials.filter(s => s.status === 'damaged').length;
  const claimedGiftsCount = serials.filter(s => s.gift_claimed).length;

  // Filtered inventory serials
  const filteredSerials = serials.filter(s => {
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || s.serial_number.toLowerCase().includes(q) || s.product?.name.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8F7F5] dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB] transition-colors duration-300">
      <Navbar />

      <main className="pt-28 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream dark:bg-white/5 border border-border dark:border-[#2E2925] text-[10px] font-semibold tracking-widest uppercase text-primary dark:text-[#D4AF37] mb-2">
                JORIQUE OS • Enterprise Suite v1.0
              </div>
              <h1 className="text-3xl lg:text-4xl font-light text-primary dark:text-white tracking-wide">
                Operating System & Inventory Hub
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/admin/products/new"
                className="inline-flex items-center gap-2 bg-primary dark:bg-[#D4AF37] text-white dark:text-black px-5 py-2.5 rounded-xl hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-all text-xs font-bold uppercase tracking-wider shadow-md"
              >
                <Plus size={16} /> New Product & Batch
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Module Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-8 border-b border-border/80 dark:border-[#2E2925] text-xs font-semibold uppercase tracking-wider">
            {[
              { id: 'overview', label: 'Dashboard', icon: <WalletCards size={14} /> },
              { id: 'products', label: `Products (${products.length})`, icon: <Boxes size={14} /> },
              { id: 'inventory', label: `Inventory Matrix (${serials.length})`, icon: <Layers size={14} /> },
              { id: 'orders', label: `Orders (${orders.length})`, icon: <ShoppingCart size={14} /> },
              { id: 'gifts', label: `Gift Redemptions (${giftClaims.length})`, icon: <Gift size={14} /> },
              { id: 'reviews', label: `Reviews (${reviews.length})`, icon: <Star size={14} /> },
              { id: 'suppliers', label: 'Suppliers & Costs', icon: <Truck size={14} /> },
              { id: 'barcodes', label: 'Packaging Labels', icon: <BarcodeIcon size={14} /> },
              { id: 'categories', label: 'Categories', icon: <Layers size={14} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary dark:bg-[#D4AF37] text-white dark:text-black shadow-md font-bold'
                    : 'text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white hover:bg-cream/60 dark:hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <Loader2 size={32} className="animate-spin text-primary dark:text-[#D4AF37]" />
              <p className="text-xs text-secondary dark:text-white/60 tracking-widest uppercase">Loading JORIQUE OS Data...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] shadow-sm">
                      <div className="flex items-center justify-between text-secondary dark:text-white/60 mb-3">
                        <span className="text-[11px] font-semibold tracking-widest uppercase">Total Catalog</span>
                        <Boxes size={16} className="text-primary dark:text-[#D4AF37]" />
                      </div>
                      <p className="text-3xl font-light text-primary dark:text-white">{products.length}</p>
                      <span className="text-[11px] text-secondary dark:text-white/50 mt-1 block">Active Product Models</span>
                    </div>

                    <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] shadow-sm">
                      <div className="flex items-center justify-between text-secondary dark:text-white/60 mb-3">
                        <span className="text-[11px] font-semibold tracking-widest uppercase">Available Stock</span>
                        <PackageCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-3xl font-light text-emerald-700 dark:text-emerald-400">{availableCount}</p>
                      <span className="text-[11px] text-secondary dark:text-white/50 mt-1 block">Of {totalStock} Total Units</span>
                    </div>

                    <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] shadow-sm">
                      <div className="flex items-center justify-between text-secondary dark:text-white/60 mb-3">
                        <span className="text-[11px] font-semibold tracking-widest uppercase">Redeemed Gifts</span>
                        <Gift size={16} className="text-[#D4AF37]" />
                      </div>
                      <p className="text-3xl font-light text-primary dark:text-[#D4AF37]">{claimedGiftsCount}</p>
                      <span className="text-[11px] text-secondary dark:text-white/50 mt-1 block">Verified Customer Claims</span>
                    </div>

                    <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] shadow-sm">
                      <div className="flex items-center justify-between text-secondary dark:text-white/60 mb-3">
                        <span className="text-[11px] font-semibold tracking-widest uppercase">Customer Reviews</span>
                        <Star size={16} className="text-primary dark:text-[#D4AF37]" />
                      </div>
                      <p className="text-3xl font-light text-primary dark:text-white">{reviews.length}</p>
                      <span className="text-[11px] text-secondary dark:text-white/50 mt-1 block">Average Rating: 4.9 / 5.0</span>
                    </div>
                  </div>

                  {/* Inventory Status Breakdown Pipeline */}
                  <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-primary dark:text-white mb-4">
                      Physical Unit Lifecycle Matrix
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-center">
                        <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 tracking-wider block">Available</span>
                        <span className="text-2xl font-light text-emerald-900 dark:text-emerald-200 mt-1 block">{availableCount}</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900 text-center">
                        <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 tracking-wider block">Reserved</span>
                        <span className="text-2xl font-light text-amber-900 dark:text-amber-200 mt-1 block">{reservedCount}</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-center">
                        <span className="text-[10px] uppercase font-bold text-blue-800 dark:text-blue-300 tracking-wider block">Sold</span>
                        <span className="text-2xl font-light text-blue-900 dark:text-blue-200 mt-1 block">{soldCount}</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900 text-center">
                        <span className="text-[10px] uppercase font-bold text-purple-800 dark:text-purple-300 tracking-wider block">Returned</span>
                        <span className="text-2xl font-light text-purple-900 dark:text-purple-200 mt-1 block">{serials.filter(s => s.status === 'returned').length}</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900 text-center">
                        <span className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-300 tracking-wider block">Damaged</span>
                        <span className="text-2xl font-light text-rose-900 dark:text-rose-200 mt-1 block">{damagedCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Products Quick Grid */}
                  <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-primary dark:text-white">Catalog Quick Glance</h3>
                      <button onClick={() => setActiveTab('products')} className="text-xs text-primary dark:text-[#D4AF37] hover:underline font-semibold">
                        View All Products →
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {products.slice(0, 4).map(p => (
                        <div key={p.id} className="border border-border dark:border-[#2E2925] rounded-2xl p-3 bg-warm-white dark:bg-[#151311]">
                          <img src={p.images?.[0] || '/placeholder-image.jpg'} alt={p.name} className="w-full aspect-[4/3] object-cover rounded-xl mb-2" />
                          <h4 className="text-xs font-semibold text-primary dark:text-white truncate">{p.name}</h4>
                          <p className="text-[11px] font-mono text-secondary dark:text-white/50 mt-0.5">{p.sku}</p>
                          <div className="flex justify-between items-center mt-2 text-xs">
                            <span className="font-semibold text-primary dark:text-[#D4AF37]">₹{p.price.toLocaleString('en-IN')}</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">{p.quantity} Units</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTS CATALOG */}
              {activeTab === 'products' && (
                <div className="bg-white dark:bg-[#1A1816] rounded-3xl border border-border dark:border-[#2E2925] shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-border dark:border-[#2E2925] flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-primary dark:text-white">Master Product Models</h3>
                      <p className="text-xs text-secondary dark:text-white/60">All manufactured models and SKU assignments</p>
                    </div>
                    <Link
                      to="/admin/products/new"
                      className="inline-flex items-center gap-1.5 bg-primary dark:bg-[#D4AF37] text-white dark:text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
                    >
                      <Plus size={14} /> Add Product
                    </Link>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-cream/40 dark:bg-white/5 text-secondary dark:text-white/60 uppercase tracking-wider text-[10px] border-b border-border dark:border-[#2E2925]">
                        <tr>
                          <th className="p-4">Product</th>
                          <th className="p-4">SKU</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Supplier</th>
                          <th className="p-4">Inventory</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border dark:divide-[#2E2925]">
                        {products.map(product => (
                          <tr key={product.id} className="hover:bg-cream/20 dark:hover:bg-white/5 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                              <img
                                src={product.images?.[0] || '/placeholder-image.jpg'}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded-lg border border-border dark:border-[#2E2925]"
                              />
                              <div>
                                <span className="font-semibold text-primary dark:text-white block">{product.name}</span>
                                {product.badge && (
                                  <span className="text-[9px] bg-cream dark:bg-white/10 px-1.5 py-0.5 rounded text-secondary dark:text-white/70 uppercase font-semibold">
                                    {product.badge}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 font-mono font-semibold text-primary dark:text-[#D4AF37]">{product.sku}</td>
                            <td className="p-4 text-secondary dark:text-white/70">{product.category}</td>
                            <td className="p-4 font-medium text-primary dark:text-white">
                              ₹{product.price.toLocaleString('en-IN')}
                              {product.discount_price && (
                                <span className="text-[10px] text-secondary dark:text-white/40 line-through block">
                                  ₹{product.discount_price.toLocaleString('en-IN')}
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-secondary dark:text-white/70">{product.supplier || 'N/A'}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                                Number(product.quantity) > 0 ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
                              }`}>
                                {product.quantity} Units
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenBarcodeHub(product)}
                                  title="Print Barcode & QR Labels"
                                  className="p-1.5 hover:bg-cream dark:hover:bg-white/10 rounded-lg text-secondary dark:text-white/70 hover:text-primary dark:hover:text-white transition-colors"
                                >
                                  <Printer size={15} />
                                </button>
                                <AdminProductModifyButton product={product} onProductUpdated={handleProductUpdated} />
                                <button
                                  onClick={() => handleProductDeleted(product.id)}
                                  className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 rounded-lg transition-colors"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: INVENTORY MATRIX */}
              {activeTab === 'inventory' && (
                <div className="space-y-6">
                  {/* Filter Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#1A1816] p-4 rounded-3xl border border-border dark:border-[#2E2925]">
                    <div className="relative w-full sm:w-72">
                      <input
                        type="text"
                        placeholder="Search serial number or model..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-cream/40 dark:bg-white/5 border border-border dark:border-[#2E2925] rounded-xl outline-none focus:bg-white dark:focus:bg-black/40 text-primary dark:text-white"
                      />
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary dark:text-white/50" />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                      {['all', 'available', 'reserved', 'sold', 'returned', 'damaged'].map(st => (
                        <button
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider ${
                            statusFilter === st ? 'bg-primary dark:bg-[#D4AF37] text-white dark:text-black' : 'bg-cream/50 dark:bg-white/5 text-secondary dark:text-white/60 hover:bg-cream dark:hover:bg-white/10'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Serial Units Table */}
                  <div className="bg-white dark:bg-[#1A1816] rounded-3xl border border-border dark:border-[#2E2925] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-cream/40 dark:bg-white/5 text-secondary dark:text-white/60 uppercase tracking-wider text-[10px] border-b border-border dark:border-[#2E2925]">
                          <tr>
                            <th className="p-4">Serial Number</th>
                            <th className="p-4">Associated Model</th>
                            <th className="p-4">Current Status</th>
                            <th className="p-4">Gift Claim Status</th>
                            <th className="p-4">Registered Date</th>
                            <th className="p-4 text-right">Update Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border dark:divide-[#2E2925]">
                          {filteredSerials.map(serial => (
                            <tr key={serial.id} className="hover:bg-cream/20 dark:hover:bg-white/5 transition-colors">
                              <td className="p-4 font-mono font-semibold text-primary dark:text-[#D4AF37]">{serial.serial_number}</td>
                              <td className="p-4">
                                <span className="font-medium text-primary dark:text-white block">{serial.product?.name || 'Unknown'}</span>
                                <span className="text-[10px] font-mono text-secondary dark:text-white/50">{serial.product?.sku}</span>
                              </td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                  serial.status === 'available' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' :
                                  serial.status === 'reserved' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300' :
                                  serial.status === 'sold' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300' :
                                  serial.status === 'returned' ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300' :
                                  'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300'
                                }`}>
                                  {serial.status}
                                </span>
                              </td>
                              <td className="p-4">
                                {serial.gift_claimed ? (
                                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Claimed
                                  </span>
                                ) : (
                                  <span className="text-secondary dark:text-white/50">Unclaimed</span>
                                )}
                              </td>
                              <td className="p-4 text-secondary dark:text-white/60">
                                {new Date(serial.created_at).toLocaleDateString()}
                              </td>
                              <td className="p-4 text-right">
                                <select
                                  value={serial.status}
                                  onChange={(e) => handleUpdateSerialStatus(serial.id, e.target.value as ProductSerialRow['status'])}
                                  className="text-xs bg-cream/40 dark:bg-white/5 border border-border dark:border-[#2E2925] rounded-xl px-2 py-1 outline-none font-semibold text-primary dark:text-white"
                                >
                                  <option value="available" className="dark:bg-[#1A1816]">Available</option>
                                  <option value="reserved" className="dark:bg-[#1A1816]">Reserved</option>
                                  <option value="sold" className="dark:bg-[#1A1816]">Sold</option>
                                  <option value="returned" className="dark:bg-[#1A1816]">Returned</option>
                                  <option value="damaged" className="dark:bg-[#1A1816]">Damaged</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ORDERS */}
              {activeTab === 'orders' && (
                <div className="bg-white dark:bg-[#1A1816] rounded-3xl border border-border dark:border-[#2E2925] shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-border dark:border-[#2E2925]">
                    <h3 className="text-sm font-semibold text-primary dark:text-white">Orders Pipeline</h3>
                    <p className="text-xs text-secondary dark:text-white/60">Track confirmed purchases and fulfillment status</p>
                  </div>
                  {orders.length === 0 ? (
                    <div className="p-12 text-center text-secondary dark:text-white/50 text-xs">
                      No active orders found in the database.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-cream/40 dark:bg-white/5 text-secondary dark:text-white/60 uppercase tracking-wider text-[10px] border-b border-border dark:border-[#2E2925]">
                          <tr>
                            <th className="p-4">Order #</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Total Amount</th>
                            <th className="p-4">Items</th>
                            <th className="p-4">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border dark:divide-[#2E2925]">
                          {orders.map(order => (
                            <tr key={order.id} className="hover:bg-cream/20 dark:hover:bg-white/5">
                              <td className="p-4 font-mono font-semibold text-primary dark:text-[#D4AF37]">{order.order_number}</td>
                              <td className="p-4">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                                  {order.status}
                                </span>
                              </td>
                              <td className="p-4 font-semibold text-primary dark:text-white">₹{Number(order.total).toLocaleString('en-IN')}</td>
                              <td className="p-4 text-secondary dark:text-white/70">{order.items?.length || 1} Item(s)</td>
                              <td className="p-4 text-secondary dark:text-white/60">{new Date(order.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: GIFT REDEMPTIONS */}
              {activeTab === 'gifts' && (
                <div className="bg-white dark:bg-[#1A1816] rounded-3xl border border-border dark:border-[#2E2925] shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-border dark:border-[#2E2925]">
                    <h3 className="text-sm font-semibold text-primary dark:text-white">QR Gift Redemption Audit Log</h3>
                    <p className="text-xs text-secondary dark:text-white/60">Verified physical serial claims and single-use vouchers</p>
                  </div>
                  {giftClaims.length === 0 ? (
                    <div className="p-12 text-center text-secondary dark:text-white/50 text-xs">
                      No redeemed gift claims recorded yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-cream/40 dark:bg-white/5 text-secondary dark:text-white/60 uppercase tracking-wider text-[10px] border-b border-border dark:border-[#2E2925]">
                          <tr>
                            <th className="p-4">Serial Number</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Voucher Code</th>
                            <th className="p-4">Redemption Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border dark:divide-[#2E2925]">
                          {giftClaims.map(gift => (
                            <tr key={gift.id} className="hover:bg-cream/20 dark:hover:bg-white/5">
                              <td className="p-4 font-mono font-semibold text-primary dark:text-[#D4AF37]">{gift.serial?.serial_number || 'N/A'}</td>
                              <td className="p-4 text-secondary dark:text-white/70">{gift.customer?.email || 'Anonymous Verified User'}</td>
                              <td className="p-4 font-mono text-[#D4AF37] font-bold">JORIQUE-GIFT</td>
                              <td className="p-4 text-secondary dark:text-white/60">{new Date(gift.redeemed_at).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: CUSTOMER REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="bg-white dark:bg-[#1A1816] rounded-3xl border border-border dark:border-[#2E2925] shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-border dark:border-[#2E2925]">
                    <h3 className="text-sm font-semibold text-primary dark:text-white">Product Reviews & Ratings</h3>
                    <p className="text-xs text-secondary dark:text-white/60">Verified customer feedback linked to physical product units</p>
                  </div>
                  {reviews.length === 0 ? (
                    <div className="p-12 text-center text-secondary dark:text-white/50 text-xs">
                      No customer reviews submitted yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-border dark:divide-[#2E2925]">
                      {reviews.map(rev => (
                        <div key={rev.id} className="p-5 hover:bg-cream/20 dark:hover:bg-white/5 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="flex text-[#D4AF37]">
                                {[...Array(rev.rating)].map((_, i) => (
                                  <Star key={i} size={14} fill="currentColor" />
                                ))}
                              </div>
                              <span className="font-semibold text-primary dark:text-white text-xs">{rev.product?.name || 'Verified Product'}</span>
                            </div>
                            <span className="text-[11px] text-secondary dark:text-white/50">{new Date(rev.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-secondary dark:text-white/70 leading-relaxed">{rev.comment || 'No written comment provided.'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: SUPPLIERS */}
              {activeTab === 'suppliers' && (
                <div className="bg-white dark:bg-[#1A1816] rounded-3xl border border-border dark:border-[#2E2925] shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-border dark:border-[#2E2925]">
                    <h3 className="text-sm font-semibold text-primary dark:text-white">Supplier & Mill Directory</h3>
                    <p className="text-xs text-secondary dark:text-white/60">Track textile mills, procurement costs, and active batches</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-cream/40 dark:bg-white/5 text-secondary dark:text-white/60 uppercase tracking-wider text-[10px] border-b border-border dark:border-[#2E2925]">
                        <tr>
                          <th className="p-4">Supplier / Mill Name</th>
                          <th className="p-4">Supplied Products</th>
                          <th className="p-4">Total Stock Supplied</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border dark:divide-[#2E2925]">
                        {Array.from(new Set(products.map(p => p.supplier).filter(Boolean))).map(supplier => {
                          const supplied = products.filter(p => p.supplier === supplier);
                          const totalUnits = supplied.reduce((sum, p) => sum + (p.quantity || 0), 0);
                          return (
                            <tr key={supplier as string} className="hover:bg-cream/20 dark:hover:bg-white/5">
                              <td className="p-4 font-semibold text-primary dark:text-white">{supplier}</td>
                              <td className="p-4 text-secondary dark:text-white/70">{supplied.map(p => p.name).join(', ')}</td>
                              <td className="p-4 font-medium text-emerald-700 dark:text-emerald-400">{totalUnits} Units</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 8: BARCODE HUB */}
              {activeTab === 'barcodes' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] shadow-sm">
                    <h3 className="text-sm font-semibold text-primary dark:text-white mb-1">Physical Packaging Label Generator</h3>
                    <p className="text-xs text-secondary dark:text-white/60 mb-6">Select any product to generate printable Code128 and QR label sheets</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {products.map(prod => (
                        <div key={prod.id} className="p-4 rounded-2xl border border-border dark:border-[#2E2925] bg-warm-white dark:bg-[#151311] flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-semibold text-primary dark:text-white">{prod.name}</h4>
                            <p className="text-[11px] font-mono text-secondary dark:text-white/50 mt-0.5">{prod.sku}</p>
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full inline-block mt-2 font-medium">
                              {prod.quantity} Physical Units
                            </span>
                          </div>
                          <button
                            onClick={() => handleOpenBarcodeHub(prod)}
                            className="mt-4 inline-flex items-center justify-center gap-1.5 bg-primary dark:bg-[#D4AF37] text-white dark:text-black py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-colors"
                          >
                            <Printer size={13} /> View Label Sheet
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* TAB 9: CATEGORY MANAGER */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-primary dark:text-white mb-1">Category & Subcategory Manager</h3>
                    <p className="text-xs text-secondary dark:text-white/60 mb-6">Create, rename, and delete product categories and their subcategories.</p>
                    <CategoryManager />
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>

      {/* Retail Packaging Barcode Sticker Label Sheet Modal */}
      {selectedProductForLabels && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1A1816] rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-border dark:border-[#2E2925]">
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-border dark:border-[#2E2925] bg-warm-white dark:bg-[#151311] gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream dark:bg-white/5 border border-border dark:border-[#2E2925] text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-1">
                  Packaging Sticker Studio
                </div>
                <h2 className="text-xl font-light text-primary dark:text-white">
                  Retail Packaging Barcode Labels
                </h2>
                <p className="text-xs text-secondary dark:text-white/60 mt-0.5">
                  {selectedProductForLabels.name} • SKU: <span className="font-mono text-primary dark:text-[#D4AF37]">{selectedProductForLabels.sku}</span> • Price: ₹{selectedProductForLabels.price}
                </p>
              </div>

              {/* Customization Options Bar */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Badge input / preset */}
                <div className="flex items-center gap-1.5 bg-cream/50 dark:bg-white/5 px-3 py-1 rounded-xl border border-border dark:border-[#2E2925]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-secondary dark:text-white/60">Badge:</span>
                  <input
                    type="text"
                    placeholder="e.g. Bestseller / 100% Cotton"
                    value={labelCustomBadge}
                    onChange={(e) => setLabelCustomBadge(e.target.value)}
                    className="bg-white dark:bg-[#1A1816] text-primary dark:text-white text-xs px-2 py-1 rounded border border-border dark:border-[#2E2925] w-36 outline-none font-semibold"
                  />
                </div>

                <label className="inline-flex items-center gap-2 text-xs font-semibold text-secondary dark:text-white/70 cursor-pointer bg-cream/50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-border dark:border-[#2E2925]">
                  <input
                    type="checkbox"
                    checked={labelShowChannels}
                    onChange={(e) => setLabelShowChannels(e.target.checked)}
                    className="accent-[#3F3A36] dark:accent-[#D4AF37] rounded"
                  />
                  <span>Marketplace Badges</span>
                </label>

                <label className="inline-flex items-center gap-2 text-xs font-semibold text-secondary dark:text-white/70 cursor-pointer bg-cream/50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-border dark:border-[#2E2925]">
                  <input
                    type="checkbox"
                    checked={labelShowQR}
                    onChange={(e) => setLabelShowQR(e.target.checked)}
                    className="accent-[#3F3A36] dark:accent-[#D4AF37] rounded"
                  />
                  <span>Include QR Code</span>
                </label>

                <button
                  onClick={() => setSelectedProductForLabels(null)}
                  className="p-2 hover:bg-cream dark:hover:bg-white/10 rounded-full transition-colors text-secondary dark:text-white/60 ml-auto"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Grid of Real Packaging Labels */}
            <div className="p-6 overflow-y-auto flex-1 bg-gray-100 dark:bg-[#100E0D]">
              {loadingLabels ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3">
                  <Loader2 size={28} className="animate-spin text-primary dark:text-[#D4AF37]" />
                  <p className="text-xs font-semibold tracking-wider text-secondary uppercase">Generating High-Res Barcode Stickers...</p>
                </div>
              ) : labelSerials.length === 0 ? (
                <div className="py-16 text-center text-xs text-secondary dark:text-white/50">
                  No individual serial units found for this product.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {labelSerials.map((serial) => (
                    <ProductPackagingLabel
                      key={serial}
                      productName={selectedProductForLabels.name}
                      sku={selectedProductForLabels.sku}
                      serialNumber={serial}
                      price={selectedProductForLabels.price}
                      discountPrice={selectedProductForLabels.discount_price}
                      badge={labelCustomBadge}
                      cost={selectedProductForLabels.cost}
                      category={selectedProductForLabels.category}
                      showChannels={labelShowChannels}
                      showQR={labelShowQR}
                      className="shadow-md hover:shadow-lg transition-shadow"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-t border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] gap-3">
              <span className="text-xs text-secondary dark:text-white/60">
                {labelSerials.length} Authentic Unit Stickers Ready for Thermal/Standard Sheet Printing
              </span>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-primary dark:bg-[#D4AF37] text-white dark:text-black px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-md hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-all"
                >
                  <Printer size={14} /> Print Sticker Sheet
                </button>
                <button
                  onClick={() => setSelectedProductForLabels(null)}
                  className="px-6 py-2.5 border border-border dark:border-[#2E2925] rounded-xl text-xs font-bold uppercase tracking-[0.2em] text-secondary dark:text-white/70 hover:bg-cream dark:hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}