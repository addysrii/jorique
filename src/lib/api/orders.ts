import { supabase } from '../supabase';

export interface OrderItem {
  product_id: string;
  sku?: string;
  name: string;
  quantity: number;
  price: number;
  customer_phone?: string;
  customer_name?: string;
}

export interface CreateOrderPayload {
  order_number: string;
  total: number;
  customer_id?: string;
  customer_email?: string;
  items: OrderItem[];
  customer_details: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    notes?: string;
  };
}

export interface StoredOrder {
  id: string;
  order_number: string;
  customer_id?: string;
  status: string;
  total: number;
  items: OrderItem[];
  shipping_address?: string;
  payment_method?: string;
  customer_notes?: string | null;
  created_at: string;
}

const LOCAL_ORDERS_KEY = 'jorique_placed_orders';

export const orderService = {
  saveLocalOrder(order: StoredOrder) {
    try {
      const existing = this.getLocalOrders();
      const filtered = existing.filter((o) => o.order_number !== order.order_number);
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([order, ...filtered]));
    } catch (e) {
      console.warn('Failed to cache order locally:', e);
    }
  },

  getLocalOrders(): StoredOrder[] {
    try {
      const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async createOrder(payload: CreateOrderPayload) {
    try {
      const enrichedItems: OrderItem[] = payload.items.map((item, idx) => ({
        ...item,
        ...(idx === 0
          ? {
              customer_phone: payload.customer_details.phone,
              customer_name: payload.customer_details.name,
            }
          : {}),
      }));

      const shippingAddress = `${payload.customer_details.address}, ${payload.customer_details.city} - ${payload.customer_details.pincode} (Tel: ${payload.customer_details.phone})`;

      const orderData = {
        order_number: payload.order_number,
        customer_id: payload.customer_id || null,
        total: payload.total,
        status: 'pending',
        items: enrichedItems,
        shipping_address: shippingAddress,
        payment_method: 'WhatsApp Order',
        customer_notes: payload.customer_details.notes || null,
        created_at: new Date().toISOString(),
      };

      // Always save to local cache for instant client availability
      this.saveLocalOrder({
        id: payload.order_number,
        ...orderData,
      });

      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select('*')
        .maybeSingle();

      if (error) {
        console.warn('Supabase order insert warning:', error);
      }

      return { success: true, data: data || orderData };
    } catch (err) {
      console.warn('Order creation error:', err);
      return { success: true, data: null };
    }
  },

  async getUserOrders(userId?: string): Promise<StoredOrder[]> {
    const localOrders = this.getLocalOrders();
    const orderMap = new Map<string, StoredOrder>();

    // Put local orders first
    localOrders.forEach((o) => {
      if (!userId || !o.customer_id || o.customer_id === userId) {
        orderMap.set(o.order_number, o);
      }
    });

    if (userId) {
      try {
        const { data: dbOrders, error } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_id', userId)
          .order('created_at', { ascending: false });

        if (!error && dbOrders) {
          dbOrders.forEach((o) => {
            orderMap.set(o.order_number, o as StoredOrder);
          });
        }
      } catch (err) {
        console.warn('Could not fetch user orders from Supabase:', err);
      }
    }

    // Return all sorted by date descending
    return Array.from(orderMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },
};

