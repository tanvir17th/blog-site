const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const userCtrl = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `profile-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

// User Routes
router.get('/profile', authMiddleware, userCtrl.getProfile);
router.put('/profile', authMiddleware, userCtrl.updateProfile);
router.patch('/profile', authMiddleware, userCtrl.updateProfile); // Added fallback for PATCH
router.post('/profile/image', authMiddleware, upload.single('image'), userCtrl.updateProfileImage);

module.exports = router;