// ========================================
// ORDER SERVICE - order.service.js
// Para Cart CON RELACIONES (populate)
// ========================================

const Order = require('../models/Order.model');
const Cart = require('../models/Cart.model');
const CartItem = require('../models/CartItem.model');

class OrderService {
  async createOrder(userId, orderData) {


    // Obtener carrito del usuario CON populate
    const cart = await Cart.findOne({ usuario: userId }).populate({
      path: 'items',
      populate: { path: 'producto' }
    });

    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    if (!cart.items || cart.items.length === 0) {
      throw new Error('El carrito está vacío');
    }


    // Verificar stock y preparar items del pedido
    const orderItems = [];
    let total = 0;

    for (let i = 0; i < cart.items.length; i++) {
      const cartItem = cart.items[i];


      // Verificar que el producto existe
      if (!cartItem.producto) {
        throw new Error(`Item ${i + 1} no tiene producto asociado`);
      }

      const product = cartItem.producto;

      // Verificar stock disponible
      if (product.stock < cartItem.cantidad) {
        throw new Error(`Stock insuficiente para ${product.nombre}. Disponible: ${product.stock}, Solicitado: ${cartItem.cantidad}`);
      }


      // Crear item del pedido con snapshot de datos
      const orderItem = {
        productoId: product._id,
        nombreProducto: product.nombre,
        imagenProducto: product.imagen || '',
        cantidad: cartItem.cantidad,
        precio: cartItem.precio,
        subtotal: cartItem.subtotal
      };


      orderItems.push(orderItem);
      total += cartItem.subtotal;

      // Reducir stock del producto
      const previousStock = product.stock;
      product.stock -= cartItem.cantidad;

      if (product.stock === 0) {
        product.estado = 'agotado';
      }

      await product.save();
    }


    // Validar que orderData tenga direccionEnvio
    if (!orderData.direccionEnvio) {
      throw new Error('Falta información de dirección de envío');
    }

    if (!orderData.telefono) {
      throw new Error('Falta información de teléfono');
    }


    // Crear pedido con items embebidos
    const order = await Order.create({
      usuario: userId,
      items: orderItems,
      total: total,
      direccionEnvio: orderData.direccionEnvio,
      telefono: orderData.telefono,
      estado: 'pendiente'
    });


    // Limpiar carrito

    // Eliminar los CartItems de la base de datos
    await CartItem.deleteMany({ _id: { $in: cart.items.map(item => item._id) } });

    // Limpiar array de items y total del carrito
    cart.items = [];
    cart.total = 0;
    await cart.save();


    // Obtener información del usuario para incluirla en la respuesta
    const User = require('../models/User.model');
    const user = await User.findById(userId).select('nombre email');

    return {
      _id: order._id,
      usuario: user ? {
        _id: user._id,
        nombre: user.nombre,
        email: user.email
      } : null,
      items: order.items,
      total: order.total,
      estado: order.estado,
      direccionEnvio: order.direccionEnvio,
      telefono: order.telefono,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
  }

  async getOrders(userId, role) {

    let query = {};

    if (role === 'cliente') {
      query.usuario = userId;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });


    const User = require('../models/User.model');
    const userIds = [...new Set(orders.map(o => o.usuario.toString()))];
    const users = await User.find({ _id: { $in: userIds } }).select('nombre email');

    const userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = {
        _id: u._id,
        nombre: u.nombre,
        email: u.email
      };
    });

    const ordersWithUsers = orders.map(order => {
      const orderObj = order.toObject();
      return {
        ...orderObj,
        usuario: userMap[orderObj.usuario.toString()] || {
          _id: orderObj.usuario,
          nombre: 'Usuario no encontrado',
          email: ''
        }
      };
    });


    return ordersWithUsers;
  }

  async getOrderById(orderId, userId, role) {

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Pedido no encontrado');
    }


    if (role === 'cliente' && order.usuario.toString() !== userId.toString()) {
      throw new Error('No tienes permiso para ver este pedido');
    }

    const User = require('../models/User.model');
    const user = await User.findById(order.usuario).select('nombre email telefono');


    return {
      _id: order._id,
      usuario: user ? {
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono
      } : null,
      items: order.items,
      total: order.total,
      estado: order.estado,
      direccionEnvio: order.direccionEnvio,
      telefono: order.telefono,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
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


    const User = require('../models/User.model');
    const user = await User.findById(order.usuario).select('nombre email');

    return {
      _id: order._id,
      usuario: user ? {
        _id: user._id,
        nombre: user.nombre,
        email: user.email
      } : null,
      items: order.items,
      total: order.total,
      estado: order.estado,
      direccionEnvio: order.direccionEnvio,
      telefono: order.telefono,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
  }
}

module.exports = new OrderService();

