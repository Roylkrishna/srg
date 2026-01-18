const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        default: '+91 98765 43210'
    },
    email: {
        type: String,
        required: true,
        default: 'contact@shreerama.com'
    },
    address: {
        type: String,
        required: true,
        default: '123, Temple Road, Ayodhya, UP - 224123'
    },
    mapUrl: {
        type: String,
        default: '' // Optional Google Maps Embed URL
    },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    youtube: { type: String, default: '' }
}, { timestamps: true });

// Singleton Pattern: Ensure only one document exists
contactSchema.statics.getSingleton = async function () {
    const doc = await this.findOne();
    if (doc) {
        return doc;
    }
    return await this.create({});
};

module.exports = mongoose.model('Contact', contactSchema);
