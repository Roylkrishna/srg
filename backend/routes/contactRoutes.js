const express = require('express');
const { getContact, updateContact } = require('../controllers/contactController');
const { verifyToken, verifyOwner } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getContact);
router.put('/', verifyToken, verifyOwner, updateContact);

module.exports = router;
