import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, CreditCard, Eye, ChevronRight } from 'lucide-react';
import Card from '../common/Card';
import OrderStatus from './OrderStatus';
import Button from '../common/Button';

const OrderCard = ({ order }) => {
  const { id, orderNumber, date, status, total, items } = order;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const totalItems = items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <Card hover className="transition-all">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-800">{orderNumber}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(date)}</span>
            </div>
          </div>
          <OrderStatus status={status} />
        </div>

        {/* Productos */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
          </p>
          
          {items && items.length > 0 && (
            <div className="space-y-1">
              {items.slice(0, 2).map((item, index) => (
                <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                  <span>{item.quantity}x {item.name}</span>
                </div>
              ))}
              {items.length > 2 && (
                <p className="text-sm text-gray-500 pl-4">
                  y {items.length - 2} producto{items.length - 2 !== 1 ? 's' : ''} más...
                </p>
              )}
            </div>
          )}
        </div>

        {/* Total y Acción */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-xl font-bold text-indigo-600">
                {formatPrice(total)}
              </p>
            </div>
          </div>

          <Link to={`/orders/${id}`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              Ver Detalles
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default OrderCard;