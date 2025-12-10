const { errorResponse } = require('../helpers/response.helper');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Usuario no autenticado');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 403, 'No tienes permisos para realizar esta acción');
    }

    next();
  };
};

module.exports = authorize;