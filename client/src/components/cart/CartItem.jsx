import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import Button from '../common/Button';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  // Extraer datos del producto que viene populado
  const { _id, producto, cantidad, precio, subtotal } = item;
  
  // Validar que producto existe (está populado)
  if (!producto) {
    console.error('Producto no populado en el item:', item);
    return null;
  }

  const { nombre, imagen, stock } = producto;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleIncrement = () => {
    if (cantidad < stock) {
      onUpdateQuantity(_id, cantidad + 1);
    }
  };

  const handleDecrement = () => {
    if (cantidad > 1) {
      onUpdateQuantity(_id, cantidad - 1);
    }
  };

  return (
    <div className="flex gap-4 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      {/* Imagen del producto */}
      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={imagen || '/placeholder-product.jpg'}
          alt={nombre}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Información del producto */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 mb-1">{nombre}</h3>
          <p className="text-lg font-bold text-indigo-600">
            {formatPrice(precio)}
          </p>
        </div>

        {/* Controles de cantidad */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={handleDecrement}
              disabled={cantidad <= 1}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
              {cantidad}
            </span>
            <button
              onClick={handleIncrement}
              disabled={cantidad >= stock}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {cantidad >= stock && (
            <span className="text-xs text-orange-600 font-medium">
              Stock máximo
            </span>
          )}
        </div>
      </div>

      {/* Subtotal y eliminar */}
      <div className="flex flex-col items-end justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(_id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-5 h-5" />
        </Button>

        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">Subtotal</p>
          <p className="text-xl font-bold text-gray-800">
            {formatPrice(subtotal)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;