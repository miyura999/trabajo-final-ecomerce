const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/roles.middleware');
const { createUserValidator, updateUserValidator, userIdValidator } = require('../validators/user.validator');
const validateRequest = require('../middlewares/validation.middleware');

// Obtener perfil del usuario autenticado
router.get('/profile/me', authenticate, userController.getProfile);

// Rutas de administración (solo admin)
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);
router.get('/:id', authenticate, authorize('admin'), userIdValidator, validateRequest, userController.getUserById);
router.post('/', authenticate, authorize('admin'), createUserValidator, validateRequest, userController.createUser);
router.put('/:id', authenticate, authorize('admin'), updateUserValidator, validateRequest, userController.updateUser);
router.delete('/:id', authenticate, authorize('admin'), userIdValidator, validateRequest, userController.deleteUser);
router.post('/stats', authenticate, authorize('admin'), userController.getStats)

module.exports = router;