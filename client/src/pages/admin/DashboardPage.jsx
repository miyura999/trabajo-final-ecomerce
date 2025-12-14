import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import { formatPrice } from '../../utils/formatters';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    averageSale: 0,
    maxSale: 0,
    minSale: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/users/stats');
      
      if (response.data.success) {
        const data = response.data.message;
        const orderStats = data.orderStats[0] || {};
        
        setStats({
          totalSales: orderStats.totalVentas || 0,
          totalOrders: orderStats.numeroPedidos || 0,
          totalProducts: data.products || 0,
          totalUsers: data.users || 0,
          averageSale: orderStats.ventaPromedio || 0,
          maxSale: orderStats.ventaMaxima || 0,
          minSale: orderStats.ventaMinima || 0
        });
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      toast.error('Error al cargar las estadísticas', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, iconBg, iconColor, isLoading }) => (
    <Card hover>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          {isLoading ? (
            <div className="h-9 bg-gray-200 rounded animate-pulse mb-2 w-32"></div>
          ) : (
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          )}
        </div>
        <div className={`${iconBg} rounded-full p-4`}>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );

  const getStatusColor = (status) => {
    const colors = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'En Producción': 'bg-blue-100 text-blue-800',
      'Enviando': 'bg-purple-100 text-purple-800',
      'Entregado': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
              Dashboard
            </h1>
            <p className="text-gray-600">
              Bienvenido al panel de administración
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Ventas Totales"
              value={formatPrice(stats.totalSales)}
              icon={DollarSign}
              iconBg="bg-green-100"
              iconColor="text-green-600"
              isLoading={loading}
            />
            <StatCard
              title="Pedidos"
              value={stats.totalOrders}
              icon={ShoppingCart}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
              isLoading={loading}
            />
            <StatCard
              title="Productos"
              value={stats.totalProducts}
              icon={Package}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
              isLoading={loading}
            />
            <StatCard
              title="Usuarios"
              value={stats.totalUsers}
              icon={Users}
              iconBg="bg-indigo-100"
              iconColor="text-indigo-600"
              isLoading={loading}
            />
          </div>

          {/* Tarjetas adicionales con más estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-gray-600 text-sm mb-1">Venta Promedio</p>
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse mx-auto w-32"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(stats.averageSale)}
                  </p>
                )}
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <ArrowUpRight className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-gray-600 text-sm mb-1">Venta Máxima</p>
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse mx-auto w-32"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(stats.maxSale)}
                  </p>
                )}
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-3">
                  <TrendingDown className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-gray-600 text-sm mb-1">Venta Mínima</p>
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse mx-auto w-32"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(stats.minSale)}
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;