const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/roles.middleware');
const { addItemValidator, updateItemValidator, itemIdValidator } = require('../validators/cart.validator');
const validateRequest = require('../middlewares/validation.middleware');

// ✅ CORRECCIÓN: Agregar authorize('cliente')
router.use(authenticate);


// Obtener carrito
router.get('/', cartController.getCart);

// Agregar item
router.post('/items', addItemValidator, validateRequest, cartController.addItem);

// Actualizar item
router.put('/items/:id', updateItemValidator, validateRequest, cartController.updateItem);

// Eliminar item
router.delete('/items/:id', itemIdValidator, validateRequest, cartController.removeItem);

// Vaciar carrito
router.delete('/clear', cartController.clearCart);

module.exports = router;