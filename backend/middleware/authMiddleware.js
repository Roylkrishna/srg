const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return next({ statusCode: 401, message: "You are not authenticated!" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next({ statusCode: 403, message: "Token is not valid!" });

        // Sliding Session: Refresh token on every active request
        const newToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        res.cookie('access_token', newToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production' // Uncomment in production
        });

        req.user = user;
        next();
    });
};

exports.verifyAdmin = (req, res, next) => {
    const allowedRoles = ['owner', 'manager'];
    if (allowedRoles.includes(req.user.role)) {
        next();
    } else {
        return next({ statusCode: 403, message: "Access denied. Restricted to Owner or Manager only." });
    }
};

exports.verifyOwner = (req, res, next) => {
    if (req.user.role === 'owner') {
        next();
    } else {
        return next({ statusCode: 403, message: "You are not authorized! Owner only." });
    }
};
