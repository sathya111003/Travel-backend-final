const Destination = require('../models/Destination');

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
const getDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find({});
        res.json(destinations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a destination region
// @route   POST /api/destinations
// @access  Private/Admin
const createDestination = async (req, res) => {
    try {
        const { region, type, cities } = req.body;
        const destination = new Destination({ region, type, cities });
        const createdDestination = await destination.save();
        res.status(201).json(createdDestination);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a destination region
// @route   PUT /api/destinations/:id
// @access  Private/Admin
const updateDestination = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (destination) {
            destination.region = req.body.region || destination.region;
            destination.type = req.body.type || destination.type;
            destination.cities = req.body.cities || destination.cities;
            const updatedDestination = await destination.save();
            res.json(updatedDestination);
        } else {
            res.status(404).json({ message: 'Destination not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a destination region
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
const deleteDestination = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (destination) {
            await Destination.deleteOne({ _id: destination._id });
            res.json({ message: 'Destination removed' });
        } else {
            res.status(404).json({ message: 'Destination not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDestinations, createDestination, updateDestination, deleteDestination };
