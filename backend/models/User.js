const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true, // Should be optional if using only OAuth in future, but mandatory for now
    },
    mobileNumber: {
        type: String,
    },
    address: {
        street: String,
        city: String,
        zip: String,
        state: String,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    likedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    role: {
        type: String,
        enum: ['user', 'owner', 'manager', 'admin', 'editor'],
        default: 'user',
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
