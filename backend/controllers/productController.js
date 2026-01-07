const Product = require('../models/Product');
const Activity = require('../models/Activity');

exports.createProduct = async (req, res, next) => {
    try {
        const productData = {
            ...req.body,
            lastEditedBy: req.user.id,
            lastEditedAt: new Date()
        };

        if (req.files && req.files.length > 0) {
            const imagePaths = req.files.map(file => {
                return file.path; // Cloudinary returns the full URL in 'path'
            });
            productData.images = imagePaths;
        } else if (!productData.images) {
            productData.images = [];
        }

        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();

        // Log Activity
        await Activity.create({
            userId: req.user.id,
            action: 'CREATE',
            productId: savedProduct._id,
            productName: savedProduct.name,
            timestamp: new Date()
        });

        res.status(201).json(savedProduct);
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        let updateData = {
            ...req.body,
            lastEditedBy: req.user.id,
            lastEditedAt: new Date()
        };

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => {
                return file.path; // Cloudinary returns the full URL in 'path'
            });

            // If replacing, we might just set images. 
            // If we want to APPEND, we need to fetch, but here let's assume req.body.existingImages could be handled if needed, 
            // OR simpler: frontend sends 'images' as array of strings for KEPT images? 
            // Multer handles files. Body handles text.
            // If I send existing images as text fields array 'images', they come in body.
            // The NEW files come in req.files. 
            // So we should combine them efficiently.

            // NOTE: express-urlencoded might not parse duplicate keys 'images' as array if only one is sent?
            // Safer to check type.

            let existingImages = req.body.entryImages || [];
            if (typeof existingImages === 'string') existingImages = [existingImages];

            // However, FormData structure from frontend is key.
            // Let's assume frontend logic:
            // "existingImages" -> URLs of images to keep.
            // "images" -> New files.

            // BUT wait, product schema has 'images' array.
            // If I update, I should probably replace the list with whatever the user intended (kept + new).
            // So I need to know which old ones to keep.

            // Let's adopt this protocol: 
            // Frontend sends `existingImages` (array of URLs).
            // Frontend sends `images` (files).
            // Backend combines them.

            // But if `req.body.images` is sent (and it typically carries JSON if we aren't careful, but in FormData it carries text fields), 
            // we should be careful.

            // Let's rely on a specific field for kept images to avoid confusion with the file field 'images'.
            // Let's verify what `req.body` contains.

            // Simpler approach for now:
            // If `req.files` exists, we append them to whatever `req.body.images` (URLs) are passed?
            // Or `req.body.images` might contain the list of retained images.

            let currentImages = [];
            if (req.body.images) {
                if (Array.isArray(req.body.images)) {
                    currentImages = req.body.images;
                } else {
                    currentImages = [req.body.images];
                }
            }

            updateData.images = [...currentImages, ...newImages];
        } else {
            // No new files. Check if we are updating the list of images (removing some?)
            // If req.body.images is sent, use it.
            if (req.body.images) {
                // It's possible we removed all, but then form data might send empty?
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: updateData
        }, { new: true });

        if (updatedProduct) {
            // Log Activity
            await Activity.create({
                userId: req.user.id,
                action: 'UPDATE',
                productId: updatedProduct._id,
                productName: updatedProduct.name,
                timestamp: new Date()
            });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted...");
    } catch (error) {
        next(error);
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

exports.getAllProducts = async (req, res, next) => {
    try {
        const { search, select } = req.query;
        let filter = {};

        if (search) {
            // 1. Find categories that match the search term
            const Category = require('../models/Category');
            const matchingCategories = await Category.find({
                name: { $regex: search, $options: 'i' }
            }).select('_id');
            const categoryIds = matchingCategories.map(cat => cat._id);

            // 2. Build filter for product name, description, and category
            filter = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { category: { $in: categoryIds } }
                ]
            };
        }

        let query = Product.find(filter);

        if (select) {
            const fields = select.split(',').join(' ');
            query = query.select(fields);
        }

        query = query.populate('category').populate('lastEditedBy', 'firstName lastName');

        const products = await query;
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};
