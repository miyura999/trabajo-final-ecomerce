import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, ChevronDown, AlertCircle, RefreshCw } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import OrderStatus from '../../components/orders/OrderStatus';
import { ORDER_STATUS_LIST } from '../../utils/constants';
import { formatPrice, formatDate } from '../../utils/formatters';
import orderService from '../../services/order.service';

const ManageOrdersPage = () => {
  // ==================== ESTADO ====================
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Modal de cambio de estado
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // ==================== MAPEO DE ESTADOS ====================
  const statusMap = {
    'pendiente': 'Pendiente',
    'en_produccion': 'En Producción',
    'enviando': 'Enviando',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado'
  };

  const reverseStatusMap = {
    'Pendiente': 'pendiente',
    'En Producción': 'en_produccion',
    'Enviando': 'enviando',
    'Entregado': 'entregado',
    'Cancelado': 'cancelado'
  };

  const statusFlowMap = {
    'Pendiente': ['En Producción', 'Cancelado'],
    'En Producción': ['Enviando', 'Cancelado'],
    'Enviando': ['Entregado'],
    'Entregado': [],
    'Cancelado': []
  };

  // ==================== EFECTOS ====================
  useEffect(() => {
    fetchOrders();
  }, []);

  // ==================== FUNCIONES DE API ====================
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await orderService.getOrders();
      
      // Transformar datos del backend al formato del frontend
      const transformedOrders = response.data.map(order => ({
        id: order._id,
        orderNumber: `ORD-${new Date(order.createdAt).getFullYear()}-${order._id.slice(-6).toUpperCase()}`,
        customer: order.usuario?.nombre || 'Usuario desconocido',
        customerEmail: order.usuario?.email || '',
        date: order.createdAt,
        status: statusMap[order.estado] || order.estado,
        backendStatus: order.estado,
        total: order.total,
        items: order.items?.length || 0,
        direccionEnvio: order.direccionEnvio,
        telefono: order.telefono,
        rawOrder: order
      }));

      setOrders(transformedOrders);
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      setError(err.message || 'Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || newStatus === selectedOrder.status) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setError(null);

      const backendStatus = reverseStatusMap[newStatus];
      await orderService.updateOrderStatus(selectedOrder.id, backendStatus);

      // Actualizar la lista local
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === selectedOrder.id
            ? { ...order, status: newStatus, backendStatus }
            : order
        )
      );

      closeModal();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      setError(err.message || 'Error al actualizar el estado del pedido');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ==================== HANDLERS ====================
  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const closeModal = () => {
    setShowStatusModal(false);
    setSelectedOrder(null);
    setNewStatus('');
  };

  const handleViewDetails = (orderId) => {
    window.location.href = `/admin/orders/${orderId}`;
  };

  // ==================== FILTROS Y BÚSQUEDA ====================
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // ==================== ESTADÍSTICAS ====================
  const stats = {
    total: orders.length,
    pendientes: orders.filter(o => o.status === 'Pendiente').length,
    enProceso: orders.filter(o => 
      o.status === 'En Producción' || o.status === 'Enviando'
    ).length,
    completados: orders.filter(o => o.status === 'Entregado').length
  };

  // ==================== RENDER: LOADING ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando pedidos...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== RENDER: PRINCIPAL ====================
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <div className="container mx-auto px-6 py-8">
          {/* ========== HEADER ========== */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Gestión de Pedidos
              </h1>
              <p className="text-gray-600">
                Administra y actualiza el estado de los pedidos
              </p>
            </div>
            <Button
              variant="outline"
              onClick={fetchOrders}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Recargar
            </Button>
          </div>

          {/* ========== MENSAJE DE ERROR ========== */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* ========== ESTADÍSTICAS ========== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Pedidos</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <span className="text-3xl">📦</span>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendientes}</p>
                </div>
                <span className="text-3xl">⏳</span>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">En Proceso</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.enProceso}</p>
                </div>
                <span className="text-3xl">🚚</span>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Completados</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completados}</p>
                </div>
                <span className="text-3xl">✅</span>
              </div>
            </Card>
          </div>

          {/* ========== BÚSQUEDA Y FILTROS ========== */}
          <Card className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por número de orden, cliente o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Todos los estados</option>
                  {ORDER_STATUS_LIST.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* ========== TABLA DE PEDIDOS ========== */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Pedido
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Cliente
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Fecha
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Estado
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {order.orderNumber}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.items} producto(s)
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div>
                          <p className="text-gray-900">{order.customer}</p>
                          <p className="text-sm text-gray-500">{order.customerEmail}</p>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <p className="text-gray-600">
                          {formatDate(order.date, 'numeric')}
                        </p>
                      </td>

                      <td className="py-4 px-4">
                        <OrderStatus status={order.status} size="sm" />
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(order.total)}
                        </p>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openStatusModal(order)}
                            disabled={
                              order.status === 'Entregado' || 
                              order.status === 'Cancelado'
                            }
                            className={`
                              px-3 py-1.5 text-sm rounded-lg transition flex items-center gap-1
                              ${order.status === 'Entregado' || order.status === 'Cancelado'
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                              }
                            `}
                          >
                            Cambiar Estado
                            <ChevronDown className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleViewDetails(order.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Ver detalles"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Sin resultados */}
              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {searchTerm || filterStatus 
                      ? 'No se encontraron pedidos con los filtros aplicados' 
                      : 'No hay pedidos registrados'}
                  </p>
                  {(searchTerm || filterStatus) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('');
                      }}
                      className="mt-2 text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer con contador */}
            {filteredOrders.length > 0 && (
              <div className="flex items-center justify-between pt-6 border-t">
                <p className="text-sm text-gray-600">
                  Mostrando {filteredOrders.length} de {orders.length} pedidos
                </p>
              </div>
            )}
          </Card>
        </div>

        <Footer />
      </div>

      {/* ========== MODAL DE CAMBIO DE ESTADO ========== */}
      <Modal
        isOpen={showStatusModal}
        onClose={!updatingStatus ? closeModal : undefined}
        title="Cambiar Estado del Pedido"
        size="sm"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pedido</p>
              <p className="font-semibold text-gray-900">
                {selectedOrder.orderNumber}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Cliente</p>
              <p className="font-semibold text-gray-900">
                {selectedOrder.customer}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Estado Actual</p>
              <OrderStatus status={selectedOrder.status} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nuevo Estado
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                disabled={updatingStatus}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              >
                <option value={selectedOrder.status}>
                  {selectedOrder.status}
                </option>
                {statusFlowMap[selectedOrder.status]?.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="primary"
                fullWidth
                onClick={handleUpdateStatus}
                disabled={newStatus === selectedOrder.status || updatingStatus}
              >
                {updatingStatus ? 'Actualizando...' : 'Actualizar Estado'}
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={closeModal}
                disabled={updatingStatus}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageOrdersPage;