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
  async getProducts(): Promise<Product[]> {
    return fetchAllProducts();
  },

  async getFeaturedProducts(limit: number = 3): Promise<Product[]> {
    try {
      const products = await fetchAllProducts();
      
      const featured = products.filter(
        (product) => product.badge && product.badge.toLowerCase() === 'featured'
      );
      
      const result = featured.length > 0 ? featured : products;
      return result.slice(0, limit);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  async getNewArrivals(limit: number = 6): Promise<Product[]> {
    try {
      const products = await fetchAllProducts();
      return products.slice(0, limit);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      throw error;
    }
  },

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

  async getProductsByBrand(brandId: string = 'JORIQUE'): Promise<Product[]> {
    try {
      const products = await fetchAllProducts();
      return products.filter(
        (product) => (product.brand_id || 'JORIQUE').toLowerCase() === brandId.toLowerCase()
      );
    } catch (error) {
      console.error('Error fetching products by brand:', error);
      throw error;
    }
  },

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

// ============================================
// SERIAL VALIDATION ✅ FINAL FIX
// ============================================

export interface SerialValidationResult {
  valid: boolean;
  gift_claimed: boolean;
  serial_number: string;
  product_name?: string;
  product_id?: string;
  message?: string;
}

export async function validateSerial(serialNumber: string): Promise<SerialValidationResult> {
  try {
    // ✅ FIXED REGEX: Allows 2 to 4 Uppercase letters (e.g., "JR-PIL")
    const serialRegex = /^[A-Z]{2,4}-[A-Z]{2,4}-\d{4}-\d{3}-\d{4}$/;
    if (!serialRegex.test(serialNumber)) {
      return {
        valid: false,
        gift_claimed: false,
        serial_number: serialNumber,
        message: 'Invalid serial number format',
      };
    }

    // 2. Query product_serials table using maybeSingle() to prevent crashing
    const { data, error } = await supabase
      .from('product_serials')
      .select(`
        serial_number,
        gift_claimed,
        reviewed,
        product_id,
        scanned_count,
        products (
          id,
          name,
          sku
        )
      `)
      .eq('serial_number', serialNumber)
      .maybeSingle();

    // 3. Handle specific Supabase errors
    if (error) {
      console.error('Supabase Query Error:', error);
      return {
        valid: false,
        gift_claimed: false,
        serial_number: serialNumber,
        message: `Database error: ${error.message || 'Unknown error'}`,
      };
    }

    // 4. Handle missing data (Serial not in table yet)
    if (!data) {
      return {
        valid: false,
        gift_claimed: false,
        serial_number: serialNumber,
        message: 'Serial number not found',
      };
    }

    // 5. Increment scanned count
    const currentScanned = data.scanned_count || 0;
    await supabase
      .from('product_serials')
      .update({
        scanned_count: currentScanned + 1,
        last_scanned_at: new Date().toISOString(),
      })
      .eq('serial_number', serialNumber);

    // 6. Safely extract related product data from the joined products relation.
    const productData: { id?: string; name?: string; sku?: string } | null = Array.isArray(data.products)
      ? (data.products[0] ?? null)
      : (data.products ?? null);

    // 7. Return success
    return {
      valid: true,
      gift_claimed: data.gift_claimed || false,
      serial_number: data.serial_number,
      product_name: productData?.name || 'Unknown Product',
      product_id: productData?.id || data.product_id,
    };

  } catch (error: any) {
    console.error('Unexpected error validating serial:', error);
    return {
      valid: false,
      gift_claimed: false,
      serial_number: serialNumber,
      message: `System error: ${error?.message || 'Please try again'}`,
    };
  }
}

// ============================================
// REVIEW FUNCTIONS
// ============================================

export interface ReviewData {
  serial_number: string;
  rating: number;
  comment: string;
  customer_name?: string;
  customer_email?: string;
}

export async function submitReview(reviewData: ReviewData): Promise<{ success: boolean; message: string }> {
  try {
    const { serial_number, rating, comment, customer_name, customer_email } = reviewData;

    // Validate serial exists and the product has not already been reviewed/claimed
    const { data: serial, error: serialError } = await supabase
      .from('product_serials')
      .select('id, product_id, gift_claimed, reviewed')
      .eq('serial_number', serial_number)
      .single();

    if (serialError || !serial) {
      return {
        success: false,
        message: 'Invalid serial number',
      };
    }

    if (serial.gift_claimed) {
      return {
        success: false,
        message: 'Gift already claimed for this product',
      };
    }

    if (serial.reviewed) {
      return {
        success: false,
        message: 'This product has already been reviewed',
      };
    }

    // Insert review
    const { error: reviewError } = await supabase
      .from('reviews')
      .insert({
        product_id: serial.product_id,
        serial_id: serial.id,
        rating: rating,
        comment: comment,
        customer_name: customer_name || null,
        customer_email: customer_email || null,
        status: 'pending',
      })
      .select()
      .single();

    if (reviewError) throw reviewError;

    // Mark serial as reviewed, but leave gift_claimed false until the gift is explicitly redeemed.
    await supabase
      .from('product_serials')
      .update({
        reviewed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('serial_number', serial_number);

    return {
      success: true,
      message: 'Review submitted successfully! You can now claim your gift.',
    };
  } catch (error) {
    console.error('Error submitting review:', error);
    return {
      success: false,
      message: 'Failed to submit review',
    };
  }
}

// ============================================
// GIFT FUNCTIONS
// ============================================

export interface GiftData {
  serial_number: string;
  reward_code?: string;
  reward_type?: string;
}

export async function claimGift(serialNumber: string): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const { data: serial, error: serialError } = await supabase
      .from('product_serials')
      .select('id, product_id, gift_claimed, reviewed')
      .eq('serial_number', serialNumber)
      .single();

    if (serialError || !serial) {
      return {
        success: false,
        message: 'Invalid serial number',
      };
    }

    if (serial.gift_claimed) {
      return {
        success: false,
        message: 'Gift already claimed',
      };
    }

    if (!serial.reviewed) {
      return {
        success: false,
        message: 'Please submit a review first',
      };
    }

    // Generate reward code
    const rewardCode = `JORIQUE-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const { error: giftError } = await supabase
      .from('gift_redemption')
      .insert({
        serial_id: serial.id,
        product_id: serial.product_id,
        reward_code: rewardCode,
        reward_type: 'discount',
        reward_value: 20,
        redeemed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (giftError) throw giftError;

    // Mark serial as gift claimed
    await supabase
      .from('product_serials')
      .update({
        gift_claimed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('serial_number', serialNumber);

    return {
      success: true,
      message: 'Gift claimed successfully!',
      data: {
        reward_code: rewardCode,
        reward_type: 'discount',
        reward_value: 20,
      },
    };
  } catch (error) {
    console.error('Error claiming gift:', error);
    return {
      success: false,
      message: 'Failed to claim gift',
    };
  }
}

// ============================================
// GET FUNCTIONS
// ============================================

export async function getReviewBySerial(serialNumber: string): Promise<any | null> {
  try {
    const { data: serial, error: serialError } = await supabase
      .from('product_serials')
      .select('id, product_id, gift_claimed, reviewed')
      .eq('serial_number', serialNumber)
      .single();

    if (serialError || !serial) return null;

    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .select('*')
      .eq('serial_id', serial.id)
      .maybeSingle();

    if (reviewError) throw reviewError;
    return review;
  } catch (error) {
    console.error('Error fetching review:', error);
    return null;
  }
}

export async function getGiftBySerial(serialNumber: string): Promise<any | null> {
  try {
    const { data: serial, error: serialError } = await supabase
      .from('product_serials')
      .select('id')
      .eq('serial_number', serialNumber)
      .single();

    if (serialError || !serial) return null;

    const { data: gift, error: giftError } = await supabase
      .from('gift_redemption')
      .select('*')
      .eq('serial_id', serial.id)
      .maybeSingle();

    if (giftError) throw giftError;
    return gift;
  } catch (error) {
    console.error('Error fetching gift:', error);
    return null;
  }
}

export default productService;