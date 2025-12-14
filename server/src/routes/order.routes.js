const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/roles.middleware');
const { createOrderValidator, updateOrderStatusValidator, orderIdValidator } = require('../validators/order.validator');
const validateRequest = require('../middlewares/validation.middleware');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Crear pedido (solo clientes)
router.post('/', createOrderValidator, validateRequest, orderController.createOrder);

// Obtener todos los pedidos (admin: todos, cliente: propios)
router.get('/', orderController.getOrders);

// Obtener pedido por ID
router.get('/:id', orderIdValidator, validateRequest, orderController.getOrderById);

// Actualizar estado de pedido (solo admin)
router.patch('/:id/status', updateOrderStatusValidator, validateRequest, orderController.updateOrderStatus);

module.exports = router;