import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import InteractiveLoginCharacters from '../components/InteractiveLoginCharacters';
import SEO from '../components/SEO';

export default function VerifyOtp() {
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState((location.state as { email?: string } | null)?.email || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<'none' | 'email' | 'password'>('none');
  const [hoverTarget, setHoverTarget] = useState<'none' | 'submit' | 'forgot'>('none');
  const [emptyAttempt, setEmptyAttempt] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!otp || otp.length < 6) {
      setEmptyAttempt(true);
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');
    setEmptyAttempt(false);

    const result = await verifyOtp(email, otp);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    const from = (location.state as { from?: string; openCheckout?: boolean } | null)?.from;
    const openCheckout = (location.state as { from?: string; openCheckout?: boolean } | null)?.openCheckout;
    if (openCheckout) {
      localStorage.setItem('jorique_reopen_checkout', 'true');
    }
    navigate(from || '/dashboard', { replace: true });
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-[#0E0D0C] flex flex-col justify-center items-center px-4 sm:px-6 py-12 selection:bg-[#D4AF37]/30 selection:text-primary relative overflow-hidden font-sans">
      <SEO
        title="Security Verification | JORIQUE"
        description="Verify your one-time authentication passcode to access your JORIQUE account."
        noindex={true}
      />

      {/* Main Dual-Panel Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center justify-center my-auto py-6" style={{ minHeight: '80vh' }}>

        {/* LEFT COLUMN: Jorique Interactive Characters Stage */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center order-2 lg:order-1 pt-4 lg:pt-0 relative w-full">
          <InteractiveLoginCharacters
            focusedField={focusedField}
            showPassword={false}
            emailLength={email.length}
            passwordLength={otp.length}
            hasError={!!error}
            emptyAttempt={emptyAttempt}
            hoverTarget={hoverTarget}
            isLoading={loading}
          />
        </div>

        {/* RIGHT COLUMN: Modern Crisp White Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto order-1 lg:order-2">
          <div className="bg-white dark:bg-[#1A1816] rounded-[32px] p-8 sm:p-10 shadow-2xl border border-black/5 dark:border-white/5 relative">

            {/* Header Text */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Verify Your Account
              </h1>
              <p className="text-xs text-gray-500 dark:text-white/50 mt-1">
                Enter the 6-digit security code sent to your inbox
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl p-3 text-xs text-red-600 dark:text-red-300 animate-shake">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <p className="leading-relaxed">{error}</p>
              </div>
            )}

            {/* Verification Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 dark:text-white/80">
                  Email Address
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
                  placeholder="your@email.com"
                  className="w-full py-2.5 text-sm bg-transparent border-b border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 outline-none focus:border-black dark:focus:border-[#D4AF37] transition-colors"
                />
              </div>

              {/* 6-Digit OTP Code */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 dark:text-white/80">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                    if (error) setError('');
                    if (emptyAttempt) setEmptyAttempt(false);
                  }}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('none')}
                  required
                  inputMode="numeric"
                  minLength={6}
                  maxLength={6}
                  placeholder="••••••"
                  className="w-full py-3 text-center text-2xl tracking-[0.4em] bg-transparent border-b-2 border-gray-300 dark:border-white/20 text-gray-900 dark:text-[#D4AF37] font-mono outline-none focus:border-black dark:focus:border-[#D4AF37] transition-colors placeholder:text-gray-300 dark:placeholder:text-white/20"
                />
              </div>

              {/* Verify OTP Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  onMouseEnter={() => setHoverTarget('submit')}
                  onMouseLeave={() => setHoverTarget('none')}
                  className="w-full py-3.5 px-4 rounded-xl bg-black dark:bg-[#D4AF37] text-white dark:text-black font-semibold text-xs uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-[#C29E2E] active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Verify OTP</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Bottom Links */}
            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
              <Link
                to="/signup"
                className="text-gray-500 hover:text-black dark:text-white/50 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <ArrowLeft size={13} />
                <span>Restart Signup</span>
              </Link>
              <Link
                to="/login"
                className="text-primary dark:text-[#D4AF37] font-medium hover:underline"
              >
                Back to Login
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}

