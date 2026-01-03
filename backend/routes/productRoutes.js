const express = require('express');
const { createProduct, updateProduct, deleteProduct, getProduct, getAllProducts } = require('../controllers/productController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/', verifyToken, verifyAdmin, upload.array('images', 5), createProduct);
router.put('/:id', verifyToken, verifyAdmin, upload.array('images', 5), updateProduct);
router.delete('/:id', verifyToken, verifyAdmin, deleteProduct);
router.get('/:id', getProduct);
router.get('/', getAllProducts);

module.exports = router;
