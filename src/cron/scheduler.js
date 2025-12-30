const cron = require('node-cron');
const pool = require('../config/db');

/**
 * Cron job: run every minute
 * Checks all medications for reminders scheduled at the current time
 */
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    const currentHourMinute = now.toTimeString().slice(0, 5); // "HH:MM"

    // Query medications with reminder_times containing current time
    const meds = await pool.query(
      `SELECT id, user_id, name
       FROM medications
       WHERE $1 = ANY(reminder_times)`,
      [currentHourMinute]
    );

    meds.rows.forEach(async (med) => {
      console.log(`[Reminder] User: ${med.user_id}, Medication: ${med.name}, Time: ${currentHourMinute}`);

      // Optional: insert into notifications table so frontend can fetch it
      await pool.query(
        `INSERT INTO notifications (user_id, medication_id, message)
         VALUES ($1, $2, $3)`,
        [med.user_id, med.id, `Time to take ${med.name}`]
      );
    });
  } catch (err) {
    console.error('Cron job error:', err);
  }
});
