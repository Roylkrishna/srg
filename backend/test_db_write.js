const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('Testing DB with URI:', process.env.MONGO_URI);

const testDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        const User = require('./models/User'); // Use actual model
        console.log('Reading Users...');
        // Set short timeout to fail fast
        const users = await User.find({}).maxTimeMS(2000);
        console.log('Found users:', users.length);

        await mongoose.connection.close();
        console.log('Done.');
    } catch (error) {
        console.error('Test Failed:', error);
    }
};

testDB();
