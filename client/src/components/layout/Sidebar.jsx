import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, BarChart3 } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin',
      icon: LayoutDashboard,
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/admin/products',
      icon: Package,
      label: 'Productos'
    },
    {
      path: '/admin/orders',
      icon: ShoppingCart,
      label: 'Pedidos'
    },
    {
      path: '/admin/users',
      icon: Users,
      label: 'Usuarios'
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white shadow-lg h-screen flex flex-col overflow-hidden">


      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Panel Admin</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${active 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Información adicional */}
      <div className="px-6 py-4 border-t">
        <div className="bg-indigo-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-indigo-900 mb-2">
            Ayuda & Soporte
          </h3>
          <p className="text-xs text-indigo-700 mb-3">
            ¿Necesitas ayuda? Consulta nuestra documentación.
          </p>
          <button className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition w-full">
            Ver Documentación
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;