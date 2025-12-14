const Router = require('express').Router


const router = Router()

router.use('/api/auth', require('./auth.routes'));
router.use('/api/users', require('./user.routes'));
router.use('/api/products', require('./product.routes'));
router.use('/api/cart', require('./cart.routes'));
router.use('/api/orders', require('./order.routes'));
router.use('/api/roles', require('./role.routes'))
router.use('/api/messages', require('./message.routes'))

// Middleware de manejo de errores (debe ir al final)
router.use(require('./../middlewares/errorHandler.middleware'));

module.exports = router