import React, { useState } from 'react';
import { Search, Filter, Eye, ChevronDown } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import OrderStatus from '../../components/orders/OrderStatus';
import { ORDER_STATUS_LIST } from '../../utils/constants';
import { formatPrice, formatDate } from '../../utils/formatters';

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: 'ORD-2025-001',
      customer: 'Juan Pérez',
      date: '2025-12-09',
      status: 'Pendiente',
      total: 2999000,
      items: 1
    },
    {
      id: 2,
      orderNumber: 'ORD-2025-002',
      customer: 'María García',
      date: '2025-12-09',
      status: 'En Producción',
      total: 1299000,
      items: 2
    },
    {
      id: 3,
      orderNumber: 'ORD-2025-003',
      customer: 'Carlos López',
      date: '2025-12-08',
      status: 'Enviando',
      total: 599000,
      items: 1
    },
    {
      id: 4,
      orderNumber: 'ORD-2025-004',
      customer: 'Ana Martínez',
      date: '2025-12-08',
      status: 'Entregado',
      total: 4899000,
      items: 3
    },
    {
      id: 5,
      orderNumber: 'ORD-2025-005',
      customer: 'Luis Rodríguez',
      date: '2025-12-07',
      status: 'Pendiente',
      total: 299000,
      items: 1
    },
    {
      id: 6,
      orderNumber: 'ORD-2025-006',
      customer: 'Patricia Sánchez',
      date: '2025-12-07',
      status: 'En Producción',
      total: 1899000,
      items: 2
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleChangeStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const confirmStatusChange = () => {
    setOrders(orders.map(order =>
      order.id === selectedOrder.id
        ? { ...order, status: newStatus }
        : order
    ));
    setShowStatusModal(false);
    setSelectedOrder(null);
  };

  const getStatusOptions = (currentStatus) => {
    const statusFlow = {
      'Pendiente': ['En Producción', 'Cancelado'],
      'En Producción': ['Enviando', 'Cancelado'],
      'Enviando': ['Entregado'],
      'Entregado': [],
      'Cancelado': []
    };
    return statusFlow[currentStatus] || [];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1">
        <Header />
        
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Gestión de Pedidos
            </h1>
            <p className="text-gray-600">
              Administra y actualiza el estado de los pedidos
            </p>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Pedidos</p>
                  <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
                </div>
                <span className="text-3xl">📦</span>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {orders.filter(o => o.status === 'Pendiente').length}
                  </p>
                </div>
                <span className="text-3xl">⏳</span>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">En Proceso</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {orders.filter(o => o.status === 'En Producción' || o.status === 'Enviando').length}
                  </p>
                </div>
                <span className="text-3xl">🚚</span>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Completados</p>
                  <p className="text-3xl font-bold text-green-600">
                    {orders.filter(o => o.status === 'Entregado').length}
                  </p>
                </div>
                <span className="text-3xl">✅</span>
              </div>
            </Card>
          </div>

          {/* Barra de búsqueda y filtros */}
          <Card className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por número de orden o cliente..."
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

          {/* Tabla de pedidos */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Pedido</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Cliente</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Fecha</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Estado</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Total</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                          <p className="text-sm text-gray-500">{order.items} producto(s)</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-900">{order.customer}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-600">{formatDate(order.date, 'numeric')}</p>
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
                            onClick={() => handleChangeStatus(order)}
                            className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-1"
                          >
                            Cambiar Estado
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
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

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No se encontraron pedidos</p>
                </div>
              )}
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between pt-6 border-t">
              <p className="text-sm text-gray-600">
                Mostrando {filteredOrders.length} de {orders.length} pedidos
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Anterior</Button>
                <Button variant="outline" size="sm">Siguiente</Button>
              </div>
            </div>
          </Card>
        </div>

        <Footer />
      </div>

      {/* Modal de cambio de estado */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Cambiar Estado del Pedido"
        size="sm"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pedido</p>
              <p className="font-semibold text-gray-900">{selectedOrder.orderNumber}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Cliente</p>
              <p className="font-semibold text-gray-900">{selectedOrder.customer}</p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={selectedOrder.status}>{selectedOrder.status}</option>
                {getStatusOptions(selectedOrder.status).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="primary"
                fullWidth
                onClick={confirmStatusChange}
                disabled={newStatus === selectedOrder.status}
              >
                Actualizar Estado
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowStatusModal(false)}
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