const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
});

// Separate config for reviews (Organized storage)
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig').cloudinary;

const reviewStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'srg_reviews',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const uploadReview = multer({
    storage: reviewStorage,
    limits: { fileSize: 1024 * 1024 * 2 }, // 2MB limit for reviews
});

module.exports = { upload, uploadReview };
