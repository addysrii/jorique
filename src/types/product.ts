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
  supplier?: string;
  description?: string;
  // brand_id?: string;
  images?: string[];
  tags?: string;
  discount_price?: number;
  year?: number;
  quantity: number;
}
