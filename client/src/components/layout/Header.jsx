import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, ShoppingBag, Package, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  // Verificar si el usuario es admin
  const isAdmin = user?.role?.name === 'admin' || user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition">
            <ShoppingBag className="w-8 h-8" />
            <span className="text-2xl font-bold">TechStore</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-indigo-200 transition">
              Inicio
            </Link>
            <Link to="/products" className="hover:text-indigo-200 transition">
              Productos
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/my-orders" className="hover:text-indigo-200 transition">
                  Mis Pedidos
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="hover:text-indigo-200 transition flex items-center gap-1">
                    <LayoutDashboard className="w-4 h-4" />
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/cart" 
                  className="relative hover:text-indigo-200 transition p-2"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </Link>
                
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-700 rounded-lg">
                  <User className="w-5 h-5" />
                  <span className="text-sm">{user?.name || user?.email}</span>
                  {isAdmin && (
                    <span className="ml-2 px-2 py-0.5 bg-yellow-500 text-yellow-900 text-xs font-bold rounded">
                      ADMIN
                    </span>
                  )}
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="hover:text-indigo-200 transition p-2"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="border-2 border-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-indigo-500 mt-2 pt-4">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-indigo-200 transition py-2"
              >
                Inicio
              </Link>
              <Link 
                to="/products" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-indigo-200 transition py-2"
              >
                Productos
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/cart" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-indigo-200 transition py-2 flex items-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Carrito ({itemCount})
                  </Link>
                  <Link 
                    to="/my-orders" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-indigo-200 transition py-2 flex items-center gap-2"
                  >
                    <Package className="w-5 h-5" />
                    Mis Pedidos
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="hover:text-indigo-200 transition py-2 flex items-center gap-2 bg-indigo-700 rounded-lg px-3"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Panel Admin
                      <span className="ml-auto px-2 py-0.5 bg-yellow-500 text-yellow-900 text-xs font-bold rounded">
                        ADMIN
                      </span>
                    </Link>
                  )}
                  <div className="border-t border-indigo-500 pt-3 mt-2">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5" />
                      <span className="text-sm">{user?.name || user?.email}</span>
                      {isAdmin && (
                        <span className="ml-auto px-2 py-0.5 bg-yellow-500 text-yellow-900 text-xs font-bold rounded">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="hover:text-indigo-200 transition py-2 flex items-center gap-2 w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold text-center hover:bg-indigo-50 transition"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="border-2 border-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-indigo-700 transition"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;