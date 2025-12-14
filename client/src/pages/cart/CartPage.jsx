import React, { useEffect, useState } from 'react';
import { json, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useCart } from '../../hooks/useCart';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotal, refreshCart } = useCart();
  const [showClearModal, setShowClearModal] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    refreshCart()
  }, [])
  const handleCheckout = () => {
    setLoading(true);
    // Simulación de proceso de checkout
    setTimeout(() => {
      setLoading(false);
      navigate('/my-orders');
      clearCart();
    }, 2000);
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearModal(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="bg-indigo-100 rounded-full p-6 mb-6">
              <ShoppingBag className="w-16 h-16 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-8">
              Agrega productos a tu carrito para continuar con tu compra
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/products')}
            >
              Explorar Productos
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition mb-3"
            >
              <ArrowLeft className="w-5 h-5" />
              Seguir Comprando
            </button>
            <h1 className="text-4xl font-bold text-gray-900">
              Carrito de Compras
            </h1>
            <p className="text-gray-600 mt-2">
              {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} en tu carrito
            </p>
          </div>

          {cartItems.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => setShowClearModal(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-5 h-5" />
              Vaciar Carrito
            </Button>
          )}
        </div>

        {/* Contenido del carrito */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Información de Envío
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Envío gratis en compras superiores a $100.000
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Entregas en 2-5 días hábiles
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Puedes rastrear tu pedido en tiempo real
                </li>
              </ul>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <CartSummary
              subtotal={getTotal()}
              onCheckout={handleCheckout}
              loading={loading}
            />

            {/* Métodos de pago aceptados */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Métodos de Pago
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="border border-gray-200 rounded p-2 flex items-center justify-center">
                  <span className="text-2xl">💳</span>
                </div>
                <div className="border border-gray-200 rounded p-2 flex items-center justify-center">
                  <span className="text-2xl">🏦</span>
                </div>
                <div className="border border-gray-200 rounded p-2 flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                Visa, Mastercard, PSE, Nequi y más
              </p>
            </div>

            {/* Garantía */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <span>✓</span>
                Compra Segura
              </h3>
              <ul className="space-y-1 text-sm text-green-800">
                <li>• Garantía de satisfacción</li>
                <li>• Devoluciones fáciles</li>
                <li>• Soporte 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modal de confirmación para vaciar carrito */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Vaciar Carrito"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro que deseas vaciar tu carrito? Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3">
            <Button
              variant="danger"
              fullWidth
              onClick={handleClearCart}
            >
              Sí, Vaciar Carrito
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowClearModal(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CartPage;