const userService = require('../services/user.service');
const { successResponse, errorResponse } = require('../helpers/response.helper');
const UserModel = require('../models/User.model');
const ProductModel = require('../models/Product.model');
const OrderModel = require('../models/Order.model')

class UserController {
  async getAllUsers(req, res) {
    const { email: emailUser } = req.user
    try {
      const users = await UserModel.find({ email: { $not: { $eq: emailUser } } })
      return successResponse(res, 200, 'Usuarios obtenidos exitosamente', users);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      return successResponse(res, 200, 'Usuario obtenido exitosamente', user);
    } catch (error) {
      return errorResponse(res, 404, error.message);
    }
  }

  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      return successResponse(res, 201, 'Usuario creado exitosamente', user);
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  }

  async updateUser(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      return successResponse(res, 200, 'Usuario actualizado exitosamente', user);
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  }

  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.params.id);
      return successResponse(res, 200, 'Usuario eliminado exitosamente');
    } catch (error) {
      return errorResponse(res, 404, error.message);
    }
  }

  async getProfile(req, res) {
    try {
      const user = await userService.getProfile(req.user.id);
      return successResponse(res, 200, 'Perfil obtenido exitosamente', user);
    } catch (error) {
      return errorResponse(res, 404, error.message);
    }
  }

  async getStats(req, res) {
    try {
      const productsCount = await ProductModel.estimatedDocumentCount()
      const usersCount = await UserModel.estimatedDocumentCount()
      const stats = await OrderModel.aggregate([
        {
          $match: {
            estado: { $in: ['entregado'] }
          }
        },
        {
          $group: {
            _id: null,
            totalVentas: { $sum: '$total' },
            numeroPedidos: { $sum: 1 },
            ventaPromedio: { $avg: '$total' },
            ventaMaxima: { $max: '$total' },
            ventaMinima: { $min: '$total' }
          }
        }
      ]);
      return successResponse(res, 200, { products: productsCount, users: usersCount, orderStats: stats })
    } catch (error) {
      return errorResponse(res, 500, error.message)
    }
  }
}

module.exports = new UserController();