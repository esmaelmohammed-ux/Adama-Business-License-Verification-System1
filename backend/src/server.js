require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db/connection');
const authRoutes = require('./routes/auth');
const businessRoutes = require('./routes/business');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
app.use(express.json());

app.get('/api/health', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    next(error);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Adama Business License Verification API running on http://localhost:${PORT}`);
});
