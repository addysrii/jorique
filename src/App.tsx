import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import WhatsAppCheckoutModal from './components/WhatsAppCheckoutModal';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded routes for performance & code splitting
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const About = lazy(() => import('./pages/About'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Connection = lazy(() => import('./pages/Connection'));
const ComingSoon = lazy(() => import('./pages/ComingSoon'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const VerifyOtp = lazy(() => import('./pages/VerifyOtp'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AddNewProducts = lazy(() => import('./pages/AddNewProducts'));
const ScanPage = lazy(() => import('./pages/Scan'));
const ReviewPage = lazy(() => import('./pages/Review'));
const GiftPage = lazy(() => import('./pages/GiftPage'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-background dark:bg-[#100E0D] flex flex-col items-center justify-center transition-colors duration-300">
      <div className="w-10 h-10 border-2 border-[#3F3A36] dark:border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-[10px] uppercase font-semibold tracking-[0.3em] text-[#8D867F] dark:text-[#D4AF37]">
        JORIQUE
      </p>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Main Storefront Routes */}
          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="/home"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="/shop"
            element={
              <PageTransition>
                <Shop />
              </PageTransition>
            }
          />
          <Route
            path="/product/:id"
            element={
              <PageTransition>
                <ProductDetails />
              </PageTransition>
            }
          />
          <Route
            path="/about"
            element={
              <PageTransition>
                <About />
              </PageTransition>
            }
          />
          <Route
            path="/reviews"
            element={
              <PageTransition>
                <Reviews />
              </PageTransition>
            }
          />
          <Route
            path="/connect"
            element={
              <PageTransition>
                <Connection />
              </PageTransition>
            }
          />
          <Route
            path="/coming-soon"
            element={
              <PageTransition>
                <ComingSoon />
              </PageTransition>
            }
          />

          {/* Authentication Routes */}
          <Route
            path="/login"
            element={
              <PageTransition>
                <Login />
              </PageTransition>
            }
          />
          <Route
            path="/signup"
            element={
              <PageTransition>
                <Signup />
              </PageTransition>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <PageTransition>
                <VerifyOtp />
              </PageTransition>
            }
          />

          {/* Customer Experience & QR Flows */}
          <Route
            path="/dashboard"
            element={
              <PageTransition>
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              </PageTransition>
            }
          />
          <Route
            path="/scan"
            element={
              <PageTransition>
                <ScanPage />
              </PageTransition>
            }
          />
          <Route
            path="/review/:serial"
            element={
              <PageTransition>
                <ReviewPage />
              </PageTransition>
            }
          />
          <Route
            path="/gift"
            element={
              <PageTransition>
                <GiftPage />
              </PageTransition>
            }
          />

          {/* Admin JORIQUE OS Suite */}
          <Route
            path="/admin"
            element={
              <PageTransition>
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              </PageTransition>
            }
          />
          <Route
            path="/admin/products"
            element={
              <PageTransition>
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              </PageTransition>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <PageTransition>
                <ProtectedRoute role="admin">
                  <AddNewProducts />
                </ProtectedRoute>
              </PageTransition>
            }
          />

          {/* Catch-all Wildcard Route (Must be last) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <ScrollToTop />
              <AnimatedRoutes />
              <CartDrawer />
              <WhatsAppCheckoutModal />
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

