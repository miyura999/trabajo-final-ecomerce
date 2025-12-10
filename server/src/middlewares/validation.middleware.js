const { validationResult } = require('express-validator');
const { errorResponse } = require('../helpers/response.helper');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Errores de validación', errors.array());
  }
  
  next(); // ← Esto debe estar presente
};

module.exports = validateRequest;