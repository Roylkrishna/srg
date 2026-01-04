const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');

dotenv.config();

const clearCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const result = await Category.deleteMany({});
        console.log(`Deleted ${result.deletedCount} categories.`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

clearCategories();
