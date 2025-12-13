const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/roles.middleware');
const { createProductValidator, updateProductValidator, productIdValidator } = require('../validators/product.validator');
const validateRequest = require('../middlewares/validation.middleware');

// Rutas públicas
router.get('/', productController.getAllProducts);
router.get('/:id', productIdValidator, validateRequest, productController.getProductById);

// Rutas protegidas (solo admin) - CON upload de imagen
router.post(
    '/',
    authenticate,
    authorize('admin'),
    createProductValidator,
    validateRequest,
    productController.createProduct
);

router.put(
    '/:id',
    authenticate,
    authorize('admin'),
    updateProductValidator,
    validateRequest,
    productController.updateProduct
);

router.delete(
    '/:id',
    authenticate,
    authorize('admin'),
    productIdValidator,
    validateRequest,
    productController.deleteProduct
);

module.exports = router;