const Contact = require('../models/Contact');

// @desc    Get Contact Information
// @route   GET /api/contact
// @access  Public
exports.getContact = async (req, res, next) => {
    try {
        const contact = await Contact.getSingleton();
        res.status(200).json({ success: true, contact });
    } catch (error) {
        next(error);
    }
};

// @desc    Update Contact Information
// @route   PUT /api/contact
// @access  Private/Owner
exports.updateContact = async (req, res, next) => {
    try {
        const updates = req.body;
        const contact = await Contact.getSingleton();

        Object.keys(updates).forEach(key => {
            contact[key] = updates[key];
        });

        await contact.save();

        res.status(200).json({ success: true, contact, message: 'Contact information updated' });
    } catch (error) {
        next(error);
    }
};
