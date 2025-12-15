import React from 'react';
import { Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const OrderStatus = ({ status, showIcon = true, size = 'md' }) => {

  const statusConfig = {
    'pendiente': {
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      label: 'Pendiente'
    },
    'en_produccion': {
      icon: Package,
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      label: 'En Producción'
    },
    'enviando': {
      icon: Truck,
      color: 'bg-purple-100 text-purple-800 border-purple-300',
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-600',
      label: 'En Camino'
    },
    'entregado': {
      icon: CheckCircle,
      color: 'bg-green-100 text-green-800 border-green-300',
      bgColor: 'bg-green-500',
      textColor: 'text-green-600',
      label: 'Entregado'
    },
    'cancelado': {
      icon: XCircle,
      color: 'bg-red-100 text-red-800 border-red-300',
      bgColor: 'bg-red-500',
      textColor: 'text-red-600',
      label: 'Cancelado'
    }
  };

  // Normalize status to lowercase with underscores
  const normalizedStatus = status?.toLowerCase().replace(/\s+/g, '_') || 'pendiente';
  const config = statusConfig[normalizedStatus] || statusConfig['pendiente'];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 font-semibold rounded-full border
      ${config.color} ${sizeClasses[size]}
    `}>
      {showIcon && <Icon className="w-4 h-4" />}
      {config.label}
    </span>
  );
};

// Componente de línea de tiempo de estados
export const OrderStatusTimeline = ({ currentStatus }) => {
  const statuses = [
    { key: 'pendiente', label: 'Pendiente', icon: Clock },
    { key: 'en_produccion', label: 'En Producción', icon: Package },
    { key: 'enviando', label: 'En Camino', icon: Truck },
    { key: 'entregado', label: 'Entregado', icon: CheckCircle }
  ];

  const statusConfig = {
    'pendiente': { color: 'bg-yellow-500', index: 0 },
    'en_produccion': { color: 'bg-blue-500', index: 1 },
    'enviando': { color: 'bg-purple-500', index: 2 },
    'entregado': { color: 'bg-green-500', index: 3 }
  };

  // Normalize status to lowercase with underscores
  const normalizedStatus = currentStatus?.toLowerCase().replace(/\s+/g, '_') || 'pendiente';
  const currentIndex = statusConfig[normalizedStatus]?.index ?? 0;

  return (
    <div className="py-6">
      <div className="relative">
        {/* Línea de fondo */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200"></div>
        
        {/* Línea de progreso */}
        <div 
          className="absolute top-5 left-0 h-1 bg-indigo-600 transition-all duration-500"
          style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
        ></div>

        {/* Estados */}
        <div className="relative flex justify-between">
          {statuses.map((status, index) => {
            const Icon = status.icon;
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={status.key} className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-4 border-white
                  transition-all duration-300 z-10
                  ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'}
                  ${isCurrent ? 'ring-4 ring-indigo-200 scale-110' : ''}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`
                  mt-2 text-xs font-medium text-center
                  ${isActive ? 'text-gray-900' : 'text-gray-500'}
                `}>
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderStatus