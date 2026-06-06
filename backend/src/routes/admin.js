const express = require('express');
const pool = require('../db/connection');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth, requireAdmin);

function formatBusiness(row) {
  const expiryDate = row.expiry_date instanceof Date
    ? row.expiry_date.toISOString().split('T')[0]
    : row.expiry_date;

  return {
    id: row.id,
    license_number: row.license_number,
    owner_name: row.owner_name,
    sub_city: row.sub_city,
    expiry_date: expiryDate,
    payment_status: row.payment_status,
    balance_due: Number(row.balance_due),
    is_active: row.payment_status === 'Paid',
  };
}

router.get('/businesses', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, license_number, owner_name, sub_city, expiry_date, payment_status, balance_due FROM businesses ORDER BY license_number'
    );
    res.json(rows.map(formatBusiness));
  } catch (error) {
    next(error);
  }
});

router.post('/businesses', async (req, res, next) => {
  try {
    const { license_number, owner_name, sub_city, expiry_date, payment_status, balance_due } = req.body;

    if (!license_number?.trim() || !owner_name?.trim() || !sub_city?.trim() || !expiry_date || !payment_status) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (!['Paid', 'Expired'].includes(payment_status)) {
      return res.status(400).json({ error: 'payment_status must be Paid or Expired' });
    }

    const [result] = await pool.query(
      `INSERT INTO businesses (license_number, owner_name, sub_city, expiry_date, payment_status, balance_due)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        license_number.trim(),
        owner_name.trim(),
        sub_city.trim(),
        expiry_date,
        payment_status,
        Number(balance_due) || 0,
      ]
    );

    const [rows] = await pool.query(
      'SELECT id, license_number, owner_name, sub_city, expiry_date, payment_status, balance_due FROM businesses WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(formatBusiness(rows[0]));
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'License number already exists' });
    }
    next(error);
  }
});

router.put('/businesses/:id', async (req, res, next) => {
  try {
    const { license_number, owner_name, sub_city, expiry_date, payment_status, balance_due } = req.body;

    if (!license_number?.trim() || !owner_name?.trim() || !sub_city?.trim() || !expiry_date || !payment_status) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (!['Paid', 'Expired'].includes(payment_status)) {
      return res.status(400).json({ error: 'payment_status must be Paid or Expired' });
    }

    const [result] = await pool.query(
      `UPDATE businesses
       SET license_number = ?, owner_name = ?, sub_city = ?, expiry_date = ?, payment_status = ?, balance_due = ?
       WHERE id = ?`,
      [
        license_number.trim(),
        owner_name.trim(),
        sub_city.trim(),
        expiry_date,
        payment_status,
        Number(balance_due) || 0,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const [rows] = await pool.query(
      'SELECT id, license_number, owner_name, sub_city, expiry_date, payment_status, balance_due FROM businesses WHERE id = ?',
      [req.params.id]
    );

    res.json(formatBusiness(rows[0]));
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'License number already exists' });
    }
    next(error);
  }
});

router.delete('/businesses/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM businesses WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json({ message: 'Business deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
