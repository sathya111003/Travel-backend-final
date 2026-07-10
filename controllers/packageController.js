const Package = require('../models/Package');

// @desc    Fetch all packages
// @route   GET /api/packages
// @access  Public
const getPackages = async (req, res) => {
    try {
        const keyword = req.query.keyword ? {
            $or: [
                { title: { $regex: req.query.keyword, $options: 'i' } },
                { description: { $regex: req.query.keyword, $options: 'i' } },
                { "location.name": { $regex: req.query.keyword, $options: 'i' } },
                { category: { $regex: req.query.keyword, $options: 'i' } },
                { type: { $regex: req.query.keyword, $options: 'i' } }
            ]
        } : {};

        const category = req.query.category ? { category: req.query.category } : {};
        const type = req.query.type ? { type: req.query.type } : {};

        const sort = req.query.sort === 'latest' ? { createdAt: -1 } : { createdAt: 1 };
        const limit = req.query.limit ? parseInt(req.query.limit) : 0;

        const packages = await Package.find({ ...keyword, ...category, ...type })
            .sort(sort)
            .limit(limit);
            
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single package
// @route   GET /api/packages/:id
// @access  Public
const getPackageById = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (pkg) {
            res.json(pkg);
        } else {
            res.status(404).json({ message: 'Package not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a package
// @route   POST /api/packages
// @access  Private/Admin
const createPackage = async (req, res) => {
    try {
        const pkg = new Package(req.body);
        const createdPackage = await pkg.save();
        res.status(201).json(createdPackage);
    } catch (error) {
        console.error("Package Creation Error: ", error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a package
// @route   PUT /api/packages/:id
// @access  Private/Admin
const updatePackage = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (pkg) {
            Object.assign(pkg, req.body);
            const updatedPackage = await pkg.save();
            res.json(updatedPackage);
        } else {
            res.status(404).json({ message: 'Package not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
const deletePackage = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (pkg) {
            await Package.deleteOne({ _id: pkg._id });
            res.json({ message: 'Package removed' });
        } else {
            res.status(404).json({ message: 'Package not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPackages, getPackageById, createPackage, updatePackage, deletePackage };
