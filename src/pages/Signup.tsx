import { FormEvent, useState } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import InteractiveLoginCharacters from '../components/InteractiveLoginCharacters';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { useAuth } from '../context/AuthContext';
import type { AppUser } from '../types';

export default function Signup() {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string; openCheckout?: boolean } | null)?.from;
  const openCheckout = (location.state as { from?: string; openCheckout?: boolean } | null)?.openCheckout;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<AppUser['role']>('user');
  const [showPassword, setShowPassword] = useState(false);

  // Character interaction state
  const [focusedField, setFocusedField] = useState<'none' | 'email' | 'password'>('none');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emptyAttempt, setEmptyAttempt] = useState(false);
  const [hoverTarget, setHoverTarget] = useState<'none' | 'forgot' | 'submit'>('none');

  if (user) {
    if (openCheckout) {
      localStorage.setItem('jorique_reopen_checkout', 'true');
    }
    return <Navigate to={from || (user.role === 'admin' ? '/admin' : '/dashboard')} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setEmptyAttempt(true);
      setTimeout(() => setEmptyAttempt(false), 2800);
      return;
    }
    setLoading(true);
    setError('');

    const result = await signUp(email, password, fullName, role);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    navigate('/verify-otp', { state: { email: result.email || email, from, openCheckout } });
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#0E0D0C] flex flex-col justify-center items-center px-4 sm:px-6 py-12 selection:bg-[#D4AF37]/30 selection:text-primary relative overflow-hidden font-sans">

      {/* Top Left Navigation Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8A847D] hover:text-black dark:text-white/60 dark:hover:text-white transition-colors z-20"
      >
        <span className="text-base leading-none">←</span>
        <span>Back to Boutique</span>
      </Link>

      {/* Main Dual-Panel Container */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center justify-center my-auto py-6" style={{ minHeight: '80vh' }}>

        {/* LEFT COLUMN: Jorique Interactive Characters Stage */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center order-2 lg:order-1 pt-4 lg:pt-0 relative w-full max-w-[620px] mx-auto">
          <InteractiveLoginCharacters
            focusedField={focusedField}
            showPassword={showPassword}
            emailLength={fullName.length + email.length}
            passwordLength={password.length}
            hasError={!!error}
            emptyAttempt={emptyAttempt}
            hoverTarget={hoverTarget}
            isLoading={loading}
          />
        </div>

        {/* RIGHT COLUMN: Modern Crisp White Signup Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto order-1 lg:order-2">
          <div className="bg-white dark:bg-[#1A1816] rounded-[32px] p-8 sm:p-10 shadow-2xl border border-black/5 dark:border-white/5 relative">

            {/* Top Emblem Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-10 h-10 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-sm">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12 2 L14 9 L21 11 L14 13 L12 20 L10 13 L3 11 L10 9 Z" />
                </svg>
              </div>
            </div>

            {/* Header Text */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Create Account
              </h1>
              <p className="text-xs text-gray-500 dark:text-white/50 mt-1">
                Join the JORIQUE atelier for handcrafted luxury
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl p-3 text-xs text-red-600 dark:text-red-300 animate-shake">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <p className="leading-relaxed">{error}</p>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 dark:text-white/80">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (error) setError('');
                    if (emptyAttempt) setEmptyAttempt(false);
                  }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('none')}
                  required
                  autoComplete="name"
                  placeholder="Aditya Sharma"
                  className="w-full py-2.5 text-sm bg-transparent border-b border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 outline-none focus:border-black dark:focus:border-[#D4AF37] transition-colors"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 dark:text-white/80">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                    if (emptyAttempt) setEmptyAttempt(false);
                  }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('none')}
                  required
                  autoComplete="email"
                  placeholder="aditya@example.com"
                  className="w-full py-2.5 text-sm bg-transparent border-b border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 outline-none focus:border-black dark:focus:border-[#D4AF37] transition-colors"
                />
              </div>

              {/* Password Input with Show/Hide Eye */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 dark:text-white/80">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                      if (emptyAttempt) setEmptyAttempt(false);
                    }}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('none')}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="••••••••••••"
                    className="w-full py-2.5 pr-10 text-sm bg-transparent border-b border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 outline-none focus:border-black dark:focus:border-[#D4AF37] transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:text-white/40 dark:hover:text-white transition-colors p-1 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Account Role */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 dark:text-white/80">
                  Account Type
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AppUser['role'])}
                  className="w-full py-2.5 text-sm bg-transparent border-b border-gray-300 dark:border-white/20 text-gray-900 dark:text-white outline-none focus:border-black dark:focus:border-[#D4AF37] transition-colors cursor-pointer"
                >
                  <option value="user" className="dark:bg-[#1A1816]">Client / Verified Buyer</option>
                  <option value="admin" className="dark:bg-[#1A1816]">Administrator (Full Catalog Access)</option>
                </select>
              </div>

              {/* Create Account Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  onMouseEnter={() => setHoverTarget('submit')}
                  onMouseLeave={() => setHoverTarget('none')}
                  className="w-full py-3.5 px-6 rounded-full bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black text-sm font-semibold tracking-wide transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  <span>Create Account</span>
                </button>
              </div>

              {/* Google Sign-Up Button */}
              <GoogleAuthButton
                role={role}
                onSuccess={() => {
                  if (openCheckout) {
                    localStorage.setItem('jorique_reopen_checkout', 'true');
                  }
                  navigate(from || (role === 'admin' ? '/admin' : '/dashboard'), { replace: true });
                }}
                onError={(err) => setError(err)}
                text="Sign up with Google"
                className="w-full py-3 px-6 rounded-full bg-white dark:bg-[#100E0D] hover:bg-gray-50 dark:hover:bg-white/5 text-gray-800 dark:text-white border border-gray-200 dark:border-white/15 text-xs font-semibold tracking-wider transition-all shadow-xs flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer"
              />
            </form>

            {/* Bottom Sign-In Link */}
            <p className="mt-6 text-center text-xs text-gray-500 dark:text-white/50">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-gray-900 dark:text-[#D4AF37] hover:underline ml-0.5"
              >
                Sign in
              </Link>
            </p>

          </div>
        </div>

      </div>
    </main>
  );
}
