import { supabase } from '../supabase';

export interface CreateOrderPayload {
  order_number: string;
  total: number;
  items: Array<{
    product_id: string;
    sku?: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  customer_details: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    notes?: string;
  };
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload) {
    try {
      const enrichedItems = payload.items.map((item, idx) => ({
        ...item,
        ...(idx === 0
          ? {
              customer_phone: payload.customer_details.phone,
              customer_name: payload.customer_details.name,
            }
          : {}),
      }));

      const orderData = {
        order_number: payload.order_number,
        total: payload.total,
        status: 'pending',
        items: enrichedItems,
        shipping_address: `${payload.customer_details.address}, ${payload.customer_details.city} - ${payload.customer_details.pincode} (Tel: ${payload.customer_details.phone})`,
        payment_method: 'WhatsApp Order',
        customer_notes: payload.customer_details.notes || null,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select('*')
        .maybeSingle();

      if (error) {
        console.warn('Supabase order insert warning:', error);
      }

      return { success: true, data };
    } catch (err) {
      console.warn('Order creation error:', err);
      return { success: true, data: null };
    }
  },
};
