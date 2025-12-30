const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require('../middleware/auth.middleware');

/**
 * GET all unseen notifications for the logged-in user
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, medication_id, message, created_at, seen
       FROM notifications
       WHERE user_id=$1 AND seen=false
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

/**
 * Mark a notification as seen
 */
router.put('/:id/seen', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      `UPDATE notifications
       SET seen=true
       WHERE id=$1 AND user_id=$2`,
      [id, req.user.id]
    );
    res.json({ message: 'Notification marked as seen' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

module.exports = router;
