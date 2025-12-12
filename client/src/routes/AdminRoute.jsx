import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  // Si NO está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si es admin (soporta ambos formatos)
  const isAdmin = user?.role?.name === 'admin' || user?.role === 'admin';

  // Si está autenticado pero NO es admin, redirige al inicio
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si es admin, muestra el contenido
  return children;
};

export default AdminRoute;