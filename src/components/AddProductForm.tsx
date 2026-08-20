import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { ProductFormValues } from '../types/product';

export default function AddProductForm() {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset,
    setValue,
    watch 
  } = useForm<ProductFormValues>();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError('');

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setUploadError('Image size must be less than 5MB');
          continue;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          setUploadError('Only image files are allowed');
          continue;
        }

        // Generate unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError, data } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      // Update images state and form value
      const updatedImages = [...images, ...uploadedUrls];
      setImages(updatedImages);
      setValue('images', updatedImages);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setValue('images', updatedImages);
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      // Ensure images are included
      const productData = {
        name: data.name,
        category: data.category,
        price: data.price,
        cost: Number.isFinite(data.cost) ? data.cost : null,
        supplier: data.supplier || null,
        description: data.description || null,
        brand_id: data.brand_id || 'JORIQUE',
        images: images,
        tags: data.tags || null,
        sku: data.sku || null,
        quantity: data.quantity || 0,
        discount_price: data.discount_price || null,
        year: data.year || new Date().getFullYear(),
      };

      const { error } = await supabase.from('products').insert(productData);

      if (error) throw error;

      alert('Product saved successfully!');
      reset();
      setImages([]);
      setValue('images', []);
    } catch (error) {
      alert('Error saving product: ' + (error as Error).message);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 pb-20 pt-28 lg:px-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-10">
          <Link to="/admin/products" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft size={16} /> Back to products
          </Link>
          <h1 className="mt-4 text-3xl font-light text-gray-900">Add New Product</h1>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 shadow-sm rounded-lg">
          
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
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
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  {uploading ? 'Uploading...' : 'Click to upload images'}
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WEBP (Max 5MB each)
                </p>
              </label>
            </div>

            {uploadError && (
              <p className="mt-2 text-sm text-red-600">{uploadError}</p>
            )}

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name *</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category *</label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select category</option>
              <option value="Bedsheet">Bedsheet</option>
              <option value="Pillow">Pillow</option>
              <option value="Blanket">Blanket</option>
              <option value="Towel">Towel</option>
              <option value="Mattress">Mattress</option>
              <option value="Cover">Cover</option>
              <option value="Comforter">Comforter</option>
              <option value="Cushion">Cushion</option>
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
          </div>

          {/* SKU & Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">SKU</label>
              <input
                type="text"
                {...register('sku')}
                placeholder="JR-BS-2026-001"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity *</label>
              <input
                type="number"
                {...register('quantity', { required: 'Quantity is required', min: 1, valueAsNumber: true })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
              {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
            </div>
          </div>

          {/* Price, Discount & Cost */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                {...register('price', { required: 'Price is required', min: 0, valueAsNumber: true })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Price</label>
              <input
                type="number"
                step="0.01"
                {...register('discount_price', { min: 0, valueAsNumber: true })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cost (₹)</label>
              <input
                type="number"
                step="0.01"
                {...register('cost', { min: 0, valueAsNumber: true })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Supplier & Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Supplier</label>
              <input
                type="text"
                {...register('supplier')}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                {...register('year', { valueAsNumber: true })}
                defaultValue={new Date().getFullYear()}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
            <input
              type="text"
              {...register('tags')}
              placeholder="cotton, premium, soft"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={4}
              {...register('description')}
              placeholder="Detailed product description..."
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Brand ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Brand</label>
            <input
              type="text"
              {...register('brand_id')}
              defaultValue="JORIQUE"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="inline-flex items-center gap-2 rounded-md bg-black px-6 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={16} />
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setImages([]);
                setValue('images', []);
              }}
              className="rounded-md border border-gray-300 px-6 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}