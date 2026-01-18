const express = require('express');
const { signup, login, checkAuth, logout, googleAuth, getCaptcha } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/captcha', getCaptcha);
router.post('/logout', logout);
router.post('/google', googleAuth);
router.get('/check', checkAuth);

module.exports = router;
