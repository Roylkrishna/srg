const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const migrateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find({});

        let count = 0;
        for (const product of products) {
            let modified = false;
            const newImages = product.images.map(img => {
                // Check if it looks like an absolute URL (http/https)
                if (img.startsWith('http')) {
                    // Extract the path starting from /uploads
                    const match = img.match(/\/uploads\/.*$/);
                    if (match) {
                        modified = true;
                        return match[0]; // e.g., "/uploads/filename.jpg"
                    }
                }
                return img;
            });

            if (modified) {
                product.images = newImages;
                await product.save();
                console.log(`Migrated ${product.name}`);
                count++;
            }
        }

        console.log(`Migration complete. Updated ${count} products.`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

migrateImages();
