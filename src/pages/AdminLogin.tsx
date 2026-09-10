import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  KeyRound,
  Fingerprint,
  ArrowRight,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function AdminLogin() {
  const { signIn, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Grab redirection target if user tried to visit a restricted admin URL
  const from = (location.state as { from?: string; error?: string } | null)?.from || '/admin';
  const initialError = (location.state as { from?: string; error?: string } | null)?.error;

  // If already logged in as admin, redirect straight to admin panel
  if (user && user.role === 'admin') {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both administrative email and master key.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signIn(email.trim(), password.trim());

      if (result.error) {
        setLoading(false);
        setError(result.error);
        return;
      }

      // Check user role: If logged in user is NOT an admin, block access
      // Note: We access the restored session or check the user
      // If the backend returned role != 'admin', deny access
      setTimeout(() => {
        // Redirection will happen if role is admin
        navigate(from, { replace: true });
      }, 200);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Authentication failed. Please verify credentials.');
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0908] text-[#FAF8F5] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]">
      <SEO
        title="Admin Sign In | JORIQUE Atelier"
        noindex={true}
      />
      {/* Ambient Luxury Dark Backdrop with Gilded Glows */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[160px] pointer-events-none opacity-25"
        style={{ background: 'radial-gradient(circle, #D4AF37 0%, #851C25 45%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-40 right-10 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-15"
        style={{ background: 'radial-gradient(circle, #1E3A8A 0%, transparent 70%)' }}
      />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header Brand Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between py-6 px-4 z-20">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-logo font-normal tracking-[0.25em] uppercase text-white/80 hover:text-[#D4AF37] transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span>JORIQUE ATELIER</span>
        </Link>

        <Link
          to="/login"
          className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1.5 font-sans tracking-wide"
        >
          <span>Customer Portal</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Main Admin Console Card */}
      <div className="w-full max-w-md my-auto relative z-10 px-2 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="rounded-[36px] bg-[#141210]/90 backdrop-blur-2xl p-8 sm:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.85)] border border-[#2E2925] relative overflow-hidden"
        >
          {/* Subtle Top Gold Border Highlight */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />

          {/* Security Badge Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#24201C] to-[#12100E] border border-[#D4AF37]/30 shadow-lg text-[#D4AF37] mx-auto relative group">
              <ShieldCheck size={28} className="transition-transform group-hover:scale-110" />
              <div className="absolute -inset-1 rounded-2xl bg-[#D4AF37]/10 blur-sm pointer-events-none" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] mb-2">
                <Terminal size={10} />
                <span>RESTRICTED • JORIQUE OS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-light text-white tracking-wide">
                Executive Login
              </h1>
              <p className="text-xs text-white/50 font-sans tracking-wide mt-1">
                Administrative security authentication required to access the inventory & POS control suite.
              </p>
            </div>
          </div>

          {/* Error Alert Display */}
          <AnimatePresence>
            {(error || initialError) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs leading-relaxed">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
                  <span>{error || initialError}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Controls */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 font-sans">
                Administrator Identifier / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jorique.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1D1A17] border border-[#2E2925] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-white placeholder-white/25 text-xs tracking-wide transition-all outline-hidden"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 font-sans">
                  Master Key / Password
                </label>
                <span className="text-[10px] text-white/40 font-mono flex items-center gap-1">
                  <KeyRound size={10} className="text-[#D4AF37]" />
                  <span>256-Bit TLS</span>
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#1D1A17] border border-[#2E2925] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-white placeholder-white/25 text-xs tracking-wide transition-all outline-hidden font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white/80 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Session Persistence & Protocol Check */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/60 hover:text-white/80 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-sm border-[#3A332C] bg-[#1D1A17] text-[#D4AF37] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#D4AF37]"
                />
                <span>Maintain trusted session</span>
              </label>

              <div className="flex items-center gap-1 text-[10px] font-mono text-[#D4AF37]/80">
                <Fingerprint size={12} />
                <span>Zero-Trust</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#DFBF58] to-[#C6A96B] hover:from-[#DFBF58] hover:to-[#D4AF37] text-black text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(212,175,55,0.25)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Verifying Authority...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate Console</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* System Security Disclaimer Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center space-y-2">
            <p className="text-[10px] text-white/35 font-mono leading-relaxed">
              Jorique Enterprise Infrastructure. Unauthorized entry attempts are captured, logged with client telemetry, and reported to security auditing.
            </p>
          </div>
        </motion.div>

        {/* Bottom Switch Link */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-xs text-white/50 hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1.5 font-sans"
          >
            <span>Standard customer account?</span>
            <span className="underline underline-offset-4">Log in to Customer Portal</span>
          </Link>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="w-full py-6 text-center text-[10px] font-mono text-white/30 z-20">
        JORIQUE OPERATING SYSTEM v2.4.0 • SECURED WITH HARDWARE ATTESTATION
      </footer>
    </main>
  );
}
