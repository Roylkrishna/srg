const Product = require('../models/Product');
const Activity = require('../models/Activity');
const Sale = require('../models/Sale');
const cloudinary = require('cloudinary').v2;

exports.createProduct = async (req, res, next) => {
    try {
        const productData = {
            ...req.body,
            lastEditedBy: req.user.id,
            lastEditedAt: new Date()
        };

        // Handle tags: convert comma-separated string to array
        if (req.body.tags) {
            productData.tags = req.body.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag !== '');
        } else {
            productData.tags = [];
        }

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

        // Handle tags: convert comma-separated string to array
        if (req.body.tags) {
            updateData.tags = req.body.tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag !== '');
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Handle Images Removal from Cloudinary
        if (req.body.existingImages || (req.files && req.files.length > 0)) {
            const keptImages = Array.isArray(req.body.existingImages) ? req.body.existingImages : (req.body.existingImages ? [req.body.existingImages] : []);
            const removedImages = product.images.filter(img => !keptImages.includes(img));

            for (const imgUrl of removedImages) {
                try {
                    const publicId = imgUrl.split('upload/')[1].split('.').slice(0, -1).join('.').split('/').slice(1).join('/');
                    await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                    console.error("Cloudinary Delete Error (Update):", err);
                }
            }
        }

        // Combine existing (kept) images and new uploads
        let currentImages = [];
        if (req.body.existingImages) {
            if (Array.isArray(req.body.existingImages)) {
                currentImages = req.body.existingImages;
            } else {
                currentImages = [req.body.existingImages];
            }
        }

        let newImages = [];
        if (req.files && req.files.length > 0) {
            newImages = req.files.map(file => file.path);
        }

        if (req.body.existingImages || (req.files && req.files.length > 0)) {
            updateData.images = [...currentImages, ...newImages];
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
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Delete all associated images from Cloudinary
        for (const imgUrl of product.images) {
            try {
                const publicId = imgUrl.split('upload/')[1].split('.').slice(0, -1).join('.').split('/').slice(1).join('/');
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.error("Cloudinary Delete Error (Product):", err);
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted...");
    } catch (error) {
        next(error);
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        let query = Product.findById(req.params.id).populate('category');

        const allowedRoles = ['owner', 'manager', 'admin'];
        const isAuthorized = req.user && allowedRoles.includes(req.user.role);

        if (!isAuthorized) {
            query = query.select('-purchasedPrice');
        }

        const product = await query;
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
            // Escape special characters for ReDoS protection
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // 1. Find categories that match the search term
            const Category = require('../models/Category');
            const matchingCategories = await Category.find({
                name: { $regex: escapedSearch, $options: 'i' }
            }).select('_id');
            const categoryIds = matchingCategories.map(cat => cat._id);

            // 2. Build filter for product name, description, and category
            filter = {
                $or: [
                    { name: { $regex: escapedSearch, $options: 'i' } },
                    { description: { $regex: escapedSearch, $options: 'i' } },
                    { category: { $in: categoryIds } }
                ]
            };
        }

        let query = Product.find(filter);

        // handle select query
        let fields = '';
        if (select) {
            fields = select.split(',').join(' ');
        }

        const allowedRoles = ['owner', 'manager', 'admin'];
        const isAuthorized = req.user && allowedRoles.includes(req.user.role);

        if (!isAuthorized) {
            // Explicitly exclude purchasedPrice for public users
            if (!fields) {
                // No select implies select * -> enforce exclusion
                fields = '-purchasedPrice';
            } else {
                // If fields are provided, check projection type
                const parts = fields.split(' ');
                const isExclusion = parts.some(p => p.startsWith('-'));

                if (isExclusion) {
                    // If exclusion, ensure purchasedPrice is also excluded
                    if (!parts.includes('-purchasedPrice')) {
                        fields += ' -purchasedPrice';
                    }
                } else {
                    // If inclusion, ensure purchasedPrice is NOT included
                    fields = parts.filter(p => p !== 'purchasedPrice').join(' ');
                }
            }
        }

        if (fields) {
            query = query.select(fields);
        }

        query = query.populate('category').populate('lastEditedBy', 'firstName lastName');

        const products = await query;
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

exports.recordSale = async (req, res, next) => {
    try {
        const { productId, quantity, sellingPrice } = req.body;

        if (!productId || !quantity || !sellingPrice) {
            return res.status(400).json({ message: "Product, quantity, and price are required." });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        if (product.quantityAvailable < quantity) {
            return res.status(400).json({ message: `Insufficient stock. Only ${product.quantityAvailable} available.` });
        }

        // update inventory
        product.quantityAvailable -= quantity;
        await product.save();

        // create sale record
        const sale = await Sale.create({
            productId,
            productName: product.name,
            quantity,
            sellingPrice,
            totalAmount: quantity * sellingPrice,
            recordedBy: req.user.id
        });

        // log activity
        await Activity.create({
            userId: req.user.id,
            action: 'UPDATE', // Using UPDATE for general product changes, or we could add SALE to Activity later if needed
            productId,
            productName: product.name,
            details: `Recorded sale: ${quantity} units at ₹${sellingPrice}`,
            timestamp: new Date()
        });

        const populatedProduct = await Product.findById(productId).populate('category');

        res.status(201).json({
            message: "Sale recorded successfully",
            sale,
            updatedProduct: populatedProduct
        });
    } catch (error) {
        next(error);
    }
};

exports.getSalesHistory = async (req, res, next) => {
    try {
        const sales = await Sale.find()
            .populate('recordedBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(50);
        res.status(200).json(sales);
    } catch (error) {
        next(error);
    }
};

exports.addReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        const review = {
            userId: req.user.id,
            rating: Number(rating),
            comment,
            date: new Date()
        };

        if (req.file) {
            review.image = req.file.path; // Cloudinary URL
        }

        product.reviews.push(review);

        // Industry Standard: Recalculate Aggregates
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();

        const updatedProduct = await Product.findById(productId)
            .populate('category')
            .populate('reviews.userId', 'firstName lastName profilePicture');

        res.status(201).json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

exports.deleteReview = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        const product = await Product.findById(id);

        if (!product) return res.status(404).json({ message: "Product not found" });

        const review = product.reviews.id(reviewId);
        if (!review) return res.status(404).json({ message: "Review not found" });

        // Authorization: Admin/Manager OR Review Author
        const isAuthor = review.userId.toString() === req.user.id;
        const isAdmin = ['owner', 'manager', 'admin'].includes(req.user.role);

        if (!isAuthor && !isAdmin) {
            return res.status(403).json({ message: "Not authorized to delete this review" });
        }

        // Remove the review
        const reviewImage = review.image;
        product.reviews.pull(reviewId);

        // Standard: Recalculate Aggregates
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.length > 0
            ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
            : 0;

        await product.save();

        // Delete review image from Cloudinary if it exists
        if (reviewImage) {
            try {
                const publicId = reviewImage.split('upload/')[1].split('.').slice(0, -1).join('.').split('/').slice(1).join('/');
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.error("Cloudinary Delete Error (Review):", err);
            }
        }

        // Return fully populated product for UI update
        const updatedProduct = await Product.findById(id)
            .populate('category')
            .populate('reviews.userId', 'firstName lastName profilePicture');

        res.status(200).json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

exports.updateReview = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        const { rating, comment } = req.body;

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const review = product.reviews.id(reviewId);
        if (!review) return res.status(404).json({ message: "Review not found" });

        // Authorization: ONLY Author can edit text/rating
        if (review.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only edit your own reviews" });
        }

        // Update fields
        if (rating) review.rating = Number(rating);
        if (comment) review.comment = comment;

        // If new image is uploaded, clean up the old one
        if (req.file) {
            const oldImage = review.image;
            review.image = req.file.path;

            if (oldImage) {
                try {
                    const publicId = oldImage.split('upload/')[1].split('.').slice(0, -1).join('.').split('/').slice(1).join('/');
                    await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                    console.error("Cloudinary Delete Error (Review Update):", err);
                }
            }
        }

        // Recalculate Aggregates (Rating might change)
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();

        const updatedProduct = await Product.findById(id)
            .populate('category')
            .populate('reviews.userId', 'firstName lastName profilePicture');

        res.status(200).json(updatedProduct);
    } catch (error) {
        next(error);
    }
};
