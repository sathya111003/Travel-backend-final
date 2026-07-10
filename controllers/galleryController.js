const Gallery = require('../models/Gallery');

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGallery = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category && category !== 'All') {
            query.category = category;
        }
        const galleryItems = await Gallery.find(query).sort({ createdAt: -1 });
        res.json(galleryItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new gallery item
// @route   POST /api/gallery
// @access  Private/Admin
const createGalleryItem = async (req, res) => {
    try {
        const { imageUrl, category, title } = req.body;

        if (!imageUrl || !category || !title) {
            return res.status(400).json({ message: 'Please provide all required fields (imageUrl, category, title)' });
        }

        const galleryItem = new Gallery({
            imageUrl,
            category,
            title
        });

        const createdItem = await galleryItem.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryItem = async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (item) {
            await Gallery.deleteOne({ _id: req.params.id });
            res.json({ message: 'Gallery item removed successfully' });
        } else {
            res.status(404).json({ message: 'Gallery item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getGallery,
    createGalleryItem,
    deleteGalleryItem
};
