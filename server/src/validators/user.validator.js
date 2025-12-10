const { body, param } = require('express-validator');

const createUserValidator = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .trim(),
  
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido'),
  
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('Mínimo 6 caracteres')
];

const updateUserValidator = [
  param('id').isMongoId().withMessage('ID inválido'),
  
  body('nombre').optional().trim(),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('telefono').optional(),
  body('estado').optional().isIn(['activo', 'inactivo'])
];

const userIdValidator = [
  param('id').isMongoId().withMessage('ID de usuario inválido')
];

module.exports = {
  createUserValidator,
  updateUserValidator,
  userIdValidator
};