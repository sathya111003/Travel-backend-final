const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, admin } = require('../middleware/authMiddleware');

// Ensure uploads directories exist
const uploadDir = path.join(__dirname, '..', 'uploads');
const imagesDir = path.join(uploadDir, 'images');
const videosDir = path.join(uploadDir, 'videos');
const audioDir = path.join(uploadDir, 'audio');

[uploadDir, imagesDir, videosDir, audioDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

// File type filters
function imageFilter(file, cb) {
    const allowed = /jpg|jpeg|png|webp|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files (jpg, jpeg, png, webp, gif) are allowed!'));
}

function videoFilter(file, cb) {
    const allowed = /mp4|webm|ogg|mov|avi/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = file.mimetype.startsWith('video/');
    if (ext || mime) return cb(null, true);
    cb(new Error('Only video files (mp4, webm, mov, avi) are allowed!'));
}

function audioFilter(file, cb) {
    const allowed = /mp3|wav|ogg|m4a|aac|flac/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = file.mimetype.startsWith('audio/');
    if (ext || mime) return cb(null, true);
    cb(new Error('Only audio files (mp3, wav, ogg, m4a, aac) are allowed!'));
}

const uploadImage = multer({
    storage: { ...storage, destination: (req, file, cb) => cb(null, imagesDir) },
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadVideo = multer({
    storage: { ...storage, destination: (req, file, cb) => cb(null, videosDir) },
    fileFilter: videoFilter,
    limits: { fileSize: 50 * 1024 * 1024 }
});

const uploadAudio = multer({
    storage: { ...storage, destination: (req, file, cb) => cb(null, audioDir) },
    fileFilter: audioFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

function handleUpload(req, res, uploadFn, fieldName) {
    uploadFn.single(fieldName)(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Upload Error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        try {
            const protocol = req.protocol;
            const host = req.get('host');
            const fileUrl = `${protocol}://${host}/uploads/${fieldName}s/${req.file.filename}`;
            res.json({ message: 'Uploaded successfully', url: fileUrl, filename: req.file.filename });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
}

// @route   POST /api/upload/image
router.post('/image', protect, admin, (req, res) => handleUpload(req, res, uploadImage, 'image'));

// @route   POST /api/upload/video
router.post('/video', protect, admin, (req, res) => handleUpload(req, res, uploadVideo, 'video'));

// @route   POST /api/upload/audio
router.post('/audio', protect, admin, (req, res) => handleUpload(req, res, uploadAudio, 'audio'));

module.exports = router;
