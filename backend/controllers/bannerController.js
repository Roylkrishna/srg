const Banner = require('../models/Banner');
const cloudinary = require('cloudinary').v2;

// Get all active banners
exports.getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ active: true }).sort({ order: 1 });
        res.status(200).json({ success: true, banners });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add new banner (Admin Only)
exports.addBanner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image' });
        }

        const newBanner = new Banner({
            imageUrl: req.file.path, // Cloudinary URL from middleware
            title: req.body.title,
            description: req.body.description,
            link: req.body.link,
            order: req.body.order || 0
        });

        await newBanner.save();
        res.status(201).json({ success: true, banner: newBanner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update banner (Admin Only)
exports.updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });

        const updatedData = { ...req.body };
        if (req.file) {
            updatedData.imageUrl = req.file.path;
        }

        const updatedBanner = await Banner.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.status(200).json({ success: true, banner: updatedBanner });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete banner (Admin Only)
exports.deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });

        // Extract public_id from Cloudinary URL if needed for deletion, 
        // but often we just delete the record. If we want to delete from Cloudinary:
        const publicId = banner.imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);

        await Banner.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Banner deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
