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

// Separate storage for each type
const imageStorage = multer.diskStorage({
    destination(req, file, cb) { cb(null, imagesDir); },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `image-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const videoStorage = multer.diskStorage({
    destination(req, file, cb) { cb(null, videosDir); },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `video-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const audioStorage = multer.diskStorage({
    destination(req, file, cb) { cb(null, audioDir); },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `audio-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

// Multer instances
const uploadImage = multer({
    storage: imageStorage,
    fileFilter(file, cb) {
        const allowed = /jpg|jpeg|png|webp|gif/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = file.mimetype.startsWith('image/');
        if (ext && mime) return cb(null, true);
        cb(new Error('Only image files allowed!'));
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadVideo = multer({
    storage: videoStorage,
    fileFilter(file, cb) {
        const allowed = /mp4|webm|ogg|mov|avi/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = file.mimetype.startsWith('video/');
        if (ext || mime) return cb(null, true);
        cb(new Error('Only video files allowed!'));
    },
    limits: { fileSize: 250 * 1024 * 1024 }
});

const uploadAudio = multer({
    storage: audioStorage,
    fileFilter(file, cb) {
        const allowed = /mp3|wav|ogg|m4a|aac|flac/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = file.mimetype.startsWith('audio/');
        if (ext || mime) return cb(null, true);
        cb(new Error('Only audio files allowed!'));
    },
    limits: { fileSize: 10 * 1024 * 1024 }
});

const handleImageUpload = (req, res) => {
    uploadImage.single('image')(req, res, function (err) {
        if (err) return res.status(400).json({ message: err.message });
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`;
        res.json({ message: 'Image uploaded successfully', url: fileUrl });
    });
};

// @route   POST /api/upload and /api/upload/image
router.post('/image', protect, admin, handleImageUpload);
router.post('/', protect, admin, handleImageUpload);

// @route   POST /api/upload/video
router.post('/video', protect, admin, (req, res) => {
    uploadVideo.single('video')(req, res, function (err) {
        if (err) return res.status(400).json({ message: err.message });
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/videos/${req.file.filename}`;
        res.json({ message: 'Video uploaded successfully', url: fileUrl });
    });
});

// @route   POST /api/upload/audio
router.post('/audio', protect, admin, (req, res) => {
    uploadAudio.single('audio')(req, res, function (err) {
        if (err) return res.status(400).json({ message: err.message });
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/audio/${req.file.filename}`;
        res.json({ message: 'Audio uploaded successfully', url: fileUrl });
    });
});

module.exports = router;
