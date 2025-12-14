const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/roles.middleware');
const { addItemValidator, updateItemValidator, itemIdValidator } = require('../validators/cart.validator');
const validateRequest = require('../middlewares/validation.middleware');

// ✅ IMPORTANTE: Estas rutas SOLO para clientes
router.use(authenticate); // Verifica que haya token válido
router.use(authorize('cliente')); // Verifica que el rol sea 'cliente'

router.get('/', cartController.getCart);
router.post('/items', addItemValidator, validateRequest, cartController.addItem);
router.put('/items/:id', updateItemValidator, validateRequest, cartController.updateItem);
router.delete('/items/:id', itemIdValidator, validateRequest, cartController.removeItem);
router.delete('/clear', cartController.clearCart);

module.exports = router;