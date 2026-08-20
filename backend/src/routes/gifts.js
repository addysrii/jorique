import { Router } from 'express';
import { supabase } from '../supabase.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
const message = (error) => error?.message || 'Request failed.';

router.get('/', authRequired, async (req, res) => {
  try {
    let query = supabase.from('gift_redemption').select('*, serial:product_serials(*), customer:profiles(id, full_name, email)').order('redeemed_at', { ascending: false });
    if (req.user.role !== 'admin') query = query.eq('customer_id', req.user.id);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) { res.status(500).json({ success: false, message: message(error) }); }
});

router.post('/claim', authRequired, async (req, res) => {
  try {
    const serialNumber = req.body?.serial_number || req.body?.serialNumber;
    if (!serialNumber) return res.status(400).json({ success: false, message: 'serial_number is required.' });
    const { data: serial, error: serialError } = await supabase.from('product_serials').select('*').eq('serial_number', serialNumber).maybeSingle();
    if (serialError) throw serialError;
    if (!serial) return res.status(404).json({ success: false, message: 'Serial not found.' });
    if (serial.gift_claimed) return res.status(409).json({ success: false, message: 'This gift has already been claimed.' });

    const { data: redemption, error: redemptionError } = await supabase.from('gift_redemption').insert({ serial_id: serial.id, customer_id: req.user.id }).select('*').single();
    if (redemptionError) throw redemptionError;
    const { data: updatedSerial, error: updateError } = await supabase.from('product_serials').update({ gift_claimed: true, updated_at: new Date().toISOString() }).eq('id', serial.id).select('*').single();
    if (updateError) throw updateError;
    res.status(201).json({ success: true, data: { redemption, serial: updatedSerial } });
  } catch (error) { res.status(400).json({ success: false, message: message(error) }); }
});

export default router;
