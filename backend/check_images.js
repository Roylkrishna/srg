const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const checkImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find({}).select('name images');
        console.log("--- PRODUCT IMAGES ---");
        products.forEach(p => {
            console.log(`Product: ${p.name}`);
            console.log(`Images:`, JSON.stringify(p.images));
        });
        console.log("----------------------");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkImages();
