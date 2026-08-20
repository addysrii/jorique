export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  category: string;
  quantity?: number;
  features: string[];
  inStock: boolean;
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
