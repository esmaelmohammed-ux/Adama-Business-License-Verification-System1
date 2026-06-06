const express = require('express');
const pool = require('../db/connection');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/:license_number', requireAuth, async (req, res, next) => {
  try {
    const licenseNumber = req.params.license_number?.trim();

    if (!licenseNumber) {
      return res.status(400).json({ error: 'License number is required' });
    }

    const [rows] = await pool.query(
      'SELECT license_number, owner_name, sub_city, expiry_date, payment_status, balance_due FROM businesses WHERE UPPER(license_number) = UPPER(?)',
      [licenseNumber]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'License not found' });
    }

    const business = rows[0];
    const expiryDate = business.expiry_date instanceof Date
      ? business.expiry_date.toISOString().split('T')[0]
      : business.expiry_date;

    res.json({
      license_number: business.license_number,
      owner_name: business.owner_name,
      sub_city: business.sub_city,
      expiry_date: expiryDate,
      payment_status: business.payment_status,
      balance_due: Number(business.balance_due),
      is_active: business.payment_status === 'Paid',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
