const Analytics = require('../models/Analytics');
const Product = require('../models/Product');

// @desc    Log a user event
// @route   POST /api/analytics/log
// @access  Public
exports.logEvent = async (req, res) => {
    try {
        const { eventType, productId, metadata } = req.body;

        let userId = null;
        if (req.user) {
            userId = req.user.id;
        }

        const analytics = await Analytics.create({
            eventType,
            userId,
            productId,
            metadata,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.status(201).json({ success: true, id: analytics._id });
    } catch (error) {
        console.error('Analytics Log Error:', error);
        // Don't block the client if analytics fail
        res.status(200).json({ success: false, error: error.message });
    }
};

// @desc    Get analytics dashboard data
// @route   GET /api/analytics/dashboard
// @access  Private (Admin/Owner)
exports.getDashboardStats = async (req, res) => {
    try {
        const { timeRange } = req.query; // '7d', '30d', 'all'

        let dateFilter = {};
        const now = new Date();
        if (timeRange === '7d') {
            dateFilter = { timestamp: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
        } else if (timeRange === '30d') {
            dateFilter = { timestamp: { $gte: new Date(now.setDate(now.getDate() - 30)) } };
        }

        // 1. Top Viewed Products
        const topProducts = await Analytics.aggregate([
            { $match: { eventType: 'VIEW_PRODUCT', ...dateFilter } },
            { $group: { _id: '$productId', views: { $sum: 1 } } },
            { $sort: { views: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    _id: 1,
                    views: 1,
                    name: '$product.name',
                    image: { $arrayElemAt: ['$product.images', 0] },
                    price: '$product.price'
                }
            }
        ]);

        // 2. Top Search Terms
        const topSearches = await Analytics.aggregate([
            { $match: { eventType: 'SEARCH', ...dateFilter } },
            // Normalizing query: lowercase and trim
            {
                $project: {
                    query: { $toLower: { $trim: { input: '$metadata.query' } } }
                }
            },
            { $match: { query: { $ne: '' } } }, // remove empty
            { $group: { _id: '$query', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // 3. Activity Timeline (Last 7 days views)
        // Group by Date
        const viewsOverTime = await Analytics.aggregate([
            { $match: { eventType: 'VIEW_PRODUCT', ...dateFilter } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 4. Recent Activity Logs (Last 50 events)
        const recentActivity = await Analytics.find(dateFilter)
            .sort({ timestamp: -1 })
            .limit(50)
            .populate('userId', 'firstName lastName email')
            .populate('productId', 'name image');

        res.status(200).json({
            topProducts,
            topSearches,
            viewsOverTime,
            recentActivity
        });
    } catch (error) {
        console.error('Analytics Dashboard Error:', error);
        res.status(500).json({ message: 'Error fetching analytics' });
    }
};
