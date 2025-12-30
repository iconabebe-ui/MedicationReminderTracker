const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth.middleware');

/**
 * Log a dose (Taken or Skipped)
 */
router.post('/', auth, async (req, res) => {
  let { medication_id, status, taken_at } = req.body;

  if (!medication_id || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Normalize status
  status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  if (!['Taken', 'Skipped'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO dose_logs (user_id, medication_id, status, taken_at)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, medication_id, status, taken_at || new Date()]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log dose' });
  }
});

/**
 * Get dose history (last 7 days by default)
 */
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM dose_logs
       WHERE user_id = $1
       AND taken_at >= NOW() - INTERVAL '7 days'
       ORDER BY taken_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dose logs' });
  }
});




module.exports = router;
