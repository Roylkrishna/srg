const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

exports.getSiteStats = async (req, res) => {
    try {
        const [userCount, productCount, categoryCount, orderCount, categoryStats] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            Product.countDocuments(),
            Category.countDocuments(),
            Order.countDocuments(),
            Product.aggregate([
                { $group: { _id: "$category", count: { $sum: 1 } } }
            ])
        ]);

        res.status(200).json({
            success: true,
            stats: {
                patrons: userCount,
                curations: productCount,
                categories: categoryCount,
                orders: orderCount,
                categoryStats: categoryStats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching site stats',
            error: error.message
        });
    }
};
