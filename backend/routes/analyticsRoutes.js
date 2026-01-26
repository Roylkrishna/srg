const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { verifyToken, verifyAdmin, verifyOwner } = require('../middleware/authMiddleware');

// Public route to log events (e.g. view product)
// Note: We might want valid tokens if we want to track specific users, 
// but for public views, we might relax it or checking req.user in controller if available.
// The authMiddleware usually blocks if no token is present for 'protect'.
// Let's make logEvent public but we can optionally extract user from token if present.
// For now, let's keep it public. The controller handles optional req.user logic if we add middleware that doesn't block.
// But standard 'protect' blocks.
// So we will use a custom middleware or just let the client send the token in header and we parse it if we want.
// For simplicity: Public access. If your app sends Authorization header, we can parse it manually or use a "soft auth" middleware.
// Let's assume public for now. If you want to track logged-in users, the frontend should send the token.
// TODO: Add 'optionalAuth' middleware if needed.

router.post('/log', analyticsController.logEvent);

// Admin only dashboard stats
router.get('/dashboard', verifyToken, verifyOwner, analyticsController.getDashboardStats);

module.exports = router;
