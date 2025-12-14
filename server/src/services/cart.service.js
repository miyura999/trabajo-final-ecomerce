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

    const cart = await Cart.findOne({ usuario: userId }).populate('items');
    
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    // Buscar el CartItem que tiene este producto
    const item = cart.items.find(item => 
      item.producto && item.producto.toString() === productId.toString()
    );
    
    if (!item) {
      throw new Error('Item no encontrado en el carrito');
    };

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

    return await this.calculateTotal(cart._id);
  }

  // ✅ CORRECCIÓN: Ahora elimina por productId en lugar de itemId
  async removeItem(userId, productId) {

    const cart = await Cart.findOne({ usuario: userId }).populate('items');
    
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }


    // Buscar el CartItem que tiene este producto
    const itemIndex = cart.items.findIndex(item => 
      item.producto && item.producto.toString() === productId.toString()
    );
    
    if (itemIndex === -1) {

      throw new Error('Item no encontrado en el carrito');
    }

    const itemToDelete = cart.items[itemIndex];


    // Eliminar del array del carrito
    cart.items.splice(itemIndex, 1);
    await cart.save();
    


    // Eliminar el CartItem de la base de datos
    await CartItem.findByIdAndDelete(itemToDelete._id);


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