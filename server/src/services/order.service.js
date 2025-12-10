const Order = require('../models/Order.model');
const OrderItem = require('../models/OrderItem.model');
const Cart = require('../models/Cart.model');
const CartItem = require('../models/CartItem.model');
const Product = require('../models/Product.model');

class OrderService {
  async createOrder(userId, orderData) {
    // Obtener carrito del usuario
    const cart = await Cart.findOne({ usuario: userId }).populate({
      path: 'items',
      populate: { path: 'producto' }
    });

    if (!cart || cart.items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    // Verificar stock y crear items del pedido
    const orderItems = [];
    
    for (const cartItem of cart.items) {
      const product = cartItem.producto;
      
      // Verificar stock disponible
      if (product.stock < cartItem.cantidad) {
        throw new Error(`Stock insuficiente para ${product.nombre}`);
      }

      // Crear item del pedido
      const orderItem = await OrderItem.create({
        producto: product._id,
        cantidad: cartItem.cantidad,
        precio: cartItem.precio,
        subtotal: cartItem.subtotal,
        nombreProducto: product.nombre,
        imagenProducto: product.imagen
      });

      orderItems.push(orderItem._id);

      // Reducir stock del producto
      product.stock -= cartItem.cantidad;
      
      if (product.stock === 0) {
        product.estado = 'agotado';
      }
      
      await product.save();
    }

    // Crear pedido
    const order = await Order.create({
      usuario: userId,
      items: orderItems,
      total: cart.total,
      direccionEnvio: orderData.direccionEnvio,
      telefono: orderData.telefono,
      estado: 'pendiente'
    });

    // Limpiar carrito
    await CartItem.deleteMany({ _id: { $in: cart.items } });
    cart.items = [];
    cart.total = 0;
    await cart.save();

    return await Order.findById(order._id).populate({
      path: 'items',
      populate: { path: 'producto' }
    }).populate('usuario', 'nombre email');
  }

  async getOrders(userId, role) {
    let query = {};
    
    // Si es cliente, solo ver sus propios pedidos
    if (role === 'cliente') {
      query.usuario = userId;
    }
    // Si es admin, ver todos los pedidos

    return await Order.find(query)
      .populate('usuario', 'nombre email')
      .populate({
        path: 'items',
        populate: { path: 'producto' }
      })
      .sort({ createdAt: -1 });
  }

  async getOrderById(orderId, userId, role) {
    const order = await Order.findById(orderId)
      .populate('usuario', 'nombre email telefono')
      .populate({
        path: 'items',
        populate: { path: 'producto' }
      });

    if (!order) {
      throw new Error('Pedido no encontrado');
    }

    // Si es cliente, verificar que el pedido le pertenece
    if (role === 'cliente' && order.usuario._id.toString() !== userId) {
      throw new Error('No tienes permiso para ver este pedido');
    }

    return order;
  }

  async updateOrderStatus(orderId, newStatus) {
    const validTransitions = {
      'pendiente': ['en_produccion', 'cancelado'],
      'en_produccion': ['enviando', 'cancelado'],
      'enviando': ['entregado'],
      'entregado': [],
      'cancelado': []
    };

    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new Error('Pedido no encontrado');
    }

    const allowedStatuses = validTransitions[order.estado];
    
    if (!allowedStatuses.includes(newStatus)) {
      throw new Error(`No se puede cambiar de ${order.estado} a ${newStatus}`);
    }

    order.estado = newStatus;
    await order.save();

    return await Order.findById(orderId)
      .populate('usuario', 'nombre email')
      .populate({
        path: 'items',
        populate: { path: 'producto' }
      });
  }
}

module.exports = new OrderService();