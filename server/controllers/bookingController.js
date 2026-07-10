const Booking = require('../models/Booking');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const addBookingItems = async (req, res) => {
    try {
        const { packageId, travelDate, persons, totalPrice } = req.body;

        if (!packageId || !travelDate || !totalPrice) {
            res.status(400).json({ message: 'Missing booking details' });
            return;
        }

        const booking = new Booking({
            user: req.user._id,
            package: packageId,
            travelDate,
            persons,
            totalPrice,
            bookingDate: new Date()
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('package');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user', 'id name').populate('package', 'id title');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addBookingItems, getMyBookings, getBookings };
