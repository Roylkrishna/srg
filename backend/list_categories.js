const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');

dotenv.config();

const listCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const categories = await Category.find({});
        console.log(`Found ${categories.length} categories:`);
        categories.forEach(c => {
            console.log(`- [${c._id}] ${c.name} (Created: ${c.createdAt})`);
        });
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listCategories();
