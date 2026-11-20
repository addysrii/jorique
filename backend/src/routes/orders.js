import { Router } from 'express';
import { supabase } from '../supabase.js';
import { adminRequired, authRequired } from '../middleware/auth.js';
import {
  sendOrderWhatsAppNotification,
  sendOrderConfirmationWhatsApp,
  sendAdminNewOrderAlert,
  normalizePhoneNumber,
} from '../services/whatsapp.js';
import { logActivity } from '../services/activityLogger.js';

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

router.get('/customer-phone/:phone', authRequired, adminRequired, async (req, res) => {
  try {
    const cleanPhone = String(req.params.phone || '').replace(/\D/g, '');
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    const filtered = (data || []).filter(o => {
      const p = o.items?.customer_phone || '';
      return p.includes(cleanPhone);
    });
    res.json({ success: true, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: message(error) });
  }
});

router.post('/', authRequired, async (req, res) => {
  try {
    const {
      items,
      total,
      customer_id: requestedCustomerId,
      invoice_number,
      source,
      shipping_address,
      customer_details,
      payment_method,
    } = req.body || {};

    if (!items || (Array.isArray(items) && items.length === 0)) {
      return res.status(400).json({ success: false, message: 'Order items are required.' });
    }

    const customerId = req.user.role === 'admin' && requestedCustomerId ? requestedCustomerId : (source === 'in_store_pos' ? null : req.user.id);
    const orderNumber = invoice_number || `JRQ-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const status = source === 'in_store_pos' ? 'delivered' : 'pending';

    const formattedAddress = shipping_address || (customer_details ? `${customer_details.address}, ${customer_details.city} - ${customer_details.pincode} (Tel: ${customer_details.phone})` : null);

    const order = {
      order_number: orderNumber,
      customer_id: customerId,
      status,
      total: total ?? 0,
      items: customer_details ? { products: items, customer_details } : items,
      shipping_address: formattedAddress,
      payment_method: payment_method || (source === 'in_store_pos' ? 'In-Store POS' : 'WhatsApp Order'),
    };

    const { data, error } = await supabase.from('orders').insert(order).select('*').single();
    if (error) throw error;

    // ── AUTOMATED WHATSAPP NOTIFICATIONS ────────────────────────────────────
    const customerInfo = extractCustomerInfo(data);
    const customerPhone = customer_details?.phone || customerInfo.phone;
    const customerName = customer_details?.name || customerInfo.name || req.user.fullName || 'Valued Patron';

    if (customerPhone && source !== 'in_store_pos') {
      const itemsList = Array.isArray(items) ? items : (items.products || [items]);

      // 1. Send Instant Confirmation to Customer
      try {
        await sendOrderConfirmationWhatsApp({
          orderNumber,
          customerPhone,
          customerName,
          total: total ?? 0,
          items: itemsList,
          shippingAddress: formattedAddress || '',
        });
        console.log(`[AUTOMATION] Order confirmation WhatsApp sent to ${customerPhone} for order #${orderNumber}`);
      } catch (waErr) {
        console.warn('[AUTOMATION] Customer WhatsApp confirmation failed:', waErr.message);
      }

      // 2. Send Instant Alert to Brand Admin / Concierge
      try {
        await sendAdminNewOrderAlert({
          orderNumber,
          customerName,
          customerPhone,
          total: total ?? 0,
          itemsCount: itemsList.length,
          city: customer_details?.city || '',
        });
        console.log(`[AUTOMATION] Admin alert WhatsApp sent for order #${orderNumber}`);
      } catch (adminAlertErr) {
        console.warn('[AUTOMATION] Admin alert WhatsApp failed:', adminAlertErr.message);
      }
    }

    logActivity({
      type: 'order',
      action: 'order_placed',
      title: `New Order Placed (#${orderNumber})`,
      description: `Amount: ₹${Number(total || 0).toLocaleString('en-IN')} • Customer: ${customerName}`,
      metadata: { orderNumber, customerPhone, total, itemsCount: itemsList.length },
      actor: 'customer',
    }).catch(() => {});

    res.status(201).json({ success: true, data });
  } catch (error) { res.status(400).json({ success: false, message: message(error) }); }
});

function extractCustomerInfo(order) {
  let phone = '';
  let name = '';

  if (order.items) {
    if (typeof order.items === 'object' && !Array.isArray(order.items)) {
      phone = order.items.customer_details?.phone || order.items.customer_phone || order.items.phone || '';
      name = order.items.customer_details?.name || order.items.customer_name || order.items.name || '';
      if (!phone && Array.isArray(order.items.products)) {
        const first = order.items.products[0];
        phone = first?.customer_phone || first?.phone || '';
        name = first?.customer_name || first?.name || '';
      }
    } else if (Array.isArray(order.items)) {
      const itemWithPhone = order.items.find((i) => i && (i.customer_phone || i.phone));
      if (itemWithPhone) {
        phone = itemWithPhone.customer_phone || itemWithPhone.phone;
        name = itemWithPhone.customer_name || itemWithPhone.name;
      }
    }
  }

  if (!phone && order.shipping_address) {
    const match = order.shipping_address.match(/(?:\+?\d{1,3}[- ]?)?\d{10}/);
    if (match) phone = match[0];
  }

  return { phone: phone || '', name: name || 'Valued Patron' };
}

router.put('/:id/status', authRequired, adminRequired, async (req, res) => {
  try {
    const { status, notify_whatsapp = true, tracking_number, custom_note, customer_phone } = req.body || {};
    if (!ORDER_STATUSES.includes(status)) return res.status(400).json({ success: false, message: 'Invalid order status.' });
    
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', req.params.id).select('*').maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Order not found.' });

    let whatsappResult = null;
    if (notify_whatsapp !== false) {
      const customerInfo = extractCustomerInfo(data);
      const targetPhone = customer_phone || customerInfo.phone;
      if (targetPhone) {
        const itemsList = Array.isArray(data.items) ? data.items : (data.items?.products || []);
        whatsappResult = await sendOrderWhatsAppNotification({
          orderNumber: data.order_number,
          customerPhone: targetPhone,
          customerName: customerInfo.name,
          status,
          total: data.total,
          itemsCount: itemsList.length || 1,
          trackingNumber: tracking_number,
          customNote: custom_note,
        });
      }
    }

    logActivity({
      type: 'order',
      action: 'order_status_updated',
      title: `Order #${data.order_number} Status Updated`,
      description: `Status changed to ${status.toUpperCase()}${tracking_number ? ` • Tracking: ${tracking_number}` : ''}`,
      metadata: { orderId: req.params.id, orderNumber: data.order_number, status, tracking_number },
      actor: req.user?.role || 'admin',
    }).catch(() => {});

    res.json({ success: true, data, whatsapp: whatsappResult });
  } catch (error) { res.status(400).json({ success: false, message: message(error) }); }
});

router.post('/:id/notify-whatsapp', authRequired, adminRequired, async (req, res) => {
  try {
    const { phone: overridePhone, status: overrideStatus, tracking_number, custom_note } = req.body || {};
    const { data: order, error } = await supabase.from('orders').select('*').eq('id', req.params.id).maybeSingle();
    if (error) throw error;
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    const customerInfo = extractCustomerInfo(order);
    const targetPhone = overridePhone || customerInfo.phone;
    if (!targetPhone) {
      return res.status(400).json({ success: false, message: 'Customer phone number not found on order. Please provide phone number.' });
    }

    const itemsList = Array.isArray(order.items) ? order.items : (order.items?.products || []);
    const whatsappResult = await sendOrderWhatsAppNotification({
      orderNumber: order.order_number,
      customerPhone: targetPhone,
      customerName: customerInfo.name,
      status: overrideStatus || order.status,
      total: order.total,
      itemsCount: itemsList.length || 1,
      trackingNumber: tracking_number,
      customNote: custom_note,
    });

    res.json({ success: true, message: 'WhatsApp notification sent.', whatsapp: whatsappResult });
  } catch (error) {
    res.status(400).json({ success: false, message: message(error) });
  }
});

export default router;
