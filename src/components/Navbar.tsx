import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, User, ShoppingBag, Menu, X, LogOut, ChevronDown, LayoutDashboard, Scan } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// Active Launch Phase Nav Links
const navLinks = [
  { label: 'Connect', href: '/connect' },
  { label: 'Coming Soon', href: '/' },
];

/* 
// FULL WEBSITE NAV LINKS (Uncomment when full site goes live):
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Connect', href: '/connect' },
];
*/

interface NavbarProps {
  cartCount?: number;
  wishlistCount?: number;
}

export default function Navbar({ cartCount = 0, wishlistCount = 0 }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const { user, signOut, loading } = useAuth();

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
            : 'bg-white/95 backdrop-blur-md border-b border-border shadow-sm'
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
                  transparent ? 'text-white' : 'text-primary'
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
                      : 'text-secondary hover:text-primary'
                  } ${location.pathname === link.href ? (transparent ? 'text-white' : 'text-primary') : ''}`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300 ${
                      transparent ? 'bg-white' : 'bg-primary'
                    } ${location.pathname === link.href ? 'w-full' : ''}`}
                  />
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4 lg:gap-5">
              {/* QR Scan Button */}
              <Link
                to="/scan"
                aria-label="Scan QR Code"
                className={`relative p-1.5 transition-colors duration-200 ${
                  transparent ? 'text-white/90 hover:text-white' : 'text-secondary hover:text-primary'
                }`}
              >
                <Scan size={18} strokeWidth={1.5} />
              </Link>

              <button
                aria-label="Wishlist"
                className={`relative p-1.5 transition-colors duration-200 ${
                  transparent ? 'text-white/90 hover:text-white' : 'text-secondary hover:text-primary'
                }`}
              >
                <Heart size={18} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] rounded-full flex items-center justify-center font-medium">
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
                      transparent ? 'text-white/90 hover:text-white' : 'text-secondary hover:text-primary'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold tracking-wider ${
                        transparent ? 'bg-white/20 text-white' : 'bg-primary text-white'
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
                    className={`p-1.5 transition-colors duration-200 ${
                      transparent ? 'text-white/90 hover:text-white' : 'text-secondary hover:text-primary'
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
                      className="absolute right-0 top-full mt-2.5 w-60 bg-white rounded-xl border border-border shadow-lg overflow-hidden"
                    >
                      <div className="px-4 py-4 border-b border-border">
                        <p className="text-xs font-semibold text-primary truncate">{displayName}</p>
                        <p className="text-[11px] text-secondary truncate mt-0.5">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to={dashboardPath}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium tracking-wide text-secondary hover:text-primary hover:bg-cream rounded-lg transition-colors duration-150"
                        >
                          <LayoutDashboard size={14} strokeWidth={1.5} />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium tracking-wide text-secondary hover:text-primary hover:bg-cream rounded-lg transition-colors duration-150"
                        >
                          <LogOut size={14} strokeWidth={1.5} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/shop"
                aria-label="Cart"
                className={`relative p-1.5 transition-colors duration-200 ${
                  transparent ? 'text-white/90 hover:text-white' : 'text-secondary hover:text-primary'
                }`}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Menu"
                className={`md:hidden p-1.5 transition-colors duration-200 ${
                  transparent ? 'text-white/90 hover:text-white' : 'text-secondary hover:text-primary'
                }`}
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white flex flex-col md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-border">
                <span className="text-sm font-semibold tracking-[0.25em] uppercase text-primary">JORIQUE</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 text-secondary hover:text-primary transition-colors"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Mobile user info */}
              {user && (
                <div className="px-6 py-4 bg-cream border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-white">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-primary truncate">{displayName}</p>
                      <p className="text-[11px] text-secondary truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <nav className="flex flex-col px-6 py-8 gap-1">
                {/* Mobile nav links */}
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 + 0.1 }}
                  >
                    <Link
                      to={link.href}
                      className={`block py-3 text-sm font-medium tracking-widest uppercase border-b border-border/50 transition-colors ${
                        location.pathname === link.href ? 'text-primary' : 'text-secondary hover:text-primary'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile QR Scan link */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    to="/scan"
                    className="flex items-center gap-3 py-3 text-sm font-medium tracking-widest uppercase border-b border-border/50 text-secondary hover:text-primary transition-colors"
                  >
                    <Scan size={16} strokeWidth={1.5} />
                    Scan QR Code
                  </Link>
                </motion.div>
              </nav>

              <div className="mt-auto px-6 py-8 border-t border-border">
                {user ? (
                  <div className="space-y-4">
                    <Link
                      to={dashboardPath}
                      className="w-full flex items-center gap-2.5 text-xs font-medium tracking-widest uppercase text-secondary hover:text-primary transition-colors"
                    >
                      <LayoutDashboard size={14} strokeWidth={1.5} />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 text-xs font-medium tracking-widest uppercase text-secondary hover:text-primary transition-colors"
                    >
                      <LogOut size={14} strokeWidth={1.5} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center gap-2.5 text-xs font-medium tracking-widest uppercase text-secondary hover:text-primary transition-colors"
                  >
                    <User size={14} strokeWidth={1.5} />
                    Sign In / Register
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}