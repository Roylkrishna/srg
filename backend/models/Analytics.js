const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
    eventType: {
        type: String,
        enum: ['VIEW_PRODUCT', 'SEARCH', 'PAGE_VIEW', 'ADD_TO_CART'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    // metadata examples: 
    // SEARCH: { query: 'gold chain' }
    // VIEW_PRODUCT: { source: 'recommendation' }

    ipAddress: String,
    userAgent: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Indexes for faster aggregation
AnalyticsSchema.index({ eventType: 1, timestamp: -1 });
AnalyticsSchema.index({ 'metadata.query': 1 });
AnalyticsSchema.index({ productId: 1 });

module.exports = mongoose.model('Analytics', AnalyticsSchema);
