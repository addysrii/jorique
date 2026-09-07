/**
 * JORIQUE Luxury Concierge - WhatsApp Integration Service
 * Supports:
 * 1. Meta WhatsApp Business Cloud API (Graph API)
 * 2. Twilio WhatsApp API
 * 3. Direct wa.me link generation and dev console fallback
 */

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
