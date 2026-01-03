const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const adminData = {
            firstName: "Admin",
            lastName: "User",
            username: process.env.ADMIN_USERNAME || "admin",
            email: process.env.ADMIN_EMAIL || "admin@example.com",
            password: process.env.ADMIN_PASSWORD || "admin123",
            role: "owner"
        };

        const existingAdmin = await User.findOne({ username: adminData.username });

        if (existingAdmin) {
            console.log('Admin user exists. Updating role and password...');
            const hashedPassword = await bcrypt.hash(adminData.password, 10);
            existingAdmin.password = hashedPassword;
            existingAdmin.role = "owner";
            await existingAdmin.save();
            console.log('Admin user updated successfully.');
        } else {
            console.log('Creating new admin user...');
            const hashedPassword = await bcrypt.hash(adminData.password, 10);
            await User.create({
                ...adminData,
                password: hashedPassword
            });
            console.log('Admin user created successfully.');
        }

        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
