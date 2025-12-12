import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  user?.role !== 'admin' && <Navigate to="/" replace />;
  

  user?.role?.name === 'admin' && <Navigate to="/admin" replace />;


  

  return children;
};

export default AdminRoute;