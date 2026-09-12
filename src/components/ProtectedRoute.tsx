import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { AppUser } from '../types';
import LoadingMasterpiece from './LoadingMasterpiece';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: AppUser['role'];
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingMasterpiece />;
  }

  if (!user) {
    const targetLogin = role === 'admin' ? '/admin/login' : '/login';
    return <Navigate to={targetLogin} state={{ from: location.pathname }} replace />;
  }

  if (role && user.role !== role) {
    if (role === 'admin') {
      return (
        <Navigate
          to="/admin/login"
          state={{ from: location.pathname, error: 'Access Denied: Administrative privileges required.' }}
          replace
        />
      );
    }
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
}
