const express = require('express');
const router = express.Router();
const {
    getGallery,
    createGalleryItem,
    deleteGalleryItem
} = require('../controllers/galleryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getGallery)
    .post(protect, admin, createGalleryItem);

router.route('/:id')
    .delete(protect, admin, deleteGalleryItem);

module.exports = router;
