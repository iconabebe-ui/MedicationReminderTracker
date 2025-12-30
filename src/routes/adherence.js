const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth.middleware');

/**
 * Get 7-day adherence percentage
 */
/**
 * Overall adherence (last 7 days)
 */
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        COUNT(*) FILTER (WHERE status = 'Taken') AS taken,
        COUNT(*) AS total
      FROM dose_logs
      WHERE user_id = $1
      AND taken_at >= NOW() - INTERVAL '7 days'
      `,
      [req.user.id]
    );

    const { taken, total } = result.rows[0];
    const adherence =
      total > 0 ? Math.round((taken / total) * 100) : 0;

    res.json({
      period: 'last_7_days',
      taken: Number(taken),
      total: Number(total),
      adherence_percent: adherence
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to calculate adherence' });
  }
});




/**
 * Per-medication adherence (last 7 days)
 */
router.get('/medications', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        m.id AS medication_id,
        m.name AS medication_name,
        COUNT(dl.*) FILTER (WHERE dl.status = 'Taken') AS taken,
        COUNT(dl.*) AS total
      FROM medications m
      LEFT JOIN dose_logs dl
        ON dl.medication_id = m.id
        AND dl.user_id = $1
        AND dl.taken_at >= NOW() - INTERVAL '7 days'
      WHERE m.user_id = $1
      GROUP BY m.id, m.name
      ORDER BY m.name
      `,
      [req.user.id]
    );

    const data = result.rows.map(row => ({
      medication_id: row.medication_id,
      medication_name: row.medication_name,
      taken: Number(row.taken),
      total: Number(row.total),
      adherence_percent:
        row.total > 0 ? Math.round((row.taken / row.total) * 100) : 0
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to calculate per-medication adherence' });
  }
});

module.exports = router;
