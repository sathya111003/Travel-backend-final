const express = require('express');
const router = express.Router();
const { getRecentTours, getRecentTourById, addRecentTour, deleteRecentTour, updateRecentTour } = require('../controllers/recentTourController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getRecentTours).post(protect, admin, addRecentTour);
router.route('/:id').get(getRecentTourById).delete(protect, admin, deleteRecentTour).put(protect, admin, updateRecentTour);

module.exports = router;
