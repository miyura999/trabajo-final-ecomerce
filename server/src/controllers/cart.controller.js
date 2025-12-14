const cartService = require('../services/cart.service');
const { successResponse, errorResponse } = require('../helpers/response.helper');

class CartController {
  async getCart(req, res) {
    try {
      const cart = await cartService.getCart(req.user.id);
      return successResponse(res, 200, 'Carrito obtenido exitosamente', cart);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async addItem(req, res) {
    try {
      const { productId, cantidad } = req.body;
      const cart = await cartService.addItem(req.user.id, productId, cantidad);
      return successResponse(res, 200, 'Producto agregado al carrito', cart);
    } catch (error) {
      
      return errorResponse(res, 400, error);


    }
  }

  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const { cantidad } = req.body;
      const cart = await cartService.updateItem(req.user.id, id, cantidad);
      return successResponse(res, 200, 'Item actualizado', cart);
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  }

  async removeItem(req, res) {
    try {
      const { id } = req.params;
      const cart = await cartService.removeItem(req.user.id, id);
      return successResponse(res, 200, 'Item eliminado del carrito', cart);
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  }

  async clearCart(req, res) {
    try {
      const cart = await cartService.clearCart(req.user.id);
      return successResponse(res, 200, 'Carrito vaciado', cart);
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  }
}

module.exports = new CartController();