const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to generate suggestions
const generateSuggestions = async (username) => {
    const suggestions = [];
    let count = 0;
    while (suggestions.length < 3 && count < 10) {
        const randomNum = Math.floor(Math.random() * 1000);
        const suffix = count === 0 ? '123' : count === 1 ? '_gift' : `_${randomNum}`;
        const newName = `${username}${suffix}`;

        const exists = await User.findOne({ username: newName });
        if (!exists) {
            suggestions.push(newName);
        }
        count++;
    }
    return suggestions;
};

exports.signup = async (req, res, next) => {
    const { firstName, lastName, username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            if (existingUser.username === username) {
                const suggestions = await generateSuggestions(username);
                return res.status(409).json({
                    success: false,
                    message: "Username taken",
                    suggestions
                });
            }
            if (existingUser.email === email) {
                return res.status(409).json({ success: false, message: "Email already exists" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '10m' });
        const { password: pass, ...rest } = newUser._doc;

        res.cookie('access_token', token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 10 * 60 * 1000 // 10 minutes
        })
            .status(201)
            .json({ success: true, user: rest, message: "User created successfully" });
    } catch (error) {
        next(error);
    }
};

const svgCaptcha = require('svg-captcha');

exports.getCaptcha = (req, res) => {
    const captcha = svgCaptcha.create({
        size: 5,
        noise: 2,
        color: true,
        background: '#cc9966'
    });

    res.cookie('captcha', captcha.text, {
        httpOnly: true,
        signed: true,
        maxAge: 10 * 60 * 1000 // 10 minutes
    });

    res.status(200).send(captcha.data);
};

exports.login = async (req, res, next) => {
    const { identifier, password, captchaToken } = req.body; // captchaToken here will be the text input

    try {
        // Verify Captcha
        if (!captchaToken) {
            return next({ statusCode: 400, message: "Please enter the captcha" });
        }

        const signedCookie = req.signedCookies.captcha;
        if (!signedCookie || signedCookie !== captchaToken) {
            return next({ statusCode: 400, message: "Invalid captcha. Please try again." });
        }

        // Clear captcha cookie after usage/attempt to prevent reuse (optional but good security)
        res.clearCookie('captcha');

        const validUser = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });

        if (!validUser) return next({ statusCode: 404, message: "User not found" });

        if (validUser.isActive === false) {
            return next({ statusCode: 403, message: "Your account has been disabled. Please contact the owner." });
        }

        const validPassword = await bcrypt.compare(password, validUser.password);
        if (!validPassword) return next({ statusCode: 401, message: "Wrong credentials" });

        const token = jwt.sign({ id: validUser._id, role: validUser.role }, process.env.JWT_SECRET, { expiresIn: '10m' });

        const { password: pass, ...rest } = validUser._doc;

        res.cookie('access_token', token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 10 * 60 * 1000 // 10 minutes
        })
            .status(200)
            .json({ success: true, user: rest });
    } catch (error) {
        next(error);
    }
};

exports.googleAuth = async (req, res, next) => {
    // checking if user exists, and creating/logging them in.
    res.status(501).json({ message: "Google Auth not implemented yet" });
};

exports.checkAuth = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) return res.status(200).json({ isAuthenticated: false });

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(200).json({ isAuthenticated: false });
            }

            const user = await User.findById(decoded.id).select('-password');
            if (!user) return res.status(200).json({ isAuthenticated: false });

            res.status(200).json({ isAuthenticated: true, user });
        });
    } catch (error) {
        next(error);
    }
};

exports.logout = (req, res) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        secure: process.env.NODE_ENV === 'production'
    }).status(200).json({ success: true, message: 'Logged out successfully' });
};

