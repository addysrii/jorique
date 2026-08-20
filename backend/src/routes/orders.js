import { Router } from 'express';
import { supabase } from '../supabase.js';
import { adminRequired, authRequired } from '../middleware/auth.js';

const router = Router();
const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
const message = (error) => error?.message || 'Request failed.';

router.get('/', authRequired, async (req, res) => {
  try {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (req.user.role !== 'admin') query = query.eq('customer_id', req.user.id);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) { res.status(500).json({ success: false, message: message(error) }); }
});

router.get('/:id', authRequired, async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').select('*').eq('id', req.params.id).maybeSingle();
    if (error) throw error;
    if (!data || (req.user.role !== 'admin' && data.customer_id !== req.user.id)) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data });
  } catch (error) { res.status(500).json({ success: false, message: message(error) }); }
});

router.post('/', authRequired, async (req, res) => {
  try {
    const { items, total, customer_id: requestedCustomerId } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ success: false, message: 'Order items are required.' });
    const customerId = req.user.role === 'admin' && requestedCustomerId ? requestedCustomerId : req.user.id;
    const order = { order_number: `JRQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`, customer_id: customerId, status: 'pending', total: total ?? 0, items };
    const { data, error } = await supabase.from('orders').insert(order).select('*').single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) { res.status(400).json({ success: false, message: message(error) }); }
});

router.put('/:id/status', authRequired, adminRequired, async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!ORDER_STATUSES.includes(status)) return res.status(400).json({ success: false, message: 'Invalid order status.' });
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', req.params.id).select('*').maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data });
  } catch (error) { res.status(400).json({ success: false, message: message(error) }); }
});

export default router;
