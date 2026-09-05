import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import InteractiveLoginCharacters from '../components/InteractiveLoginCharacters';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [focusedField, setFocusedField] = useState<'none' | 'email' | 'password'>('none');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [emptyAttempt, setEmptyAttempt] = useState(false);
  const [hoverTarget, setHoverTarget] = useState<'none' | 'forgot' | 'submit'>('none');

  const from = (location.state as { from?: string } | null)?.from;

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setEmptyAttempt(true);
      setTimeout(() => setEmptyAttempt(false), 2800);
      return;
    }
    setLoading(true);
    setError('');

    const result = await signIn(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      if (result.error.toLowerCase().includes('verify')) {
        navigate('/verify-otp', { state: { email } });
      }
      return;
    }

    navigate(from || '/dashboard', { replace: true });
  }

  return (
    <main className="min-h-screen bg-[#F5EDE3] dark:bg-[#12100E] text-[#1A1A1A] dark:text-[#FCFAF7] flex items-center justify-center p-4 sm:p-8 transition-colors duration-300">
      {/* Top Left Floating Brand Link */}
      <Link
        to="/"
        className="fixed top-6 left-6 sm:top-8 sm:left-10 text-xs font-serif font-bold tracking-[0.25em] uppercase text-primary/70 dark:text-white/70 hover:text-primary dark:hover:text-white transition-colors z-20"
      >
        JORIQUE
      </Link>

      {/* Main Dual-Panel Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center justify-center my-auto py-6" style={{ minHeight: '80vh' }}>
        
        {/* LEFT COLUMN: Jorique Product Characters */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center order-2 lg:order-1 pt-4 lg:pt-0 relative">
          {/* Brand decorative corner — gold top-right */}
          <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none opacity-30"
            style={{ background: 'radial-gradient(circle at top right, #C6A96B 0%, transparent 70%)' }} />
          {/* Brand decorative accent — gold bottom-left */}
          <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none opacity-20"
            style={{ background: 'radial-gradient(circle at bottom left, #C6A96B 0%, transparent 70%)' }} />
          {/* Brand label */}
          <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#C6A96B] mb-2 font-sans">JORIQUE Collection</p>
          <InteractiveLoginCharacters
            focusedField={focusedField}
            showPassword={showPassword}
            emailLength={email.length}
            passwordLength={password.length}
            hasError={!!error}
            emptyAttempt={emptyAttempt}
            hoverTarget={hoverTarget}
            isLoading={loading}
          />
          {/* Tagline */}
          <p className="text-xs text-[#8A847D] dark:text-[#8A847D] mt-4 tracking-wide font-serif italic">Crafted with care, worn with pride.</p>
        </div>

        {/* RIGHT COLUMN: Modern Crisp White Login Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto order-1 lg:order-2">
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
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Welcome back!
              </h1>
              <p className="text-xs text-gray-500 dark:text-white/50 mt-1">
                Please enter your details
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl p-3 text-xs text-red-600 dark:text-red-300 animate-shake">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <p className="leading-relaxed">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="anna@gmail.com"
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
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    className="w-full py-2.5 pr-10 text-sm bg-transparent border-b border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 outline-none focus:border-black dark:focus:border-[#D4AF37] transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:text-white/40 dark:hover:text-white transition-colors p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember for 30 days & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600 dark:text-white/70">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-black dark:text-[#D4AF37] focus:ring-black dark:focus:ring-[#D4AF37] border-gray-300 dark:border-white/20 cursor-pointer"
                  />
                  <span>Remember for 30 days</span>
                </label>

                <Link
                  to="/forgot-password"
                  onMouseEnter={() => setHoverTarget('forgot')}
                  onMouseLeave={() => setHoverTarget('none')}
                  className="font-semibold text-gray-700 dark:text-white/70 hover:text-black dark:hover:text-white hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Log In Button */}
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={() => setHoverTarget('submit')}
                onMouseLeave={() => setHoverTarget('none')}
                className="w-full py-3.5 px-6 rounded-full bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black text-sm font-semibold tracking-wide transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                <span>Log In</span>
              </button>

              {/* Google Sign-In Button */}
              <GoogleAuthButton
                onSuccess={() => navigate(from || '/dashboard', { replace: true })}
                onError={(err) => setError(err)}
                text="Log in with Google"
                className="w-full py-3 px-6 rounded-full bg-white dark:bg-[#100E0D] hover:bg-gray-50 dark:hover:bg-white/5 text-gray-800 dark:text-white border border-gray-200 dark:border-white/15 text-xs font-semibold tracking-wider transition-all shadow-xs flex items-center justify-center gap-2.5 active:scale-[0.99]"
              />
            </form>

            {/* Bottom Sign-Up Link */}
            <p className="mt-8 text-center text-xs text-gray-500 dark:text-white/50">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-bold text-gray-900 dark:text-[#D4AF37] hover:underline ml-0.5"
              >
                Sign up
              </Link>
            </p>

          </div>
        </div>

      </div>
    </main>
  );
}
