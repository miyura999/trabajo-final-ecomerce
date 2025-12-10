const { body, param } = require('express-validator');

const createOrderValidator = [
  body('direccionEnvio.calle')
    .notEmpty().withMessage('La calle es obligatoria'),
  
  body('direccionEnvio.ciudad')
    .notEmpty().withMessage('La ciudad es obligatoria'),
  
  body('direccionEnvio.codigoPostal')
    .notEmpty().withMessage('El código postal es obligatorio'),
  
  body('direccionEnvio.pais')
    .notEmpty().withMessage('El país es obligatorio'),
  
  body('telefono')
    .notEmpty().withMessage('El teléfono es obligatorio')
];

const updateOrderStatusValidator = [
  param('id').isMongoId().withMessage('ID de pedido inválido'),
  
  body('estado')
    .notEmpty().withMessage('El estado es obligatorio')
    .isIn(['pendiente', 'en_produccion', 'enviando', 'entregado', 'cancelado'])
    .withMessage('Estado inválido')
];

const orderIdValidator = [
  param('id').isMongoId().withMessage('ID de pedido inválido')
];

module.exports = {
  createOrderValidator,
  updateOrderStatusValidator,
  orderIdValidator
};