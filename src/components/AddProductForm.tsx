import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Upload, X, ChevronDown, ChevronUp, Printer, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductPackagingLabel from './ProductPackagingLabel';
import { supabase } from '../lib/supabase';
import { createProductRequest } from '../lib/api';
import { generateSKU, generateSerials } from '../lib/utils/product';
import { useAuth } from '../context/AuthContext';
import type { ProductFormValues } from '../types/product';
import type { SkuSeries } from '../types/skuSeries';
import { formatSeriesSku } from '../types/skuSeries';
import { fetchSkuSeriesList, incrementSeriesCounter, checkSkuAvailable } from '../lib/utils/skuSeriesStorage';

export default function AddProductForm() {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showAllSerials, setShowAllSerials] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [labelShowChannels, setLabelShowChannels] = useState(true);
  const [labelShowQR, setLabelShowQR] = useState(true);
  const [generatedSerials, setGeneratedSerials] = useState<string[]>([]);
  const [productName, setProductName] = useState('');
  const [createdProductDetails, setCreatedProductDetails] = useState<{
    price?: number;
    discount_price?: number;
    badge?: string;
    cost?: number;
    category?: string;
    sku?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Dynamic categories & subcategories from Supabase
  const [dbCategories, setDbCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [dbSubcategories, setDbSubcategories] = useState<{ id: string; category_id: string; name: string; slug: string }[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  // Dynamic badges from Supabase
  const [dbBadges, setDbBadges] = useState<{ id: string; label: string; color: string; text_color: string }[]>([]);

  // SKU Series & manual series state
  const [searchParams] = useSearchParams();
  const urlSeriesId = searchParams.get('seriesId');
  const [skuMode, setSkuMode] = useState<'auto' | 'series' | 'manual'>(urlSeriesId ? 'series' : 'auto');
  const [availableSeries, setAvailableSeries] = useState<SkuSeries[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>(urlSeriesId || '');
  const [manualSkuInput, setManualSkuInput] = useState<string>('');
  const [skuChecking, setSkuChecking] = useState(false);
  const [skuCheckResult, setSkuCheckResult] = useState<{ available: boolean; reason?: string } | null>(null);

  useEffect(() => {
    const loadCats = async () => {
      setLoadingCats(true);
      try {
        const [{ data: cats }, { data: subs }, { data: bdgs }] = await Promise.all([
          supabase.from('categories').select('id, name, slug').order('name'),
          supabase.from('subcategories').select('id, category_id, name, slug').order('name'),
          supabase.from('badges').select('id, label, color, text_color').order('label'),
        ]);
        if (cats) setDbCategories(cats as { id: string; name: string; slug: string }[]);
        if (subs) setDbSubcategories(subs as { id: string; category_id: string; name: string; slug: string }[]);
        if (bdgs) setDbBadges(bdgs as { id: string; label: string; color: string; text_color: string }[]);
      } catch {
        // silently fallback
      } finally {
        setLoadingCats(false);
      }
    };
    loadCats();
  }, []);

  const { token } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: formSubmitting },
    reset,
    setValue,
    watch
  } = useForm<ProductFormValues>({
    defaultValues: { quantity: 1, year: new Date().getFullYear() },
  });

  const category = watch('category');
  const year = watch('year');
  const quantity = watch('quantity');

  // Filter subcategories based on selected category name
  const selectedDbCategory = dbCategories.find(c => c.name === category);
  const filteredSubs = selectedDbCategory
    ? dbSubcategories.filter(s => s.category_id === selectedDbCategory.id)
    : [];

  // Load custom SKU series
  useEffect(() => {
    fetchSkuSeriesList().then((list) => {
      setAvailableSeries(list);
      if (urlSeriesId && list.some(s => s.id === urlSeriesId)) {
        setSelectedSeriesId(urlSeriesId);
        setSkuMode('series');
      } else if (list.length > 0 && !selectedSeriesId) {
        setSelectedSeriesId(list[0].id);
      }
    });
  }, [urlSeriesId]);

  // Compute effective SKU based on selected mode
  const selectedSeries = availableSeries.find(s => s.id === selectedSeriesId);
  let effectiveSku = '';
  if (skuMode === 'auto') {
    effectiveSku = generateSKU(category || 'GEN', year || new Date().getFullYear(), 1);
  } else if (skuMode === 'series' && selectedSeries) {
    effectiveSku = formatSeriesSku(selectedSeries, selectedSeries.currentCounter, year || new Date().getFullYear());
  } else if (skuMode === 'manual') {
    effectiveSku = manualSkuInput.trim().toUpperCase();
  }

  // Debounced check for SKU availability
  useEffect(() => {
    if (!effectiveSku || effectiveSku.length < 3) {
      setSkuCheckResult(null);
      return;
    }

    setSkuChecking(true);
    const timer = setTimeout(async () => {
      const res = await checkSkuAvailable(effectiveSku);
      setSkuCheckResult(res);
      setSkuChecking(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [effectiveSku]);

  const previewSerials = generateSerials(effectiveSku || 'PENDING-SKU', Number.isInteger(quantity) ? quantity : 0);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError('');

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          setUploadError('Image size must be less than 5MB');
          continue;
        }

        if (!file.type.startsWith('image/')) {
          setUploadError('Only image files are allowed');
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      const updatedImages = [...images, ...uploadedUrls];
      setImages(updatedImages);
      setValue('images', updatedImages);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setValue('images', updatedImages);
  };

  const handlePrintLabels = () => {
    window.print();
  };

  const handleReset = () => {
    reset();
    setImages([]);
    setValue('images', []);
    setValue('tags', '');
    setValue('quantity', 1);
    setShowAllSerials(false);
    setIsSuccess(false);
    setGeneratedSerials([]);
    setProductName('');
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (!token) throw new Error('You must be signed in as an admin to create a product.');

      const tagsArray = data.tags
        ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      const productData = {
        name: data.name,
        category: data.category,
        subcategory: data.subcategory || null,
        price: data.price,
        quantity: data.quantity,
        supplier: data.supplier || null,
        description: data.description || null,
        images: images,
        tags: tagsArray,
        discount_price: data.discount_price || null,
        year: data.year || new Date().getFullYear(),
        badge: data.badge || null,
        sku: effectiveSku || undefined,
      };

      const result = await createProductRequest(productData, token);

      // If a series was used, increment counter for next batch
      if (skuMode === 'series' && selectedSeriesId) {
        await incrementSeriesCounter(selectedSeriesId);
        const updated = await fetchSkuSeriesList();
        setAvailableSeries(updated);
      }

      const serials = result.data.serials.map((serial) => serial.serial_number);
      setGeneratedSerials(serials);
      setProductName(data.name);
      setCreatedProductDetails({
        price: data.price,
        discount_price: data.discount_price,
        badge: data.badge,
        cost: data.cost,
        category: data.category,
        sku: result.data.product.sku,
      });
      setIsSuccess(true);
      
      if (serials.length > 0) {
        setShowQRModal(true);
      }

      reset();
      setImages([]);
      setValue('images', []);
      setValue('tags', '');
      setValue('quantity', 1);
      setShowAllSerials(false);

    } catch (error) {
      alert('Error saving product: ' + (error as Error).message);
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F7F5] dark:bg-[#100E0D] text-primary dark:text-[#F5F2EB] px-6 pb-20 pt-28 lg:px-12 transition-colors duration-300">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <Link to="/admin" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to JORIQUE OS Dashboard
          </Link>
          <div className="flex items-center justify-between mt-3">
            <div>
              <h1 className="text-3xl font-light text-primary dark:text-white tracking-wide">Register New Product & Batch</h1>
              <p className="text-xs text-secondary dark:text-white/60 mt-1">Auto-generates SKU, Code128 physical barcodes, and serial QR codes</p>
            </div>
            <span className="px-3 py-1 bg-cream dark:bg-white/5 rounded-full text-[11px] font-semibold tracking-widest uppercase text-primary dark:text-[#D4AF37] border border-border dark:border-[#2E2925]">
              MVP v1 Spec
            </span>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-[#1A1816] p-8 shadow-sm rounded-3xl border border-border dark:border-[#2E2925]">
          
          {/* Images upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-2">
              Product Images
            </label>
            
            <div className="border-2 border-dashed border-border dark:border-[#2E2925] rounded-2xl p-6 text-center hover:border-primary/40 dark:hover:border-white/40 transition-colors bg-cream/20 dark:bg-white/5">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer block">
                <Upload className="mx-auto h-10 w-10 text-secondary dark:text-white/50" />
                <p className="mt-2 text-xs font-medium text-primary dark:text-white">
                  {uploading ? 'Uploading assets...' : 'Click to select high-resolution images'}
                </p>
                <p className="text-[11px] text-secondary dark:text-white/50 mt-1">
                  PNG, JPG, WEBP (Max 5MB each)
                </p>
              </label>
            </div>

            {uploadError && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400">{uploadError}</p>
            )}

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-border dark:border-[#2E2925] aspect-square">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-md"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">Product Name *</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                placeholder="e.g. 800TC Egyptian Cotton Sateen Duvet"
                className="w-full rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37] transition-colors"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">Category *</label>
              <select
                {...register('category', { required: 'Category is required' })}
                onChange={e => {
                  register('category').onChange(e);
                  setValue('subcategory', ''); // reset subcategory when category changes
                }}
                className="w-full rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37] transition-colors"
                disabled={loadingCats}
              >
                <option value="" className="dark:bg-[#1A1816]">
                  {loadingCats ? 'Loading categories...' : 'Select Category'}
                </option>
                {dbCategories.length > 0
                  ? dbCategories.map(cat => (
                      <option key={cat.id} value={cat.name} className="dark:bg-[#1A1816]">{cat.name}</option>
                    ))
                  : (
                    <>
                      <option value="Bedsheets" className="dark:bg-[#1A1816]">Bedsheets</option>
                      <option value="Home Decor" className="dark:bg-[#1A1816]">Home Decor</option>
                      <option value="Bath" className="dark:bg-[#1A1816]">Bath</option>
                      <option value="Kitchen" className="dark:bg-[#1A1816]">Kitchen</option>
                      <option value="Accessories" className="dark:bg-[#1A1816]">Accessories</option>
                    </>
                  )
                }
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.category.message}</p>}
            </div>

            {/* Subcategory — shown only when category is selected and has subs */}
            {category && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">
                  Subcategory
                  {filteredSubs.length === 0 && category && !loadingCats && (
                    <span className="ml-2 normal-case font-normal text-secondary dark:text-white/40">(none defined — add via Categories tab)</span>
                  )}
                </label>
                <select
                  {...register('subcategory')}
                  disabled={filteredSubs.length === 0 || loadingCats}
                  className={`w-full rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37] transition-colors ${filteredSubs.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="" className="dark:bg-[#1A1816]">
                    {filteredSubs.length === 0 ? 'No subcategories for this category' : 'Select Subcategory (optional)'}
                  </option>
                  {filteredSubs.map(sub => (
                    <option key={sub.id} value={sub.name} className="dark:bg-[#1A1816]">{sub.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">Retail Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 0, message: 'Must be positive' },
                  valueAsNumber: true,
                })}
                placeholder="4999"
                className="w-full rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37] transition-colors"
              />
              {errors.price && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">Discount Price (₹)</label>
              <input
                type="number"
                step="0.01"
                {...register('discount_price', { valueAsNumber: true })}
                placeholder="3999"
                className="w-full rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">Initial Units / Quantity *</label>
              <input
                type="number"
                min={1}
                max={100000}
                {...register('quantity', {
                  required: 'Quantity is required',
                  min: { value: 1, message: 'Quantity must be at least 1' },
                  max: { value: 100000, message: 'Max 100,000' },
                  valueAsNumber: true,
                })}
                className="w-full rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37] transition-colors"
              />
              {errors.quantity && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.quantity.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">Supplier / Mill</label>
              <input
                type="text"
                {...register('supplier')}
                placeholder="e.g. Guimarães Weaving Mill"
                className="w-full rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">Collection Year</label>
              <input
                type="number"
                {...register('year', { valueAsNumber: true })}
                defaultValue={new Date().getFullYear()}
                className="w-full rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">
                Storefront Badge
              </label>
              <select
                {...register('badge')}
                className="w-full rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37] transition-colors"
              >
                <option value="" className="dark:bg-[#1A1816]">No Badge</option>
                {dbBadges.length > 0
                  ? dbBadges.map(b => (
                      <option key={b.id} value={b.label} className="dark:bg-[#1A1816]">{b.label}</option>
                    ))
                  : (
                    <>
                      <option value="NEW" className="dark:bg-[#1A1816]">New</option>
                      <option value="FEATURED" className="dark:bg-[#1A1816]">Featured</option>
                      <option value="BEST SELLER" className="dark:bg-[#1A1816]">Best Seller</option>
                      <option value="LIMITED" className="dark:bg-[#1A1816]">Limited Edition</option>
                    </>
                  )
                }
              </select>
              {/* Live badge colour preview */}
              {watch('badge') && dbBadges.find(b => b.label === watch('badge')) && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] text-secondary dark:text-white/40 uppercase tracking-wider">Preview:</span>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                    style={{
                      backgroundColor: dbBadges.find(b => b.label === watch('badge'))?.color,
                      color: dbBadges.find(b => b.label === watch('badge'))?.text_color,
                    }}
                  >
                    {watch('badge')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* SKU Architecture & Manual Series Selection */}
          <div className="rounded-2xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-white/[0.03] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#D4AF37]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-white">
                    SKU Series & Code Architecture
                  </span>
                </div>
                <p className="text-xs text-secondary dark:text-white/60 mt-0.5">
                  Select a pre-configured manual SKU series or type a custom manual code.
                </p>
              </div>

              {/* Mode Selector Tabs */}
              <div className="flex items-center gap-1 bg-white dark:bg-[#100E0D] p-1 rounded-xl border border-border dark:border-[#2E2925] text-xs">
                <button
                  type="button"
                  onClick={() => setSkuMode('auto')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    skuMode === 'auto'
                      ? 'bg-primary dark:bg-[#D4AF37] text-white dark:text-black shadow-xs'
                      : 'text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white'
                  }`}
                >
                  Auto Standard
                </button>
                <button
                  type="button"
                  onClick={() => setSkuMode('series')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    skuMode === 'series'
                      ? 'bg-primary dark:bg-[#D4AF37] text-white dark:text-black shadow-xs'
                      : 'text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white'
                  }`}
                >
                  Manual Series
                </button>
                <button
                  type="button"
                  onClick={() => setSkuMode('manual')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    skuMode === 'manual'
                      ? 'bg-primary dark:bg-[#D4AF37] text-white dark:text-black shadow-xs'
                      : 'text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white'
                  }`}
                >
                  Direct Custom SKU
                </button>
              </div>
            </div>

            {/* Mode 1: Auto Standard info */}
            {skuMode === 'auto' && (
              <div className="text-xs text-secondary dark:text-white/70 bg-white/60 dark:bg-[#100E0D]/60 p-3.5 rounded-xl border border-border/70 dark:border-[#2E2925]/70 flex items-center justify-between">
                <span>Standard JORIQUE formula: <code className="font-mono font-bold text-primary dark:text-[#D4AF37]">JR-[CATEGORY]-[YEAR]-[001]</code></span>
                <span className="text-[10px] text-secondary dark:text-white/50">Auto-generated</span>
              </div>
            )}

            {/* Mode 2: Manual SKU Series Selector */}
            {skuMode === 'series' && (
              <div className="space-y-3 bg-white/60 dark:bg-[#100E0D]/60 p-4 rounded-xl border border-border/70 dark:border-[#2E2925]/70">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-primary dark:text-white">
                    Select Manual SKU Series:
                  </label>
                  <Link
                    to="/admin?tab=sku-series"
                    target="_blank"
                    className="text-[11px] font-semibold text-[#D4AF37] hover:underline inline-flex items-center gap-1"
                  >
                    Manage Series Rules in Dashboard →
                  </Link>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <select
                    value={selectedSeriesId}
                    onChange={(e) => setSelectedSeriesId(e.target.value)}
                    className="w-full rounded-xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] px-3.5 py-2.5 text-xs font-medium text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                  >
                    {availableSeries.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.prefix}{s.separator}...) • Next #{s.currentCounter}
                      </option>
                    ))}
                  </select>

                  {selectedSeries && (
                    <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-cream/40 dark:bg-white/5 border border-border dark:border-[#2E2925] text-xs">
                      <span className="text-secondary dark:text-white/60 text-[11px]">Current Series Counter:</span>
                      <span className="font-mono font-bold text-primary dark:text-[#D4AF37]">
                        #{selectedSeries.currentCounter}
                      </span>
                    </div>
                  )}
                </div>

                {selectedSeries?.description && (
                  <p className="text-[11px] text-secondary dark:text-white/60 italic">
                    "{selectedSeries.description}"
                  </p>
                )}
              </div>
            )}

            {/* Mode 3: Direct Custom SKU Input */}
            {skuMode === 'manual' && (
              <div className="space-y-2 bg-white/60 dark:bg-[#100E0D]/60 p-4 rounded-xl border border-border/70 dark:border-[#2E2925]/70">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-primary dark:text-white">
                    Enter Exact Custom SKU Code:
                  </label>
                  <span className="text-[10px] text-secondary dark:text-white/50 uppercase tracking-wider">
                    Alphanumeric, dashes, underscores
                  </span>
                </div>
                <input
                  type="text"
                  value={manualSkuInput}
                  onChange={(e) => setManualSkuInput(e.target.value.toUpperCase())}
                  placeholder="e.g. SILK-EMB-QUEEN-01, BED-LUX-2026-A"
                  className="w-full font-mono uppercase font-bold rounded-xl border border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] px-4 py-2.5 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                />
              </div>
            )}

            {/* Live SKU Status & Availability Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-border/50 dark:border-[#2E2925]/50 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-secondary dark:text-white/60">Batch Master SKU:</span>
                <span className="font-mono font-bold text-sm text-primary dark:text-[#D4AF37]">
                  {effectiveSku || '—'}
                </span>
              </div>

              <div>
                {skuChecking ? (
                  <span className="inline-flex items-center gap-1.5 text-secondary dark:text-white/60 text-xs">
                    <RefreshCw size={12} className="animate-spin text-[#D4AF37]" /> Checking availability...
                  </span>
                ) : skuCheckResult ? (
                  skuCheckResult.available ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px] border border-emerald-200 dark:border-emerald-800/60">
                      <CheckCircle2 size={12} /> SKU Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-semibold text-[11px] border border-rose-200 dark:border-rose-800/60">
                      <AlertCircle size={12} /> {skuCheckResult.reason || 'SKU Already in Use'}
                    </span>
                  )
                ) : null}
              </div>
            </div>
          </div>

          {/* Real-time Serial Preview */}
          <div className="rounded-2xl border border-border dark:border-[#2E2925] bg-cream/40 dark:bg-white/5 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#D4AF37]" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-white">Sequential Serial & Barcode Structure</span>
              </div>
              <span className="text-xs font-mono font-medium text-secondary dark:text-white/60">Units: {previewSerials.length}</span>
            </div>
            <p className="text-xs text-secondary dark:text-white/70 mb-3">
              Master SKU: <span className="font-mono font-bold text-primary dark:text-[#D4AF37]">{effectiveSku || 'PENDING'}</span> • Sequential physical unit serials:
            </p>
            
            <div className="grid gap-2 text-xs text-primary sm:grid-cols-2">
              {(showAllSerials ? previewSerials : previewSerials.slice(0, 4)).map((serial) => (
                <div key={serial} className="flex items-center justify-between bg-white dark:bg-[#100E0D] px-3 py-2 rounded-xl border border-border dark:border-[#2E2925] font-mono text-[11px] shadow-sm text-primary dark:text-white">
                  <span>{serial}</span>
                  <span className="text-[9px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-sans font-semibold">Available</span>
                </div>
              ))}
            </div>

            {previewSerials.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllSerials((value) => !value)}
                className="mt-3 text-xs font-semibold text-primary dark:text-[#D4AF37] hover:underline inline-flex items-center gap-1"
              >
                {showAllSerials ? 'Show Less' : `Show All (${previewSerials.length} Serials)`}
                {showAllSerials ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">Tags (comma separated)</label>
            <input
              type="text"
              {...register('tags')}
              placeholder="Egyptian Cotton, 800TC, Sateen, OEKO-TEX"
              className="w-full rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-secondary dark:text-white/70 mb-1.5">Description</label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Detailed product specifications, weave origin, and tactile notes..."
              className="w-full rounded-xl border border-border dark:border-[#2E2925] bg-cream/30 dark:bg-[#100E0D] px-4 py-3 text-sm text-primary dark:text-white outline-none focus:border-primary dark:focus:border-[#D4AF37] resize-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border dark:border-[#2E2925]">
            <button
              type="submit"
              disabled={isSubmitting || uploading || formSubmitting || (skuCheckResult !== null && !skuCheckResult.available)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary dark:bg-[#D4AF37] px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white dark:text-black hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-all shadow-md disabled:opacity-50"
            >
              <Save size={15} />
              {isSubmitting ? 'Creating & Generating Batch...' : 'Save Product & Auto-Generate Serials'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-border dark:border-[#2E2925] px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-secondary dark:text-white/70 hover:bg-cream dark:hover:bg-white/10 transition-colors"
            >
              Clear
            </button>
          </div>
        </form>

        {/* Success Notice Bar */}
        {isSuccess && generatedSerials.length > 0 && (
          <div className="mt-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-300">
                Product Created! Generated {generatedSerials.length} Unique Physical Unit Serials.
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">{productName}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowQRModal(true)}
                className="inline-flex items-center gap-2 bg-emerald-700 dark:bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-800 transition-colors text-xs font-bold uppercase tracking-wider shadow-sm"
              >
                <Printer size={14} />
                View & Print Labels
              </button>
            </div>
          </div>
        )}

        {/* Modal: Physical Packaging Barcode Labels */}
        {showQRModal && generatedSerials.length > 0 && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1A1816] rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-border dark:border-[#2E2925]">
              {/* Modal Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-border dark:border-[#2E2925] bg-warm-white dark:bg-[#151311] gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream dark:bg-white/5 border border-border dark:border-[#2E2925] text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-1">
                    Batch Ready for Packaging
                  </div>
                  <h2 className="text-xl font-light text-primary dark:text-white">
                    Retail Packaging Barcode Stickers
                  </h2>
                  <p className="text-xs text-secondary dark:text-white/60 mt-0.5">
                    {productName} • {generatedSerials.length} Units Generated
                  </p>
                </div>

                {/* Customization Options Bar */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Badge input / preset */}
                  <div className="flex items-center gap-1.5 bg-cream/50 dark:bg-white/5 px-3 py-1 rounded-xl border border-border dark:border-[#2E2925]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary dark:text-white/60">Badge:</span>
                    <input
                      type="text"
                      placeholder="e.g. Bestseller"
                      value={createdProductDetails.badge || ''}
                      onChange={(e) => setCreatedProductDetails(prev => ({ ...prev, badge: e.target.value }))}
                      className="bg-white dark:bg-[#1A1816] text-primary dark:text-white text-xs px-2 py-1 rounded border border-border dark:border-[#2E2925] w-32 outline-none font-semibold"
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
                    onClick={() => setShowQRModal(false)}
                    className="p-2 hover:bg-cream dark:hover:bg-white/10 rounded-full transition-colors text-secondary dark:text-white/60 ml-auto"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Printable Grid of Labels */}
              <div className="p-6 overflow-y-auto flex-1 bg-gray-100 dark:bg-[#100E0D]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {generatedSerials.map((serial) => (
                    <ProductPackagingLabel
                      key={serial}
                      productName={productName}
                      sku={createdProductDetails.sku || effectiveSku}
                      serialNumber={serial}
                      price={createdProductDetails.price || watch('price') || 1882}
                      discountPrice={createdProductDetails.discount_price || watch('discount_price')}
                      badge={createdProductDetails.badge || watch('badge')}
                      cost={createdProductDetails.cost}
                      category={createdProductDetails.category || watch('category') || 'BED SHEET (DOUBLE BED)'}
                      showChannels={labelShowChannels}
                      showQR={labelShowQR}
                      className="shadow-md hover:shadow-lg transition-shadow"
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-t border-border dark:border-[#2E2925] bg-white dark:bg-[#1A1816] gap-3">
                <p className="text-xs text-secondary dark:text-white/60">
                  Ready for thermal packaging label printers & retail box application
                </p>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={handlePrintLabels}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-primary dark:bg-[#D4AF37] text-white dark:text-black px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-md hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-all"
                  >
                    <Printer size={14} /> Print Sticker Sheet
                  </button>
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="px-6 py-2.5 border border-border dark:border-[#2E2925] rounded-xl text-xs font-bold uppercase tracking-[0.2em] text-secondary dark:text-white/70 hover:bg-cream dark:hover:bg-white/10 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}