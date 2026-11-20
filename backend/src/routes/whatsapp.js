import { Router } from 'express';
import { adminRequired, authRequired } from '../middleware/auth.js';
import {
  handleIncomingWhatsAppMessage,
  sendWhatsAppMessage,
  normalizePhoneNumber,
} from '../services/whatsapp.js';

const router = Router();

/**
 * 1. Meta WhatsApp Cloud API Webhook Verification (GET)
 */
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'JORIQUE_WHATSAPP_VERIFY_TOKEN';

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[WHATSAPP WEBHOOK] Verified successfully with Meta Graph API');
    return res.status(200).send(challenge);
  }
  return res.status(403).json({ error: 'Verification token mismatch' });
});

/**
 * 2. Meta WhatsApp Cloud API Incoming Message Handler (POST)
 */
router.post('/webhook', async (req, res) => {
  try {
    const body = req.body;
    if (body.object === 'whatsapp_business_account') {
      const entries = body.entry || [];
      for (const entry of entries) {
        for (const change of entry.changes || []) {
          const value = change.value;
          const messages = value?.messages || [];
          for (const msg of messages) {
            const from = msg.from;
            const text = msg.text?.body || msg.button?.text || msg.interactive?.button_reply?.title || '';
            if (from && text) {
              await handleIncomingWhatsAppMessage({ from, text });
            }
          }
        }
      }
      return res.status(200).send('EVENT_RECEIVED');
    }
    res.status(200).send('OK');
  } catch (error) {
    console.error('[WHATSAPP WEBHOOK] Processing error:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * 3. Twilio WhatsApp Webhook (POST)
 */
router.post('/twilio-webhook', async (req, res) => {
  try {
    const from = (req.body.From || '').replace('whatsapp:', '');
    const text = req.body.Body || '';
    if (from && text) {
      await handleIncomingWhatsAppMessage({ from, text });
    }
    res.type('text/xml').send('<Response></Response>');
  } catch (error) {
    console.error('[TWILIO WEBHOOK] Processing error:', error);
    res.status(500).send('Error');
  }
});

/**
 * 4. Automation Simulator / Test Endpoint
 */
router.post('/simulate', async (req, res) => {
  try {
    const { phone, message } = req.body || {};
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message text is required.' });
    }
    const result = await handleIncomingWhatsAppMessage({
      from: phone || '919919388211',
      text: message,
    });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 5. Automation Configuration Status
 */
router.get('/config', authRequired, (req, res) => {
  res.json({
    success: true,
    meta_configured: Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID),
    twilio_configured: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_NUMBER),
    admin_phone: process.env.WHATSAPP_ADMIN_PHONE || '919919388211',
    webhook_verify_token: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'JORIQUE_WHATSAPP_VERIFY_TOKEN',
  });
});

/**
 * 6. Send Custom WhatsApp Message from Admin Dashboard
 */
router.post('/send-custom', authRequired, adminRequired, async (req, res) => {
  try {
    const { phone, message: text } = req.body || {};
    if (!phone || !text) {
      return res.status(400).json({ success: false, message: 'Phone and message are required.' });
    }
    const result = await sendWhatsAppMessage({ to: phone, text });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
