const { body, param } = require('express-validator');

const addItemValidator = [
  body('productId')
    .notEmpty().withMessage('El ID del producto es obligatorio')
    .isMongoId().withMessage('ID de producto inválido'),
  
  body('cantidad')
    .optional()
    .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero positivo')
];

const updateItemValidator = [
  param('id').isMongoId().withMessage('ID de item inválido'),
  
  body('cantidad')
    .notEmpty().withMessage('La cantidad es obligatoria')
    .isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero positivo')
];

const itemIdValidator = [
  param('id').isMongoId().withMessage('ID de item inválido')
];

module.exports = {
  addItemValidator,
  updateItemValidator,
  itemIdValidator
};