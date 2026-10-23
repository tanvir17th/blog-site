const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/forgot-password', authCtrl.forgotPassword);
router.patch('/reset-password/:token', authCtrl.resetPassword);

module.exports = router;