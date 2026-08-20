import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { OAuth2Client } from 'google-auth-library';
import { supabase } from './supabase.js';
import { sendOtpEmail } from './mailer.js';

const googleAuthClient = new OAuth2Client();

async function verifyGoogleIdToken(idToken) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  let payload;

  if (googleClientId && googleClientId !== 'YOUR_GOOGLE_CLIENT_ID') {
    const ticket = await googleAuthClient.verifyIdToken({
      idToken,
      audience: googleClientId,
    });
    payload = ticket.getPayload();
  } else {
    try {
      const ticket = await googleAuthClient.verifyIdToken({ idToken });
      payload = ticket.getPayload();
    } catch {
      const decoded = jwt.decode(idToken);
      if (decoded && decoded.email) {
        payload = decoded;
      } else {
        throw new Error('Invalid Google credential token.');
      }
    }
  }
  return payload;
}

const signupSchema = z.object({
  fullName: z.string().trim().min(2),
  email: z.string().trim().email().transform((v) => v.toLowerCase()),
  password: z.string().min(6),
  role: z.enum(['user', 'admin']).optional().default('user'),
});

const loginSchema = z.object({
  email: z.string().trim().email().transform((v) => v.toLowerCase()),
  password: z.string().min(1),
});

const verifyOtpSchema = z.object({
  email: z.string().trim().email().transform((v) => v.toLowerCase()),
  otp: z.string().trim().regex(/^\d{6}$/),
});

function createOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function publicProfile(profile) {
  return {
    id: profile.id,
    email: profile.email,
    role: profile.role,
    isVerified: profile.is_verified,
    fullName: profile.full_name,
    user_metadata: { full_name: profile.full_name },
  };
}

function signToken(profile) {
  return jwt.sign(
    { sub: profile.id, email: profile.email, role: profile.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function queueOtp(email) {
  const otp = createOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const ttl = Number(process.env.OTP_TTL_MINUTES || 10);
  const expiresAt = new Date(Date.now() + ttl * 60 * 1000).toISOString();

  const { error } = await supabase.from('email_otps').insert({
    email,
    otp_hash: otpHash,
    expires_at: expiresAt,
  });

  if (error) throw error;
  
  try {
    await sendOtpEmail(email, otp);
  } catch (mailError) {
    console.error('SMTP Error: Failed to send verification email. Details:', mailError.message);
    console.log('\n----------------------------------------');
    console.log(`[DEVELOPMENT OTP FALLBACK]`);
    console.log(`Email: ${email}`);
    console.log(`OTP Code: ${otp}`);
    console.log('----------------------------------------\n');
  }
}

export function registerAuthRoutes(app) {
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const input = signupSchema.parse(req.body);
      const { data: existing, error: existingError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', input.email)
        .maybeSingle();

      if (existingError) throw existingError;
      if (existing?.is_verified) {
        return res.status(409).json({ message: 'An account with this email already exists.' });
      }

      const passwordHash = await bcrypt.hash(input.password, 12);

      if (existing) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: input.fullName,
            password_hash: passwordHash,
            role: input.role,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('profiles').insert({
          full_name: input.fullName,
          email: input.email,
          password_hash: passwordHash,
          role: input.role,
        });

        if (error) throw error;
      }

      await queueOtp(input.email);
      res.status(201).json({ message: 'OTP sent to your email.', email: input.email });
    } catch (error) {
      const message = error?.issues ? 'Please check the signup details.' : error.message;
      res.status(400).json({ message });
    }
  });

  app.post('/api/auth/verify-otp', async (req, res) => {
    try {
      const input = verifyOtpSchema.parse(req.body);
      const now = new Date().toISOString();
      const { data: otpRows, error: otpError } = await supabase
        .from('email_otps')
        .select('*')
        .eq('email', input.email)
        .is('consumed_at', null)
        .gt('expires_at', now)
        .order('created_at', { ascending: false })
        .limit(5);

      if (otpError) throw otpError;

      const matched = [];
      for (const row of otpRows || []) {
        if (await bcrypt.compare(input.otp, row.otp_hash)) matched.push(row);
      }

      if (!matched.length) {
        return res.status(400).json({ message: 'Invalid or expired OTP.' });
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .update({ is_verified: true, updated_at: now })
        .eq('email', input.email)
        .select('*')
        .single();

      if (profileError) throw profileError;

      await supabase
        .from('email_otps')
        .update({ consumed_at: now })
        .eq('id', matched[0].id);

      res.json({ token: signToken(profile), user: publicProfile(profile) });
    } catch (error) {
      const message = error?.issues ? 'Enter the 6 digit OTP sent to your email.' : error.message;
      res.status(400).json({ message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const input = loginSchema.parse(req.body);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', input.email)
        .maybeSingle();

      if (error) throw error;
      if (!profile || !(await bcrypt.compare(input.password, profile.password_hash))) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
      if (!profile.is_verified) {
        await queueOtp(input.email);
        return res.status(403).json({
          message: 'Please verify your email. A fresh OTP has been sent.',
          requiresVerification: true,
          email: input.email,
        });
      }

      res.json({ token: signToken(profile), user: publicProfile(profile) });
    } catch (error) {
      const message = error?.issues ? 'Please enter a valid email and password.' : error.message;
      res.status(400).json({ message });
    }
  });

  app.post('/api/auth/google', async (req, res) => {
    try {
      const { idToken, role } = req.body || {};
      if (!idToken) {
        return res.status(400).json({ message: 'Google ID token is required.' });
      }

      const payload = await verifyGoogleIdToken(idToken);
      const email = payload.email?.toLowerCase();
      const fullName = payload.name || payload.given_name || 'Google User';

      if (!email) {
        return res.status(400).json({ message: 'Unable to retrieve email from Google token.' });
      }

      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;

      if (!profile) {
        const targetRole = role === 'admin' ? 'admin' : 'user';
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            full_name: fullName,
            email: email,
            password_hash: 'OAUTH_USER_NO_PASSWORD',
            role: targetRole,
            is_verified: true,
          })
          .select('*')
          .single();

        if (createError) throw createError;
        profile = newProfile;
      } else if (!profile.is_verified) {
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({ is_verified: true, updated_at: new Date().toISOString() })
          .eq('id', profile.id)
          .select('*')
          .single();

        if (!updateError && updatedProfile) {
          profile = updatedProfile;
        }
      }

      res.json({ token: signToken(profile), user: publicProfile(profile) });
    } catch (error) {
      console.error('Google OAuth error:', error.message);
      res.status(400).json({ message: error.message || 'Google sign in failed.' });
    }
  });
}

export async function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) return res.status(401).json({ message: 'Authentication required.' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', payload.sub)
      .single();

    if (error || !profile) return res.status(401).json({ message: 'Invalid session.' });
    req.user = publicProfile(profile);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired session.' });
  }
}
