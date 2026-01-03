const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const forceFix = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const product = await Product.findOne({ name: 'x' });
        if (product) {
            // Hardcode the known good filename from the uploads directory
            // product-1767437426359-706335350.jpg
            product.images = ['http://localhost:5000/uploads/product-1767437426359-706335350.jpg'];
            await product.save();
            console.log('Fixed product x');
        } else {
            console.log('Product x not found');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

forceFix();
