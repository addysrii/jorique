import { Router } from 'express';
import { supabase } from '../supabase.js';
import { adminRequired, authRequired } from '../middleware/auth.js';

const router = Router();
const message = (error) => error?.message || 'Request failed.';

router.get('/dashboard', authRequired, adminRequired, async (_req, res) => {
  try {
    const [{ count: products }, { count: orders }, { count: customers }, { data: revenueRows }] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase.from('customers').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('total').in('status', ['confirmed', 'processing', 'shipped', 'delivered']),
    ]);
    const revenue = (revenueRows || []).reduce((sum, order) => sum + Number(order.total || 0), 0);
    res.json({ success: true, data: { products: products || 0, orders: orders || 0, customers: customers || 0, revenue: Number(revenue.toFixed(2)) } });
  } catch (error) { res.status(500).json({ success: false, message: message(error) }); }
});

router.get('/sales', authRequired, adminRequired, async (req, res) => {
  try {
    const from = req.query.from;
    const to = req.query.to;
    let query = supabase.from('orders').select('id, order_number, total, status, created_at').order('created_at', { ascending: true });
    if (from) query = query.gte('created_at', from);
    if (to) query = query.lte('created_at', to);
    const { data, error } = await query;
    if (error) throw error;
    const orders = data || [];
    const completed = orders.filter((order) => ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status));
    const total = completed.reduce((sum, order) => sum + Number(order.total || 0), 0);
    res.json({ success: true, data: { orders, total: Number(total.toFixed(2)), count: completed.length } });
  } catch (error) { res.status(500).json({ success: false, message: message(error) }); }
});

export default router;
