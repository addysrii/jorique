import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { ProductFormValues } from '../types/product'; 

export default function AddProductForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProductFormValues>();

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const { error } = await supabase.from('products').insert({
        name: data.name,
        category: data.category,
        price: data.price,
        cost: Number.isFinite(data.cost) ? data.cost : null,
        supplier: data.supplier || null,
        description: data.description || null,
        brand_id: data.brand_id || 'JORIQUE',
      });

      if (error) throw error;

      alert('Product saved successfully!');
      reset();
    } catch (error) {
      alert('Error saving product: ' + (error as Error).message);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 pb-20 pt-10 lg:px-12">
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
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
          </div>

          {/* Price & Cost */}
          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700">Cost (₹)</label>
              <input
                type="number"
                step="0.01"
                {...register('cost', { min: 0, valueAsNumber: true })}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier</label>
            <input
              type="text"
              {...register('supplier')}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              {...register('description')}
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
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-md bg-black px-6 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={16} />
              {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
            <button
              type="button"
              onClick={() => reset()}
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