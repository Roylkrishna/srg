const express = require('express');
const { getBanners, addBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getBanners);
router.post('/', verifyToken, verifyAdmin, upload.single('image'), addBanner);
router.put('/:id', verifyToken, verifyAdmin, upload.single('image'), updateBanner);
router.delete('/:id', verifyToken, verifyAdmin, deleteBanner);

module.exports = router;
