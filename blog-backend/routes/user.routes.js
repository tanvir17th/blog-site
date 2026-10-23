const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userCtrl = require('../controllers/user.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get('/profile', authenticateToken, userCtrl.getProfile);
router.put('/profile/update', authenticateToken, userCtrl.updateProfile);
router.patch('/profile/image', authenticateToken, upload.single('image'), userCtrl.updateProfileImage);
router.patch('/password', authenticateToken, userCtrl.changePassword);

// Admin Routes
router.get('/', authenticateToken, requireAdmin, userCtrl.getAllUsers);
router.get('/:id', authenticateToken, requireAdmin, userCtrl.getUserById);
router.patch('/:id/status', authenticateToken, requireAdmin, userCtrl.updateUserStatus);

module.exports = router;