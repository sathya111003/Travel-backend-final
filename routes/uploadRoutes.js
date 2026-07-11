const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, admin } = require('../middleware/authMiddleware');

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
            const protocol = req.protocol;
            const host = req.get('host');
            const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

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
            const protocol = req.protocol;
            const host = req.get('host');
            const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

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
            const protocol = req.protocol;
            const host = req.get('host');
            const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

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

module.exports = router;
