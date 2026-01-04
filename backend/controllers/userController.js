const User = require('../models/User');
const Order = require('../models/Order');
const Activity = require('../models/Activity');
const bcrypt = require('bcryptjs');

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

