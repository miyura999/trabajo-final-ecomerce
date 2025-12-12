import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Si NO está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, muestra el contenido
  return children;
};

export default PrivateRoute;