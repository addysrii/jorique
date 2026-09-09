import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  User,
  Menu,
  X,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Sun,
  Moon,
  ShoppingBag,
  Info,
  PhoneCall,
  LogIn,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

interface NavbarProps {
  cartCount?: number;
  wishlistCount?: number;
}

export default function Navbar({}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isHome = location.pathname === '/';
  const { user, signOut, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { cartCount, setIsCartOpen } = useCart();

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname, location.search]);

  // Prevent background scroll on mobile open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Click outside user dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  // Fetch real categories from database & active products
  useEffect(() => {
    let active = true;

    const fetchNavbarCategories = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          supabase.from('categories').select('name').order('name'),
          supabase.from('products').select('category'),
        ]);

        const dbCatNames = (catRes.data || []).map((c: { name: string }) => c.name).filter(Boolean);
        const prodCatNames = (prodRes.data || []).map((p: { category: string }) => p.category).filter(Boolean);

        // Normalize and deduplicate
        const seen = new Set<string>();
        const unique: string[] = [];

        for (const name of [...dbCatNames, ...prodCatNames]) {
          const clean = name.trim();
          const lower = clean.toLowerCase();
          if (clean && !seen.has(lower)) {
            seen.add(lower);
            unique.push(clean);
          }
        }

        if (active) {
          if (unique.length > 0) {
            setCategories(unique);
          } else {
            setCategories(['Suits', 'Bedsheet', 'Pillow', 'Towel']);
          }
        }
      } catch (err) {
        console.warn('Navbar categories load fallback:', err);
        if (active) {
          setCategories(['Suits', 'Bedsheet', 'Pillow', 'Towel']);
        }
      }
    };

    fetchNavbarCategories();
    return () => {
      active = false;
    };
  }, []);

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
    setUserMenuOpen((v) => !v);
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
            <Link to="/" className="flex-shrink-0 group flex flex-col items-center">
              <span
                className={`font-mainlogo text-2xl tracking-[0.20em] uppercase transition-colors duration-300 ${
                  transparent ? 'text-white' : 'text-primary dark:text-[#FCFAF7]'
                }`}
              >
                JORIQUE
              </span>
              <span
                className={`h-[1px] w-full mt-[-1px] transition-all duration-300 ${
                  transparent ? 'bg-white/40' : 'bg-[#1A1A1A]/30 dark:bg-[#C6A96B]/50'
                } scale-x-75 group-hover:scale-x-100`}
              />
            </Link>

            {/* Desktop Nav: Home + All Categories */}
            <nav className="hidden md:flex items-center gap-5 lg:gap-8 flex-wrap">
              <Link
                to="/"
                className={`text-xs font-semibold tracking-widest uppercase transition-colors duration-200 relative group py-1 ${
                  transparent
                    ? 'text-white/90 hover:text-white'
                    : 'text-secondary dark:text-white/70 hover:text-primary dark:hover:text-[#D4AF37]'
                } ${location.pathname === '/' ? (transparent ? 'text-white' : 'text-primary dark:text-[#D4AF37]') : ''}`}
              >
                Home
                <span
                  className={`absolute -bottom-0.5 left-0 h-0.5 transition-all duration-300 ${
                    transparent ? 'bg-white' : 'bg-primary dark:bg-[#D4AF37]'
                  } ${location.pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}
                />
              </Link>

              {categories.map((cat) => {
                const activeCatParam = searchParams.get('category');
                const isCatActive =
                  location.pathname === '/shop' &&
                  activeCatParam?.toLowerCase() === cat.toLowerCase();

                return (
                  <Link
                    key={cat}
                    to={`/shop?category=${encodeURIComponent(cat)}`}
                    className={`text-xs font-semibold tracking-widest uppercase transition-colors duration-200 relative group py-1 ${
                      transparent
                        ? 'text-white/90 hover:text-white'
                        : 'text-secondary dark:text-white/70 hover:text-primary dark:hover:text-[#D4AF37]'
                    } ${isCatActive ? (transparent ? 'text-white' : 'text-primary dark:text-[#D4AF37]') : ''}`}
                  >
                    {cat}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-0.5 transition-all duration-300 ${
                        transparent ? 'bg-white' : 'bg-primary dark:bg-[#D4AF37]'
                      } ${isCatActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions (Theme, Cart, Profile) */}
            <div className="flex items-center gap-3 lg:gap-4">

              {/* Theme Switcher Button */}
              <button
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className={`p-2 rounded-xl border transition-all duration-300 cursor-pointer ${
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

              {/* Shopping Bag / Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping Bag"
                className={`relative p-2 rounded-xl transition-colors duration-200 cursor-pointer ${
                  transparent
                    ? 'text-white/90 hover:text-white'
                    : 'text-secondary dark:text-white/80 hover:text-primary dark:hover:text-[#D4AF37]'
                }`}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#25D366] text-white text-[9.5px] rounded-full flex items-center justify-center font-bold shadow-sm animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Profile / Account Section Dropdown Trigger */}
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <button
                    onClick={handleAccountClick}
                    aria-label="Account menu"
                    className={`flex items-center gap-1.5 p-1 rounded-full transition-colors duration-200 cursor-pointer ${
                      transparent ? 'text-white/90 hover:text-white' : 'text-secondary dark:text-white/80 hover:text-primary'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold tracking-wider ${
                        transparent
                          ? 'bg-white/20 text-white'
                          : 'bg-primary dark:bg-[#D4AF37] text-white dark:text-black'
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
                    aria-label="Profile and About menu"
                    className={`p-2 rounded-xl transition-colors duration-200 cursor-pointer ${
                      transparent
                        ? 'text-white/90 hover:text-white'
                        : 'text-secondary dark:text-white/80 hover:text-primary dark:hover:text-[#D4AF37]'
                    }`}
                  >
                    <User size={18} strokeWidth={1.5} />
                  </button>
                )}

                {/* Profile Dropdown Menu (Contains About Us & Connect) */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-full mt-2.5 w-64 bg-white dark:bg-[#1A1816] rounded-2xl border border-border dark:border-[#2E2925] shadow-2xl overflow-hidden z-50 divide-y divide-border/60 dark:divide-[#2E2925]"
                    >
                      {/* Header Info */}
                      <div className="px-4 py-3.5 bg-cream/35 dark:bg-white/[0.02]">
                        {user ? (
                          <>
                            <p className="text-xs font-bold text-primary dark:text-white truncate">{displayName}</p>
                            <p className="text-[11px] text-secondary dark:text-white/60 truncate mt-0.5">{user.email}</p>
                          </>
                        ) : (
                          <>
                            <p className="text-xs font-bold text-primary dark:text-white">JORIQUE Atelier</p>
                            <p className="text-[11px] text-secondary dark:text-white/60 mt-0.5">Luxury Handcrafted Textiles</p>
                          </>
                        )}
                      </div>

                      {/* Account / Dashboard Action */}
                      <div className="p-2 space-y-1">
                        {user ? (
                          <Link
                            to={dashboardPath}
                            onClick={() => setUserMenuOpen(false)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium tracking-wide text-secondary dark:text-white/70 hover:text-primary dark:hover:text-[#D4AF37] hover:bg-cream dark:hover:bg-white/5 rounded-xl transition-colors duration-150"
                          >
                            <LayoutDashboard size={14} strokeWidth={1.5} className="text-[#C6A96B] dark:text-[#D4AF37]" />
                            <span>Dashboard</span>
                          </Link>
                        ) : (
                          <Link
                            to="/login"
                            onClick={() => setUserMenuOpen(false)}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-primary dark:bg-[#D4AF37] dark:text-black rounded-xl transition-all shadow-xs hover:opacity-90"
                          >
                            <LogIn size={14} />
                            <span>Sign In / Register</span>
                          </Link>
                        )}
                      </div>

                      {/* About Us & Connect (Integrated in Profile Section) */}
                      <div className="p-2 space-y-1">
                        <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-secondary/60 dark:text-white/40 block pt-1 pb-0.5">
                          Atelier & Info
                        </span>
                        <Link
                          to="/about"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium tracking-wide text-secondary dark:text-white/70 hover:text-primary dark:hover:text-[#D4AF37] hover:bg-cream dark:hover:bg-white/5 rounded-xl transition-colors duration-150"
                        >
                          <Info size={14} strokeWidth={1.5} className="text-[#C6A96B] dark:text-[#D4AF37]" />
                          <span>About Us</span>
                        </Link>
                        <Link
                          to="/connect"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium tracking-wide text-secondary dark:text-white/70 hover:text-primary dark:hover:text-[#D4AF37] hover:bg-cream dark:hover:bg-white/5 rounded-xl transition-colors duration-150"
                        >
                          <PhoneCall size={14} strokeWidth={1.5} className="text-[#C6A96B] dark:text-[#D4AF37]" />
                          <span>Connect With Us</span>
                        </Link>
                      </div>

                      {/* Sign Out Action if Authenticated */}
                      {user && (
                        <div className="p-2">
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium tracking-wide text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors duration-150 cursor-pointer"
                          >
                            <LogOut size={14} strokeWidth={1.5} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle navigation"
                className={`md:hidden p-2 rounded-xl transition-colors duration-200 cursor-pointer ${
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
            <div className="flex flex-col gap-5 overflow-y-auto max-h-[72vh] pr-2">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-light tracking-wide text-primary dark:text-white hover:text-secondary transition-colors"
              >
                Home
              </Link>

              {/* Categories */}
              <div className="pt-2 border-t border-border/60 dark:border-[#2E2925] space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-secondary/60 dark:text-white/40 block">
                  Categories
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/shop?category=${encodeURIComponent(cat)}`}
                      onClick={() => setMobileOpen(false)}
                      className="px-3.5 py-2.5 rounded-xl bg-cream/40 dark:bg-white/5 border border-border/70 dark:border-[#2E2925] text-xs font-semibold text-primary dark:text-white hover:border-primary/40 dark:hover:border-[#D4AF37] transition-all"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Profile & Information Links */}
              <div className="pt-2 border-t border-border/60 dark:border-[#2E2925] space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-secondary/60 dark:text-white/40 block">
                  Profile & Atelier
                </span>
                <div className="flex flex-col gap-2 text-sm">
                  {user ? (
                    <Link
                      to={dashboardPath}
                      onClick={() => setMobileOpen(false)}
                      className="text-primary dark:text-white hover:underline flex items-center gap-2"
                    >
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="text-primary dark:text-white hover:underline flex items-center gap-2 font-semibold"
                    >
                      <LogIn size={15} /> Sign In / Register
                    </Link>
                  )}
                  <Link
                    to="/about"
                    onClick={() => setMobileOpen(false)}
                    className="text-primary dark:text-white hover:underline flex items-center gap-2"
                  >
                    <Info size={15} /> About Us
                  </Link>
                  <Link
                    to="/connect"
                    onClick={() => setMobileOpen(false)}
                    className="text-primary dark:text-white hover:underline flex items-center gap-2"
                  >
                    <PhoneCall size={15} /> Connect With Us
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t border-border dark:border-[#2E2925] pt-6 flex items-center justify-between">
              <span className="text-xs text-secondary dark:text-white/60">Theme:</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cream dark:bg-white/10 text-xs font-semibold uppercase tracking-wider text-primary dark:text-white cursor-pointer"
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