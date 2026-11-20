/**
 * JORIQUE Luxury Concierge - WhatsApp Integration & Automation Service
 * Supports:
 * 1. Meta WhatsApp Business Cloud API (Graph API)
 * 2. Twilio WhatsApp API
 * 3. Direct wa.me link generation and dev console fallback
 * 4. Automated 24/7 inbound AI/keyword auto-responder
 * 5. Automated Order Confirmation & Admin Alerts
 */

import { supabase } from '../supabase.js';
import { logActivity } from './activityLogger.js';

export function normalizePhoneNumber(rawPhone) {
  if (!rawPhone) return '';
  const digits = String(rawPhone).replace(/\D/g, '');
  // If 10 digits (India domestic format), prepend country code 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  // If 11 digits starting with 0 (e.g., 09919388211), replace leading 0 with 91
  if (digits.length === 11 && digits.startsWith('0')) {
    return `91${digits.slice(1)}`;
  }
  return digits;
}

export async function sendWhatsAppMessage({ to, text }) {
  const cleanPhone = normalizePhoneNumber(to);
  if (!cleanPhone) {
    throw new Error('Valid recipient phone number is required.');
  }

  const encodedText = encodeURIComponent(text);
  const directWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;
  const directWhatsAppWebUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;

  // 1. Meta WhatsApp Cloud API
  const metaToken = process.env.WHATSAPP_TOKEN;
  const metaPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (metaToken && metaPhoneId) {
    try {
      const response = await fetch(`https://graph.facebook.com/v20.0/${metaPhoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${metaToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanPhone,
          type: 'text',
          text: { preview_url: true, body: text },
        }),
      });

      const resData = await response.json().catch(() => ({}));
      if (response.ok) {
        console.log(`[WHATSAPP CLOUD API] Message successfully dispatched to +${cleanPhone}`);
        logActivity({
          type: 'whatsapp',
          action: 'whatsapp_dispatch',
          title: `WhatsApp Dispatched to +${cleanPhone}`,
          description: text.length > 90 ? `${text.slice(0, 90)}...` : text,
          metadata: { to: cleanPhone, provider: 'meta_cloud', messageId: resData.messages?.[0]?.id },
          actor: 'system',
        }).catch(() => {});
        return { success: true, provider: 'meta_cloud', messageId: resData.messages?.[0]?.id, whatsappUrl: directWhatsAppUrl };
      }
      console.warn('[WHATSAPP CLOUD API] Error from Meta:', resData);
    } catch (metaErr) {
      console.error('[WHATSAPP CLOUD API] Request failed:', metaErr.message);
    }
  }

  // 2. Twilio WhatsApp
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_WHATSAPP_NUMBER; // e.g. "whatsapp:+14155238886"

  if (twilioSid && twilioAuth && twilioFrom) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');
      const params = new URLSearchParams();
      params.append('From', twilioFrom.startsWith('whatsapp:') ? twilioFrom : `whatsapp:${twilioFrom}`);
      params.append('To', `whatsapp:+${cleanPhone}`);
      params.append('Body', text);

      const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const twilioData = await twilioRes.json().catch(() => ({}));
      if (twilioRes.ok) {
        console.log(`[TWILIO WHATSAPP] Message dispatched to +${cleanPhone}`);
        logActivity({
          type: 'whatsapp',
          action: 'whatsapp_dispatch',
          title: `WhatsApp Dispatched to +${cleanPhone} (Twilio)`,
          description: text.length > 90 ? `${text.slice(0, 90)}...` : text,
          metadata: { to: cleanPhone, provider: 'twilio', messageId: twilioData.sid },
          actor: 'system',
        }).catch(() => {});
        return { success: true, provider: 'twilio', messageId: twilioData.sid, whatsappUrl: directWhatsAppUrl, whatsappWebUrl: directWhatsAppWebUrl };
      }
      console.warn('[TWILIO WHATSAPP] Error from Twilio:', twilioData);
    } catch (twErr) {
      console.error('[TWILIO WHATSAPP] Request failed:', twErr.message);
    }
  }

  // 3. Twilio Direct SMS Option
  const twilioSmsFrom = process.env.TWILIO_PHONE_NUMBER;
  if (twilioSid && twilioAuth && twilioSmsFrom) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');
      const params = new URLSearchParams();
      params.append('From', twilioSmsFrom);
      params.append('To', `+${cleanPhone}`);
      params.append('Body', text);

      const smsRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const smsData = await smsRes.json().catch(() => ({}));
      if (smsRes.ok) {
        console.log(`[TWILIO SMS] Direct SMS dispatched to +${cleanPhone}`);
        return { success: true, provider: 'twilio_sms', messageId: smsData.sid, whatsappUrl: directWhatsAppUrl, whatsappWebUrl: directWhatsAppWebUrl };
      }
      console.warn('[TWILIO SMS] Error from Twilio SMS:', smsData);
    } catch (smsErr) {
      console.error('[TWILIO SMS] SMS request failed:', smsErr.message);
    }
  }

  // 3. Fallback / Development Simulation
  if (process.env.NODE_ENV !== 'production' || (!metaToken && !twilioSid)) {
    console.log('\n======================================================');
    console.log('[WHATSAPP CONCIERGE SERVICE]');
    console.log(`To: +${cleanPhone}`);
    console.log(`Direct Link: ${directWhatsAppUrl}`);
    console.log('Message Body:');
    console.log(text);
    console.log('======================================================\n');
  }

  logActivity({
    type: 'whatsapp',
    action: 'whatsapp_dispatch',
    title: `WhatsApp Concierge Sent to +${cleanPhone}`,
    description: text.length > 90 ? `${text.slice(0, 90)}...` : text,
    metadata: { to: cleanPhone, provider: 'dev_fallback', preview: text.slice(0, 160) },
    actor: 'system',
  }).catch(() => {});

  return {
    success: true,
    provider: 'dev_fallback',
    whatsappUrl: directWhatsAppUrl,
    whatsappWebUrl: directWhatsAppWebUrl,
  };
}

/**
 * Send WhatsApp Verification OTP
 */
export async function sendWhatsAppOtp(phone, otp) {
  const message = `✨ *JORIQUE ATELIER*
Your verification code is: *${otp}*

This code is valid for 10 minutes. For security, do not share it with anyone.

_Where Comfort Meets Design_`;

  return await sendWhatsAppMessage({ to: phone, text: message });
}

/**
 * Send WhatsApp Order Status Notification
 */
export async function sendOrderWhatsAppNotification({
  orderNumber,
  customerPhone,
  customerName = 'Valued Patron',
  status,
  total,
  itemsCount = 1,
  trackingNumber,
  customNote,
}) {
  const statusLabels = {
    pending: '⏳ Pending Confirmation',
    confirmed: '✨ Confirmed & In Atelier Curation',
    processing: '🧵 In Crafting & Quality Inspection',
    shipped: '📦 Dispatched via Express Courier',
    delivered: '🏡 Delivered to Your Doorstep',
    cancelled: '❌ Cancelled',
    returned: '🔄 Exchange / Return Request',
  };

  const statusLabel = statusLabels[status?.toLowerCase()] || `Status: ${status}`;

  let body = `⚜️ *JORIQUE CONCIERGE — ORDER UPDATE*
────────────────────────────
Dear *${customerName}*,

Here is the latest update on your JORIQUE order:
📋 *Order ID:* #${orderNumber}
🏷️ *Current Status:* ${statusLabel}
${total ? `💰 *Amount:* ₹${Number(total).toLocaleString('en-IN')}\n` : ''}📦 *Items:* ${itemsCount} Piece(s)
`;

  if (trackingNumber) {
    body += `🚚 *Courier Tracking:* ${trackingNumber}\n`;
  }

  if (customNote) {
    body += `📝 *Note from Atelier:* ${customNote}\n`;
  }

  // Add mandatory unboxing reminder if order is shipped
  if (status?.toLowerCase() === 'shipped') {
    body += `\n⚠️ *IMPORTANT UNBOXING REMINDER:*
To ensure protection under our Return & Exchange Policy, please record a continuous, unedited *360° unboxing video* starting before opening the parcel seals.\n`;
  }

  body += `────────────────────────────
Questions? Reach our concierge at care@jorique.in.
Thank you for choosing JORIQUE.`;

  return await sendWhatsAppMessage({ to: customerPhone, text: body });
}

/**
 * Automated Order Confirmation on Placement
 */
export async function sendOrderConfirmationWhatsApp({
  orderNumber,
  customerPhone,
  customerName = 'Valued Patron',
  total,
  items = [],
  shippingAddress = '',
}) {
  const itemsList = Array.isArray(items) ? items : [items];
  const itemsText = itemsList
    .slice(0, 5)
    .map((i, idx) => {
      const name = i.name || i.product_name || 'Handcrafted Luxury Piece';
      const qty = i.quantity || 1;
      const price = i.price ? `₹${Number(i.price).toLocaleString('en-IN')}` : '';
      return `${idx + 1}. *${name}* (Qty: ${qty}${price ? ` • ${price}` : ''})`;
    })
    .join('\n');

  const moreItemsText = itemsList.length > 5 ? `\n...and ${itemsList.length - 5} more item(s)` : '';

  const body = `⚜️ *JORIQUE ATELIER — ORDER CONFIRMATION*
────────────────────────────
Dear *${customerName}*,

Thank you for choosing JORIQUE. Your order has been placed successfully and scheduled for master artisan preparation.

📋 *Order ID:* #${orderNumber}
💰 *Total Amount:* ₹${Number(total || 0).toLocaleString('en-IN')}
🚚 *Delivery:* FREE Express Delivery
${shippingAddress ? `📍 *Deliver to:* ${shippingAddress}\n` : ''}
📦 *Order Summary:*
${itemsText}${moreItemsText}

────────────────────────────
✨ *Fulfillment Stages:*
1. Quality inspection & sequential serial tagging.
2. Courier handover with real-time tracking link.
3. As part of our luxury guarantee, please record a continuous 360° unboxing video upon parcel delivery.

Questions? Reply directly to this WhatsApp concierge or email care@jorique.in.
_Where Comfort Meets Design_`;

  return await sendWhatsAppMessage({ to: customerPhone, text: body });
}

/**
 * Automated Admin / Store Owner Alert on New Order
 */
export async function sendAdminNewOrderAlert({
  orderNumber,
  customerName = 'Valued Customer',
  customerPhone = 'Not provided',
  total,
  itemsCount = 1,
  city = '',
}) {
  const adminPhone = process.env.WHATSAPP_ADMIN_PHONE || process.env.WHATSAPP_CONCIERGE_NUMBER || '919919388211';
  const body = `🚨 *NEW JORIQUE ORDER RECEIVED!*
────────────────────────────
📋 *Order ID:* #${orderNumber}
👤 *Customer:* ${customerName} (+${normalizePhoneNumber(customerPhone)})
💰 *Amount:* ₹${Number(total || 0).toLocaleString('en-IN')}
📦 *Items:* ${itemsCount} Piece(s)
${city ? `📍 *Destination:* ${city}\n` : ''}────────────────────────────
View and fulfill this order in the JORIQUE OS Admin Dashboard:
https://jorique.in/admin`;

  try {
    return await sendWhatsAppMessage({ to: adminPhone, text: body });
  } catch (err) {
    console.warn('[WHATSAPP ADMIN ALERT] Failed to notify admin:', err.message);
  }
}

/**
 * Automated 24/7 Inbound AI / Keyword Auto-Responder
 */
export async function handleIncomingWhatsAppMessage({ from, text }) {
  const cleanPhone = normalizePhoneNumber(from);
  const userMsg = String(text || '').trim().toLowerCase();

  console.log(`[WHATSAPP AUTOMATION BOT] Message from +${cleanPhone}: "${text}"`);

  logActivity({
    type: 'whatsapp',
    action: 'whatsapp_inbound_bot',
    title: `Inbound WhatsApp from +${cleanPhone}`,
    description: `Customer sent: "${text}"`,
    metadata: { from: cleanPhone, query: text },
    actor: 'whatsapp_bot',
  }).catch(() => {});

  // 1. Order Status Tracking
  if (
    userMsg.includes('order') ||
    userMsg.includes('track') ||
    userMsg.includes('status') ||
    userMsg.startsWith('jrq-') ||
    userMsg === '1'
  ) {
    const orderMatch = text.match(/jrq-[\w-]+/i);
    let order = null;

    if (orderMatch) {
      const orderNum = orderMatch[0].toUpperCase();
      const { data } = await supabase
        .from('orders')
        .select('*')
        .ilike('order_number', `%${orderNum}%`)
        .maybeSingle();
      order = data;
    } else {
      // Look up by customer phone number
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        order = data.find((o) => {
          const p = (
            o.items?.customer_phone ||
            o.items?.phone ||
            o.items?.customer_details?.phone ||
            o.shipping_address ||
            ''
          ).replace(/\D/g, '');
          return p.includes(cleanPhone.slice(-10));
        });
      }
    }

    if (order) {
      const statusLabels = {
        pending: '⏳ Pending Confirmation',
        confirmed: '✨ Confirmed & In Atelier Curation',
        processing: '🧵 In Crafting & Quality Inspection',
        shipped: '📦 Dispatched via Express Courier',
        delivered: '🏡 Delivered to Your Doorstep',
        cancelled: '❌ Cancelled',
        returned: '🔄 Exchange / Return Request',
      };
      const label = statusLabels[order.status?.toLowerCase()] || order.status;
      const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      const reply = `⚜️ *ORDER STATUS — JORIQUE*
────────────────────────────
Order ID: *#${order.order_number}*
Status: *${label}*
Total: ₹${Number(order.total || 0).toLocaleString('en-IN')}
Placed On: ${orderDate}

${order.status === 'shipped' ? '⚠️ *Reminder:* Please record a continuous 360° unboxing video upon parcel arrival.\n' : ''}────────────────────────────
Need concierge assistance? Reply with *4* or type your question.`;

      return await sendWhatsAppMessage({ to: cleanPhone, text: reply });
    } else {
      const reply = `⚜️ *JORIQUE ORDER TRACKING*
We could not locate an active order registered under this phone number (+${cleanPhone}).

If your order is under a different number or email, please reply with your *Order Number* (e.g. *JRQ-123456*) and our concierge will look it up immediately!`;
      return await sendWhatsAppMessage({ to: cleanPhone, text: reply });
    }
  }

  // 2. Browse Catalog / Collections
  if (
    userMsg.includes('catalog') ||
    userMsg.includes('catalogue') ||
    userMsg.includes('collection') ||
    userMsg.includes('shop') ||
    userMsg.includes('store') ||
    userMsg.includes('product') ||
    userMsg.includes('bedsheet') ||
    userMsg.includes('towel') ||
    userMsg === '2'
  ) {
    const reply = `✨ *JORIQUE LUXURY CATALOGUE STORE*
────────────────────────────
Explore our signature handcrafted homeware & digital catalogue:

📖 *Interactive Catalogue Store:*
https://jorique.in/catalog

🛏️ *Luxury Bedsheets:*
https://jorique.in/shop?category=Bedsheet

🛋️ *Artisan Cushion Covers:*
https://jorique.in/shop?category=Cushion+Cover

🧣 *Super-Soft Towels:*
https://jorique.in/shop?category=Towel

👗 *Designer Suits:*
https://jorique.in/shop?category=Suits

🎁 *Complimentary Souvenir Gift Page:*
https://jorique.in/souvenir

Reply *1* to track an order, or *4* for personalized concierge recommendations.`;

    return await sendWhatsAppMessage({ to: cleanPhone, text: reply });
  }

  // 3. Fabric Care & Maintenance Guide
  if (
    userMsg.includes('care') ||
    userMsg.includes('wash') ||
    userMsg.includes('clean') ||
    userMsg.includes('fabric') ||
    userMsg === '3'
  ) {
    const reply = `🧵 *JORIQUE FABRIC CARE & LONGEVITY GUIDE*
────────────────────────────
To preserve the tactile luster of your Egyptian cotton & luxury linens:

• *Machine Wash:* Gentle cycle with cold or lukewarm water (max 30°C).
• *Detergent:* Mild liquid detergent. Avoid chlorine bleach or harsh brighteners.
• *Drying:* Line dry in shaded breeze or tumble dry low heat.
• *Ironing:* Warm iron on reverse side while slightly damp.
• *Dark Colours:* Wash dark and light tones separately on first wash.

_Where Comfort Meets Design_`;

    return await sendWhatsAppMessage({ to: cleanPhone, text: reply });
  }

  // 4. Return, Exchange & Damage Claims
  if (
    userMsg.includes('return') ||
    userMsg.includes('exchange') ||
    userMsg.includes('refund') ||
    userMsg.includes('defect') ||
    userMsg.includes('damage') ||
    userMsg === '5'
  ) {
    const reply = `📦 *JORIQUE RETURN & EXCHANGE GUARANTEE*
────────────────────────────
Every JORIQUE piece is pre-dispatch inspected by master artisans.

⚠️ *MANDATORY FOR CLAIMS:*
To protect your order, please record a continuous, unedited *360° unboxing video* starting before parcel seals are broken.

• Transit defect or damage claims must be submitted within *48 hours* of delivery.
• Send video & order ID to *care@jorique.in* or upload directly in this chat.

Our concierge team will review and arrange an immediate replacement.`;

    return await sendWhatsAppMessage({ to: cleanPhone, text: reply });
  }

  // 5. Connect to Human Stylist / Concierge
  if (userMsg.includes('human') || userMsg.includes('agent') || userMsg.includes('help') || userMsg.includes('stylist') || userMsg === '4') {
    const reply = `⚜️ *JORIQUE CONCIERGE ASSISTANCE*
────────────────────────────
Thank you for reaching out. A dedicated JORIQUE client advisor has been notified and will assist you in this chat shortly.

Atelier Hours: 10:00 AM – 7:00 PM IST (Mon – Sat).
For urgent inquiries, email: care@jorique.in.`;

    return await sendWhatsAppMessage({ to: cleanPhone, text: reply });
  }

  // 6. Default Welcome Menu
  const reply = `⚜️ *WELCOME TO JORIQUE LUXURY ATELIER*
_Where Comfort Meets Design_
────────────────────────────
Hello! How may our concierge assist you today?

Reply with a number:
*1* — 📦 Track My Order
*2* — 🛍️ Browse Luxury Collections
*3* — 🧵 Fabric Care Guide
*4* — 💬 Connect with Client Stylist
*5* — 🔄 Return & Exchange Policy

Or simply type your question and an advisor will assist you.`;

  return await sendWhatsAppMessage({ to: cleanPhone, text: reply });
}
