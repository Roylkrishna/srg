const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// Serve Static Files (placed before rate limiter to avoid blocking images)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Security Headers
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // limit each IP to 300 requests per windowMs (approx 1 req/3s)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: (req, res) => {
        // Exempt admin-heavy operations (Uploads, Edits)
        // This assumes these routes are protected by Auth Middleware
        if (req.method === 'OPTIONS') return true;
        const adminMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
        const adminPaths = [
            '/api/products',
            '/api/categories',
            '/api/banners',
            '/api/stats'
        ];

        if (adminMethods.includes(req.method) && adminPaths.some(p => req.originalUrl.startsWith(p))) {
            return true;
        }
        return false;
    }
});
app.use(limiter);

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Serve Static Files - Moved above

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectDB, 5000);
    }
};

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('API is running...');
});

// DB Readiness Middleware
app.use((req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            message: 'Database service is unavailable. Please ensure MongoDB is running.'
        });
    }
    next();
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const statsRoutes = require('./routes/statsRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/stats', statsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});
