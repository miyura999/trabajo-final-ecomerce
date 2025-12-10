import React from 'react';
import OrderCard from './OrderCard';
import { ShoppingBag } from 'lucide-react';

const OrderList = ({ orders, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                  <div className="h-3 bg-gray-300 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-300 rounded w-24"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded w-full"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="h-8 bg-gray-300 rounded w-24"></div>
                <div className="h-10 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-indigo-100 rounded-full p-6 mb-4">
          <ShoppingBag className="w-16 h-16 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          No tienes pedidos aún
        </h3>
        <p className="text-gray-600 mb-6">
          Comienza a comprar y tus pedidos aparecerán aquí
        </p>
        <a
          href="/products"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Explorar Productos
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrderList;