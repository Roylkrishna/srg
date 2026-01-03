const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const fixImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find({});

        for (const product of products) {
            let modified = false;
            const newImages = product.images.map(img => {
                // Remove control characters using regex
                const cleanImg = img.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
                if (cleanImg !== img) {
                    console.log(`Fixing for ${product.name}:`);
                    console.log(`  Old: ${JSON.stringify(img)}`);
                    console.log(`  New: ${JSON.stringify(cleanImg)}`);
                    modified = true;
                }
                return cleanImg;
            });

            if (modified) {
                product.images = newImages;
                await product.save();
                console.log(`Saved product ${product.name}`);
            }
        }

        console.log("Cleanup complete.");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixImages();
