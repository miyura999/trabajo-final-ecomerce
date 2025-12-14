import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProductsPage from '../pages/products/ProductsPage';
import ProductDetailPage from '../pages/products/ProductDetailPage';
import CartPage from '../pages/cart/CartPage';
import MyOrdersPage from '../pages/orders/MyOrdersPage';
import OrderDetailPage from '../pages/orders/OrderDetailPage';
import DashboardPage from '../pages/admin/DashboardPage';
import ManageProductsPage from '../pages/admin/ManageProductsPage';
import ManageOrdersPage from '../pages/admin/ManageOrdersPage';
import ManageUsersPage from '../pages/admin/ManageUsersPage';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import Chat from '../pages/admin/chatPage';
import PageNotFound from '../components/layout/PageNotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<ProductsPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />

      {/* Rutas privadas - Cliente */}
      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <CartPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-orders"
        element={
          <PrivateRoute>
            <MyOrdersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <PrivateRoute>
            <OrderDetailPage />
          </PrivateRoute>
        }
      />

      {/* Rutas privadas - Admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <DashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <ManageProductsPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <ManageOrdersPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <ManageUsersPage />
          </AdminRoute>
        }
      />
      <Route path='/chat'
        element={
          <Chat />
        } />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default AppRoutes;