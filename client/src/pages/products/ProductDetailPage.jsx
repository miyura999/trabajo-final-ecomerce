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

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

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

            <div className="grid grid-cols-3 gap-3">
              {/* {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`
                    aspect-square rounded-lg overflow-hidden border-2 transition
                    ${selectedImage === index ? 'border-indigo-600' : 'border-gray-200 hover:border-gray-300'}
                  `}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))} */}
            </div>
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
                  disabled={product.stock === 0}
                  className="flex-1"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Agregar al Carrito
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1"
                >
                  Comprar Ahora
                </Button>
              </div>

              {/* Acciones adicionales */}
              <div className="flex gap-3 pt-6 border-t">
                <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition">
                  <Heart className="w-5 h-5" />
                  <span>Agregar a favoritos</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition">
                  <Share2 className="w-5 h-5" />
                  <span>Compartir</span>
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* Características y especificaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Características */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Características
            </h2>
            <ul className="space-y-3">
              {/* {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))} */}
            </ul>
          </Card>

          {/* Especificaciones */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Especificaciones Técnicas
            </h2>
            <div className="space-y-4">
              {/* {product.specifications.map((spec, index) => (
                <div key={index} className="flex justify-between py-3 border-b last:border-b-0">
                  <span className="font-semibold text-gray-700">{spec.label}:</span>
                  <span className="text-gray-600">{spec.value}</span>
                </div>
              ))} */}
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;