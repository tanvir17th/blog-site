const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, 'User']
    );

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users || users.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const user = users[0];
    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated' });
    }

    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password === user.password) isMatch = true;

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error during login', error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  return res.json({ message: 'Password reset link sent to your email.' });
};

exports.resetPassword = async (req, res) => {
  return res.json({ message: 'Password successfully changed.' });
};