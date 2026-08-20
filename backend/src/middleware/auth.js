import jwt from 'jsonwebtoken';
import { supabase } from '../supabase.js';

export async function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, is_verified')
      .eq('id', payload.sub)
      .maybeSingle();

    if (error || !profile || !profile.is_verified) {
      return res.status(401).json({ success: false, message: 'Invalid session.' });
    }

    req.user = {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      role: profile.role,
      isVerified: profile.is_verified,
    };
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }
}

export function adminRequired(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  }
  next();
}
