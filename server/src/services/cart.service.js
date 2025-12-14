const Cart = require('../models/Cart.model');
const CartItem = require('../models/CartItem.model');
const Product = require('../models/Product.model');

class CartService {
  async getCart(userId) {
    let cart = await Cart.findOne({ usuario: userId })
      .populate({
        path: 'items',
        populate: { path: 'producto' }
      });

    if (!cart) {
      cart = await Cart.create({ usuario: userId, items: [], total: 0 });
    }

    return cart;
  }

  async addItem(userId, productId, cantidad = 1) {
    const product = await Product.findById(productId);
    
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (product.stock < cantidad) {
      throw new Error('Stock insuficiente');
    }

    let cart = await Cart.findOne({ usuario: userId });
    
    if (!cart) {
      cart = await Cart.create({ usuario: userId, items: [] });
    }

    const existingItem = await CartItem.findOne({
      _id: { $in: cart.items },
      producto: productId
    });

    if (existingItem) {
      existingItem.cantidad += cantidad;
      
      if (existingItem.cantidad > product.stock) {
        throw new Error('Stock insuficiente');
      }
      
      existingItem.subtotal = existingItem.cantidad * existingItem.precio;
      await existingItem.save();
    } else {
      const newItem = await CartItem.create({
        producto: productId,
        cantidad,
        precio: product.precio,
        subtotal: product.precio * cantidad
      });
      
      cart.items.push(newItem._id);
    }

    await cart.save();
    return await this.calculateTotal(cart._id);
  }

  // ✅ CORRECCIÓN: Ahora busca por productId en lugar de itemId
  async updateItem(userId, productId, cantidad) {
    console.log('====================================');
    console.log('📝 UPDATE ITEM - Buscando por PRODUCTO ID');
    console.log('User ID:', userId);
    console.log('Product ID:', productId);
    console.log('Nueva cantidad:', cantidad);
    console.log('====================================');

    const cart = await Cart.findOne({ usuario: userId }).populate('items');
    
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    console.log('✅ Carrito encontrado con', cart.items.length, 'items');

    // Buscar el CartItem que tiene este producto
    const item = cart.items.find(item => 
      item.producto && item.producto.toString() === productId.toString()
    );
    
    if (!item) {
      console.log('❌ No se encontró ningún item con producto:', productId);
      console.log('Items en carrito:', cart.items.map(i => ({
        itemId: i._id,
        productoId: i.producto
      })));
      throw new Error('Item no encontrado en el carrito');
    }

    console.log('✅ Item encontrado:', item._id);

    // Obtener el producto para verificar stock
    const product = await Product.findById(productId);
    
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (cantidad > product.stock) {
      throw new Error('Stock insuficiente');
    }

    // Actualizar el CartItem
    item.cantidad = cantidad;
    item.subtotal = item.cantidad * item.precio;
    await item.save();

    console.log('✅ Item actualizado correctamente');
    console.log('====================================');

    return await this.calculateTotal(cart._id);
  }

  // ✅ CORRECCIÓN: Ahora elimina por productId en lugar de itemId
  async removeItem(userId, productId) {
    console.log('====================================');
    console.log('🗑️ REMOVE ITEM - Buscando por PRODUCTO ID');
    console.log('User ID:', userId);
    console.log('Product ID:', productId);
    console.log('====================================');

    const cart = await Cart.findOne({ usuario: userId }).populate('items');
    
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    console.log('✅ Carrito encontrado con', cart.items.length, 'items');

    // Buscar el CartItem que tiene este producto
    const itemIndex = cart.items.findIndex(item => 
      item.producto && item.producto.toString() === productId.toString()
    );
    
    if (itemIndex === -1) {
      console.log('❌ No se encontró ningún item con producto:', productId);
      console.log('Items en carrito:', cart.items.map(i => ({
        itemId: i._id,
        productoId: i.producto
      })));
      throw new Error('Item no encontrado en el carrito');
    }

    const itemToDelete = cart.items[itemIndex];
    console.log('✅ Item encontrado para eliminar:', itemToDelete._id);

    // Eliminar del array del carrito
    cart.items.splice(itemIndex, 1);
    await cart.save();
    
    console.log('✅ Item removido del array del carrito');

    // Eliminar el CartItem de la base de datos
    await CartItem.findByIdAndDelete(itemToDelete._id);
    
    console.log('✅ CartItem eliminado de la BD');
    console.log('====================================');

    return await this.calculateTotal(cart._id);
  }

  async clearCart(userId) {
    const cart = await Cart.findOne({ usuario: userId });
    
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    await CartItem.deleteMany({ _id: { $in: cart.items } });
    
    cart.items = [];
    cart.total = 0;
    await cart.save();

    return cart;
  }

  async calculateTotal(cartId) {
    const cart = await Cart.findById(cartId).populate('items');
    
    let total = 0;
    
    if (cart.items && cart.items.length > 0) {
      for (const item of cart.items) {
        if (item && item.subtotal) {
          total += item.subtotal;
        }
      }
    }
    
    cart.total = total;
    await cart.save();

    return await Cart.findById(cartId).populate({
      path: 'items',
      populate: { path: 'producto' }
    });
  }
}

module.exports = new CartService();

// ========================================
// CONTROLADOR (NO CAMBIAR) - cart.controller.js
// ========================================

/*
El controlador NO necesita cambios, sigue siendo el mismo:

const cartService = require('../services/cart.service');
const { successResponse, errorResponse } = require('../helpers/response.helper');

class CartController {
  async getCart(req, res) {
    try {
      const cart = await cartService.getCart(req.user.id);
      return successResponse(res, 200, 'Carrito obtenido exitosamente', cart);
    } catch (error) {
      console.error('❌ Error en getCart:', error);
      return errorResponse(res, 500, error.message);
    }
  }

  async addItem(req, res) {
    try {
      const { productId, cantidad } = req.body;
      const cart = await cartService.addItem(req.user.id, productId, cantidad);
      return successResponse(res, 200, 'Producto agregado al carrito', cart);
    } catch (error) {
      console.error('❌ Error en addItem:', error);
      return errorResponse(res, 400, error.message);
    }
  }

  async updateItem(req, res) {
    try {
      const { id } = req.params; // Este es el productId
      const { cantidad } = req.body;
      
      const cart = await cartService.updateItem(req.user.id, id, cantidad);
      return successResponse(res, 200, 'Item actualizado', cart);
    } catch (error) {
      console.error('❌ Error en updateItem:', error);
      return errorResponse(res, 400, error.message);
    }
  }

  async removeItem(req, res) {
    try {
      const { id } = req.params; // Este es el productId
      
      const cart = await cartService.removeItem(req.user.id, id);
      return successResponse(res, 200, 'Item eliminado del carrito', cart);
    } catch (error) {
      console.error('❌ Error en removeItem:', error);
      return errorResponse(res, 400, error.message);
    }
  }

  async clearCart(req, res) {
    try {
      const cart = await cartService.clearCart(req.user.id);
      return successResponse(res, 200, 'Carrito vaciado', cart);
    } catch (error) {
      console.error('❌ Error en clearCart:', error);
      return errorResponse(res, 400, error.message);
    }
  }
}

module.exports = new CartController();
*/

// ========================================
// RUTAS SUGERIDAS - cart.routes.js
// ========================================

/*
router.get('/', authMiddleware, cartController.getCart);
router.post('/items', authMiddleware, cartController.addItem);
router.put('/items/:id', authMiddleware, cartController.updateItem); // :id es productId
router.delete('/items/:id', authMiddleware, cartController.removeItem); // :id es productId
router.delete('/', authMiddleware, cartController.clearCart);
*/