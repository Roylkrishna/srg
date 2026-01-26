const express = require('express');
const { signup, login, checkAuth, logout, googleAuth, getCaptcha, forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/captcha', getCaptcha);
router.post('/logout', logout);
router.post('/google', googleAuth);
router.get('/check', checkAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
