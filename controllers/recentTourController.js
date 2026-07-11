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
        const { title, image, images, days, description, videoUrl, videoUrls, audioUrl, audioUrls, packageId } = req.body;
        const tourData = { title, image, images, days, description, videoUrl, videoUrls, audioUrl, audioUrls };
        if (packageId && packageId.trim() !== '') {
            tourData.packageId = packageId;
        }
        const tour = new RecentTour(tourData);
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

// @desc    Update a recent tour
// @route   PUT /api/recentTours/:id
// @access  Private/Admin
const updateRecentTour = async (req, res) => {
    try {
        const { title, image, images, days, description, videoUrl, videoUrls, audioUrl, audioUrls, packageId } = req.body;
        const tour = await RecentTour.findById(req.params.id);
        if (tour) {
            tour.title = title || tour.title;
            tour.image = image !== undefined ? image : tour.image;
            tour.images = images !== undefined ? images : tour.images;
            tour.days = days || tour.days;
            tour.description = description || tour.description;
            tour.videoUrl = videoUrl !== undefined ? videoUrl : tour.videoUrl;
            tour.videoUrls = videoUrls !== undefined ? videoUrls : tour.videoUrls;
            tour.audioUrl = audioUrl !== undefined ? audioUrl : tour.audioUrl;
            tour.audioUrls = audioUrls !== undefined ? audioUrls : tour.audioUrls;
            tour.packageId = (packageId !== undefined && packageId !== '') ? packageId : null;

            const updatedTour = await tour.save();
            res.json(updatedTour);
        } else {
            res.status(404).json({ message: 'Recent tour not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getRecentTours, getRecentTourById, addRecentTour, deleteRecentTour, updateRecentTour };
