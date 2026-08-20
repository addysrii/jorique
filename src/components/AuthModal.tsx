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
      <label className="text-xs font-medium tracking-widest uppercase text-secondary">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full px-4 py-3.5 text-sm text-text bg-white border rounded-lg focus:outline-none transition-all duration-200 placeholder:text-secondary/40 ${
            error
              ? 'border-red-300 focus:border-red-400 bg-red-50/30'
              : 'border-border focus:border-primary'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
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
        <p className="text-xs text-red-500 flex items-center gap-1.5">
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

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  function resetAll() {
    setSiEmail(''); setSiPassword(''); setSiErrors({});
    setSuName(''); setSuEmail(''); setSuPassword(''); setSuErrors({});
  }

  function switchTab(t: Tab) {
    setTab(t);
    setSuccess(false);
    resetAll();
  }

  // --- Sign in ---
  const validateSignIn = () => {
    const errs: typeof siErrors = {};
    if (!siEmail.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(siEmail)) errs.email = 'Enter a valid email';
    if (!siPassword) errs.password = 'Password is required';
    setSiErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignIn()) return;
    setSiLoading(true);
    setSiErrors({});
    const { error } = await signIn(siEmail, siPassword);
    setSiLoading(false);
    if (error) {
      setSiErrors({ form: error });
    } else {
      onClose();
    }
  };

  // --- Sign up ---
  const validateSignUp = () => {
    const errs: typeof suErrors = {};
    if (!suName.trim()) errs.name = 'Full name is required';
    if (!suEmail.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(suEmail)) errs.email = 'Enter a valid email';
    if (!suPassword) errs.password = 'Password is required';
    else if (suPassword.length < 6) errs.password = 'Password must be at least 6 characters';
    setSuErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUp()) return;
    setSuLoading(true);
    setSuErrors({});
    const { error } = await signUp(suEmail, suPassword, suName);
    setSuLoading(false);
    if (error) {
      if (error.includes('already exists')) {
        setSuErrors({ form: error });
      } else {
        setSuErrors({ form: error });
      }
    } else {
      setSuccess(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[61] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header bar */}
              <div className="relative flex items-center justify-center py-7 px-8 border-b border-border">
                <span className="text-sm font-semibold tracking-[0.25em] uppercase text-primary">
                  JORIQUE
                </span>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 text-secondary hover:text-primary rounded-full hover:bg-cream transition-colors duration-150"
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
                      <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-5">
                        <Check size={24} strokeWidth={1.5} className="text-green-600" />
                      </div>
                      <h2 className="text-lg font-medium text-primary mb-2">Account Created</h2>
                      <p className="text-sm text-secondary leading-relaxed max-w-xs mb-8">
                        Welcome to JORIQUE. Your account is ready — sign in to start exploring our collection.
                      </p>
                      <button
                        onClick={() => { setSuccess(false); switchTab('signin'); }}
                        className="w-full bg-primary text-white text-xs font-medium tracking-widest uppercase py-4 hover:bg-[#2a2623] transition-colors duration-200"
                      >
                        Sign In Now
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {/* Tab switcher */}
                      <div className="flex gap-0 mb-8 border border-border rounded-lg overflow-hidden">
                        {(['signin', 'signup'] as Tab[]).map((t) => (
                          <button
                            key={t}
                            onClick={() => switchTab(t)}
                            className={`flex-1 py-3 text-xs font-medium tracking-widest uppercase transition-all duration-200 ${
                              tab === t
                                ? 'bg-primary text-white'
                                : 'bg-white text-secondary hover:text-primary hover:bg-cream'
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
                                <p className="text-lg font-light text-primary mb-1">Welcome back</p>
                                <p className="text-xs text-secondary">Sign in to your JORIQUE account</p>
                              </div>

                              {siErrors.form && (
                                <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                                  <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                                  <p className="text-xs text-red-600 leading-relaxed">{siErrors.form}</p>
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
                                className="w-full bg-primary text-white text-xs font-medium tracking-widest uppercase py-4 mt-1 hover:bg-[#2a2623] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                              >
                                {siLoading && <Loader2 size={14} className="animate-spin" />}
                                {siLoading ? 'Signing In...' : 'Sign In'}
                              </button>

                              <p className="text-center text-xs text-secondary">
                                Don't have an account?{' '}
                                <button
                                  type="button"
                                  onClick={() => switchTab('signup')}
                                  className="text-primary font-medium underline underline-offset-2 hover:text-primary/70 transition-colors"
                                >
                                  Create one
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
                                <p className="text-lg font-light text-primary mb-1">Create your account</p>
                                <p className="text-xs text-secondary">Join JORIQUE for exclusive access and offers</p>
                              </div>

                              {suErrors.form && (
                                <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                                  <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                                  <p className="text-xs text-red-600 leading-relaxed">{suErrors.form}</p>
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
                                className="w-full bg-primary text-white text-xs font-medium tracking-widest uppercase py-4 mt-1 hover:bg-[#2a2623] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                              >
                                {suLoading && <Loader2 size={14} className="animate-spin" />}
                                {suLoading ? 'Creating Account...' : 'Create Account'}
                              </button>

                              <p className="text-center text-xs text-secondary">
                                Already have an account?{' '}
                                <button
                                  type="button"
                                  onClick={() => switchTab('signin')}
                                  className="text-primary font-medium underline underline-offset-2 hover:text-primary/70 transition-colors"
                                >
                                  Sign in
                                </button>
                              </p>

                              <p className="text-center text-[10px] text-secondary/60 leading-relaxed">
                                By creating an account, you agree to our Terms of Service and Privacy Policy.
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
        </>
      )}
    </AnimatePresence>
  );
}
