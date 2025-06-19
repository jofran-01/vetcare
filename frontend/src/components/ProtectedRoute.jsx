import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requireAuth = true, userType = null }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se requer autenticação mas usuário não está logado
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se não requer autenticação mas usuário está logado (ex: página de login)
  if (!requireAuth && isAuthenticated) {
    const redirectTo = user?.type === 'tutor' ? '/dashboard/tutor' : '/dashboard/clinica';
    return <Navigate to={redirectTo} replace />;
  }

  // Se requer tipo específico de usuário
  if (userType && user?.type !== userType) {
    const redirectTo = user?.type === 'tutor' ? '/dashboard/tutor' : '/dashboard/clinica';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;

