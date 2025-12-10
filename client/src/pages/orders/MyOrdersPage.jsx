import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import OrderList from '../../components/orders/OrderList';
import { useOrders } from '../../hooks/useOrders';
import { ORDER_STATUS_LIST } from '../../utils/constants';

const MyOrdersPage = () => {
  const { orders, loading } = useOrders();
  const [selectedStatus, setSelectedStatus] = useState('');

  const filteredOrders = selectedStatus
    ? orders.filter(order => order.status === selectedStatus)
    : orders;

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
            Revisa el estado de tus pedidos y su historial
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Filter className="w-5 h-5" />
              <span className="font-semibold">Filtrar por estado:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedStatus('')}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all
                  ${selectedStatus === ''
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                Todos
              </button>
              
              {ORDER_STATUS_LIST.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all
                    ${selectedStatus === status.value
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Pedidos</p>
                <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <div className="bg-indigo-100 rounded-full p-3">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {orders.filter(o => o.status === 'Pendiente').length}
                </p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">En Camino</p>
                <p className="text-3xl font-bold text-purple-600">
                  {orders.filter(o => o.status === 'Enviando').length}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <span className="text-2xl">🚚</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Entregados</p>
                <p className="text-3xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'Entregado').length}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de pedidos */}
        <OrderList orders={filteredOrders} loading={loading} />
      </div>

      <Footer />
    </div>
  );
};

export default MyOrdersPage;