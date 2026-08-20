import { useEffect, useState } from 'react';
import { Loader2, PackageCheck, Users, WalletCards } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { dashboardRequest } from '../lib/api';

interface AdminDashboardData {
  stats: { label: string; value: string }[];
  activity: string[];
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    dashboardRequest<AdminDashboardData>('admin', token)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load admin dashboard.'));
  }, [token]);

  const icons = [WalletCards, PackageCheck, Users, PackageCheck];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-secondary mb-4">
              Admin Dashboard
            </p>
            <h1 className="text-3xl lg:text-4xl font-light text-primary tracking-wide">
              Store Overview
            </h1>
          </div>

          {error && <p className="mb-6 text-sm text-red-600">{error}</p>}

          {!data && !error ? (
            <div className="py-20 flex justify-center">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_360px] gap-8">
              <section>
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                  {(data?.stats || []).map((stat, index) => {
                    const Icon = icons[index] || PackageCheck;
                    return (
                      <div key={stat.label} className="bg-white border border-border rounded-lg p-6">
                        <Icon size={18} className="text-primary mb-5" />
                        <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-light text-primary">{stat.value}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white border border-border rounded-lg p-6">
                  <h2 className="text-sm font-medium tracking-widest uppercase text-primary mb-6">
                    Order Pipeline
                  </h2>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {['Pending', 'Packing', 'Dispatched'].map((status, index) => (
                      <div key={status} className="border border-border rounded-lg p-5 bg-warm-white">
                        <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                          {status}
                        </p>
                        <p className="text-2xl font-light text-primary">{[9, 14, 22][index]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <aside className="bg-white border border-border rounded-lg p-6 h-fit">
                <h2 className="text-sm font-medium tracking-widest uppercase text-primary mb-5">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {(data?.activity || []).map((item) => (
                    <div key={item} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
                      <p className="text-sm text-secondary leading-relaxed">{item}</p>
                    </div>
                  ))}
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
