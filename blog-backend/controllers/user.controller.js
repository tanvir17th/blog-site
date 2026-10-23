const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, firstName, lastName, email, role, isActive, profileImage, createdAt FROM users WHERE id = ?',
      [req.user.id]
    );
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    await db.query('UPDATE users SET firstName = ?, lastName = ? WHERE id = ?', [
      firstName,
      lastName,
      req.user.id,
    ]);
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Image file is required' });

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    await db.query('UPDATE users SET profileImage = ? WHERE id = ?', [imageUrl, req.user.id]);

    res.json({ message: 'Profile image updated', profileImage: imageUrl });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'New password required' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin Endpoints
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, firstName, lastName, email, role, isActive, profileImage, createdAt FROM users'
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, firstName, lastName, email, role, isActive, profileImage, createdAt FROM users WHERE id = ?',
      [req.params.id]
    );
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    await db.query('UPDATE users SET isActive = ? WHERE id = ?', [isActive, req.params.id]);
    res.json({ message: 'User status updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};