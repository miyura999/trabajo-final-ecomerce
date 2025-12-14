import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, Package, Truck, CreditCard, AlertCircle } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { OrderStatusTimeline } from '../../components/orders/OrderStatus';
import { formatPrice, formatDate } from '../../utils/formatters';
import axios from 'axios';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ==================== ESTADO ====================
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==================== MAPEO DE ESTADOS ====================
  const statusMap = {
    'pendiente': 'Pendiente',
    'en_produccion': 'En Producción',
    'enviando': 'Enviando',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado'
  };

  // ==================== FUNCIONES DE API ====================
  const fetchOrderDetail = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`/orders/${id}`);
      const orderData = response.data.data;

      // Transformar datos del backend al formato del frontend
      const transformedOrder = {
        id: orderData._id,
        orderNumber: `ORD-${new Date(orderData.createdAt).getFullYear()}-${orderData._id.slice(-6).toUpperCase()}`,
        date: orderData.createdAt,
        status: statusMap[orderData.estado] || orderData.estado,
        backendStatus: orderData.estado,
        
        // Items del pedido
        items: orderData.items.map(item => ({
          id: item.productoId,
          name: item.nombreProducto,
          price: item.precio,
          quantity: item.cantidad,
          subtotal: item.subtotal,
          image: item.imagenProducto || 'https://via.placeholder.com/300'
        })),
        
        // Totales
        subtotal: orderData.total, // El total ya incluye todo
        shipping: 0, // Envío gratis
        tax: Math.round(orderData.total * 0.19), // IVA 19%
        total: orderData.total,
        
        // Información del usuario
        customer: {
          id: orderData.usuario?._id,
          name: orderData.usuario?.nombre || 'Usuario',
          email: orderData.usuario?.email || '',
          phone: orderData.usuario?.telefono || orderData.telefono
        },
        
        // Dirección de envío
        shippingAddress: {
          name: orderData.usuario?.nombre || 'Usuario',
          address: orderData.direccionEnvio?.calle || '',
          city: orderData.direccionEnvio?.ciudad || '',
          state: orderData.direccionEnvio?.pais || '',
          zipCode: orderData.direccionEnvio?.codigoPostal || '',
          phone: orderData.telefono
        },
        
        // Información adicional
        paymentMethod: 'Tarjeta de Crédito', // Por defecto
        trackingNumber: orderData.estado === 'enviando' || orderData.estado === 'entregado' 
          ? `TRK${orderData._id.slice(-9).toUpperCase()}` 
          : null,
        estimatedDelivery: orderData.estado === 'enviando' 
          ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() 
          : null,
        
        // Datos originales
        rawOrder: orderData
      };

      setOrder(transformedOrder);
    } catch (err) {
      console.error('Error al cargar detalle de orden:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar el pedido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]); // ← Dependencia: se recrea cuando cambia el ID

  // ==================== EFECTOS ====================
  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]); // ← Ejecutar cuando cambie fetchOrderDetail

  // ==================== RENDER: LOADING ====================
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

  // ==================== RENDER: ERROR ====================
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
          </div>
          
          <Card>
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Error al cargar el pedido
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={fetchOrderDetail}>
                Intentar de nuevo
              </Button>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // ==================== RENDER: SIN ORDEN ====================
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Pedido no encontrado
              </h2>
              <p className="text-gray-600 mb-6">
                No se pudo encontrar el pedido solicitado
              </p>
              <Button onClick={() => navigate(-1)}>
                Volver
              </Button>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // ==================== RENDER: PRINCIPAL ====================
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* ========== HEADER ========== */}
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
                Realizado el {formatDate(order.date, 'long')}
              </p>
            </div>
            
            <Button variant="outline" onClick={() => window.print()}>
              Descargar Factura
            </Button>
          </div>
        </div>

        {/* ========== TIMELINE DE ESTADO ========== */}
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
                  {order.estimatedDelivery && (
                    <p className="text-sm text-blue-700">
                      Entrega estimada: {formatDate(order.estimatedDelivery, 'long')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ========== COLUMNA IZQUIERDA: PRODUCTOS Y DETALLES ========== */}
          <div className="lg:col-span-2 space-y-6">
            {/* Productos */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6" />
                Productos ({order.items.length})
              </h2>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300?text=Producto';
                        }}
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
                        {formatPrice(item.price)} c/u
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(item.subtotal)}
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
                  {order.shippingAddress.address && (
                    <p className="text-gray-600">
                      {order.shippingAddress.address}
                    </p>
                  )}
                  <p className="text-gray-600">
                    {order.shippingAddress.city}
                    {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                  </p>
                  {order.shippingAddress.zipCode && (
                    <p className="text-gray-600">
                      {order.shippingAddress.zipCode}
                    </p>
                  )}
                </div>
                
                {order.shippingAddress.phone && (
                  <div className="flex items-center gap-2 text-gray-600 pt-3 border-t">
                    <Phone className="w-4 h-4" />
                    <span>{order.shippingAddress.phone}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Información del cliente */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Mail className="w-6 h-6" />
                Información del Cliente
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{order.customer.email}</span>
                </div>
                {order.customer.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{order.customer.phone}</span>
                  </div>
                )}
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

          {/* ========== COLUMNA DERECHA: RESUMEN ========== */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Resumen del Pedido
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    {formatPrice(order.items.reduce((sum, item) => sum + item.subtotal, 0))}
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
                {order.trackingNumber && (
                  <Button variant="primary" fullWidth>
                    Rastrear Pedido
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  fullWidth
                  onClick={() => window.location.href = 'mailto:soporte@techstore.com'}
                >
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
                    <a 
                      href="mailto:soporte@techstore.com"
                      className="hover:text-indigo-600 transition"
                    >
                      soporte@techstore.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <a 
                      href="tel:+573001234567"
                      className="hover:text-indigo-600 transition"
                    >
                      +57 300 123 4567
                    </a>
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