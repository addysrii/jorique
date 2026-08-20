import { Router } from 'express';
import { supabase } from '../supabase.js';
import { adminRequired, authRequired } from '../middleware/auth.js';
import { createUniqueSKU, generateSerials } from '../utils/product.js';

const router = Router();
const SERIAL_STATUSES = ['available', 'reserved', 'sold', 'returned', 'damaged'];

function errorMessage(error) {
  return error?.message || 'Request failed.';
}

router.get('/sku/:sku', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('sku', req.params.sku).maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: errorMessage(error) });
  }
});

router.get('/serial/:serialNumber', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('product_serials')
      .select('*, product:products(*)')
      .eq('serial_number', req.params.serialNumber)
      .maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Serial not found.' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: errorMessage(error) });
  }
});

router.get('/', async (_req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: errorMessage(error) });
  }
});

router.get('/:id/serials', async (req, res) => {
  try {
    const { data: product, error: productError } = await supabase.from('products').select('*').eq('id', req.params.id).maybeSingle();
    if (productError) throw productError;
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const { data: serials, error: serialError } = await supabase
      .from('product_serials').select('*').eq('product_id', req.params.id).order('serial_number');
    if (serialError) throw serialError;
    res.json({ success: true, data: { product, serials: serials || [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: errorMessage(error) });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: errorMessage(error) });
  }
});

router.post('/', authRequired, adminRequired, async (req, res) => {
  try {
    const body = req.body || {};
    const quantity = Number(body.quantity ?? 0);
    const year = Number(body.year || new Date().getFullYear());
    
    if (!body.name || !body.category || !Number.isInteger(quantity) || quantity < 1 || quantity > 100000) {
      return res.status(400).json({ 
        success: false, 
        message: 'name, category, and a valid quantity are required.' 
      });
    }

    const sku = await createUniqueSKU(supabase, body.category, year);
    
    const productInput = {
      name: body.name,
      category: body.category,
      price: body.price,
      supplier: body.supplier ?? null,
      description: body.description ?? null,
      images: body.images ?? [],
      tags: body.tags ?? null,
      sku,
      quantity,
      discount_price: body.discount_price ?? null,
      year,
      badge: body.badge ?? null,
    };

    const { data: product, error: productError } = await supabase
      .from('products')
      .insert(productInput)
      .select('*')
      .single();
      
    if (productError) throw productError;

    const serialsInput = generateSerials(sku, quantity).map((serial) => ({
      product_id: product.id,
      ...serial,
    }));
    
    const { data: serials, error: serialError } = serialsInput.length
      ? await supabase.from('product_serials').insert(serialsInput).select('*')
      : { data: [], error: null };
      
    if (serialError) {
      await supabase.from('products').delete().eq('id', product.id);
      throw serialError;
    }
    
    res.status(201).json({ 
      success: true, 
      data: { product, serials: serials || [] } 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: errorMessage(error) });
  }
});

router.put('/serial/:serialNumber/status', authRequired, adminRequired, async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!SERIAL_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid serial status.' });
    }
    
    const { data, error } = await supabase
      .from('product_serials')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('serial_number', req.params.serialNumber)
      .select('*')
      .maybeSingle();
      
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Serial not found.' });
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: errorMessage(error) });
  }
});

router.put('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    const allowed = ['name', 'category', 'price', 'supplier', 'description', 'images', 'tags', 'discount_price', 'year', 'badge'];
    const updates = Object.fromEntries(
      Object.entries(req.body || {}).filter(([key]) => allowed.includes(key))
    );
    
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', req.params.id)
      .select('*')
      .maybeSingle();
      
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Product not found.' });
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: errorMessage(error) });
  }
});

router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id)
      .select('id')
      .maybeSingle();
      
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Product not found.' });
    
    res.json({ success: true, data: { id: data.id } });
  } catch (error) {
    res.status(400).json({ success: false, message: errorMessage(error) });
  }
});

export default router;