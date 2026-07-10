const express = require('express');
const router = express.Router();
const {
    getTrainings,
    createTraining,
    updateTraining,
    deleteTraining
} = require('../controllers/trainingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getTrainings)
    .post(protect, admin, createTraining);

router.route('/:id')
    .put(protect, admin, updateTraining)
    .delete(protect, admin, deleteTraining);

module.exports = router;
