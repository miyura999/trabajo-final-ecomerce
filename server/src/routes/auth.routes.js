const express = require('express');
const autenticated = require("./../middlewares/auth.middleware.js")
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { registerValidator, loginValidator, refreshTokenValidator } = require('../validators/auth.validator');
const validateRequest = require('../middlewares/validation.middleware');

// POST /api/auth/register
router.post('/register', registerValidator, validateRequest, authController.register);

// POST /api/auth/login
router.post('/login', loginValidator, validateRequest, authController.login);

// ⭐ NUEVO: POST /api/auth/refresh-token
router.post('/refresh-token', refreshTokenValidator, validateRequest, authController.refreshToken);

module.exports = router;