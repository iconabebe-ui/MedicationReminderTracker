
```markdown
# 💊 Medication Reminder & Tracker

## 📋 Summary
The **Medication Reminder & Tracker** is a mobile-first web application designed to help users manage complex medication schedules reliably. The system automates the creation of daily dose logs, provides real-time in-app alerts for overdue medications, and visualizes adherence data to improve patient compliance and reduce health risks associated with missed doses.

---

## 🏗️ Architecture & File Descriptions

### Project Tree
```text
medication-reminder-tracker/
│
├── backend/                        # Server-side logic and API
│   ├── server.js                   # Entry point: initializes Express, middleware, and database
│   ├── package.json                # Backend dependencies (express, pg, jsonwebtoken, etc.)
│   ├── config/                     # Configuration folder
│   │   └── db.js                   # PostgreSQL connection pool logic
│   ├── models/                     # Data structures and helper logic
│   │   ├── User.js                 # User fields (email, password_hash, timezone)
│   │   ├── Medication.js           # Medication rules (name, frequency, dosage)
│   │   └── Dose.js                 # Dose logs (scheduled_time, status)
│   ├── routes/                     # API endpoint definitions
│   │   ├── auth.js                 # Registration and login routes
│   │   ├── medications.js          # CRUD operations on medications
│   │   └── reminders.js            # Fetching and updating dose log statuses
│   ├── middleware/                 # Request processing logic
│   │   └── auth.js                 # JWT validation for secure routes
│   └── services/                   # Automated background tasks
│       └── scheduler.js            # Cron job generating daily dose logs
│
├── frontend/                       # Client-side user interface
│   ├── index.html                  # Base HTML template
│   ├── package.json                # Frontend dependencies (react, axios, tailwindcss)
│   ├── vite.config.js              # Vite build tool configuration
│   └── src/                        # React source code
│       ├── main.jsx                # Entry point: renders React into the DOM
│       ├── App.jsx                 # Routing and global layout
│       ├── api.js                  # Centralized Axios instance with Auth headers
│       ├── pages/                  # Screen-level components
│       │   ├── Login.jsx           # Authentication screen
│       │   ├── Dashboard.jsx       # Overdue alerts and adherence charts
│       │   └── AddMedication.jsx   # New medication schedule form
│       └── styles.css              # Global styles and Tailwind CSS
│
└── README.md                       # Project documentation and overview

```

---

### 📂 Backend (`/backend`)

The backend is a **RESTful API** built with Node.js and Express, following a modular architecture to separate concerns.

* **`server.js`**: The application entry point. It initializes middleware (CORS, JSON parsing), connects to the database, and mounts API routes.
* **`config/db.js`**: Configuration for the PostgreSQL connection pool using `pg`.
* **`models/`**: Defines the table structures and data logic.
* `User.js`: Handles user data, password hashing (Bcrypt), and timezone storage.
* `Medication.js`: Manages medication metadata (name, dosage, frequency).
* `Dose.js`: Logic for the `dose_logs` table which tracks individual intake events.


* **`routes/`**:
* `auth.js`: Endpoints for `register` and `login`.
* `medications.js`: CRUD endpoints for a user’s medication list.
* `reminders.js`: Logic to fetch "Today's" doses and update status (Taken/Skipped).


* **`middleware/auth.js`**: Protects private routes by verifying the JWT (JSON Web Tokens) in the request headers.
* **`services/scheduler.js`**: A background service using `node-cron` that runs daily to populate the `dose_logs` table for all active medications.

---

### 📂 Frontend (`/frontend`)

A **Single Page Application (SPA)** built with React and Vite, utilizing a "Mobile-First" CSS approach.

* **`main.jsx` & `App.jsx**`: Handles the React DOM rendering and the primary routing logic using `react-router-dom`.
* **`api.js`**: A centralized Axios instance with interceptors to inject the Auth token into every outgoing request.
* **`pages/`**:
* `Login.jsx`: Secure entry point for users.
* `Dashboard.jsx`: The "Mission Control" view showing today’s schedule, overdue alerts, and the 7-day adherence chart.
* `AddMedication.jsx`: A multi-input form to configure drug names, dosages, and multiple reminder times.


* **`styles.css`**: Custom Tailwind CSS utility classes for responsive, touch-friendly UI components.

---

## 🔄 File Relationships & Data Flow

1. **Creation**: `AddMedication.jsx` sends a POST request to `routes/medications.js`.
2. **Scheduling**: The backend saves the medication and triggers `services/scheduler.js` to create the initial `Dose` entries.
3. **Polling**: `Dashboard.jsx` uses an interval to call `routes/reminders.js` every minute.
4. **Alerting**: If the current time passes a "Pending" dose time, `Dashboard.jsx` triggers a visual alert.
5. **Logging**: When a user clicks "Taken," `api.js` sends a PATCH request to update the specific `Dose` record.

---

## 🗄️ Database Explanation

We use **PostgreSQL** for its robust handling of relational data and time-series logging.

* **Users Table**: Stores `id`, `email`, `password_hash`, and `timezone`.
* **Medications Table**: Linked to Users via `user_id`. Stores the "Rules" (e.g., "Take 20mg at 08:00").
* **Dose_Logs Table**: Linked to Medications via `med_id`. This table tracks the "Events" (e.g., "Did the user take the dose on Jan 5th?").
* **Timezone Logic**: All timestamps are stored in **UTC**. The frontend converts these to the user's local time for display.

---

## 🛠️ Tools & Technologies

* **Frontend**: React.js, Vite, Tailwind CSS, Recharts.
* **Backend**: Node.js, Express.js.
* **Database**: PostgreSQL.
* **Auth**: JWT (JSON Web Tokens), Bcrypt.js, Google OAuth.
* **Utility**: Node-Cron (Scheduling), Day.js (Time management), Axios (API calls).

---

## 🔮 Future Works

* **Native Push Notifications**: Move beyond in-app alerts to system-level notifications using Service Workers.
* **Caregiver Portal**: Allow users to share their adherence dashboard with a doctor or family member.
* **Refill Automation**: Integrating with local pharmacy APIs to automate prescription refills.
* **PRN Support**: Adding an "As Needed" medication type that doesn't penalize adherence scores.

---

### 🚀 Installation

To run this project locally:

1. Clone the repo.
2. Run `npm install` in both `/backend` and `/frontend`.
3. Set up your `.env` variables (DB URL, JWT Secret, Google Client ID).
4. Run `npm run dev` in both directories.

```

Would you like me to help you create a sample `.env.example` file so users know exactly what keys to add to their environment?

```
