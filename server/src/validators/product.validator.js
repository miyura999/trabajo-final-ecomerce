const { body, param } = require('express-validator');

const createProductValidator = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .trim(),
  
  body('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria')
    .trim(),
  
  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser mayor o igual a 0'),
  
  body('categoria')
    .notEmpty().withMessage('La categoría es obligatoria')
    .trim(),
  
  body('stock')
    .notEmpty().withMessage('El stock es obligatorio')
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo')
  
  // La imagen es opcional, se maneja con multer
];

const updateProductValidator = [
  param('id').isMongoId().withMessage('ID de producto inválido'),
  
  body('nombre').optional().trim(),
  body('descripcion').optional().trim(),
  body('precio').optional().isFloat({ min: 0 }),
  body('categoria').optional().trim(),
  body('stock').optional().isInt({ min: 0 }),
  body('estado').optional().isIn(['disponible', 'agotado', 'descontinuado'])
  
  // La imagen es opcional
];

const productIdValidator = [
  param('id').isMongoId().withMessage('ID de producto inválido')
];

module.exports = {
  createProductValidator,
  updateProductValidator,
  productIdValidator
};