const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // Selling Price
    purchasedPrice: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    quantityAvailable: { type: Number, required: true },
    images: [String],
    details: { type: Map, of: String }, // Flexible key-value pairs
    reviews: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: Number,
        comment: String,
        image: String,
        date: { type: Date, default: Date.now }
    }],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }],
    lastEditedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastEditedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
