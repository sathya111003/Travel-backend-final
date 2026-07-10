const express = require('express');
const router = express.Router();
const { addBookingItems, getMyBookings, getBookings } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addBookingItems).get(protect, admin, getBookings);
router.route('/mybookings').get(protect, getMyBookings);

module.exports = router;
