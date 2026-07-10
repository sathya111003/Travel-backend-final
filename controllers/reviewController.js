const Review = require('../models/Review');

// @desc    Get reviews for a package
// @route   GET /api/reviews/:packageId
// @access  Public
const getReviewsByPackage = async (req, res) => {
    try {
        const reviews = await Review.find({ package: req.params.packageId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
    try {
        const { packageId, rating, comment } = req.body;

        const review = new Review({
            user: req.user._id,
            package: packageId,
            name: req.user.name,
            rating: Number(rating),
            comment,
        });

        const createdReview = await review.save();
        res.status(201).json(createdReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({}).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getReviewsByPackage, addReview, getAllReviews };
