import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

const ProductCard = ({ product, onAddToCart }) => {
  const { _id: id, nombre, precio, imagen, descripcion, stock, categoria } = product;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card hover className="overflow-hidden group">
      {/* Imagen del producto */}
      <div className="relative overflow-hidden bg-gray-100 h-48">
        <img
          src={imagen || 'https://mkgabinet.com/wp-content/uploads/2022/07/caracteristicas-beneficios-producto-mejorar-ventas.jpg'}
          alt={nombre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Badge de categoría */}
        {categoria && (
          <div className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
            {categoria}
          </div>
        )}


        {/* Badge de stock bajo */}
        {stock < 5 && stock > 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            ¡Últimas unidades!
          </div>
        )}

        {/* Sin stock */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
              Agotado
            </span>
          </div>
        )}

        {/* Botón de vista rápida */}
        <Link
          to={`/products/${id}`}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all opacity-0 group-hover:opacity-100"
        >
          <div className="bg-white rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform">
            <Eye className="w-5 h-5 text-indigo-600" />
          </div>
        </Link>
      </div>

      {/* Información del producto */}
      <div className="p-4">


        {/* Nombre */}
        <Link to={`/products/${id}`}>
          <h3 className="font-semibold text-gray-800 mb-2 hover:text-indigo-600 transition line-clamp-2">
            {nombre}
          </h3>
        </Link>

        {/* Descripción */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {descripcion}
        </p>

        {/* Precio y acciones */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-indigo-600">
              {formatPrice(precio)}
            </p>
            {stock > 0 && (
              <p className="text-xs text-gray-500">
                Stock: {stock} unidades
              </p>
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onAddToCart(product)}
            disabled={stock === 0}
            className="flex items-center gap-1"
          >
            <ShoppingCart className="w-4 h-4" />
            Agregar
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;