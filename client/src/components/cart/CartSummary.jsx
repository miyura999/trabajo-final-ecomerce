import React from 'react';
import { ShoppingBag, Truck, Tag } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

const CartSummary = ({ subtotal, onCheckout, loading = false }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Cálculos
  const shipping = subtotal > 100000 ? 0 : 10000; // Envío gratis sobre $100.000
  const tax = subtotal * 0.19; // IVA 19%
  const discount = 0; // Descuentos aplicados
  const total = subtotal + shipping + tax - discount;

  return (
    <Card className="sticky top-24">
      <div className="space-y-4">
        {/* Título */}
        <div className="flex items-center gap-2 pb-4 border-b">
          <ShoppingBag className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-800">Resumen del Pedido</h2>
        </div>

        {/* Desglose de precios */}
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <div className="flex items-center gap-1">
              <Truck className="w-4 h-4" />
              <span>Envío</span>
            </div>
            <span className="font-semibold">
              {shipping === 0 ? (
                <span className="text-green-600">¡Gratis!</span>
              ) : (
                formatPrice(shipping)
              )}
            </span>
          </div>

          {shipping > 0 && subtotal < 100000 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                ¡Agrega {formatPrice(100000 - subtotal)} más para envío gratis!
              </p>
            </div>
          )}

          <div className="flex justify-between text-gray-600">
            <span>IVA (19%)</span>
            <span className="font-semibold">{formatPrice(tax)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                <span>Descuento</span>
              </div>
              <span className="font-semibold">-{formatPrice(discount)}</span>
            </div>
          )}
        </div>

        {/* Código de descuento */}
        <div className="pt-3 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Código de descuento"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <Button variant="outline" size="sm">
              Aplicar
            </Button>
          </div>
        </div>

        {/* Total */}
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-800">Total</span>
            <span className="text-2xl font-bold text-indigo-600">
              {formatPrice(total)}
            </span>
          </div>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={onCheckout}
            loading={loading}
            className="shadow-lg hover:shadow-xl"
          >
            Proceder al Pago
          </Button>
        </div>

        {/* Información adicional */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
            <span>Aceptamos todos los métodos de pago</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
            <span>Compra 100% segura</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
            <span>Envío en 2-5 días hábiles</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CartSummary;