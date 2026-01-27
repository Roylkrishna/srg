const express = require('express');
const { createProduct, updateProduct, deleteProduct, getProduct, getAllProducts, recordSale, getSalesHistory, addReview, deleteReview, updateReview } = require('../controllers/productController');
const { verifyToken, verifyAdmin, verifyTokenOptional } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/', verifyToken, verifyAdmin, upload.array('images', 5), createProduct);
router.patch('/:id', verifyToken, verifyAdmin, upload.array('images', 5), updateProduct); // Changed to patch for consistency or kept as put
router.delete('/:id', verifyToken, verifyAdmin, deleteProduct);
router.get('/:id', verifyTokenOptional, getProduct);
router.get('/', verifyTokenOptional, getAllProducts);

// Sales endpoints
router.post('/record-sale', verifyToken, verifyAdmin, recordSale);
router.get('/sales/history', verifyToken, verifyAdmin, getSalesHistory);

// Reviews
const { uploadReview } = require('../middleware/uploadMiddleware');
router.post('/:id/reviews', verifyToken, uploadReview.single('image'), addReview);
// Update & Delete Review
router.delete('/:id/reviews/:reviewId', verifyToken, deleteReview);
router.put('/:id/reviews/:reviewId', verifyToken, uploadReview.single('image'), updateReview);

module.exports = router;
