const RecentTour = require('../models/RecentTour');

// @desc    Get all recent tours
// @route   GET /api/recentTours
// @access  Public
const getRecentTours = async (req, res) => {
    try {
        const tours = await RecentTour.find({}).sort({ createdAt: -1 });
        res.json(tours);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a recent tour
// @route   POST /api/recentTours
// @access  Private/Admin
const addRecentTour = async (req, res) => {
    try {
        const { title, image, days, description, videoUrl, audioUrl } = req.body;
        const tour = new RecentTour({ title, image, days, description, videoUrl, audioUrl });
        const createdTour = await tour.save();
        res.status(201).json(createdTour);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a recent tour
// @route   DELETE /api/recentTours/:id
// @access  Private/Admin
const deleteRecentTour = async (req, res) => {
    try {
        const tour = await RecentTour.findById(req.params.id);
        if (tour) {
            await RecentTour.deleteOne({ _id: tour._id });
            res.json({ message: 'Recent tour removed' });
        } else {
            res.status(404).json({ message: 'Recent tour not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single recent tour
// @route   GET /api/recentTours/:id
// @access  Public
const getRecentTourById = async (req, res) => {
    try {
        const tour = await RecentTour.findById(req.params.id);
        if (tour) {
            res.json(tour);
        } else {
            res.status(404).json({ message: 'Recent tour not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getRecentTours, getRecentTourById, addRecentTour, deleteRecentTour };
