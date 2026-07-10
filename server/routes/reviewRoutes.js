const express = require('express');
const router = express.Router();
const { getReviewsByPackage, addReview, getAllReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, addReview).get(getAllReviews);
router.route('/:packageId').get(getReviewsByPackage);

module.exports = router;
