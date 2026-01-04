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
        let query = Product.find();

        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Always populate category and lastEditedBy unless specifically excluded? 
        // For simplicity, let's keep populating them as they are useful. 
        // Mongoose ignores populate if field is excluded in select?
        // Actually if strict select is used, we must ensure populated fields are selected to be populated.
        // If select is present, we rely on user strictly asking for what they want.
        // But for safety, let's just chain populate. If field is not in select, populate is no-op or handled.
        // Wait, if I do Model.find().select('name').populate('category'), it might try to populate category but category path is not in result if not selected?
        // No, typically you must select the field to populate it.
        // If I select 'name category', then populate 'category' works.
        // If I select 'name', populate 'category' is ignored or returns nothing.

        query = query.populate('category').populate('lastEditedBy', 'firstName lastName');

        const products = await query;
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};
