import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import GoogleAuthButton from '../components/GoogleAuthButton';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from;

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
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
    <AuthLayout title="Welcome back" subtitle="Sign in with your email or Google account.">
      <div className="space-y-5">
        <GoogleAuthButton
          onSuccess={() => navigate(from || '/dashboard', { replace: true })}
          onError={(err) => setError(err)}
          text="Sign in with Google"
        />

        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-border w-full" />
          <span className="bg-background px-3 text-[11px] font-medium tracking-widest text-secondary uppercase absolute">
            Or sign in with email
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
                autoComplete="current-password"
                className="w-full px-4 py-3.5 pr-12 text-sm bg-white border border-border rounded-lg focus:outline-none focus:border-primary"
                placeholder="Password"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white text-xs font-medium tracking-widest uppercase py-4 hover:bg-[#2a2623] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <LogIn size={15} />}
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-secondary">
        New to JORIQUE?{' '}
        <Link to="/signup" className="text-primary font-medium underline underline-offset-2">
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
}
