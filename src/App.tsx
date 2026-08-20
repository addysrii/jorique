import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ComingSoon from './pages/ComingSoon';
import Connection from './pages/Connection';

 
// ========================================================================
// PAGE IMPORTS (Temporarily commented out for Launch Phase)
// Uncomment these imports when ready to restore full website functionality:
// ========================================================================
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Reviews from './pages/Reviews';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOtp from './pages/VerifyOtp';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AddNewProducts from './pages/AddNewProducts';


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
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ========================================================================
            ACTIVE LAUNCH PHASE ROUTES
            ======================================================================== */}
        
        {/* Main Website -> Coming Soon landing page */}
        <Route
          path="/"
          element={
            <PageTransition>
              <ComingSoon />
            </PageTransition>
          }
        />

        {/* Connect Page -> Digital Business Card (Live & Functional) */}
        <Route
          path="/connect"
          element={
            <PageTransition>
              <Connection />
            </PageTransition>
          }
        />

        {/* Catch-all route: Redirect all other URLs to Coming Soon page during launch phase */}
        <Route path="*" element={<Navigate to="/" replace />} />

        
        {/* ========================================================================
        FULL WEBSITE ROUTES (Temporarily commented out for launch phase)
        Uncomment the routes below (and the imports at top) when full website goes live:
        ======================================================================== */}

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
          path="/admin/products/new"
          element={
            <PageTransition>
              <ProtectedRoute role="admin">
                <AddNewProducts/>
              </ProtectedRoute>
            </PageTransition>
          }
        />
        
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
