import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Star, Minus, Plus, ArrowLeft, Check } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatters';
import api from '../../services/api.service';
import { useAuth } from '../../hooks/useAuth';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth()

  // Mock data del producto
  const setActualProduct = async () => {
    const { data } = await api.get('/products/' + id)
    setProduct(data.data);
  }


  useEffect(() => {
    setActualProduct()
    setLoading(false);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      // Aquí podrías mostrar una notificación
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-300 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-12 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>Producto no encontrado</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb y botón volver */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <div className="text-sm text-gray-500">
            / Productos / {product.categoria} / {product.nombre}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <Card padding={false} className="overflow-hidden mb-4">
              <div className="aspect-square bg-gray-100">
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>

          </div>

          {/* Información del producto */}
          <div>
            <Card>
              {/* Categoría */}
              <div className="text-sm text-indigo-600 font-semibold mb-2">
                {product.categoria}
              </div>

              {/* Nombre */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.nombre}
              </h1>


              {/* Precio */}
              <div className="mb-6">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {formatPrice(product.precio)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Stock disponible: {product.stock} unidades
                  </span>
                  {product.stock > 0 && (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <Check className="w-4 h-4" />
                      <span>Disponible</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Descripción */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Cantidad */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cantidad
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="px-6 py-2 font-semibold text-lg min-w-[4rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="text-gray-600">
                    Total: <span className="font-bold text-indigo-600">
                      {formatPrice(product.precio * quantity)}
                    </span>
                  </span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 mb-6">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || !user}
                  className="flex-1"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Agregar al Carrito
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0 || !user}
                  className="flex-1"
                >
                  Comprar Ahora
                </Button>
              </div>

              
            </Card>
          </div>
        </div>

        
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;