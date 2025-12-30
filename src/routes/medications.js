const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require('../middleware/auth.middleware');

// Helper to validate UUID
const isUUID = (id) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

/**
 * CREATE a new medication
 */
router.post('/', verifyToken, async (req, res) => {
  const { name, dosage, frequency, stock, instructions, reminder_times } = req.body;

  if (!name || !dosage || !frequency) {
    return res.status(400).json({ error: 'Name, dosage, and frequency are required' });
  }

  try {
    const { name, dosage, frequency, stock, instructions, reminder_times } = req.body;

const newMed = await pool.query(
  `INSERT INTO medications
   (user_id, name, dosage, frequency, stock, instructions, reminder_times)
   VALUES ($1,$2,$3,$4,$5,$6,$7)
   RETURNING *`,
  [req.user.id, name, dosage, frequency, stock || 0, instructions || '', reminder_times || []]
);

    res.status(201).json(newMed.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET all medications for the logged-in user
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const meds = await pool.query(
      "SELECT * FROM medications WHERE user_id=$1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(meds.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * UPDATE a medication
 */
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, dosage, frequency, stock, instructions, reminder_times } = req.body;

  if (!isUUID(id)) return res.status(400).json({ error: 'Invalid medication ID' });

  try {
    await pool.query(
      `UPDATE medications
       SET name=$1, dosage=$2, frequency=$3, stock=$4, instructions=$5, reminder_times=$6
       WHERE id=$7 AND user_id=$8`,
      [name, dosage, frequency, stock, instructions, reminder_times || [], id, req.user.id]
    );
    res.json({ message: 'Medication updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * DELETE a medication
 */
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  if (!isUUID(id)) return res.status(400).json({ error: 'Invalid medication ID' });

  try {
    await pool.query('DELETE FROM medications WHERE id=$1 AND user_id=$2', [id, req.user.id]);
    res.json({ message: 'Medication deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * LOG a dose (Taken or Skipped)
 */
router.post('/:id/log', verifyToken, async (req, res) => {
  const { status = 'Taken' } = req.body;
  const medicationId = req.params.id;
  const userId = req.user.id;

  if (!['Taken', 'Skipped'].includes(status)) {
    return res.status(400).json({ error: 'Status must be Taken or Skipped' });
  }

  if (!isUUID(medicationId)) return res.status(400).json({ error: 'Invalid medication ID' });

  try {
    const result = await pool.query(
      `INSERT INTO dose_logs (user_id, medication_id, status, taken_at)
       VALUES ($1,$2,$3,NOW())
       RETURNING *`,
      [userId, medicationId, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log dose' });
  }
});

/**
 * GET Dose Logs for a medication (last 7 days)
 */
router.get('/:id/logs', verifyToken, async (req, res) => {
  const medId = req.params.id;
  if (!isUUID(medId)) return res.status(400).json({ error: 'Invalid medication ID' });

  try {
    const logs = await pool.query(
      `SELECT *
       FROM dose_logs
       WHERE medication_id=$1 AND user_id=$2
       AND taken_at >= NOW() - INTERVAL '7 days'
       ORDER BY taken_at DESC`,
      [medId, req.user.id]
    );
    res.json(logs.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dose logs' });
  }
});

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMzNmE3NzI5LTMwZWMtNDg1YS1hODJmLWJlOTU0ODlkZWIwMCIsImVtYWlsIjoiam9objJAZXhhbXBsZS5jb20iLCJpYXQiOjE3NjY5NDgwNDUsImV4cCI6MTc2NzAzNDQ0NX0.EP2m5XFz2MRlVsnrhQQ9T9q-SvhPNzpRBT-96KOoFkE

module.exports = router;
