import { useState, useEffect } from 'react';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simular carga de pedidos
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // Simulación de datos
      const mockOrders = [
        {
          id: 1,
          orderNumber: 'ORD-2025-001',
          date: '2025-12-01',
          status: 'Entregado',
          total: 1299.99,
          items: [
            { id: 1, name: 'Laptop Gaming', quantity: 1, price: 1299.99 }
          ]
        },
        {
          id: 2,
          orderNumber: 'ORD-2025-002',
          date: '2025-12-05',
          status: 'En Producción',
          total: 599.99,
          items: [
            { id: 2, name: 'Mouse Inalámbrico', quantity: 2, price: 299.99 }
          ]
        }
      ];
      setOrders(mockOrders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === parseInt(orderId));
  };

  const createOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      orderNumber: `ORD-2025-${String(orders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pendiente',
      ...orderData
    };
    setOrders([...orders, newOrder]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus }
        : order
    ));
  };

  const filterOrdersByStatus = (status) => {
    if (!status) return orders;
    return orders.filter(order => order.status === status);
  };

  return {
    orders,
    loading,
    error,
    loadOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    filterOrdersByStatus
  };
};