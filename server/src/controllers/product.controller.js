const productService = require('../services/product.service');
const { successResponse, errorResponse } = require('../helpers/response.helper');

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await productService.getAllProducts(req.query);
      return successResponse(res, 200, 'Productos obtenidos exitosamente', products);
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);
      return successResponse(res, 200, 'Producto obtenido exitosamente', product);
    } catch (error) {
      return errorResponse(res, 404, error.message);
    }
  }

  async createProduct(req, res) {
    try {
      const product = await productService.createProduct(req.body);
      return successResponse(res, 201, 'Producto creado exitosamente', product);
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body, req.file);
      return successResponse(res, 200, 'Producto actualizado exitosamente', product);
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  }

  async deleteProduct(req, res) {
    try {
      await productService.deleteProduct(req.params.id);
      return successResponse(res, 200, 'Producto eliminado exitosamente');
    } catch (error) {
      return errorResponse(res, 404, error.message);
    }
  }
}

module.exports = new ProductController();