const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder = 'shree-rama-gift-center/others';

        if (file.fieldname === 'profilePicture') {
            folder = 'shree-rama-gift-center/users';
        } else if (file.fieldname === 'images') {
            folder = 'shree-rama-gift-center/products';
        }

        return {
            folder: folder,
            allowed_formats: ['jpg', 'png', 'jpeg'],
        };
    },
});

module.exports = {
    cloudinary,
    storage
};
