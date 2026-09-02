import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, User, Menu, X, LogOut, ChevronDown, LayoutDashboard, Scan, Sun, Moon, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Connect', href: '/connect' },
];

interface NavbarProps {
  cartCount?: number;
  wishlistCount?: number;
}

export default function Navbar({ wishlistCount = 0 }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const { user, signOut, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const transparent = isHome && !scrolled;

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Account';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleAccountClick = () => {
    if (loading) return;
    if (user) {
      setUserMenuOpen((v) => !v);
    } else {
      navigate('/login');
    }
  };

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut();
    navigate('/');
  };

  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          transparent
            ? 'bg-transparent'
            : 'bg-white/95 dark:bg-[#12100E]/95 backdrop-blur-md border-b border-border dark:border-[#2E2925] shadow-sm'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span
                className={`text-lg font-semibold tracking-[0.25em] uppercase transition-colors duration-300 ${
                  transparent ? 'text-white' : 'text-primary dark:text-[#F5F2EB]'
                }`}
              >
                JORIQUE
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-xs font-medium tracking-widest uppercase transition-colors duration-200 relative group ${
                    transparent
                      ? 'text-white/90 hover:text-white'
                      : 'text-secondary dark:text-white/70 hover:text-primary dark:hover:text-[#D4AF37]'
                  } ${location.pathname === link.href ? (transparent ? 'text-white' : 'text-primary dark:text-[#D4AF37]') : ''}`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300 ${
                      transparent ? 'bg-white' : 'bg-primary dark:bg-[#D4AF37]'
                    } ${location.pathname === link.href ? 'w-full' : ''}`}
                  />
                </Link>
              ))}
            </nav>

            {/* Icons & Theme Switcher */}
            <div className="flex items-center gap-3 lg:gap-4">
              
              {/* 🌗 Theme Switcher Button */}
              <button
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className={`p-2 rounded-xl border transition-all duration-300 ${
                  transparent
                    ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                    : 'border-border dark:border-[#2E2925] bg-cream/40 dark:bg-white/5 text-primary dark:text-[#D4AF37] hover:scale-105'
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === 'dark' ? (
                    <motion.div
                      key="sun"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun size={17} strokeWidth={1.75} className="text-[#D4AF37]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ scale: 0, rotate: 90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon size={17} strokeWidth={1.75} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* QR Scan Button */}
              <Link
                to="/scan"
                aria-label="Scan QR Code"
                className={`relative p-2 rounded-xl transition-colors duration-200 ${
                  transparent ? 'text-white/90 hover:text-white' : 'text-secondary dark:text-white/80 hover:text-primary dark:hover:text-[#D4AF37]'
                }`}
              >
                <Scan size={18} strokeWidth={1.5} />
              </Link>

              {/* Shopping Bag / Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping Bag"
                className={`relative p-2 rounded-xl transition-colors duration-200 ${
                  transparent ? 'text-white/90 hover:text-white' : 'text-secondary dark:text-white/80 hover:text-primary dark:hover:text-[#D4AF37]'
                }`}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#25D366] text-white text-[9.5px] rounded-full flex items-center justify-center font-bold shadow-sm animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                aria-label="Wishlist"
                className={`relative p-2 rounded-xl transition-colors duration-200 ${
                  transparent ? 'text-white/90 hover:text-white' : 'text-secondary dark:text-white/80 hover:text-primary dark:hover:text-[#D4AF37]'
                }`}
              >
                <Heart size={18} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary dark:bg-[#D4AF37] text-white dark:text-black text-[9px] rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Account icon / user menu */}
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <button
                    onClick={handleAccountClick}
                    aria-label="Account menu"
                    className={`flex items-center gap-1.5 p-1 rounded-full transition-colors duration-200 ${
                      transparent ? 'text-white/90 hover:text-white' : 'text-secondary dark:text-white/80 hover:text-primary'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold tracking-wider ${
                        transparent ? 'bg-white/20 text-white' : 'bg-primary dark:bg-[#D4AF37] text-white dark:text-black'
                      }`}
                    >
                      {initials}
                    </span>
                    <ChevronDown
                      size={12}
                      strokeWidth={2}
                      className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                ) : (
                  <button
                    onClick={handleAccountClick}
                    aria-label="Sign in"
                    className={`p-2 rounded-xl transition-colors duration-200 ${
                      transparent ? 'text-white/90 hover:text-white' : 'text-secondary dark:text-white/80 hover:text-primary dark:hover:text-[#D4AF37]'
                    }`}
                  >
                    <User size={18} strokeWidth={1.5} />
                  </button>
                )}

                {/* User dropdown */}
                <AnimatePresence>
                  {userMenuOpen && user && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-full mt-2.5 w-60 bg-white dark:bg-[#1A1816] rounded-2xl border border-border dark:border-[#2E2925] shadow-2xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-4 border-b border-border dark:border-[#2E2925]">
                        <p className="text-xs font-semibold text-primary dark:text-white truncate">{displayName}</p>
                        <p className="text-[11px] text-secondary dark:text-white/60 truncate mt-0.5">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to={dashboardPath}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium tracking-wide text-secondary dark:text-white/70 hover:text-primary dark:hover:text-white hover:bg-cream dark:hover:bg-white/5 rounded-xl transition-colors duration-150"
                        >
                          <LayoutDashboard size={14} strokeWidth={1.5} />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium tracking-wide text-secondary dark:text-white/70 hover:text-primary dark:hover:text-white hover:bg-cream dark:hover:bg-white/5 rounded-xl transition-colors duration-150"
                        >
                          <LogOut size={14} strokeWidth={1.5} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle navigation"
                className={`md:hidden p-2 rounded-xl transition-colors duration-200 ${
                  transparent ? 'text-white' : 'text-primary dark:text-white'
                }`}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-white dark:bg-[#100E0D] pt-24 px-6 flex flex-col justify-between pb-8 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-light tracking-wide text-primary dark:text-white hover:text-secondary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-border dark:border-[#2E2925] pt-6 flex items-center justify-between">
              <span className="text-xs text-secondary dark:text-white/60">Theme:</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cream dark:bg-white/10 text-xs font-semibold uppercase tracking-wider text-primary dark:text-white"
              >
                {theme === 'dark' ? <Sun size={15} className="text-[#D4AF37]" /> : <Moon size={15} />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}