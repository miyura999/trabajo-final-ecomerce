const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../helpers/response.helper');

class AuthController {
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      return successResponse(res, 201, 'Usuario registrado exitosamente', result);
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return successResponse(res, 200, 'Login exitoso', result);
    } catch (error) {
      return errorResponse(res, 200, error.message);
    }
  }

  // ⭐ NUEVO: Controlador para refresh token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      return successResponse(res, 200, 'Token renovado exitosamente', result);
    } catch (error) {
      return errorResponse(res, 401, error.message);
    }
  }
}

module.exports = new AuthController();