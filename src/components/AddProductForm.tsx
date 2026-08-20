import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Upload, X, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase';
import { createProductRequest } from '../lib/api';
import { generateSKU, generateSerials } from '../lib/utils/product';
import { useAuth } from '../context/AuthContext';
import type { ProductFormValues } from '../types/product';

export default function AddProductForm() {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showAllSerials, setShowAllSerials] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [generatedSerials, setGeneratedSerials] = useState<string[]>([]);
  const [productName, setProductName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
  const previewSku = generateSKU(category || 'GEN', year || new Date().getFullYear(), 1);
  const previewSerials = generateSerials(previewSku, Number.isInteger(quantity) ? quantity : 0);

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
      console.error('Upload error:', error);
      setUploadError('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    setValue('images', updatedImages);
  };

  const downloadQR = (serial: string) => {
    const svg = document.getElementById(`qr-${serial}`);
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 200;
      canvas.height = 200;
      ctx?.drawImage(img, 0, 0, 200, 200);
      
      const link = document.createElement('a');
      link.download = `${serial}-qr.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      URL.revokeObjectURL(img.src);
    };
    
    img.src = URL.createObjectURL(new Blob([svgData], { type: 'image/svg+xml' }));
  };

  const downloadAllQRs = () => {
    generatedSerials.forEach((serial, index) => {
      setTimeout(() => downloadQR(serial), index * 300);
    });
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
        price: data.price,
        quantity: data.quantity,
        supplier: data.supplier || null,
        description: data.description || null,
        images: images,
        tags: tagsArray,
        discount_price: data.discount_price || null,
        year: data.year || new Date().getFullYear(),
        badge: data.badge || null,
      };

      const result = await createProductRequest(productData, token);

      const serials = result.data.serials.map((serial) => serial.serial_number);
      setGeneratedSerials(serials);
      setProductName(data.name);
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
    <main className="min-h-screen bg-gray-50 px-6 pb-20 pt-28 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10">
          <Link to="/admin/products" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft size={16} /> Back to products
          </Link>
          <h1 className="mt-4 text-3xl font-light text-gray-900">Add New Product</h1>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 shadow-sm rounded-lg">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name *</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
              <label className="block text-sm font-medium text-gray-700">Quantity *</label>
              <input
                type="number"
                min={1}
                max={100000}
                {...register('quantity', {
                  required: 'Quantity is required',
                  min: { value: 1, message: 'Quantity must be at least 1' },
                  max: { value: 100000, message: 'Quantity cannot exceed 100000' },
                  valueAsNumber: true,
                })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
              {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Badge</label>
            <select
              {...register('badge')}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">No Badge</option>
              <option value="NEW">New</option>
              <option value="SALE">Sale</option>
              <option value="BEST SELLER">Best Seller</option>
              <option value="LIMITED">Limited Edition</option>
              <option value="EXCLUSIVE">Exclusive</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">Select a badge to display on the product card</p>
          </div>

          <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Serial Preview</p>
              <span className="text-xs text-gray-500">Total: {previewSerials.length}</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">SKU will be generated automatically. Preview: {previewSku}</p>
            <div className="mt-2 grid gap-1 text-sm text-gray-700 sm:grid-cols-2">
              {(showAllSerials ? previewSerials : previewSerials.slice(0, 5)).map((serial) => (
                <span key={serial} className="font-mono text-xs bg-white px-2 py-1 rounded border border-gray-200">
                  {serial}
                </span>
              ))}
            </div>
            {previewSerials.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAllSerials((value) => !value)}
                className="mt-3 text-sm font-medium text-blue-700 hover:underline inline-flex items-center gap-1"
              >
                {showAllSerials ? 'Show Less' : `Show All (${previewSerials.length})`}
                {showAllSerials ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
            <input
              type="text"
              {...register('tags')}
              placeholder="cotton, premium, soft"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">Separate tags with commas: e.g., cotton, premium, soft</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={4}
              {...register('description')}
              placeholder="Detailed product description..."
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting || uploading || formSubmitting}
              className="inline-flex items-center gap-2 rounded-md bg-black px-6 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={16} />
              {isSubmitting ? 'Creating Product...' : 'Save Product'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md border border-gray-300 px-6 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </form>

        {isSuccess && generatedSerials.length > 0 && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">
                Product created successfully! {generatedSerials.length} serials generated.
              </p>
              <p className="text-xs text-green-600">{productName}</p>
            </div>
            <button
              onClick={() => setShowQRModal(true)}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm"
            >
              <Download size={16} />
              Download QR Codes
            </button>
          </div>
        )}

        {showQRModal && generatedSerials.length > 0 && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    QR Codes Generated
                  </h2>
                  <p className="text-sm text-gray-600">
                    {productName} - {generatedSerials.length} serials
                  </p>
                </div>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {generatedSerials.map((serial) => (
                    <div key={serial} className="border rounded-lg p-3 text-center hover:shadow-md transition-shadow">
                      <div className="bg-white p-2 rounded">
                        <QRCodeSVG
                          id={`qr-${serial}`}
                          value={`https://joriqie.in/p/${serial}`}
                          size={120}
                          level="H"
                          includeMargin
                        />
                      </div>
                      <p className="text-xs font-mono mt-2 truncate text-gray-600">{serial}</p>
                      <button
                        onClick={() => downloadQR(serial)}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                      >
                        <Download size={12} />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 p-4 border-t bg-gray-50">
                <button
                  onClick={downloadAllQRs}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} />
                  Download All QR Codes
                </button>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}