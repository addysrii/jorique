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
          <div className="border-t border-border w-full" />
          <span className="bg-background px-3 text-[11px] font-medium tracking-widest text-secondary uppercase absolute">
            Or sign up with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex gap-2.5 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              <AlertCircle size={15} className="text-red-500 mt-0.5" />
              <p className="text-xs text-red-600 leading-relaxed">{error}</p>
            </div>
          )}

          <label className="block">
            <span className="text-xs font-medium tracking-widest uppercase text-secondary">Full Name</span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              autoComplete="name"
              className="mt-2 w-full px-4 py-3.5 text-sm bg-white border border-border rounded-lg focus:outline-none focus:border-primary"
              placeholder="Jane Doe"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium tracking-widest uppercase text-secondary">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="mt-2 w-full px-4 py-3.5 text-sm bg-white border border-border rounded-lg focus:outline-none focus:border-primary"
              placeholder="your@email.com"
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium tracking-widest uppercase text-secondary">Password</span>
            <span className="relative block mt-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full px-4 py-3.5 pr-12 text-sm bg-white border border-border rounded-lg focus:outline-none focus:border-primary"
                placeholder="Minimum 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>

          <div>
            <span className="text-xs font-medium tracking-widest uppercase text-secondary">Dashboard Type</span>
            <div className="mt-2 grid grid-cols-2 border border-border rounded-lg overflow-hidden">
              {(['user', 'admin'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={`py-3 text-xs font-medium tracking-widest uppercase ${
                    role === value ? 'bg-primary text-white' : 'bg-white text-secondary hover:text-primary'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white text-xs font-medium tracking-widest uppercase py-4 hover:bg-[#2a2623] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-secondary">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-medium underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
