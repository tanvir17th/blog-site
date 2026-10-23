const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Enable CORS for all origins
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/blogs', require('./routes/blog.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend REST API server running on http://localhost:${PORT}`);
});