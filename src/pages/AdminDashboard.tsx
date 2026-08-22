import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, PackageCheck, Users, WalletCards, Plus, Boxes } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { dashboardRequest } from '../lib/api';
import { productService } from '../lib/api/products';
import { Product } from '../types';
import AdminProductModifyButton from '../components/AdminProductModifyButton'; // ✅ ADD THIS

interface AdminDashboardData {
  stats: { label: string; value: string }[];
  activity: string[];
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    dashboardRequest<AdminDashboardData>('admin', token)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load admin dashboard.'));
  }, [token]);

  // Fetch Real Products Dynamically
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const data = await productService.getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products for dashboard:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductUpdated = (updatedProduct: Product) => {
    // Update the state immediately
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const icons = [WalletCards, PackageCheck, Users, PackageCheck];
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  const totalCategories = new Set(products.map(p => p.category)).size;

  const realStats = data?.stats?.length ? data.stats : [
    { label: 'Total Products', value: String(totalProducts) },
    { label: 'Total Stock', value: String(totalStock) },
    { label: 'Categories', value: String(totalCategories) },
    { label: 'Revenue', value: 'N/A' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 flex items-start justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.3em] uppercase text-secondary mb-4">Admin Dashboard</p>
              <h1 className="text-3xl lg:text-4xl font-light text-primary tracking-wide">Store Overview</h1>
            </div>
            <Link to="/admin/products/new" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm">
              <Plus size={18} /> Add Product
            </Link>
          </div>

          {error && <p className="mb-6 text-sm text-red-600">{error}</p>}

          {(!data && !error) || loadingProducts ? (
            <div className="py-20 flex justify-center">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stats Section */}
              <div className="grid lg:grid-cols-[1fr_360px] gap-8 mb-12">
                <section>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    {realStats.map((stat, index) => {
                      const Icon = icons[index] || PackageCheck;
                      return (
                        <div key={stat.label} className="bg-white border border-border rounded-lg p-6">
                          <Icon size={18} className="text-primary mb-5" />
                          <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">{stat.label}</p>
                          <p className="text-3xl font-light text-primary">{stat.value}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-white border border-border rounded-lg p-6">
                    <h2 className="text-sm font-medium tracking-widest uppercase text-primary mb-6">Order Pipeline</h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {['Pending', 'Packing', 'Dispatched'].map((status, index) => (
                        <div key={status} className="border border-border rounded-lg p-5 bg-warm-white">
                          <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">{status}</p>
                          <p className="text-2xl font-light text-primary">{[9, 14, 22][index]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <aside className="bg-white border border-border rounded-lg p-6 h-fit">
                  <h2 className="text-sm font-medium tracking-widest uppercase text-primary mb-5">Recent Activity</h2>
                  <div className="space-y-4">
                    {(data?.activity || []).map((item) => (
                      <div key={item} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
                        <p className="text-sm text-secondary leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>

              {/* Dynamic Products Section */}
              <section className="bg-white border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-medium tracking-widest uppercase text-primary">All Products ({totalProducts})</h2>
                  <Link to="/admin/products" className="text-sm text-primary hover:underline">View All</Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {products.slice(0, 10).map((product) => (
                    <div key={product.id} className="group bg-white border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <Link to={`/product/${product.sku}`} className="block">
                        <div className="aspect-[4/5] bg-cream relative overflow-hidden">
                          <img src={product.images?.[0] || '/placeholder-image.jpg'} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                          {product.badge && (
                            <div className="absolute top-2 left-2 bg-primary text-white text-[9px] font-medium tracking-widest uppercase px-2 py-0.5 rounded-full">{product.badge}</div>
                          )}
                        </div>
                        <div className="p-3 pb-1">
                          <p className="text-xs text-secondary line-clamp-1">{product.category}</p>
                          <p className="text-sm font-medium text-primary line-clamp-1 mt-1">{product.name}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {product.discount_price ? (
                              <>
                                <p className="text-sm font-medium text-primary">₹ {product.discount_price.toLocaleString('en-IN')}</p>
                                <p className="text-xs text-secondary/60 line-through">₹ {product.price.toLocaleString('en-IN')}</p>
                              </>
                            ) : (
                              <p className="text-sm font-medium text-primary">₹ {product.price.toLocaleString('en-IN')}</p>
                            )}
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className={`text-[10px] font-medium ${Number(product.quantity) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {Number(product.quantity) > 0 ? `In Stock: ${product.quantity}` : 'Out of Stock'}
                            </span>
                            <Boxes size={14} className="text-secondary/40" />
                          </div>
                        </div>
                      </Link>
                      
                      {/* ✅ Admin Edit Button Below Product */}
                      <div className="px-3 pb-3 border-t border-border/50 mt-2 pt-2">
                        <AdminProductModifyButton product={product} onProductUpdated={handleProductUpdated} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}