import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Loader2,
  Package,
  ShoppingBag,
  Star,
  Sparkles,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  MessageCircle,
  Copy,
  Check,
  User,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { dashboardRequest } from '../lib/api';
import { orderService, StoredOrder } from '../lib/api/orders';

interface UserDashboardData {
  welcome: string;
  stats: { label: string; value: string }[];
  recentOrders: { id: string; status: string; total: string }[];
}

export default function UserDashboard() {
  const { user, token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // UI state for order history
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const setActiveTab = (tab: string) => {
    setSearchParams(tab === 'overview' ? {} : { tab });
  };

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      setError('');

      try {
        // 1. Load basic dashboard stats from backend
        if (token) {
          try {
            const data = await dashboardRequest<UserDashboardData>('user', token);
            if (isMounted) setDashboardData(data);
          } catch (e) {
            console.warn('Dashboard stats fallback:', e);
          }
        }

        // 2. Load comprehensive order history from orderService (Supabase + Local Cache)
        const userOrders = await orderService.getUserOrders(user?.id);
        if (isMounted) {
          setOrders(userOrders);
          // Expand first order by default if exists
          if (userOrders.length > 0) {
            setExpandedOrders({ [userOrders[0].order_number]: true });
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load profile data.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [token, user?.id]);

  const toggleOrderExpand = (orderNumber: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderNumber]: !prev[orderNumber],
    }));
  };

  const copyOrderNumber = (orderNum: string) => {
    navigator.clipboard.writeText(orderNum);
    setCopiedId(orderNum);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (orderFilter !== 'all') {
        const s = (order.status || '').toLowerCase();
        if (orderFilter === 'pending' && s !== 'pending' && s !== 'processing' && s !== 'confirmed') {
          return false;
        }
        if (orderFilter === 'shipped' && s !== 'shipped') {
          return false;
        }
        if (orderFilter === 'delivered' && s !== 'delivered') {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNum = order.order_number.toLowerCase().includes(q);
        const matchesItems = (order.items || []).some((item) =>
          item.name.toLowerCase().includes(q) || (item.sku && item.sku.toLowerCase().includes(q))
        );
        return matchesNum || matchesItems;
      }

      return true;
    });
  }, [orders, orderFilter, searchQuery]);

  const getStatusBadge = (status: string) => {
    const s = (status || 'pending').toLowerCase();
    if (s === 'delivered') {
      return {
        label: 'Delivered',
        bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        icon: <CheckCircle2 size={12} className="text-emerald-500" />,
      };
    }
    if (s === 'shipped') {
      return {
        label: 'Dispatched / In Transit',
        bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        icon: <Truck size={12} className="text-blue-500" />,
      };
    }
    if (s === 'confirmed' || s === 'processing') {
      return {
        label: 'Crafting in Atelier',
        bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        icon: <Clock size={12} className="text-indigo-500" />,
      };
    }
    return {
      label: 'Order Placed',
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      icon: <Clock size={12} className="text-amber-500" />,
    };
  };

  const openWhatsAppTrack = (order: StoredOrder) => {
    const phone = '919555238241';
    const text = encodeURIComponent(
      `Hello JORIQUE Concierge, I would like to check the tracking status for my Order #${order.order_number}.\n\nTotal: ₹${Number(order.total || 0).toLocaleString('en-IN')}\nAccount: ${user?.email || 'Patron'}`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB] transition-colors duration-300">
      <SEO
        title="Client Atelier & Order Sanctuary | JORIQUE"
        description="Private patron account dashboard for order tracking, bespoke inquiries, and shipping status."
        noindex={true}
      />
      <Navbar />

      <main className="pt-28 pb-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* HEADER: Client Welcome & Quick Actions */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-border/70 dark:border-[#2E2925]">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cream dark:bg-white/5 border border-border dark:border-[#2E2925] text-[11px] font-bold tracking-[0.22em] uppercase text-secondary dark:text-[#D4AF37] mb-3">
                <Sparkles size={12} className="text-[#C6A96B] dark:text-[#D4AF37]" />
                Client Atelier & Profile
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-light text-primary dark:text-white tracking-tight">
                {dashboardData?.welcome || `Welcome back, ${user?.fullName || user?.email?.split('@')[0] || 'Patron'}`}
              </h1>
              <p className="text-xs sm:text-sm text-secondary dark:text-white/60 mt-1 font-light">
                {user?.email} • Verified Member
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold tracking-widest uppercase px-5 py-3 rounded-xl hover:opacity-90 transition-all shadow-md"
              >
                <ShoppingBag size={14} />
                Explore Shop
              </Link>
            </div>
          </div>

          {/* NAVIGATION TABS: Overview vs Order History vs Privileges */}
          <div className="flex items-center gap-2 sm:gap-3 border-b border-border dark:border-[#2E2925] overflow-x-auto pb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${activeTab === 'overview'
                ? 'border-primary dark:border-[#D4AF37] text-primary dark:text-[#D4AF37]'
                : 'border-transparent text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white'
                }`}
            >
              <User size={14} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${activeTab === 'orders'
                ? 'border-primary dark:border-[#D4AF37] text-primary dark:text-[#D4AF37]'
                : 'border-transparent text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white'
                }`}
            >
              <Package size={14} />
              <span>Order History</span>
              {orders.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-[10px] rounded-full bg-cream dark:bg-white/10 text-primary dark:text-white font-bold">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('privileges')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${activeTab === 'privileges'
                ? 'border-primary dark:border-[#D4AF37] text-primary dark:text-[#D4AF37]'
                : 'border-transparent text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white'
                }`}
            >
              <Star size={14} />
              <span>Member Privileges</span>
            </button>
          </div>

          {error && <p className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">{error}</p>}

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-3">
              <Loader2 size={28} className="animate-spin text-[#C6A96B] dark:text-[#D4AF37]" />
              <p className="text-xs uppercase tracking-widest text-secondary dark:text-white/60 font-semibold">
                Accessing Client Ledger...
              </p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
                  <div className="space-y-8">
                    {/* Summary statistics */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-2xl p-5 shadow-xs">
                        <p className="text-[10px] font-bold tracking-widest uppercase text-secondary dark:text-white/60 mb-2">
                          Total Orders
                        </p>
                        <p className="text-2xl sm:text-3xl font-light text-primary dark:text-white">
                          {String(orders.length || dashboardData?.recentOrders?.length || 0).padStart(2, '0')}
                        </p>
                      </div>

                      {/* <div className="bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-2xl p-5 shadow-xs">
                        <p className="text-[10px] font-bold tracking-widest uppercase text-secondary dark:text-white/60 mb-2">
                          Client Tier
                        </p>
                        <p className="text-xl sm:text-2xl font-light text-[#C6A96B] dark:text-[#D4AF37]">
                          Patron
                        </p>
                      </div> */}

                      <div className="col-span-2 sm:col-span-1 bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-2xl p-5 shadow-xs">
                        <p className="text-[10px] font-bold tracking-widest uppercase text-secondary dark:text-white/60 mb-2">
                          Authentication
                        </p>
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                          <ShieldCheck size={16} /> Verified
                        </div>
                      </div>
                    </div>

                    {/* Recent Orders Card */}
                    <div className="bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-3xl overflow-hidden shadow-xs">
                      <div className="px-6 py-4.5 border-b border-border dark:border-[#2E2925] flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Package size={16} className="text-[#C6A96B] dark:text-[#D4AF37]" />
                          <h2 className="text-xs font-bold tracking-widest uppercase text-primary dark:text-white">
                            Recent Orders
                          </h2>
                        </div>
                        <button
                          onClick={() => setActiveTab('orders')}
                          className="text-[11px] font-bold tracking-wider uppercase text-primary dark:text-[#D4AF37] hover:underline inline-flex items-center gap-1"
                        >
                          View Full History <ArrowRight size={12} />
                        </button>
                      </div>

                      {orders.length === 0 ? (
                        <div className="p-10 text-center space-y-3">
                          <Package size={32} className="mx-auto text-secondary/40 dark:text-white/20" strokeWidth={1} />
                          <p className="text-xs text-secondary dark:text-white/60">No orders placed yet.</p>
                          <Link
                            to="/shop"
                            className="inline-block text-xs font-bold uppercase tracking-wider text-[#C6A96B] dark:text-[#D4AF37] hover:underline"
                          >
                            Browse Our Collections →
                          </Link>
                        </div>
                      ) : (
                        <div className="divide-y divide-border/60 dark:divide-[#2E2925]">
                          {orders.slice(0, 3).map((order) => {
                            const badge = getStatusBadge(order.status);
                            return (
                              <div
                                key={order.order_number}
                                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-cream/20 dark:hover:bg-white/[0.02] transition-colors"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold font-mono text-primary dark:text-white">
                                      #{order.order_number}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                                      {badge.icon}
                                      <span>{badge.label}</span>
                                    </span>
                                  </div>
                                  <p className="text-xs text-secondary dark:text-white/60">
                                    {(order.items || []).length} item(s) •{' '}
                                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-4">
                                  <span className="text-base font-semibold text-primary dark:text-[#D4AF37]">
                                    ₹{Number(order.total || 0).toLocaleString('en-IN')}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setActiveTab('orders');
                                      setExpandedOrders({ [order.order_number]: true });
                                    }}
                                    className="text-xs font-bold text-secondary dark:text-white/70 hover:text-primary dark:hover:text-[#D4AF37] underline cursor-pointer"
                                  >
                                    Details
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar Privileges */}
                  <aside className="space-y-6">
                    <div className="bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-3xl p-6 shadow-xs">
                      <div className="w-10 h-10 rounded-2xl bg-cream dark:bg-white/10 flex items-center justify-center mb-4 text-[#C6A96B] dark:text-[#D4AF37]">
                        <Star size={18} />
                      </div>
                      <h2 className="text-lg font-serif font-light text-primary dark:text-white mb-2">
                        Member Privileges
                      </h2>
                      <p className="text-xs text-secondary dark:text-white/70 leading-relaxed mb-6">
                        Access bespoke monogramming, express courier priority, and exclusive previews of curated handloom weaves.
                      </p>
                      <div className="space-y-3 text-xs text-secondary dark:text-white/70">
                        <p className="flex items-center gap-2">✦ Early access to seasonal drops</p>
                        <p className="flex items-center gap-2">✦ Direct WhatsApp artisan concierge</p>
                        <p className="flex items-center gap-2">✦ Complimentary shipping on all orders</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-cream/40 dark:bg-white/5 border border-border dark:border-[#2E2925] space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-primary dark:text-white">
                        Need assistance with an order?
                      </h3>
                      <p className="text-xs text-secondary dark:text-white/70 leading-relaxed">
                        Our master atelier concierge is available via WhatsApp for sizing consultations, packaging requests, or dispatch status.
                      </p>
                      <a
                        href="https://wa.me/919555238241?text=Hello%20JORIQUE%2C%20I%20have%20an%20inquiry%20regarding%20my%20orders."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
                      >
                        <MessageCircle size={14} /> Connect on WhatsApp
                      </a>
                    </div>
                  </aside>
                </div>
              )}

              {/* TAB 2: ORDER HISTORY (FULL DEDICATED SECTION) */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  {/* Filters and search bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] p-3 sm:p-4 rounded-2xl shadow-xs">
                    {/* Status filter chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                      {(
                        [
                          { id: 'all', label: 'All Orders' },
                          { id: 'pending', label: 'Pending' },
                          { id: 'shipped', label: 'In Transit' },
                          { id: 'delivered', label: 'Delivered' },
                        ] as const
                      ).map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setOrderFilter(f.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${orderFilter === f.id
                            ? 'bg-primary dark:bg-[#D4AF37] text-white dark:text-black shadow-xs'
                            : 'bg-cream/40 dark:bg-white/5 text-secondary dark:text-white/70 hover:bg-cream dark:hover:bg-white/10'
                            }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>

                    {/* Search box */}
                    <div className="relative min-w-[240px]">
                      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary/60 dark:text-white/40" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by Order # or Item..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-cream/30 dark:bg-white/5 border border-border dark:border-[#2E2925] text-xs text-primary dark:text-white placeholder:text-secondary/50 dark:placeholder:text-white/30 focus:outline-none focus:border-primary/60 dark:focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  {/* Orders List */}
                  {filteredOrders.length === 0 ? (
                    <div className="bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-3xl p-12 text-center space-y-4 shadow-xs">
                      <div className="w-14 h-14 rounded-2xl bg-cream dark:bg-white/5 flex items-center justify-center mx-auto text-secondary/50 dark:text-white/30">
                        <Package size={28} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-1 max-w-sm mx-auto">
                        <h3 className="text-base font-serif font-light text-primary dark:text-white">
                          No orders match your filter
                        </h3>
                        <p className="text-xs text-secondary dark:text-white/60">
                          {orders.length === 0
                            ? 'You have not placed any orders yet. Discover our artisanal pieces in the shop.'
                            : 'Try adjusting your search query or selecting a different status filter.'}
                        </p>
                      </div>
                      {orders.length === 0 && (
                        <Link
                          to="/shop"
                          className="inline-flex items-center gap-2 bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-xl hover:opacity-90 transition-all"
                        >
                          <ShoppingBag size={14} /> Shop Now
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((order) => {
                        const isExpanded = !!expandedOrders[order.order_number];
                        const badge = getStatusBadge(order.status);
                        const items = order.items || [];
                        const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        });

                        return (
                          <div
                            key={order.order_number}
                            className="bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-3xl overflow-hidden shadow-xs transition-all hover:border-border/90 dark:hover:border-[#3E3833]"
                          >
                            {/* Order Summary Header Bar */}
                            <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 dark:border-[#2E2925] bg-cream/20 dark:bg-white/[0.01]">
                              <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2.5">
                                  <span className="text-base font-bold font-mono text-primary dark:text-white">
                                    #{order.order_number}
                                  </span>
                                  <button
                                    onClick={() => copyOrderNumber(order.order_number)}
                                    title="Copy Order ID"
                                    className="p-1 rounded-md text-secondary/60 dark:text-white/40 hover:text-primary dark:hover:text-white hover:bg-cream dark:hover:bg-white/10 transition-colors"
                                  >
                                    {copiedId === order.order_number ? (
                                      <Check size={13} className="text-emerald-500" />
                                    ) : (
                                      <Copy size={13} />
                                    )}
                                  </button>
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                                    {badge.icon}
                                    <span>{badge.label}</span>
                                  </span>
                                </div>
                                <p className="text-xs text-secondary dark:text-white/60 flex items-center gap-2">
                                  <span>Placed on {formattedDate}</span>
                                  <span>•</span>
                                  <span>{items.length} {items.length === 1 ? 'item' : 'items'}</span>
                                </p>
                              </div>

                              <div className="flex items-center justify-between md:justify-end gap-5">
                                <div className="text-left md:text-right">
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-secondary dark:text-white/50">
                                    Order Total
                                  </p>
                                  <p className="text-lg font-semibold text-primary dark:text-[#D4AF37]">
                                    ₹{Number(order.total || 0).toLocaleString('en-IN')}
                                  </p>
                                </div>

                                <button
                                  onClick={() => toggleOrderExpand(order.order_number)}
                                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cream/50 dark:bg-white/5 hover:bg-cream dark:hover:bg-white/10 text-xs font-semibold text-primary dark:text-white transition-all cursor-pointer"
                                >
                                  <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                              </div>
                            </div>

                            {/* Collapsible Order Details Body */}
                            {isExpanded && (
                              <div className="p-5 sm:p-6 space-y-6">
                                {/* Items list */}
                                <div className="space-y-3">
                                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-secondary/70 dark:text-white/50">
                                    Items In This Order ({items.length})
                                  </h4>
                                  <div className="divide-y divide-border/60 dark:divide-[#2E2925] border border-border/70 dark:border-[#2E2925] rounded-2xl overflow-hidden">
                                    {items.map((item, idx) => {
                                      const lineTotal = (item.price || 0) * (item.quantity || 1);
                                      return (
                                        <div
                                          key={`${item.product_id || idx}-${idx}`}
                                          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1A1816]"
                                        >
                                          <div className="space-y-0.5">
                                            <p className="text-xs font-semibold text-primary dark:text-white">
                                              {item.name}
                                            </p>
                                            <p className="text-[11px] text-secondary dark:text-white/60 font-mono">
                                              {item.sku ? `SKU: ${item.sku} • ` : ''}Qty: {item.quantity} × ₹{Number(item.price || 0).toLocaleString('en-IN')}
                                            </p>
                                          </div>
                                          <p className="text-xs font-bold text-primary dark:text-white">
                                            ₹{lineTotal.toLocaleString('en-IN')}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Delivery & Destination Information */}
                                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                                  {order.shipping_address && (
                                    <div className="p-4 rounded-2xl bg-cream/30 dark:bg-white/5 border border-border/60 dark:border-[#2E2925] space-y-1.5">
                                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary dark:text-white">
                                        <MapPin size={13} className="text-[#C6A96B] dark:text-[#D4AF37]" />
                                        <span>Shipping Address</span>
                                      </div>
                                      <p className="text-xs text-secondary dark:text-white/70 leading-relaxed">
                                        {order.shipping_address}
                                      </p>
                                    </div>
                                  )}

                                  <div className="p-4 rounded-2xl bg-cream/30 dark:bg-white/5 border border-border/60 dark:border-[#2E2925] space-y-2 flex flex-col justify-between">
                                    <div>
                                      <p className="text-xs font-bold uppercase tracking-wider text-primary dark:text-white mb-1">
                                        Fulfillment & Tracking
                                      </p>
                                      <p className="text-xs text-secondary dark:text-white/70">
                                        {order.payment_method || 'WhatsApp Order Verified'} • Inspection Passed
                                      </p>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex flex-wrap items-center gap-2 pt-2">
                                      <button
                                        onClick={() => openWhatsAppTrack(order)}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                                      >
                                        <MessageCircle size={13} />
                                        <span>Track On WhatsApp</span>
                                      </button>

                                      <Link
                                        to="/shop"
                                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white dark:bg-white/10 border border-border dark:border-white/15 text-xs font-semibold text-primary dark:text-white hover:bg-cream/40 transition-colors"
                                      >
                                        <span>Shop Again</span>
                                        <ExternalLink size={12} />
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MEMBER PRIVILEGES */}
              {activeTab === 'privileges' && (
                <div className="max-w-4xl space-y-6">
                  <div className="bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-cream dark:bg-white/10 flex items-center justify-center text-[#C6A96B] dark:text-[#D4AF37]">
                        <Star size={22} />
                      </div>
                      <div>
                        <h2 className="text-xl font-serif font-light text-primary dark:text-white">
                          Patron Tier Benefits
                        </h2>
                        <p className="text-xs text-secondary dark:text-white/60">
                          Handcrafted textile provenance and concierge privileges
                        </p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-cream/30 dark:bg-white/5 border border-border/60 dark:border-[#2E2925] space-y-1.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary dark:text-white">
                          QR Authenticity Guarantee
                        </h4>
                        <p className="text-xs text-secondary dark:text-white/70 leading-relaxed">
                          Every suit and cushion carries a tamper-evident woven serial number. Scan to verify thread counts, master weaver certificates, and care instructions.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-cream/30 dark:bg-white/5 border border-border/60 dark:border-[#2E2925] space-y-1.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary dark:text-white">
                          Express Artisan Packaging
                        </h4>
                        <p className="text-xs text-secondary dark:text-white/70 leading-relaxed">
                          Orders are pre-inspected under high-CRI daylight lamps, folded with acid-free tissue wrap, and dispatched in weatherproof luxury cases.
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/60 dark:border-[#2E2925] flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="text-xs text-secondary dark:text-white/60">
                        Have questions regarding custom sizing or bulk gifting?
                      </span>
                      <a
                        href="https://wa.me/919555238241"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C6A96B] dark:text-[#D4AF37] hover:underline"
                      >
                        Contact Atelier Concierge →
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
