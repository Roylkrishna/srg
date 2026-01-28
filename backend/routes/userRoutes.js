const express = require('express');
const { updateProfile, getUser, getAllUsers, getUserWithOrders, updateUserRole, createUser, deleteUser, deleteMe, toggleUserStatus, getManagerActivity, getManagersStats, toggleWishlist, getWishlist, adminResetPassword, changePassword } = require('../controllers/userController');
const { verifyToken, verifyAdmin, verifyOwner } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.put('/:id', verifyToken, upload.single('profilePicture'), updateProfile);
router.post('/me/delete-account', verifyToken, deleteMe);
router.put('/wishlist/toggle', verifyToken, toggleWishlist);
router.get('/wishlist', verifyToken, getWishlist);
router.get('/:id', verifyToken, getUser);

// Admin Routes
router.get('/', verifyToken, verifyAdmin, getAllUsers);
router.get('/details/:id', verifyToken, verifyOwner, getUserWithOrders);
router.get('/activity/:id', verifyToken, verifyOwner, getManagerActivity);
router.get('/managers-stats', verifyToken, verifyOwner, getManagersStats);
router.post('/', verifyToken, verifyOwner, createUser);
router.put('/:id/role', verifyToken, verifyOwner, updateUserRole);
router.delete('/:id', verifyToken, verifyOwner, deleteUser);
router.patch('/:id/status', verifyToken, verifyOwner, toggleUserStatus);
router.put('/admin-reset-password', verifyToken, verifyOwner, adminResetPassword);
router.put('/change-password', verifyToken, changePassword);

module.exports = router;
