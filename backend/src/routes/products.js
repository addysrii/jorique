import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../supabase.js';
import { adminRequired, authRequired } from '../middleware/auth.js';
import { createUniqueSKU, generateSerials } from '../utils/product.js';
import { logActivity } from '../services/activityLogger.js';

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

router.get('/validate-sku/:sku', async (req, res) => {
  try {
    const cleanSku = String(req.params.sku || '').trim().toUpperCase();
    if (!cleanSku || cleanSku.length < 3) {
      return res.json({ success: true, available: false, message: 'SKU must be at least 3 characters.' });
    }
    const { data, error } = await supabase.from('products').select('id, name, sku').eq('sku', cleanSku).maybeSingle();
    if (error) throw error;
    if (data) {
      return res.json({ success: true, available: false, message: `SKU "${cleanSku}" is already registered to "${data.name}".` });
    }
    res.json({ success: true, available: true });
  } catch (error) {
    res.status(500).json({ success: false, message: errorMessage(error) });
  }
});

router.post('/upload-image', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    
    // In production, require valid token and admin role
    if (process.env.NODE_ENV === 'production' || token) {
      if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, role, is_verified')
          .eq('id', payload.sub)
          .maybeSingle();

        if (!profile || profile.role !== 'admin') {
          return res.status(403).json({ success: false, message: 'Admin access required.' });
        }
      } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
      }
    }

    const { fileName, fileBase64, contentType } = req.body || {};
    if (!fileName || !fileBase64) {
      return res.status(400).json({ success: false, message: 'Missing file data.' });
    }

    const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');
    const ext = fileName.split('.').pop() || 'png';
    const filePath = `products/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, buffer, {
        contentType: contentType || 'image/png',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return res.json({ success: true, url: publicUrl });
  } catch (error) {
    return res.status(500).json({ success: false, message: errorMessage(error) });
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

    let sku;
    if (body.sku && typeof body.sku === 'string' && body.sku.trim().length >= 3) {
      sku = body.sku.trim().toUpperCase();
      const { data: existing, error: checkError } = await supabase
        .from('products')
        .select('id, name')
        .eq('sku', sku)
        .maybeSingle();

      if (checkError) throw checkError;
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `SKU "${sku}" is already in use by product "${existing.name}". Please provide a unique SKU.`,
        });
      }
    } else {
      sku = await createUniqueSKU(supabase, body.category, year);
    }
    
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

    logActivity({
      type: 'product',
      action: 'product_created',
      title: `Product Added: ${product.name}`,
      description: `SKU: ${product.sku} • Price: ₹${product.price} • Quantity: ${quantity}`,
      metadata: { id: product.id, sku: product.sku, price: product.price, category: product.category },
      actor: 'admin',
    }).catch(() => {});
    
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
    const allowed = [
      'name', 'category', 'subcategory', 'price', 'discount_price',
      'quantity', 'cost', 'supplier', 'description', 'images',
      'tags', 'year', 'badge', 'sku', 'brand_id'
    ];
    const updates = Object.fromEntries(
      Object.entries(req.body || {}).filter(([key]) => allowed.includes(key))
    );

    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.discount_price !== undefined) {
      updates.discount_price = updates.discount_price === '' || updates.discount_price === null ? null : Number(updates.discount_price);
    }
    if (updates.quantity !== undefined) updates.quantity = Number(updates.quantity);
    if (updates.cost !== undefined) {
      updates.cost = updates.cost === '' || updates.cost === null ? null : Number(updates.cost);
    }

    const targetId = req.params.id;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);

    const query = supabase.from('products').update(updates);
    const { data, error } = await (isUUID ? query.eq('id', targetId) : query.eq('sku', targetId))
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Product not found.' });

    logActivity({
      type: 'product',
      action: 'product_updated',
      title: `Product Updated: ${data.name || data.sku}`,
      description: `Updated fields: ${Object.keys(updates).join(', ')}`,
      metadata: { id: data.id, sku: data.sku, updates },
      actor: 'admin',
    }).catch(() => {});

    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: errorMessage(error) });
  }
});

router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    const targetId = req.params.id;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);

    let productId = targetId;
    if (!isUUID) {
      const { data: prod } = await supabase.from('products').select('id, name, sku').eq('sku', targetId).maybeSingle();
      if (prod) productId = prod.id;
    }

    // Delete serials and reviews first to prevent foreign key errors
    await supabase.from('product_serials').delete().eq('product_id', productId);
    await supabase.from('reviews').delete().eq('product_id', productId);

    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .select('id, name, sku')
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Product not found.' });

    logActivity({
      type: 'product',
      action: 'product_deleted',
      title: `Product Removed: ${data.name || data.sku || targetId}`,
      description: 'Product and associated serials purged from catalogue',
      metadata: { id: productId, target: targetId, name: data.name },
      actor: 'admin',
    }).catch(() => {});

    res.json({ success: true, message: 'Product deleted successfully', data: { id: data.id } });
  } catch (error) {
    res.status(400).json({ success: false, message: errorMessage(error) });
  }
});

/**
 * Meta / WhatsApp Commerce Catalog CSV Feed Export
 */
router.get('/export/meta-catalog.csv', async (_req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const frontendBase = (process.env.FRONTEND_URL || 'https://jorique.in').split(',')[0].trim().replace(/\/$/, '');

    // Standard Meta / Facebook Catalog CSV header
    const headers = [
      'id',
      'title',
      'description',
      'availability',
      'condition',
      'price',
      'link',
      'image_link',
      'brand',
      'google_product_category',
      'fb_product_category',
    ];

    const escapeCsv = (str) => {
      const s = String(str || '').replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = (products || []).map((p) => {
      const id = p.sku || p.id;
      const title = p.name || 'JORIQUE Atelier Product';
      const desc = p.description || `${title} - Handcrafted Luxury Homeware by JORIQUE.`;
      const avail = Number(p.quantity || 0) > 0 ? 'in stock' : 'out of stock';
      const condition = 'new';
      const price = `${Number(p.price || 0).toFixed(2)} INR`;
      const link = `${frontendBase}/product/${p.id}`;
      const image_link = Array.isArray(p.images) && p.images[0] ? p.images[0] : '';
      const brand = 'JORIQUE';
      const gCategory = 'Home & Garden > Linens & Bedding';
      const fbCategory = 'Home & Garden';

      return [
        escapeCsv(id),
        escapeCsv(title),
        escapeCsv(desc),
        escapeCsv(avail),
        escapeCsv(condition),
        escapeCsv(price),
        escapeCsv(link),
        escapeCsv(image_link),
        escapeCsv(brand),
        escapeCsv(gCategory),
        escapeCsv(fbCategory),
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="jorique-meta-catalog.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, message: errorMessage(error) });
  }
});

export default router;