import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Loader2, Mail } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { useAuth } from '../context/AuthContext';
import type { AppUser } from '../types';

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<AppUser['role']>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const result = await signUp(email, password, fullName, role);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    navigate('/verify-otp', { state: { email: result.email || email } });
  }

  return (
    <AuthLayout title="Create your account" subtitle="Sign up with Google or your email.">
      <div className="space-y-5">
        <GoogleAuthButton
          role={role}
          onSuccess={() => navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true })}
          onError={(err) => setError(err)}
          text="Sign up with Google"
        />

        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-border dark:border-[#2E2925] w-full" />
          <span className="bg-background dark:bg-[#100E0D] px-3 text-[11px] font-medium tracking-widest text-secondary dark:text-white/50 uppercase absolute">
            Or sign up with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 rounded-xl px-4 py-3">
              <AlertCircle size={15} className="text-red-500 mt-0.5" />
              <p className="text-xs text-red-600 dark:text-red-300 leading-relaxed">{error}</p>
            </div>
          )}

          <label className="block">
            <span className="text-xs font-semibold tracking-widest uppercase text-secondary dark:text-white/70">Full Name</span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              autoComplete="name"
              className="mt-2 w-full px-4 py-3.5 text-sm bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-xl text-primary dark:text-white placeholder:text-secondary/40 focus:outline-none focus:border-primary dark:focus:border-[#D4AF37]"
              placeholder="Jane Doe"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold tracking-widest uppercase text-secondary dark:text-white/70">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="mt-2 w-full px-4 py-3.5 text-sm bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-xl text-primary dark:text-white placeholder:text-secondary/40 focus:outline-none focus:border-primary dark:focus:border-[#D4AF37]"
              placeholder="your@email.com"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold tracking-widest uppercase text-secondary dark:text-white/70">Password</span>
            <span className="relative block mt-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full px-4 py-3.5 pr-12 text-sm bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-xl text-primary dark:text-white placeholder:text-secondary/40 focus:outline-none focus:border-primary dark:focus:border-[#D4AF37]"
                placeholder="Minimum 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary dark:text-white/50 hover:text-primary dark:hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>

          <label className="block">
            <span className="text-xs font-semibold tracking-widest uppercase text-secondary dark:text-white/70">Account Role</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as AppUser['role'])}
              className="mt-2 w-full px-4 py-3.5 text-sm bg-white dark:bg-[#1A1816] border border-border dark:border-[#2E2925] rounded-xl text-primary dark:text-white focus:outline-none focus:border-primary dark:focus:border-[#D4AF37]"
            >
              <option value="user" className="dark:bg-[#1A1816]">Client / Verified Buyer</option>
              <option value="admin" className="dark:bg-[#1A1816]">Administrator (Full Catalog Access)</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold tracking-widest uppercase py-4 rounded-xl hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Mail size={15} />
                <span>Create account</span>
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-secondary dark:text-white/60 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary dark:text-[#D4AF37] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
