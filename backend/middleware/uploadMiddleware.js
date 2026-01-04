const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');

const upload = multer({
    storage,
    limits: { fileSize: 500 * 1024 }, // 500KB limit
});

module.exports = upload;
