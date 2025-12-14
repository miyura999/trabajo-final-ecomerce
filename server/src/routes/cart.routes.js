const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/roles.middleware');
const { addItemValidator, updateItemValidator, itemIdValidator } = require('../validators/cart.validator');
const validateRequest = require('../middlewares/validation.middleware');

// Todas las rutas requieren autenticación como cliente
router.use(authenticate);

router.get('/', cartController.getCart);

// IMPORTANTE: validateRequest debe ir DESPUÉS de los validadores
router.post('/items', addItemValidator, validateRequest, cartController.addItem);

router.put('/items/:id', updateItemValidator, validateRequest, cartController.updateItem);

router.delete('/items/:id', itemIdValidator, validateRequest, cartController.removeItem);

router.delete('/clear', cartController.clearCart);

module.exports = router;