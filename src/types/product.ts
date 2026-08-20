export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  supplier?: string;
  description?: string;
  images: string[];
  tags?: string[];
  sku: string;
  discount_price?: number;
  year: number;
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
