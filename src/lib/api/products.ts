import { supabase } from '../supabase';
import type { Product, ProductResponse } from '../../types';

// Transform database response to frontend Product type
function toProduct(product: ProductResponse): Product {
  return {
    id: product.id,
    sku: product.sku || '',
    name: product.name,
    category: product.category,
    price: product.price,
    discount_price: product.discount_price || undefined,
    cost: product.cost || undefined,
    quantity: product.quantity || 0,
    supplier: product.supplier || '',
    description: product.description || '',
    images: Array.isArray(product.images) ? product.images : [],
    tags: Array.isArray(product.tags) ? product.tags : [],
    badge: product.badge || undefined,
    brand_id: product.brand_id || 'JORIQUE',
    year: product.year || new Date().getFullYear(),
    created_at: product.created_at,
    updated_at: product.updated_at,
  };
}

// Core fetch function with error handling
async function fetchAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(toProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// ============================================
// PRODUCT SERVICE
// ============================================

export const productService = {
  /**
   * Get all products
   */
  async getProducts(): Promise<Product[]> {
    return fetchAllProducts();
  },

  /**
   * Get featured products for home page
   * Shows products with 'Featured' badge first, then falls back to newest
   * @param limit - Number of products to return (default: 3)
   */
  async getFeaturedProducts(limit: number = 3): Promise<Product[]> {
    try {
      const products = await fetchAllProducts();
      
      // First try to get products with 'Featured' badge
      const featured = products.filter(
        (product) => product.badge && product.badge.toLowerCase() === 'featured'
      );
      
      // If featured products exist, return them, otherwise return newest products
      const result = featured.length > 0 ? featured : products;
      return result.slice(0, limit);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  /**
   * Get new arrivals (latest products)
   * @param limit - Number of products to return (default: 6)
   */
  async getNewArrivals(limit: number = 6): Promise<Product[]> {
    try {
      const products = await fetchAllProducts();
      return products.slice(0, limit);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      throw error;
    }
  },

  /**
   * Get products by category
   * @param category - Category name to filter by
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const products = await fetchAllProducts();
      return products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  /**
   * Get single product by ID
   * @param id - Product UUID
   */
  async getProductById(id: string): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Product not found');
      
      return toProduct(data);
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  },

  /**
   * Get product by SKU
   * @param sku - Product SKU
   */
  async getProductBySku(sku: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('sku', sku)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      return toProduct(data);
    } catch (error) {
      console.error('Error fetching product by SKU:', error);
      throw error;
    }
  },

  /**
   * Get related products (same category, exclude current)
   * @param category - Category name
   * @param excludeId - Product ID to exclude
   * @param limit - Number of products to return (default: 4)
   */
  async getRelatedProducts(
    category: string,
    excludeId: string,
    limit: number = 4
  ): Promise<Product[]> {
    try {
      const products = await fetchAllProducts();
      return products
        .filter(
          (product) =>
            product.category.toLowerCase() === category.toLowerCase() &&
            product.id !== excludeId
        )
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching related products:', error);
      throw error;
    }
  },

  /**
   * Search products by name, category, or description
   * @param query - Search query string
   */
  async searchProducts(query: string): Promise<Product[]> {
    try {
      if (!query || query.trim().length === 0) {
        return fetchAllProducts();
      }

      const searchTerm = query.trim().toLowerCase();
      const products = await fetchAllProducts();
      
      return products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          (product.description &&
            product.description.toLowerCase().includes(searchTerm)) ||
          (product.tags &&
            product.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm)
            ))
      );
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  /**
   * Get products by brand
   * @param brandId - Brand identifier (default: 'JORIQUE')
   */
  async getProductsByBrand(brandId: string = 'JORIQUE'): Promise<Product[]> {
    try {
      const products = await fetchAllProducts();
      return products.filter(
        (product) => product.brand_id.toLowerCase() === brandId.toLowerCase()
      );
    } catch (error) {
      console.error('Error fetching products by brand:', error);
      throw error;
    }
  },

  /**
   * Get products with discount
   * Products where discount_price is set and less than price
   */
  async getDiscountedProducts(): Promise<Product[]> {
    try {
      const products = await fetchAllProducts();
      return products.filter(
        (product) =>
          product.discount_price !== undefined &&
          product.discount_price !== null &&
          product.discount_price < product.price
      );
    } catch (error) {
      console.error('Error fetching discounted products:', error);
      throw error;
    }
  },

  /**
   * Get products with badge
   * @param badge - Badge type (e.g., 'NEW', 'SALE', 'BEST SELLER')
   */
  async getProductsByBadge(badge: string): Promise<Product[]> {
    try {
      const products = await fetchAllProducts();
      return products.filter(
        (product) =>
          product.badge && product.badge.toLowerCase() === badge.toLowerCase()
      );
    } catch (error) {
      console.error('Error fetching products by badge:', error);
      throw error;
    }
  },

  /**
   * Get product count
   */
  async getProductCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting product count:', error);
      throw error;
    }
  },

  /**
   * Get all categories with product counts
   */
  async getCategoriesWithCounts(): Promise<Array<{ category: string; count: number }>> {
    try {
      const products = await fetchAllProducts();
      const categoryMap = new Map<string, number>();
      
      products.forEach((product) => {
        const count = categoryMap.get(product.category) || 0;
        categoryMap.set(product.category, count + 1);
      });
      
      return Array.from(categoryMap.entries())
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => a.category.localeCompare(b.category));
    } catch (error) {
      console.error('Error getting categories with counts:', error);
      throw error;
    }
  },

  /**
   * Get products with pagination
   * @param page - Page number (starting from 1)
   * @param limit - Items per page
   */
  async getProductsPaginated(page: number = 1, limit: number = 12): Promise<{
    products: Product[];
    total: number;
    totalPages: number;
  }> {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        products: (data || []).map(toProduct),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      console.error('Error fetching paginated products:', error);
      throw error;
    }
  },
};

export default productService;