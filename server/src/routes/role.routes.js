const express = require('express');
const RoleController = require('./../controllers/role.controller')
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/roles.middleware');

const router = express.Router()

router.get('/', authenticate, authorize('admin'), RoleController.getRoles)

module.exports = router