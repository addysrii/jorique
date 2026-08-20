export interface ProductFormValues {
  name: string;
  category: string;
  price: number;
  cost?: number;
  supplier?: string;
  description?: string;
  // brand_id?: string;
  images?: string[];
  tags?: string;
  sku?: string;
  discount_price?: number;
  year?: number;
}
