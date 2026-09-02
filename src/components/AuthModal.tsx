import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Tab = 'signin' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: Tab;
}

interface FieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}

function Field({ label, type = 'text', value, onChange, placeholder, autoComplete, error }: FieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-widest uppercase text-secondary dark:text-white/70">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full px-4 py-3.5 text-sm text-primary dark:text-white bg-white dark:bg-[#100E0D] border rounded-xl focus:outline-none transition-all duration-200 placeholder:text-secondary/40 ${
            error
              ? 'border-red-300 dark:border-red-800 focus:border-red-400 bg-red-50/30 dark:bg-red-950/20'
              : 'border-border dark:border-[#2E2925] focus:border-primary dark:focus:border-[#D4AF37]'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary dark:text-white/50 hover:text-primary dark:hover:text-white transition-colors"
          >
            {showPassword ? (
              <EyeOff size={15} strokeWidth={1.5} />
            ) : (
              <Eye size={15} strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1.5">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'signin' }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [success, setSuccess] = useState(false);
  const { signIn, signUp } = useAuth();

  // Sign-in state
  const [siEmail, setSiEmail] = useState('');
  const [siPassword, setSiPassword] = useState('');
  const [siErrors, setSiErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [siLoading, setSiLoading] = useState(false);

  // Sign-up state
  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suErrors, setSuErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [suLoading, setSuLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
      setSuccess(false);
      resetAll();
    }
  }, [isOpen, defaultTab]);

  const resetAll = () => {
    setSiEmail('');
    setSiPassword('');
    setSiErrors({});
    setSuName('');
    setSuEmail('');
    setSuPassword('');
    setSuErrors({});
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    resetAll();
  };

  // Validation
  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof siErrors = {};

    if (!siEmail.trim()) errors.email = 'Email is required';
    else if (!validateEmail(siEmail)) errors.email = 'Enter a valid email address';

    if (!siPassword) errors.password = 'Password is required';

    if (Object.keys(errors).length > 0) {
      setSiErrors(errors);
      return;
    }

    setSiLoading(true);
    setSiErrors({});

    try {
      const res = await signIn(siEmail, siPassword);
      if (res.error) {
        setSiErrors({ form: res.error });
      } else {
        onClose();
      }
    } catch {
      setSiErrors({ form: 'An unexpected error occurred. Please try again.' });
    } finally {
      setSiLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof suErrors = {};

    if (!suName.trim()) errors.name = 'Full name is required';
    if (!suEmail.trim()) errors.email = 'Email is required';
    else if (!validateEmail(suEmail)) errors.email = 'Enter a valid email address';

    if (!suPassword) errors.password = 'Password is required';
    else if (suPassword.length < 6) errors.password = 'Password must be at least 6 characters';

    if (Object.keys(errors).length > 0) {
      setSuErrors(errors);
      return;
    }

    setSuLoading(true);
    setSuErrors({});

    try {
      const res = await signUp(suEmail, suPassword, suName.trim());
      if (res.error) {
        setSuErrors({ form: res.error });
      } else {
        setSuccess(true);
      }
    } catch {
      setSuErrors({ form: 'An unexpected error occurred. Please try again.' });
    } finally {
      setSuLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-white dark:bg-[#1A1816] rounded-3xl shadow-2xl overflow-hidden border border-border dark:border-[#2E2925]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar */}
            <div className="relative flex items-center justify-center py-6 px-8 border-b border-border dark:border-[#2E2925]">
              <span className="text-sm font-semibold tracking-[0.25em] uppercase text-primary dark:text-white">
                JORIQUE
              </span>
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white rounded-full hover:bg-cream dark:hover:bg-white/10 transition-colors duration-150"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            <div className="p-8">
              {/* Success state */}
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center py-6"
                  >
                    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center mb-5">
                      <Check size={24} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h2 className="text-lg font-light text-primary dark:text-white mb-2">Account Created</h2>
                    <p className="text-sm text-secondary dark:text-white/60 leading-relaxed max-w-xs mb-8">
                      Welcome to JORIQUE. Your account is ready — sign in to start exploring our collection.
                    </p>
                    <button
                      onClick={() => { setSuccess(false); switchTab('signin'); }}
                      className="w-full bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold tracking-widest uppercase py-4 rounded-xl hover:bg-primary/90 dark:hover:bg-[#E5C158] transition-colors duration-200 shadow-md"
                    >
                      Sign In Now
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {/* Tab switcher */}
                    <div className="flex gap-0 mb-8 border border-border dark:border-[#2E2925] rounded-xl overflow-hidden p-1 bg-cream/40 dark:bg-white/5">
                      {(['signin', 'signup'] as Tab[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => switchTab(t)}
                          className={`flex-1 py-2.5 rounded-lg text-xs font-semibold tracking-widest uppercase transition-all duration-200 ${
                            tab === t
                              ? 'bg-primary dark:bg-[#D4AF37] text-white dark:text-black shadow-md'
                              : 'text-secondary dark:text-white/60 hover:text-primary dark:hover:text-white'
                          }`}
                        >
                          {t === 'signin' ? 'Sign In' : 'Create Account'}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {/* Sign In Form */}
                      {tab === 'signin' && (
                        <motion.form
                          key="signin"
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 12 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          onSubmit={handleSignIn}
                          noValidate
                        >
                          <div className="flex flex-col gap-5">
                            <div>
                              <p className="text-lg font-light text-primary dark:text-white mb-1">Welcome back</p>
                              <p className="text-xs text-secondary dark:text-white/60">Sign in to your JORIQUE account</p>
                            </div>

                            {siErrors.form && (
                              <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 rounded-xl px-4 py-3">
                                <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-red-600 dark:text-red-300 leading-relaxed">{siErrors.form}</p>
                              </div>
                            )}

                            <Field
                              label="Email"
                              type="email"
                              value={siEmail}
                              onChange={setSiEmail}
                              placeholder="your@email.com"
                              autoComplete="email"
                              error={siErrors.email}
                            />
                            <Field
                              label="Password"
                              type="password"
                              value={siPassword}
                              onChange={setSiPassword}
                              placeholder="••••••••"
                              autoComplete="current-password"
                              error={siErrors.password}
                            />

                            <button
                              type="submit"
                              disabled={siLoading}
                              className="w-full bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold tracking-widest uppercase py-4 mt-1 rounded-xl hover:bg-primary/90 dark:hover:bg-[#E5C158] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 shadow-md"
                            >
                              {siLoading && <Loader2 size={14} className="animate-spin" />}
                              {siLoading ? 'Signing In...' : 'Sign In'}
                            </button>

                            <p className="text-center text-xs text-secondary dark:text-white/60">
                              Do not have an account?{' '}
                              <button
                                type="button"
                                onClick={() => switchTab('signup')}
                                className="text-primary dark:text-[#D4AF37] font-semibold underline underline-offset-2 hover:opacity-80 transition-colors"
                              >
                                Create an account
                              </button>
                            </p>
                          </div>
                        </motion.form>
                      )}

                      {/* Sign Up Form */}
                      {tab === 'signup' && (
                        <motion.form
                          key="signup"
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -12 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          onSubmit={handleSignUp}
                          noValidate
                        >
                          <div className="flex flex-col gap-5">
                            <div>
                              <p className="text-lg font-light text-primary dark:text-white mb-1">Create an account</p>
                              <p className="text-xs text-secondary dark:text-white/60">Join JORIQUE for exclusive privileges</p>
                            </div>

                            {suErrors.form && (
                              <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 rounded-xl px-4 py-3">
                                <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-red-600 dark:text-red-300 leading-relaxed">{suErrors.form}</p>
                              </div>
                            )}

                            <Field
                              label="Full Name"
                              value={suName}
                              onChange={setSuName}
                              placeholder="Jane Doe"
                              autoComplete="name"
                              error={suErrors.name}
                            />
                            <Field
                              label="Email"
                              type="email"
                              value={suEmail}
                              onChange={setSuEmail}
                              placeholder="your@email.com"
                              autoComplete="email"
                              error={suErrors.email}
                            />
                            <Field
                              label="Password"
                              type="password"
                              value={suPassword}
                              onChange={setSuPassword}
                              placeholder="Min. 6 characters"
                              autoComplete="new-password"
                              error={suErrors.password}
                            />

                            <button
                              type="submit"
                              disabled={suLoading}
                              className="w-full bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-xs font-bold tracking-widest uppercase py-4 mt-1 rounded-xl hover:bg-primary/90 dark:hover:bg-[#E5C158] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 shadow-md"
                            >
                              {suLoading && <Loader2 size={14} className="animate-spin" />}
                              {suLoading ? 'Creating Account...' : 'Create Account'}
                            </button>

                            <p className="text-center text-xs text-secondary dark:text-white/60">
                              Already have an account?{' '}
                              <button
                                type="button"
                                onClick={() => switchTab('signin')}
                                className="text-primary dark:text-[#D4AF37] font-semibold underline underline-offset-2 hover:opacity-80 transition-colors"
                              >
                                Sign in
                              </button>
                            </p>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
