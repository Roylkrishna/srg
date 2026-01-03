const express = require('express');
const { signup, login, googleAuth, checkAuth, logout } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/google', googleAuth);
router.get('/check', checkAuth);

module.exports = router;
