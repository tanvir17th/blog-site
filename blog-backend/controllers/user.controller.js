const db = require('../config/db');

const formatImageUrl = (pathStr) => {
  if (!pathStr) return null;
  if (pathStr.startsWith('http://') || pathStr.startsWith('https://')) return pathStr;
  return `http://localhost:5000${pathStr.startsWith('/') ? '' : '/'}${pathStr}`;
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [users] = await db.query(
      'SELECT id, firstName, lastName, email, role, profileImage FROM users WHERE id = ?',
      [userId]
    );

    if (!users || users.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = users[0];
    user.profileImage = formatImageUrl(user.profileImage);

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const relativePath = `/uploads/${req.file.filename}`;

    // Save relative path into database
    await db.query('UPDATE users SET profileImage = ? WHERE id = ?', [relativePath, userId]);

    const fullUrl = formatImageUrl(relativePath);

    return res.json({
      message: 'Profile image updated successfully',
      profileImage: fullUrl,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating image', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName } = req.body;

    await db.query('UPDATE users SET firstName = ?, lastName = ? WHERE id = ?', [
      firstName,
      lastName,
      userId,
    ]);

    return res.json({ message: 'Profile details updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};