import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Loader } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import OrderCard from '../../components/orders/OrderCard';
import Button from '../../components/common/Button';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/orders');
      
      if (response.data.success) {
        // Transformar datos del backend al formato del frontend
        const transformedOrders = response.data.data.map(order => ({
          id: order._id,
          orderNumber: `#${order._id.slice(-8).toUpperCase()}`,
          date: order.createdAt,
          status: order.estado,
          total: order.total,
          items: order.items.map(item => ({
            name: item.nombreProducto,
            quantity: item.cantidad,
            price: item.precio,
            image: item.imagenProducto
          })),
          direccionEnvio: order.direccionEnvio,
          telefono: order.telefono
        }));
        
        setOrders(transformedOrders);
        console.log('✅ Órdenes cargadas:', transformedOrders.length);
      }
    } catch (error) {
      console.error('❌ Error al cargar órdenes:', error);
      setError(error.response?.data?.message || 'Error al cargar las órdenes');
      
      toast.error('No se pudieron cargar las órdenes', {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center">
            <Loader className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-600">Cargando tus pedidos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="bg-red-100 rounded-full p-6 mb-6">
              <Package className="w-16 h-16 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Error al cargar pedidos
            </h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <Button
              variant="primary"
              onClick={fetchOrders}
            >
              Reintentar
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Sin órdenes
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="bg-indigo-100 rounded-full p-6 mb-6">
              <ShoppingBag className="w-16 h-16 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              No tienes pedidos aún
            </h2>
            <p className="text-gray-600 mb-8">
              Cuando realices tu primera compra, aparecerá aquí
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

  // Lista de órdenes
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mis Pedidos
          </h1>
          <p className="text-gray-600">
            Tienes {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
          </p>
        </div>

        {/* Filtros y ordenamiento (opcional) */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-gray-700">
                Historial de Pedidos
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchOrders}
            >
              Actualizar
            </Button>
          </div>
        </div>

        {/* Grid de órdenes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrdersPage;