const Router = require('express').Router


const router = Router()

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/products', require('./product.routes'));
router.use('/cart', require('./cart.routes'));
router.use('/orders', require('./order.routes'));
router.use('/roles', require('./role.routes'))
router.use('/messages', require('./message.routes'))

// Middleware de manejo de errores (debe ir al final)
router.use(require('./../middlewares/errorHandler.middleware'));

module.exports = router