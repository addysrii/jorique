import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Package, ShoppingBag, Star } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-medium tracking-[0.3em] uppercase text-secondary mb-4">
                User Dashboard
              </p>
              <h1 className="text-3xl lg:text-4xl font-light text-primary tracking-wide">
                {data?.welcome || `Welcome back, ${user?.fullName || 'there'}`}
              </h1>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white text-xs font-medium tracking-widest uppercase px-6 py-3.5 hover:bg-[#2a2623] transition-colors"
            >
              <ShoppingBag size={15} />
              Shop Collection
            </Link>
          </div>

          {error && <p className="mb-6 text-sm text-red-600">{error}</p>}

          {!data && !error ? (
            <div className="py-20 flex justify-center">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
              <section>
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  {(data?.stats || []).map((stat) => (
                    <div key={stat.label} className="bg-white border border-border rounded-lg p-6">
                      <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-light text-primary">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-border rounded-lg overflow-hidden">
                  <div className="px-6 py-5 border-b border-border flex items-center gap-3">
                    <Package size={17} className="text-primary" />
                    <h2 className="text-sm font-medium tracking-widest uppercase text-primary">
                      Recent Orders
                    </h2>
                  </div>
                  {(data?.recentOrders || []).map((order) => (
                    <div key={order.id} className="px-6 py-5 border-b border-border last:border-b-0 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-primary">{order.id}</p>
                        <p className="text-xs text-secondary mt-1">{order.status}</p>
                      </div>
                      <p className="text-sm text-primary">{order.total}</p>
                    </div>
                  ))}
                </div>
              </section>

              <aside className="bg-white border border-border rounded-lg p-6 h-fit">
                <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center mb-5">
                  <Star size={18} className="text-primary" />
                </div>
                <h2 className="text-xl font-light text-primary mb-3">Member Perks</h2>
                <p className="text-sm text-secondary leading-relaxed mb-6">
                  Track orders, build your wishlist, and preview curated bedding drops before they reach the shop.
                </p>
                <div className="space-y-3 text-sm text-secondary">
                  <p>Early collection access</p>
                  <p>Priority support</p>
                  <p>Reward points on every order</p>
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
