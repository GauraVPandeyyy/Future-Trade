const express = require('express');
const { registerController, loginController, userController, logOutController } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', registerController)

router.post('/login', loginController)


router.get('/user', authMiddleware , userController )
router.get('/logout', logOutController)

module.exports = router;