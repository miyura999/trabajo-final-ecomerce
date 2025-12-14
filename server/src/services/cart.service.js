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

  async updateItem(userId, itemId, cantidad) {
    const cart = await Cart.findOne({ usuario: userId });
    
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const item = await CartItem.findById(itemId).populate('producto');
    
    // ✅ CORRECCIÓN: usar .some() en lugar de .includes()
    const itemExists = cart.items.some(id => id.toString() === itemId.toString());
    
    if (!item || !itemExists) {
      throw new Error('Item no encontrado en el carrito');
    }

    if (cantidad > item.producto.stock) {
      throw new Error('Stock insuficiente');
    }

    item.cantidad = cantidad;
    item.subtotal = item.cantidad * item.precio;
    await item.save();

    return await this.calculateTotal(cart._id);
  }

  async removeItem(userId, itemId) {
    const cart = await Cart.findOne({ usuario: userId });
    
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    // ✅ CORRECCIÓN: usar .findIndex() en lugar de .indexOf()
    const itemIndex = cart.items.findIndex(id => id.toString() === itemId.toString());
    
    if (itemIndex === -1) {
      throw new Error('Item no encontrado en el carrito');
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    
    await CartItem.findByIdAndDelete(itemId);

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
        total += item.subtotal;
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