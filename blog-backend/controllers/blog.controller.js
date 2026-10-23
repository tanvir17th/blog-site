const db = require('../config/db');

exports.getAllBlogs = async (req, res) => {
  try {
    const { title, category } = req.query;
    let sql = `
      SELECT b.*, u.firstName, u.lastName, u.email, u.profileImage 
      FROM blogs b 
      JOIN users u ON b.userId = u.id 
      WHERE 1=1
    `;
    const params = [];

    if (title) {
      sql += ' AND b.blogTitle LIKE ?';
      params.push(`%${title}%`);
    }

    if (category && category !== 'All') {
      sql += ' AND b.category = ?';
      params.push(category);
    }

    sql += ' ORDER BY b.createdAt DESC';

    const [rows] = await db.query(sql, params);

    const formattedBlogs = rows.map((row) => ({
      _id: row.id,
      id: row.id,
      blogTitle: row.blogTitle,
      blog: row.blog,
      category: row.category,
      createdAt: row.createdAt,
      author: {
        id: row.userId,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        profileImage: row.profileImage,
      },
    }));

    res.json(formattedBlogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error loading blogs', error: err.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.*, u.firstName, u.lastName, u.email, u.profileImage 
       FROM blogs b 
       JOIN users u ON b.userId = u.id 
       WHERE b.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Blog Not Found' });

    const row = rows[0];
    res.json({
      _id: row.id,
      id: row.id,
      blogTitle: row.blogTitle,
      blog: row.blog,
      category: row.category,
      createdAt: row.createdAt,
      author: {
        id: row.userId,
        firstName: row.firstName,
        lastName: row.lastName,
        profileImage: row.profileImage,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { blogTitle, blog, category } = req.body;
    const userId = req.user.id;

    if (!blogTitle || !blog || !category) {
      return res.status(400).json({ message: 'Blog title, content, and category are required' });
    }

    const [result] = await db.query(
      'INSERT INTO blogs (blogTitle, blog, category, userId) VALUES (?, ?, ?, ?)',
      [blogTitle, blog, category, userId]
    );

    res.status(201).json({ message: 'Blog published successfully', blogId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error creating blog', error: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { blogTitle, blog, category } = req.body;
    const blogId = req.params.id;

    const [existing] = await db.query('SELECT * FROM blogs WHERE id = ?', [blogId]);
    if (existing.length === 0) return res.status(404).json({ message: 'Blog not found' });

    if (req.user.role !== 'Admin' && existing[0].userId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this blog' });
    }

    await db.query(
      'UPDATE blogs SET blogTitle = ?, blog = ?, category = ? WHERE id = ?',
      [blogTitle, blog, category, blogId]
    );

    res.json({ message: 'Blog updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error updating blog', error: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    const [existing] = await db.query('SELECT * FROM blogs WHERE id = ?', [blogId]);
    if (existing.length === 0) return res.status(404).json({ message: 'Blog not found' });

    if (req.user.role !== 'Admin' && existing[0].userId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this blog' });
    }

    await db.query('DELETE FROM blogs WHERE id = ?', [blogId]);
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting blog', error: err.message });
  }
};