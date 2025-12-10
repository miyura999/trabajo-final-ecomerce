const { body } = require('express-validator');

const registerValidator = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .trim()
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

const loginValidator = [
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
];

// ⭐ NUEVO: Validador para refresh token
const refreshTokenValidator = [
  body('refreshToken')
    .notEmpty().withMessage('El refresh token es obligatorio')
    .isString().withMessage('El refresh token debe ser un string')
];

module.exports = {
  registerValidator,
  loginValidator,
  refreshTokenValidator // ← Exportar el nuevo validador
};