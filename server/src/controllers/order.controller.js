const orderService = require('../services/order.service');
const { successResponse, errorResponse } = require('../helpers/response.helper');

class OrderController {
  async createOrder(req, res) {
    try {
      const order = await orderService.createOrder(req.user.id, req.body);
      return successResponse(res, 201, 'Pedido creado exitosamente', order);
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  }

  async getOrders(req, res) {
    try {
      const orders = await orderService.getOrders(req.user.id, req.user.role);
      return successResponse(res, 200, 'Pedidos obtenidos exitosamente', orders);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await orderService.getOrderById(req.params.id, req.user.id, req.user.role);
      return successResponse(res, 200, 'Pedido obtenido exitosamente', order);
    } catch (error) {
      return errorResponse(res, 404, error.message);
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { estado } = req.body;
      const order = await orderService.updateOrderStatus(req.params.id, estado);
      return successResponse(res, 200, 'Estado del pedido actualizado', order);
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  }
}

module.exports = new OrderController();
