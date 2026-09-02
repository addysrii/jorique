import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Package, ShoppingBag, Star, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { dashboardRequest } from '../lib/api';

interface UserDashboardData {
  welcome: string;
  stats: { label: string; value: string }[];
  recentOrders: { id: string; status: string; total: string }[];
}

export default function UserDashboard() {
  const { user, token } = useAuth();
  const [data, setData] = useState<UserDashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    dashboardRequest<UserDashboardData>('user', token)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load dashboard.'));
  }, [token]);

  return (
    <div className="min-h-screen bg-background dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB] transition-colors duration-300">
      <Navbar />
      <main className="pt-28 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream dark:bg-white/5 border border-border dark:border-[#2E2925] text-xs font-semibold tracking-[0.2em] uppercase text-secondary dark:text-[#D4AF37] mb-3">
                <Sparkles size={12} className="text-[#D4AF37]" />
                Client Portal
              </div>
              <h1 className="text-3xl lg:text-4xl font-light text-primary dark:text-white tracking-wide">
                {data?.welcome || `Welcome back, ${user?.fullName || 'there'}`}
              </h1>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold tracking-widest uppercase px-6 py-3.5 rounded-xl hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-colors shadow-md"
            >
              <ShoppingBag size={15} />
              Shop Collection
            </Link>
          </div>

          {error && <p className="mb-6 text-sm text-red-600 dark:text-red-400">{error}</p>}

          {!data && !error ? (
            <div className="py-20 flex justify-center">
              <Loader2 size={24} className="animate-spin text-primary dark:text-[#D4AF37]" />
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
              <section>
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  {(data?.stats || []).map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-2xl p-6 shadow-sm">
                      <p className="text-xs font-semibold tracking-widest uppercase text-secondary dark:text-white/60 mb-3">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-light text-primary dark:text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-3xl overflow-hidden shadow-sm">
                  <div className="px-6 py-5 border-b border-border dark:border-[#2E2925] flex items-center gap-3">
                    <Package size={17} className="text-primary dark:text-[#D4AF37]" />
                    <h2 className="text-sm font-semibold tracking-widest uppercase text-primary dark:text-white">
                      Recent Orders
                    </h2>
                  </div>
                  {(data?.recentOrders || []).length === 0 ? (
                    <div className="p-8 text-center text-xs text-secondary dark:text-white/50">
                      No active orders found.
                    </div>
                  ) : (
                    (data?.recentOrders || []).map((order) => (
                      <div key={order.id} className="px-6 py-5 border-b border-border dark:border-[#2E2925] last:border-b-0 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-primary dark:text-white">{order.id}</p>
                          <p className="text-xs text-secondary dark:text-white/50 mt-1">{order.status}</p>
                        </div>
                        <p className="text-sm font-semibold text-primary dark:text-[#D4AF37]">{order.total}</p>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <aside className="bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-3xl p-6 h-fit shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-cream dark:bg-white/10 flex items-center justify-center mb-5 text-[#D4AF37]">
                  <Star size={18} />
                </div>
                <h2 className="text-xl font-light text-primary dark:text-white mb-3">Member Privileges</h2>
                <p className="text-sm text-secondary dark:text-white/70 leading-relaxed mb-6">
                  Track authenticated serials, access single-use promotional vouchers, and preview curated linen drops before public release.
                </p>
                <div className="space-y-3 text-xs text-secondary dark:text-white/60">
                  <p className="flex items-center gap-2">✦ Early collection allocations</p>
                  <p className="flex items-center gap-2">✦ Priority customer concierge</p>
                  <p className="flex items-center gap-2">✦ Complimentary monogramming eligibility</p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
