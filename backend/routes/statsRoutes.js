const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const statsController = require('../controllers/statsController');

router.get('/', verifyToken, verifyAdmin, statsController.getSiteStats);

module.exports = router;
