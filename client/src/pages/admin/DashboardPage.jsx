import React from 'react';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import { formatPrice } from '../../utils/formatters';

const DashboardPage = () => {
  // Datos mock para el dashboard
  const stats = {
    totalSales: 45680000,
    totalOrders: 324,
    totalProducts: 156,
    totalUsers: 1248,
    salesGrowth: 12.5,
    ordersGrowth: 8.3,
    productsGrowth: -2.1,
    usersGrowth: 15.7
  };

  const recentOrders = [
    { id: 1, customer: 'Juan Pérez', amount: 2999000, status: 'Pendiente', date: '2025-12-09' },
    { id: 2, customer: 'María García', amount: 1299000, status: 'En Producción', date: '2025-12-09' },
    { id: 3, customer: 'Carlos López', amount: 599000, status: 'Enviando', date: '2025-12-08' },
    { id: 4, customer: 'Ana Martínez', amount: 4899000, status: 'Entregado', date: '2025-12-08' },
    { id: 5, customer: 'Luis Rodríguez', amount: 299000, status: 'Pendiente', date: '2025-12-07' }
  ];

  const topProducts = [
    { id: 1, name: 'Laptop Gaming Pro X1', sales: 45, revenue: 134955000, stock: 15 },
    { id: 2, name: 'iPhone 15 Pro Max', sales: 32, revenue: 156768000, stock: 8 },
    { id: 3, name: 'Monitor 27" 4K', sales: 28, revenue: 36372000, stock: 12 },
    { id: 4, name: 'Audífonos Bluetooth', sales: 56, revenue: 33544000, stock: 25 },
    { id: 5, name: 'Teclado Mecánico RGB', sales: 67, revenue: 20033000, stock: 30 }
  ];

  const StatCard = ({ title, value, icon: Icon, growth, iconBg, iconColor }) => (
    <Card hover>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {growth !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(growth)}% vs mes anterior</span>
            </div>
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
              growth={stats.salesGrowth}
              iconBg="bg-green-100"
              iconColor="text-green-600"
            />
            <StatCard
              title="Pedidos"
              value={stats.totalOrders}
              icon={ShoppingCart}
              growth={stats.ordersGrowth}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
            <StatCard
              title="Productos"
              value={stats.totalProducts}
              icon={Package}
              growth={stats.productsGrowth}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
            />
            <StatCard
              title="Usuarios"
              value={stats.totalUsers}
              icon={Users}
              growth={stats.usersGrowth}
              iconBg="bg-indigo-100"
              iconColor="text-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pedidos Recientes */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Pedidos Recientes
                </h2>
                <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1">
                  Ver todos
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {order.customer}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900">
                        {formatPrice(order.amount)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Productos Más Vendidos */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Productos Más Vendidos
                </h2>
                <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-1">
                  Ver todos
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-4 py-3 border-b last:border-b-0">
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full font-bold text-indigo-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.sales} ventas • Stock: {product.stock}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatPrice(product.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Gráficos y análisis adicionales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ventas por Categoría
              </h3>
              <div className="space-y-3">
                {[
                  { category: 'Laptops', percentage: 35, amount: 15988000 },
                  { category: 'Smartphones', percentage: 28, amount: 12790000 },
                  { category: 'Accesorios', percentage: 20, amount: 9136000 },
                  { category: 'Audio', percentage: 17, amount: 7766000 }
                ].map((item) => (
                  <div key={item.category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{item.category}</span>
                      <span className="font-semibold text-gray-900">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Estado de Pedidos
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-700">Pendientes</span>
                  </div>
                  <span className="font-bold text-gray-900">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">En Producción</span>
                  </div>
                  <span className="font-bold text-gray-900">78</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">Enviando</span>
                  </div>
                  <span className="font-bold text-gray-900">123</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Entregados</span>
                  </div>
                  <span className="font-bold text-gray-900">1056</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Inventario Bajo
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'iPhone 15 Pro Max', stock: 8 },
                  { name: 'Tablet Pro 12.9"', stock: 10 },
                  { name: 'Monitor 27" 4K', stock: 12 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded">
                      {item.stock} unidades
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardPage;