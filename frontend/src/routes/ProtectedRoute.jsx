import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';

/**
 * Guardia de ruta protegida
 * Redirige a /login si no hay una sesión activa
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-retro-bg text-retro-text flex items-center justify-center">
        <span className="font-mono text-xs text-retro-muted animate-pulse">
          VERIFICANDO AUTORIZACIÓN...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
