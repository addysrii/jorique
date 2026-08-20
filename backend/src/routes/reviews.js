import { Router } from 'express';
import { supabase } from '../supabase.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
const message = (error) => error?.message || 'Request failed.';

router.get('/', async (req, res) => {
  try {
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (req.query.product_id) query = query.eq('product_id', req.query.product_id);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) { res.status(500).json({ success: false, message: message(error) }); }
});

router.post('/', authRequired, async (req, res) => {
  try {
    const { product_id: productId, rating, comment } = req.body || {};
    if (!productId || !Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ success: false, message: 'product_id and a rating from 1 to 5 are required.' });
    }
    const { data, error } = await supabase.from('reviews').insert({ product_id: productId, customer_id: req.user.id, rating: Number(rating), comment: comment ?? null }).select('*').single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (error) { res.status(400).json({ success: false, message: message(error) }); }
});

router.put('/:id', authRequired, async (req, res) => {
  try {
    const updates = {};
    if (req.body?.rating !== undefined) {
      if (!Number.isInteger(Number(req.body.rating)) || Number(req.body.rating) < 1 || Number(req.body.rating) > 5) return res.status(400).json({ success: false, message: 'Rating must be from 1 to 5.' });
      updates.rating = Number(req.body.rating);
    }
    if (req.body?.comment !== undefined) updates.comment = req.body.comment;
    let query = supabase.from('reviews').update(updates).eq('id', req.params.id);
    if (req.user.role !== 'admin') query = query.eq('customer_id', req.user.id);
    const { data, error } = await query.select('*').maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Review not found.' });
    res.json({ success: true, data });
  } catch (error) { res.status(400).json({ success: false, message: message(error) }); }
});

export default router;
