```markdown
# 💊 Medication Reminder & Tracker

## 📋 Summary
The **Medication Reminder & Tracker** is a mobile-first web application designed to help users manage complex medication schedules reliably. The system automates the creation of daily dose logs, provides real-time in-app alerts for overdue medications, and visualizes adherence data to improve patient compliance and reduce health risks associated with missed doses.

---

## 🏗️ Architecture & File Descriptions

### Project Template
```text
medication-reminder-tracker/
│
├── backend/                        # Server-side logic and API (Node.js/Express)
│   ├── server.js                   # Entry point: initializes Express, middleware, and database
│   ├── package.json                # Backend dependencies (express, pg, jsonwebtoken, etc.)
│   ├── config/                     # Configuration folder
│   │   └── db.js                   # PostgreSQL connection pool logic using 'pg'
│   ├── controllers/                # Business logic processing
│   │   └── auth.controller.js      # Processes registration and login logic
│   ├── cron/                       # Automated background tasks
│   │   └── scheduler.js            # Cron job generating daily dose logs for all users
│   ├── middleware/                 # Security and request processing
│   │   ├── auth.middleware.js      # Validates JWT tokens for secure access
│   │   └── authenticateToken.js    # Secondary validation for token-based routing
│   ├── routes/                     # API endpoint definitions
│   │   ├── auth.js                 # Endpoints for User registration and login
│   │   ├── medications.js          # CRUD operations for medication lists
│   │   ├── doseLogs.js             # Tracking for Taken/Skipped intake events
│   │   ├── adherence.js            # Logic for calculating user compliance scores
│   │   └── notifications.js        # Logic for fetching pending alerts
│   └── .env                        # Private environment variables (DB URLs, Secrets)
│
├── frontend/                       # Client-side user interface (React/Vite)
│   ├── index.html                  # Base HTML template
│   ├── package.json                # Frontend dependencies (react, axios, tailwindcss)
│   ├── vite.config.js              # Vite build tool and development server config
│   ├── tailwind.config.js          # Configuration for utility-first styling
│   └── src/                        # React source code
│       ├── main.jsx                # Entry point: renders React app into the DOM
│       ├── App.js                  # Main routing and global layout definition
│       ├── api/                    # Centralized API communication logic
│       ├── components/             # Reusable UI parts and screens
│       │   ├── Auth/               # Auth screens (Login.js, Register.js, AuthLayout.js)
│       │   └── Dashboard/          # Core views (Dashboard.js, AddMedication.js, AdherenceChart.js)
│       ├── utils/                  # Helper functions (Time formatting, calculations)
│       ├── App.css                 # Global styles
│       └── index.css               # Tailwind CSS base imports
│
└── README.md                       # Project documentation and architectural overview

```

---

### 📂 Backend (`/backend`)

The backend is a **RESTful API** designed with a modular structure to ensure the "engine" (logic) is separated from the "data" (storage).

* **`server.js`**: The heart of the backend. It connects to PostgreSQL, handles CORS for the frontend, and links all the routes together.
* **`config/db.js`**: Manages the life-cycle of database connections to ensure efficiency.
* **`cron/scheduler.js`**: Uses `node-cron` to automatically look at every user's medication rules and create "Pending" slots in the database every 24 hours.
* **`routes/`**:
* `medications.js`: Handles the rules (e.g., "Take 5mg of Amlodipine").
* `doseLogs.js`: Handles the reality (e.g., "User took the 8:00 AM dose on Jan 6th").


* **`middleware/`**: Functions as a security gatekeeper, checking every request for a valid identity token before allowing access to medical data.

---

### 📂 Frontend (`/frontend`)

The frontend is a **Single Page Application (SPA)** built for speed and a smooth mobile experience.

* **`src/App.js`**: Uses `react-router-dom` to switch between the Login, Register, and Dashboard views without refreshing the page.
* **`src/components/Dashboard/`**:
* `AddMedication.js`: An intuitive form that simplifies complex scheduling for the user.
* `AdherenceChart.js`: Uses data visualization to provide immediate feedback on the user's health progress.
* `Notifications.js`: Listens for upcoming dose times to trigger in-app alerts.


* **`src/api/`**: A dedicated folder to handle all "bridge" communication with the Render-hosted backend.

---

## 🔄 Relationship & Data Flow

1. **Input**: User defines a schedule in `AddMedication.js`.
2. **Processing**: The Frontend `api/` sends this to the Backend `routes/medications.js`.
3. **Automation**: The `cron/scheduler.js` generates the individual dose events for the week.
4. **Feedback**: The `Dashboard.js` fetches these events to show the user what to take **now**.
5. **Logging**: When "Taken" is clicked, a request is sent to `doseLogs.js` to update the adherence score.

---

## 🛠️ Tech Stack

* **Frontend**: React.js, Tailwind CSS, Recharts.
* **Backend**: Node.js, Express.js.
* **Database**: PostgreSQL (Relational management of users and logs).
* **Task Scheduling**: Node-Cron (Daily log generation).
* **Authentication**: JWT (JSON Web Tokens) & Google OAuth 2.0.

---

## 🚀 Installation & Setup

1. Clone the repository.
2. **Backend**: Navigate to `/backend`, run `npm install`, and create a `.env` with your `DATABASE_URL` and `JWT_SECRET`.
3. **Frontend**: Navigate to `/frontend`, run `npm install`, and run `npm run dev`.
4. Open the local URL provided by Vite to view the app.


### 🔧 Inventory Logic (CRUD)
The application manages medication lifecycle through a standardized CRUD interface:

* **Create**: Form validation ensures no duplicate medication names.
* **Read**: Real-time fetching of dose requirements based on the current time.
* **Update (Stock Management)**: 
    * `POST /log`: Subtracts 1 unit from inventory upon a "Taken" status.
    * `PUT /medications/:id`: Manually resets stock counts during refills.
* **Delete**: Soft-delete implementation to maintain historical adherence records.

```
