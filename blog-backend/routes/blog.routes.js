const express = require('express');
const router = express.Router();
const blogCtrl = require('../controllers/blog.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.get('/', blogCtrl.getAllBlogs);
router.get('/:id', blogCtrl.getBlogById);
router.post('/create', authenticateToken, blogCtrl.createBlog);
router.put('/update/:id', authenticateToken, blogCtrl.updateBlog);
router.delete('/delete/:id', authenticateToken, blogCtrl.deleteBlog);

module.exports = router;