import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function VerifyOtp() {
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState((location.state as { email?: string } | null)?.email || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const result = await verifyOtp(email, otp);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    navigate('/dashboard', { replace: true });
  }

  return (
    <AuthLayout title="Verify your email" subtitle="Enter the 6 digit code sent to your inbox.">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 rounded-xl px-4 py-3">
            <AlertCircle size={15} className="text-red-500 mt-0.5" />
            <p className="text-xs text-red-600 dark:text-red-300 leading-relaxed">{error}</p>
          </div>
        )}

        <label className="block">
          <span className="text-xs font-semibold tracking-widest uppercase text-secondary dark:text-white/70">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full px-4 py-3.5 text-sm bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-xl text-primary dark:text-white placeholder:text-secondary/40 focus:outline-none focus:border-primary dark:focus:border-[#D4AF37]"
            placeholder="your@email.com"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold tracking-widest uppercase text-secondary dark:text-white/70">6-Digit Code</span>
          <input
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
            required
            inputMode="numeric"
            minLength={6}
            maxLength={6}
            className="mt-2 w-full px-4 py-4 text-center text-2xl tracking-[0.35em] bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-xl text-primary dark:text-[#D4AF37] font-mono focus:outline-none focus:border-primary dark:focus:border-[#D4AF37]"
            placeholder="000000"
          />
        </label>

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold tracking-widest uppercase py-4 rounded-xl hover:bg-primary/90 dark:hover:bg-[#E5C158] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-secondary dark:text-white/60">
        New user?{' '}
        <Link to="/signup" className="text-primary dark:text-[#D4AF37] font-semibold underline underline-offset-2">
          Start signup again
        </Link>
      </p>
    </AuthLayout>
  );
}
