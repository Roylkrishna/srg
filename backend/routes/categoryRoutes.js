const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories, deleteCategory } = require('../controllers/categoryController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', getAllCategories);
router.post('/', verifyToken, verifyAdmin, createCategory);
router.delete('/:id', verifyToken, verifyAdmin, deleteCategory);

module.exports = router;
