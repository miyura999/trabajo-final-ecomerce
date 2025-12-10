import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, Package, Truck, CreditCard } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { OrderStatusTimeline } from '../../components/orders/OrderStatus';
import { useOrders } from '../../hooks/useOrders';
import { formatPrice, formatDate } from '../../utils/formatters';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de pedido
    setTimeout(() => {
      const mockOrder = {
        id: parseInt(id),
        orderNumber: 'ORD-2025-001',
        date: '2025-12-01',
        status: 'En Producción',
        total: 2999000,
        subtotal: 2999000,
        shipping: 0,
        tax: 570810,
        items: [
          {
            id: 1,
            name: 'Laptop Gaming Pro X1',
            price: 2999000,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300'
          }
        ],
        shippingAddress: {
          name: 'Juan Pérez',
          address: 'Calle 10 #20-30',
          city: 'Medellín',
          state: 'Antioquia',
          zipCode: '050001',
          phone: '3001234567'
        },
        paymentMethod: 'Tarjeta de Crédito',
        trackingNumber: 'TRK123456789',
        estimatedDelivery: '2025-12-10'
      };
      setOrder(mockOrder);
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
            <div className="h-96 bg-gray-300 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>Pedido no encontrado</p>
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
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a Mis Pedidos
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Pedido {order.orderNumber}
              </h1>
              <p className="text-gray-600">
                Realizado el {formatDate(order.date)}
              </p>
            </div>
            
            <Button variant="outline">
              Descargar Factura
            </Button>
          </div>
        </div>

        {/* Timeline de estado */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Estado del Pedido
          </h2>
          <OrderStatusTimeline currentStatus={order.status} />
          
          {order.trackingNumber && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">
                    Número de rastreo: {order.trackingNumber}
                  </p>
                  <p className="text-sm text-blue-700">
                    Entrega estimada: {formatDate(order.estimatedDelivery)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Productos y detalles */}
          <div className="lg:col-span-2 space-y-6">
            {/* Productos */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6" />
                Productos
              </h2>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Cantidad: {item.quantity}
                      </p>
                      <p className="text-lg font-bold text-indigo-600">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Dirección de envío */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                Dirección de Envío
              </h2>
              
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    {order.shippingAddress.name}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.address}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                  <p className="text-gray-600">
                    {order.shippingAddress.zipCode}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600 pt-3 border-t">
                  <Phone className="w-4 h-4" />
                  <span>{order.shippingAddress.phone}</span>
                </div>
              </div>
            </Card>

            {/* Método de pago */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                Método de Pago
              </h2>
              
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 rounded-lg p-3">
                  <span className="text-2xl">💳</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {order.paymentMethod}
                  </p>
                  <p className="text-sm text-gray-600">
                    Transacción completada
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Resumen
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="font-semibold">
                    {order.shipping === 0 ? (
                      <span className="text-green-600">¡Gratis!</span>
                    ) : (
                      formatPrice(order.shipping)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>IVA (19%)</span>
                  <span className="font-semibold">
                    {formatPrice(order.tax)}
                  </span>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-indigo-600">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Acciones */}
              <div className="mt-6 space-y-3">
                <Button variant="primary" fullWidth>
                  Rastrear Pedido
                </Button>
                <Button variant="outline" fullWidth>
                  Contactar Soporte
                </Button>
              </div>
              
              {/* Ayuda */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  ¿Necesitas ayuda?
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>soporte@techstore.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>+57 300 123 4567</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetailPage;