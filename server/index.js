const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
// Forced restart again for email test
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Basic Route
app.get('/', (req, res) => {
    res.send('Travel API is running...');
});

// Define Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/recentTours', require('./routes/recentTourRoutes'));
app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Serve uploads static files
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
