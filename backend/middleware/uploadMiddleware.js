const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 }, // 1MB limit
});

module.exports = upload;
