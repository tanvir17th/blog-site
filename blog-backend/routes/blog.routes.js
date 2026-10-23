const express = require('express');
const router = express.Router();
const blogCtrl = require('../controllers/blog.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public blog routes
router.get('/', blogCtrl.getAllBlogs);
router.get('/:id', blogCtrl.getBlogById);

// Protected blog routes
router.post('/', authMiddleware, blogCtrl.createBlog);
router.put('/:id', authMiddleware, blogCtrl.updateBlog);
router.delete('/:id', authMiddleware, blogCtrl.deleteBlog);

module.exports = router;