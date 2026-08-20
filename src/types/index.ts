export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  discount_price?: number;
  cost?: number;
  quantity: number;
  supplier?: string;
  description?: string;
  images: string[];
  tags: string[];
  badge?: string;
  brand_id: string;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface ProductResponse {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  discount_price?: number;
  cost?: number;
  quantity: number;
  supplier?: string;
  description?: string;
  images?: string[];
  tags?: string[];
  badge?: string;
  brand_id: string;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface ProductFormValues {
  name: string;
  category: string;
  price: number;
  discount_price?: number;
  cost?: number;
  quantity: number;
  supplier?: string;
  description?: string;
  images?: string[];
  tags?: string;
  brand_id?: string;
  year?: number;
  sku?: string;
  badge?: string;
}
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
}

export interface AppUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  fullName: string;
  user_metadata: { full_name: string };
}
