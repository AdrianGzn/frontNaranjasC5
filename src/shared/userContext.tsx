import { Navigate, Outlet } from 'react-router-dom';
import { AuthService } from './hooks/auth_user.service';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Si hay roles permitidos, verificamos que el usuario tenga uno de ellos
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(role => AuthService.hasRole(role));
    
    if (!hasRequiredRole) {
      return <Navigate to="/forbidden" replace />;
    }
  }
  
  return <Outlet />;
};