const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Bypass schema validation to find products with string categories
        // We use the native driver or a separate schema? 
        // Actually, if we use lean() or just find, mongoose might still try to cast.
        // Let's use the collection directly to find products with string categories.
        const productsCollection = mongoose.connection.collection('products');
        const products = await productsCollection.find({}).toArray();

        // Get admins/owner for createdBy
        const User = require('./models/User');
        const admin = await User.findOne({ role: 'owner' });
        const adminId = admin ? admin._id : null;

        if (!adminId) {
            console.error('No owner found to assign categories to.');
            process.exit(1);
        }

        for (const p of products) {
            // Check if p.category is a string and not an ObjectId
            // ObjectId is 24 hex chars. 
            if (typeof p.category === 'string' && !mongoose.Types.ObjectId.isValid(p.category)) {
                console.log(`Migrating product: ${p.name}, category: ${p.category}`);

                // Find or create category
                let category = await Category.findOne({ name: { $regex: new RegExp(`^${p.category}$`, 'i') } });

                if (!category) {
                    console.log(`Creating new category: ${p.category}`);
                    category = await Category.create({
                        name: p.category,
                        createdBy: adminId
                    });
                }

                // Update product
                await productsCollection.updateOne(
                    { _id: p._id },
                    { $set: { category: category._id } }
                );
                console.log(`Updated product ${p.name} with category ID ${category._id}`);
            }
        }

        console.log('Migration completed.');
        process.exit();
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
