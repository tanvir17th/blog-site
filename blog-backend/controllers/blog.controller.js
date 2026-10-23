const db = require('../config/db');

// GET ALL BLOGS
exports.getAllBlogs = async (req, res) => {
  try {
    const [blogs] = await db.query(`
      SELECT b.*, u.firstName, u.lastName, u.profileImage 
      FROM blogs b 
      LEFT JOIN users u ON b.userId = u.id 
      ORDER BY b.createdAt DESC
    `);
    return res.json(blogs);
  } catch (err) {
    console.error('Get all blogs error:', err);
    return res.status(500).json({ message: 'Error fetching blogs', error: err.message });
  }
};

// GET SINGLE BLOG BY ID
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const [blogs] = await db.query(
      `SELECT b.*, u.firstName, u.lastName, u.profileImage 
       FROM blogs b 
       LEFT JOIN users u ON b.userId = u.id 
       WHERE b.id = ?`,
      [id]
    );

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    return res.json(blogs[0]);
  } catch (err) {
    console.error('Get blog error:', err);
    return res.status(500).json({ message: 'Error fetching blog details', error: err.message });
  }
};

// CREATE NEW BLOG
exports.createBlog = async (req, res) => {
  try {
    const { blogTitle, blog, category } = req.body;
    const userId = req.user.id;

    if (!blogTitle || !blog || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }

    const [result] = await db.query(
      'INSERT INTO blogs (blogTitle, blog, category, userId) VALUES (?, ?, ?, ?)',
      [blogTitle, blog, category, userId]
    );

    return res.status(201).json({
      message: 'Blog created successfully',
      blogId: result.insertId,
    });
  } catch (err) {
    console.error('Create blog error:', err);
    return res.status(500).json({ message: 'Error creating blog', error: err.message });
  }
};

// UPDATE BLOG
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { blogTitle, blog, category } = req.body;

    await db.query(
      'UPDATE blogs SET blogTitle = ?, blog = ?, category = ? WHERE id = ?',
      [blogTitle, blog, category, id]
    );

    return res.json({ message: 'Blog updated successfully' });
  } catch (err) {
    console.error('Update blog error:', err);
    return res.status(500).json({ message: 'Error updating blog', error: err.message });
  }
};

// DELETE BLOG
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM blogs WHERE id = ?', [id]);
    return res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Delete blog error:', err);
    return res.status(500).json({ message: 'Error deleting blog', error: err.message });
  }
};