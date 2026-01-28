const User = require('../models/User');
const Order = require('../models/Order');
const Activity = require('../models/Activity');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;

exports.updateProfile = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next({ statusCode: 401, message: "You can only update your own account!" });

    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const updateData = {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                mobileNumber: req.body.mobileNumber,
                address: req.body.address
            }
        };

        // Handle File Upload (Cloudinary)
        if (req.file) {
            // Delete old profile picture
            const user = await User.findById(req.params.id);
            if (user && user.profilePicture && user.profilePicture.includes('cloudinary')) {
                try {
                    const publicId = user.profilePicture.split('upload/')[1].split('.').slice(0, -1).join('.').split('/').slice(1).join('/');
                    await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                    console.error("Cloudinary Delete Error (Profile Update):", err);
                }
            }
            updateData.$set.profilePicture = req.file.path;
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json({ success: true, user: rest });
    } catch (error) {
        next(error);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        // Access Control: Allow if self OR if manager/owner
        const allowedRoles = ['owner', 'manager'];
        if (req.user.id !== req.params.id && !allowedRoles.includes(req.user.role)) {
            return next({ statusCode: 403, message: "You are not authorized to view this profile!" });
        }

        const user = await User.findById(req.params.id);
        if (!user) return next({ statusCode: 404, message: "User not found!" });
        const { password, ...rest } = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

exports.getUserWithOrders = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return next({ statusCode: 404, message: "User not found!" });

        const orders = await Order.find({ userId: req.params.id }).sort({ createdAt: -1 });

        const { password, ...rest } = user._doc;
        res.status(200).json({ ...rest, orders });
    } catch (error) {
        next(error);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude passwords
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

exports.updateUserRole = async (req, res, next) => {
    try {
        // Strict check: Only owner can manage roles
        if (req.user.role !== 'owner') {
            return next({ statusCode: 403, message: "Only owners can manage user roles!" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { role: req.body.role } },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        if (req.user.role !== 'owner') return next({ statusCode: 403, message: "Only owners can create users/managers!" });

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            ...req.body,
            password: hashedPassword
        });

        await newUser.save();
        const { password, ...rest } = newUser._doc;
        res.status(201).json(rest);
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        // Only owner can delete users/staff
        if (req.user.role !== 'owner') return next({ statusCode: 403, message: "Only owners can delete users!" });

        // Safeguard: Cannot delete self
        if (req.user.id === req.params.id) return next({ statusCode: 400, message: "You cannot delete your own account!" });

        const user = await User.findById(req.params.id);
        if (user) {
            // Delete profile picture
            if (user.profilePicture && user.profilePicture.includes('cloudinary')) {
                try {
                    const publicId = user.profilePicture.split('upload/')[1].split('.').slice(0, -1).join('.').split('/').slice(1).join('/');
                    await cloudinary.uploader.destroy(publicId);
                } catch (err) {
                    console.error("Cloudinary Delete Error (Admin User Delete):", err);
                }
            }

            // Cleanup Reviews and Review Images
            const productsWithReviews = await Product.find({ 'reviews.userId': user._id });

            for (const product of productsWithReviews) {
                const userReviews = product.reviews.filter(rev => rev.userId && rev.userId.toString() === user._id.toString());

                for (const rev of userReviews) {
                    if (rev.image && rev.image.includes('cloudinary')) {
                        try {
                            const publicId = rev.image.split('upload/')[1].split('.').slice(0, -1).join('.').split('/').slice(1).join('/');
                            await cloudinary.uploader.destroy(publicId);
                        } catch (err) {
                            console.error("Cloudinary Delete Error (Review cleanup on user delete):", err);
                        }
                    }
                }

                // Remove reviews from product
                product.reviews = product.reviews.filter(rev => rev.userId && rev.userId.toString() !== user._id.toString());

                // Recalculate Aggregates
                product.numReviews = product.reviews.length;
                if (product.numReviews > 0) {
                    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
                } else {
                    product.rating = 0;
                }

                await product.save();
            }
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        next(error);
    }
};

exports.toggleUserStatus = async (req, res, next) => {
    try {
        // Only owner can change status
        if (req.user.role !== 'owner') return next({ statusCode: 403, message: "Only owners can change user status!" });

        // Safeguard: Cannot disable self
        if (req.user.id === req.params.id) return next({ statusCode: 400, message: "You cannot disable your own account!" });

        const user = await User.findById(req.params.id);
        if (!user) return next({ statusCode: 404, message: "User not found!" });

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

exports.getManagerActivity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { startDate, endDate } = req.query;

        let query = { userId: id };

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.timestamp.$lte = end;
            }
        }

        const activities = await Activity.find(query).sort({ timestamp: -1 });
        res.status(200).json(activities);
    } catch (error) {
        next(error);
    }
};

exports.getManagersStats = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        let dateFilter = {};
        if (startDate || endDate) {
            dateFilter = { timestamp: {} };
            if (startDate) dateFilter.timestamp.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                dateFilter.timestamp.$lte = end;
            }
        }

        const stats = await Activity.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: { userId: '$userId', action: '$action' },
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id.userId',
                    foreignField: '_id',
                    as: 'manager'
                }
            },
            { $unwind: '$manager' },
            {
                $project: {
                    userId: '$_id.userId',
                    action: '$_id.action',
                    count: 1,
                    managerName: { $concat: ['$manager.firstName', ' ', '$manager.lastName'] },
                    managerUsername: '$manager.username'
                }
            }
        ]);

        // Reformat data for frontend consumption (group by manager)
        const formattedStats = stats.reduce((acc, curr) => {
            const userId = curr.userId.toString();
            if (!acc[userId]) {
                acc[userId] = {
                    managerId: userId,
                    name: curr.managerName,
                    username: curr.managerUsername,
                    added: 0,
                    updated: 0
                };
            }
            if (curr.action === 'CREATE') acc[userId].added = curr.count;
            if (curr.action === 'UPDATE') acc[userId].updated = curr.count;
            return acc;
        }, {});

        res.status(200).json(Object.values(formattedStats));
    } catch (error) {
        next(error);
    }
};

exports.toggleWishlist = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return next({ statusCode: 404, message: "User not found!" });

        const index = user.likedProducts.indexOf(productId);
        if (index === -1) {
            user.likedProducts.push(productId);
        } else {
            user.likedProducts.splice(index, 1);
        }

        await user.save();

        // Populate and return updated wishlist immediately? 
        // Or just return IDs. Frontend usually expects ids for toggle.
        // Let's return IDs as before.
        res.status(200).json({ success: true, wishlist: user.likedProducts });
    } catch (error) {
        next(error);
    }
};

exports.getWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('likedProducts');
        if (!user) return next({ statusCode: 404, message: "User not found!" });

        res.status(200).json(user.likedProducts);
    } catch (error) {
        next(error);
    }
};


exports.adminResetPassword = async (req, res, next) => {
    try {
        if (req.user.role !== 'owner') {
            return next({ statusCode: 403, message: "Only owners can reset user passwords!" });
        }

        const { userId, newPassword } = req.body;

        if (!userId || !newPassword) {
            return next({ statusCode: 400, message: "User ID and new password are required!" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return next({ statusCode: 404, message: "User not found!" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return next({ statusCode: 400, message: "Incorrect old password!" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        next(error);
    }
};

exports.deleteMe = async (req, res, next) => {
    try {
        const { password } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return next({ statusCode: 404, message: "User not found!" });

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next({ statusCode: 400, message: "Incorrect password! Account deletion aborted." });
        }

        // Delete profile picture from Cloudinary if it exists
        if (user.profilePicture && user.profilePicture.includes('cloudinary')) {
            try {
                const publicId = user.profilePicture.split('upload/')[1].split('.').slice(0, -1).join('.').split('/').slice(1).join('/');
                await cloudinary.uploader.destroy(publicId);
            } catch (cloudErr) {
                console.error("Error deleting profile picture from Cloudinary:", cloudErr);
            }
        }

        // Cleanup Reviews and Review Images
        const productsWithReviews = await Product.find({ 'reviews.userId': user._id });

        for (const product of productsWithReviews) {
            const userReviews = product.reviews.filter(rev => rev.userId && rev.userId.toString() === user._id.toString());

            for (const rev of userReviews) {
                if (rev.image && rev.image.includes('cloudinary')) {
                    try {
                        const publicId = rev.image.split('upload/')[1].split('.').slice(0, -1).join('.').split('/').slice(1).join('/');
                        await cloudinary.uploader.destroy(publicId);
                    } catch (err) {
                        console.error("Cloudinary Delete Error (Review cleanup on user delete):", err);
                    }
                }
            }

            // Remove reviews from product
            product.reviews = product.reviews.filter(rev => rev.userId && rev.userId.toString() !== user._id.toString());

            // Recalculate Aggregates
            product.numReviews = product.reviews.length;
            if (product.numReviews > 0) {
                product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
            } else {
                product.rating = 0;
            }

            await product.save();
        }

        await User.findByIdAndDelete(req.user.id);

        res.status(200).json({ success: true, message: "Your account has been permanently deleted." });
    } catch (error) {
        next(error);
    }
};
