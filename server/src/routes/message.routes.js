const messageController = require('../controllers/message.controller')
const authenticate = require('../middlewares/auth.middleware')
const authorize = require('../middlewares/roles.middleware')

const Router = require('express').Router

const router = Router()

router.use(authenticate)
router.use(authorize('admin'))

router.get('/users', messageController.usersForSideBar)
router.get('/:id', messageController.getMessages)
router.post('/:id', messageController.sendMessage)

module.exports = router