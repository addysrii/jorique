import { useState, useEffect } from 'react';
import { X, Save, Loader2, Pencil, QrCode, Download, Copy } from 'lucide-react';
import { productService } from '../lib/api/products';
import { getProductWithSerialsRequest } from '../lib/api';
import { Product } from '../types';
import { supabase } from '../lib/supabase';

interface AdminProductModifyButtonProps {
  product: Product;
  onProductUpdated: (updatedProduct: Product) => void;
}

export default function AdminProductModifyButton({ product, onProductUpdated }: AdminProductModifyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serials, setSerials] = useState<any[]>([]);
  const [serialsLoading, setSerialsLoading] = useState(false);
  
  // Form State initialized with product data
  // Dynamic badges from Supabase
  const [dbBadges, setDbBadges] = useState<{ id: string; label: string; color: string; text_color: string }[]>([]);

  useEffect(() => {
    supabase.from('badges').select('id, label, color, text_color').order('label')
      .then(({ data }) => { if (data) setDbBadges(data as { id: string; label: string; color: string; text_color: string }[]); });
  }, []);

  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category,
    price: product.price,
    discount_price: product.discount_price || '',
    quantity: product.quantity || 0,
    badge: product.badge || '',
    description: product.description || '',
  });

  // Fetch serials using existing API
  useEffect(() => {
    if (isOpen && product.id) {
      const fetchSerials = async () => {
        setSerialsLoading(true);
        try {
          const response = await getProductWithSerialsRequest(product.id);
          if (response.success) {
            setSerials(response.data.serials || []);
          }
        } catch (err) {
          console.error('Error fetching serials:', err);
          setSerials([]);
        } finally {
          setSerialsLoading(false);
        }
      };
      fetchSerials();
    }
  }, [isOpen, product.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updateData = {
        ...formData,
        price: Number(formData.price),
        discount_price: formData.discount_price ? Number(formData.discount_price) : undefined,
        quantity: Number(formData.quantity),
      };

      const updated = await productService.updateProduct(product.id, updateData);
      
      onProductUpdated(updated);
      setIsOpen(false);
    } catch (err) {
      setError('Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate QR URL for a specific serial
  const generateQRCodeUrl = (serialNumber: string) => {
    const url = `https://joriqie.in/p/${serialNumber}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  const downloadQRCode = (serialNumber: string) => {
    window.open(generateQRCodeUrl(serialNumber), '_blank');
  };

  const copyURL = (serialNumber: string) => {
    navigator.clipboard.writeText(`https://joriqie.in/p/${serialNumber}`);
  };

  return (
    <>
      {/* Edit Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 text-xs font-semibold text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white transition-colors"
      >
        <Pencil size={12} />
        Edit
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1A1816] rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-border dark:border-[#2E2925] text-primary dark:text-[#F5F2EB]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border dark:border-[#2E2925]">
              <h3 className="text-lg font-light text-primary dark:text-white">Edit Product: {product.name}</h3>
              <button onClick={() => setIsOpen(false)} className="text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <p className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-900">{error}</p>}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] rounded-xl text-sm text-primary dark:text-white focus:outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] rounded-xl text-sm text-primary dark:text-white focus:outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">Badge</label>
                  <select
                    name="badge"
                    value={formData.badge}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] rounded-xl text-sm text-primary dark:text-white focus:outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                  >
                    <option value="">No Badge</option>
                    {dbBadges.length > 0
                      ? dbBadges.map(b => (
                          <option key={b.id} value={b.label}>{b.label}</option>
                        ))
                      : (
                        <>
                          <option value="NEW">New</option>
                          <option value="FEATURED">Featured</option>
                          <option value="BEST SELLER">Best Seller</option>
                          <option value="LIMITED">Limited Edition</option>
                        </>
                      )
                    }
                  </select>
                  {/* Live colour preview */}
                  {formData.badge && dbBadges.find(b => b.label === formData.badge) && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] text-secondary dark:text-white/40 uppercase tracking-wider">Preview:</span>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                        style={{
                          backgroundColor: dbBadges.find(b => b.label === formData.badge)?.color,
                          color: dbBadges.find(b => b.label === formData.badge)?.text_color,
                        }}
                      >
                        {formData.badge}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    className="w-full px-4 py-2.5 bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] rounded-xl text-sm text-primary dark:text-white focus:outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">Discount Price (₹)</label>
                  <input
                    type="number"
                    name="discount_price"
                    value={formData.discount_price}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full px-4 py-2.5 bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] rounded-xl text-sm text-primary dark:text-white focus:outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">Stock Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] rounded-xl text-sm text-primary dark:text-white focus:outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-cream/30 dark:bg-[#100E0D] border border-border dark:border-[#2E2925] rounded-xl text-sm text-primary dark:text-white focus:outline-none focus:border-primary dark:focus:border-[#D4AF37] resize-none"
                />
              </div>

              {/* QR Codes Section */}
              <div className="border-t border-border dark:border-[#2E2925] pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary dark:text-white">Generated QR Codes & Serial Numbers</h4>
                  {serialsLoading && <Loader2 size={16} className="animate-spin text-primary dark:text-[#D4AF37]" />}
                </div>
                
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {serials.length === 0 && !serialsLoading && (
                    <p className="text-xs text-secondary dark:text-white/50">No serials generated for this product yet.</p>
                  )}
                  
                  {serials.map((serial) => (
                    <div key={serial.id} className="flex items-center justify-between bg-cream/30 dark:bg-white/5 border border-border dark:border-[#2E2925] rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <QrCode size={18} className="text-primary dark:text-[#D4AF37]" />
                        <div>
                          <p className="text-xs font-mono font-semibold text-primary dark:text-white">{serial.serial_number}</p>
                          <p className="text-[10px] text-secondary dark:text-white/50 uppercase">Status: {serial.status || 'available'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => downloadQRCode(serial.serial_number)}
                          className="p-1.5 text-primary dark:text-white hover:bg-cream dark:hover:bg-white/10 rounded-lg transition-colors"
                          aria-label="Download QR"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => copyURL(serial.serial_number)}
                          className="p-1.5 text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white rounded-lg transition-colors"
                          aria-label="Copy URL"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border dark:border-[#2E2925]">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-secondary dark:text-white/70 hover:text-primary dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-primary/90 dark:hover:bg-[#E5C158] disabled:opacity-50 shadow-md transition-all"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}