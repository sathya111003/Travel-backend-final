const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const adminExists = await User.findOne({ email: 'admin@travelweb.com' });

        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@travelweb.com',
            password: 'adminpassword123',
            role: 'admin'
        });

        if (admin) {
            console.log('Admin user created successfully!');
            console.log('Email: admin@travelweb.com');
            console.log('Password: adminpassword123');
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
