// ========================================
// ORDER SERVICE - order.service.js
// Para Cart CON RELACIONES (populate)
// ========================================

const Order = require('../models/Order.model');
const Cart = require('../models/Cart.model');
const CartItem = require('../models/CartItem.model');
const Product = require('../models/Product.model');

class OrderService {
  async createOrder(userId, orderData) {
    console.log('====================================');
    console.log('📦 CREAR ORDEN - INICIO');
    console.log('Usuario:', userId);
    console.log('Datos recibidos:', JSON.stringify(orderData, null, 2));
    console.log('====================================');

    // Obtener carrito del usuario CON populate
    const cart = await Cart.findOne({ usuario: userId }).populate({
      path: 'items',
      populate: { path: 'producto' }
    });

    if (!cart) {
      console.log('❌ Carrito no encontrado');
      throw new Error('Carrito no encontrado');
    }

    if (!cart.items || cart.items.length === 0) {
      console.log('❌ Carrito vacío');
      throw new Error('El carrito está vacío');
    }

    console.log(`✅ Carrito encontrado con ${cart.items.length} items`);

    // Verificar stock y preparar items del pedido
    const orderItems = [];
    let total = 0;

    for (let i = 0; i < cart.items.length; i++) {
      const cartItem = cart.items[i];
      
      console.log(`\n🔍 PROCESANDO ITEM ${i + 1}:`);
      console.log('   CartItem ID:', cartItem._id);
      console.log('   Producto:', cartItem.producto?.nombre);
      console.log('   Cantidad:', cartItem.cantidad);

      // Verificar que el producto existe
      if (!cartItem.producto) {
        console.log('❌ CartItem no tiene producto asociado');
        throw new Error(`Item ${i + 1} no tiene producto asociado`);
      }

      const product = cartItem.producto;

      // Verificar stock disponible
      if (product.stock < cartItem.cantidad) {
        console.log(`❌ Stock insuficiente para ${product.nombre}`);
        throw new Error(`Stock insuficiente para ${product.nombre}. Disponible: ${product.stock}, Solicitado: ${cartItem.cantidad}`);
      }

      console.log(`✅ ${product.nombre} - Stock OK (${product.stock} disponibles)`);

      // Crear item del pedido con snapshot de datos
      const orderItem = {
        productoId: product._id,
        nombreProducto: product.nombre,
        imagenProducto: product.imagen || '',
        cantidad: cartItem.cantidad,
        precio: cartItem.precio,
        subtotal: cartItem.subtotal
      };

      console.log('📦 OrderItem creado:', orderItem.nombreProducto);

      orderItems.push(orderItem);
      total += cartItem.subtotal;

      // Reducir stock del producto
      const previousStock = product.stock;
      product.stock -= cartItem.cantidad;
      
      if (product.stock === 0) {
        product.estado = 'agotado';
      }
      
      await product.save();
      console.log(`📉 Stock actualizado: ${previousStock} → ${product.stock}`);
    }

    console.log('\n💰 Total calculado: $', total);
    console.log('📦 Total de items en orden:', orderItems.length);

    // Validar que orderData tenga direccionEnvio
    if (!orderData.direccionEnvio) {
      console.log('❌ Falta direccionEnvio');
      throw new Error('Falta información de dirección de envío');
    }

    if (!orderData.telefono) {
      console.log('❌ Falta teléfono');
      throw new Error('Falta información de teléfono');
    }

    console.log('\n📝 Creando orden en la base de datos...');

    // Crear pedido con items embebidos
    const order = await Order.create({
      usuario: userId,
      items: orderItems,
      total: total,
      direccionEnvio: orderData.direccionEnvio,
      telefono: orderData.telefono,
      estado: 'pendiente'
    });

    console.log('✅ Orden creada exitosamente:', order._id);

    // Limpiar carrito
    console.log('\n🧹 Limpiando carrito...');
    
    // Eliminar los CartItems de la base de datos
    await CartItem.deleteMany({ _id: { $in: cart.items.map(item => item._id) } });
    console.log(`✅ ${cart.items.length} CartItems eliminados de la BD`);
    
    // Limpiar array de items y total del carrito
    cart.items = [];
    cart.total = 0;
    await cart.save();

    console.log('✅ Carrito limpiado');
    console.log('====================================\n');

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
    console.log('====================================');
    console.log('📋 OBTENER ÓRDENES');
    console.log('Usuario:', userId);
    console.log('Rol:', role);
    console.log('====================================');

    let query = {};
    
    if (role === 'cliente') {
      query.usuario = userId;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    console.log(`✅ ${orders.length} órdenes encontradas`);

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

    console.log('====================================');

    return ordersWithUsers;
  }

  async getOrderById(orderId, userId, role) {
    console.log('====================================');
    console.log('🔍 OBTENER ORDEN POR ID');
    console.log('Orden ID:', orderId);
    console.log('Usuario:', userId);
    console.log('Rol:', role);
    console.log('====================================');

    const order = await Order.findById(orderId);

    if (!order) {
      console.log('❌ Orden no encontrada');
      throw new Error('Pedido no encontrado');
    }

    console.log('✅ Orden encontrada');

    if (role === 'cliente' && order.usuario.toString() !== userId.toString()) {
      console.log('❌ Usuario no autorizado');
      throw new Error('No tienes permiso para ver este pedido');
    }

    const User = require('../models/User.model');
    const user = await User.findById(order.usuario).select('nombre email telefono');

    console.log('====================================');

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
    console.log('====================================');
    console.log('🔄 ACTUALIZAR ESTADO DE ORDEN');
    console.log('Orden ID:', orderId);
    console.log('Nuevo estado:', newStatus);
    console.log('====================================');

    const validTransitions = {
      'pendiente': ['en_produccion', 'cancelado'],
      'en_produccion': ['enviando', 'cancelado'],
      'enviando': ['entregado'],
      'entregado': [],
      'cancelado': []
    };

    const order = await Order.findById(orderId);
    
    if (!order) {
      console.log('❌ Orden no encontrada');
      throw new Error('Pedido no encontrado');
    }

    console.log('Estado actual:', order.estado);

    const allowedStatuses = validTransitions[order.estado];
    
    if (!allowedStatuses.includes(newStatus)) {
      console.log('❌ Transición no permitida');
      throw new Error(`No se puede cambiar de ${order.estado} a ${newStatus}`);
    }

    order.estado = newStatus;
    await order.save();

    console.log('✅ Estado actualizado exitosamente');
    console.log('====================================');

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

