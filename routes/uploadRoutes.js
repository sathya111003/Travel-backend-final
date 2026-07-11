const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, admin } = require('../middleware/authMiddleware');

// Resolve base URL for uploaded file URLs
// Use BACKEND_URL env var if set, otherwise detect from request headers (handles Render reverse proxy)
function getBaseUrl(req) {
    if (process.env.BACKEND_URL) return process.env.BACKEND_URL;
    const proto = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    return `${proto}://${host}`;
}

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
        );
    },
});

// Check file types (Images only)
function checkImageType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed!'));
    }
}

// Check file types (Video only)
function checkVideoType(file, cb) {
    const filetypes = /mp4|webm|ogg|mov/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype.startsWith('video/');

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only video files (mp4, webm, ogg, mov) are allowed!'));
    }
}

// Check file types (Audio only)
function checkAudioType(file, cb) {
    const filetypes = /mp3|wav|ogg|m4a|aac/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype.startsWith('audio/');

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only audio files (mp3, wav, ogg, m4a, aac) are allowed!'));
    }
}

const uploadImage = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkImageType(file, cb);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const uploadVideoMulter = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkVideoType(file, cb);
    },
    limits: { fileSize: 250 * 1024 * 1024 } // 250MB limit
});

const uploadAudioMulter = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkAudioType(file, cb);
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const handleImageUpload = (req, res) => {
    uploadImage.single('image')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Multer Error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please select an image file to upload' });
        }

        try {
            const baseUrl = getBaseUrl(req);
            const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

            res.json({
                message: 'Image uploaded successfully',
                url: fileUrl,
                filename: req.file.filename
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};

// @desc    Upload an image
// @route   POST /api/upload and /api/upload/image
// @access  Private/Admin
router.post('/', protect, admin, handleImageUpload);
router.post('/image', protect, admin, handleImageUpload);

// @desc    Upload a video
// @route   POST /api/upload/video
// @access  Private/Admin
router.post('/video', protect, admin, (req, res) => {
    uploadVideoMulter.single('video')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Multer Error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please select a video file to upload' });
        }

        try {
            const baseUrl = getBaseUrl(req);
            const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

            res.json({
                message: 'Video uploaded successfully',
                url: fileUrl,
                filename: req.file.filename
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
});

// @desc    Upload audio
// @route   POST /api/upload/audio
// @access  Private/Admin
router.post('/audio', protect, admin, (req, res) => {
    uploadAudioMulter.single('audio')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Multer Error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please select an audio file to upload' });
        }

        try {
            const baseUrl = getBaseUrl(req);
            const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

            res.json({
                message: 'Audio uploaded successfully',
                url: fileUrl,
                filename: req.file.filename
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
});

// @desc    Fix broken http:// URLs in DB to use correct base URL
// @route   POST /api/upload/fix-urls
// @access  Private/Admin
router.post('/fix-urls', protect, admin, async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const baseUrl = getBaseUrl(req);
        let fixed = 0;

        // Fix Packages
        const Package = mongoose.model('Package');
        const packages = await Package.find();
        for (const pkg of packages) {
            let changed = false;
            if (pkg.images && pkg.images.length) {
                pkg.images = pkg.images.map(img => {
                    if (img && img.startsWith('http://')) {
                        changed = true;
                        return img.replace(/^http:\/\/[^/]+/, baseUrl);
                    }
                    return img;
                });
            }
            if (pkg.hotel && pkg.hotel.image && pkg.hotel.image.startsWith('http://')) {
                pkg.hotel.image = pkg.hotel.image.replace(/^http:\/\/[^/]+/, baseUrl);
                changed = true;
            }
            if (changed) { await pkg.save(); fixed++; }
        }

        // Fix RecentTours
        const RecentTour = mongoose.model('RecentTour');
        const tours = await RecentTour.find();
        for (const tour of tours) {
            let changed = false;
            if (tour.image && tour.image.startsWith('http://')) {
                tour.image = tour.image.replace(/^http:\/\/[^/]+/, baseUrl);
                changed = true;
            }
            if (tour.images && tour.images.length) {
                tour.images = tour.images.map(img => {
                    if (img && img.startsWith('http://')) {
                        changed = true;
                        return img.replace(/^http:\/\/[^/]+/, baseUrl);
                    }
                    return img;
                });
            }
            if (tour.videoUrl && tour.videoUrl.startsWith('http://')) {
                tour.videoUrl = tour.videoUrl.replace(/^http:\/\/[^/]+/, baseUrl);
                changed = true;
            }
            if (tour.videoUrls && tour.videoUrls.length) {
                tour.videoUrls = tour.videoUrls.map(v => {
                    if (v && v.startsWith('http://')) {
                        changed = true;
                        return v.replace(/^http:\/\/[^/]+/, baseUrl);
                    }
                    return v;
                });
            }
            if (tour.audioUrl && tour.audioUrl.startsWith('http://')) {
                tour.audioUrl = tour.audioUrl.replace(/^http:\/\/[^/]+/, baseUrl);
                changed = true;
            }
            if (changed) { await tour.save(); fixed++; }
        }

        // Fix Destinations
        const Destination = mongoose.model('Destination');
        const destinations = await Destination.find();
        for (const dest of destinations) {
            let changed = false;
            if (dest.cities && dest.cities.length) {
                dest.cities.forEach(city => {
                    if (city.image && city.image.startsWith('http://')) {
                        city.image = city.image.replace(/^http:\/\/[^/]+/, baseUrl);
                        changed = true;
                    }
                });
            }
            if (changed) { await dest.save(); fixed++; }
        }

        res.json({ message: `Fixed ${fixed} documents`, baseUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
