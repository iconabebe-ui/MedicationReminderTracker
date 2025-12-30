require('./cron/scheduler');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const medRoutes = require('./routes/medications');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/medications', medRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const doseLogsRoutes = require('./routes/doseLogs');

app.use('/api/dose-logs', doseLogsRoutes);

const adherenceRoutes = require('./routes/adherence');

app.use('/api/adherence', adherenceRoutes);

const adherencePerMedicationRoutes = require('./routes/adherencePerMedication');

app.use('/api/adherence/medications', adherencePerMedicationRoutes);

const notificationsRouter = require('./routes/notifications');
app.use('/api/notifications', notificationsRouter);
