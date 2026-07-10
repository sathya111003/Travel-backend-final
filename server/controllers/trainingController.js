const Training = require('../models/Training');

// @desc    Get all training programs
// @route   GET /api/training
// @access  Public
const getTrainings = async (req, res) => {
    try {
        const { activeOnly } = req.query;
        let query = {};
        if (activeOnly === 'true') {
            query.isActive = true;
        }
        const programs = await Training.find(query).sort({ createdAt: -1 });
        res.json(programs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a training program
// @route   POST /api/training
// @access  Private/Admin
const createTraining = async (req, res) => {
    try {
        const { title, description, duration, isActive } = req.body;

        if (!title || !description || !duration) {
            return res.status(400).json({ message: 'Please provide all required fields (title, description, duration)' });
        }

        const training = new Training({
            title,
            description,
            duration,
            isActive: isActive !== undefined ? isActive : true
        });

        const createdTraining = await training.save();
        res.status(201).json(createdTraining);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a training program
// @route   PUT /api/training/:id
// @access  Private/Admin
const updateTraining = async (req, res) => {
    try {
        const { title, description, duration, isActive } = req.body;
        const training = await Training.findById(req.params.id);

        if (training) {
            training.title = title !== undefined ? title : training.title;
            training.description = description !== undefined ? description : training.description;
            training.duration = duration !== undefined ? duration : training.duration;
            training.isActive = isActive !== undefined ? isActive : training.isActive;

            const updatedTraining = await training.save();
            res.json(updatedTraining);
        } else {
            res.status(404).json({ message: 'Training program not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a training program
// @route   DELETE /api/training/:id
// @access  Private/Admin
const deleteTraining = async (req, res) => {
    try {
        const training = await Training.findById(req.params.id);
        if (training) {
            await Training.deleteOne({ _id: req.params.id });
            res.json({ message: 'Training program removed successfully' });
        } else {
            res.status(404).json({ message: 'Training program not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTrainings,
    createTraining,
    updateTraining,
    deleteTraining
};
