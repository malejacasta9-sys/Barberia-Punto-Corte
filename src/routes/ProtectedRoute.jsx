import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/common/Spinner';

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, rol, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner text="Verificando permisos y sesión..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(rol)) {
    // Si el usuario no tiene el rol permitido, redirigir a su vista adecuada
    return <Navigate to="/" replace />;
  }

  return children;
}
