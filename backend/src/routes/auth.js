const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/connection');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username?.trim() || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const [rows] = await pool.query(
      'SELECT id, username, password_hash, full_name, role FROM users WHERE username = ?',
      [username.trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, full_name: user.full_name },
      process.env.JWT_SECRET || 'ketelelema-dev-secret',
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    full_name: req.user.full_name,
    role: req.user.role,
  });
});

module.exports = router;
