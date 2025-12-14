const { verifyToken } = require('../helpers/jwt.helper');
const { errorResponse } = require('../helpers/response.helper');
const User = require('../models/User.model');

const authenticate = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Token no proporcionado');
    }

    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return errorResponse(res, 401, 'Token inválido o expirado');
    }

    // Buscar usuario
    const user = await User.findById(decoded.id).populate('role', 'name');
    
    if (!user || user.estado !== 'activo') {
      return errorResponse(res, 401, 'Usuario no autorizado');
    }

    // Agregar usuario al request
    req.user = {
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      role: user.role.name
    };

    next();
  } catch (error) {
    console.error('❌ Error en authenticate:', error);
    return errorResponse(res, 500, 'Error en autenticación');
  }
};

module.exports = authenticate;