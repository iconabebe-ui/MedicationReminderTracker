Here is the complete, formatted content for your `README.md` file. You can copy and paste this directly into your repository to provide a professional overview of your project.

---

#  Medication Reminder & Tracker

##  Project Summary

The **Medication Reminder & Tracker** is a mobile-first web application designed to help users manage complex medication schedules reliably. It addresses the common problem of medical non-adherence by providing timely in-app reminders and a clear tracking log for users to record when doses are taken or skipped. The project aims to improve patient compliance and reduce health risks through a simple, effective interface targeted at individuals with chronic conditions, caregivers, and the elderly.

---

##  Folder Structure & Descriptions

Based on the project architecture, here is the responsibility of each key directory:

###  Backend (`/backend`)

* **`server.js`**: The main entry point that initializes the Express server, connects middleware, and mounts API routes.
* **`config/`**: Contains database configuration logic, such as `db.js`, to manage the connection to the PostgreSQL database.
* **`controllers/`**: (Optional/Refined structure) Houses the logic for processing requests like adding medications or updating dose statuses.
* **`cron/` (or `services/`)**: Contains the `node-cron` scheduler logic used to automatically generate daily dose logs for users.
* **`middleware/`**: Includes security logic like `auth.js` to verify JWT tokens before allowing access to private data.
* **`routes/`**: Defines the API endpoints for user authentication, medication management, and reminder tracking.

###  Frontend (`/frontend`)

* **`src/App.jsx`**: The main component handling application routing and global state.
* **`src/api.js`**: A centralized Axios configuration for making authorized API calls to the backend.
* **`src/pages/`**: Contains the primary user views:
* **`Dashboard.jsx`**: Displays upcoming doses, overdue alerts, and the 7-day adherence score.
* **`AddMedication.jsx`**: An intuitive form for users to input medication names, dosages, and schedules.
* **`Login.jsx`**: The secure gateway for user authentication.



---

##  Relationship Between Components

The application follows a **Request-Response** architecture supported by automated background services:

1. **User Input**: A user adds a medication in the **Frontend** (`AddMedication.jsx`), which uses `api.js` to send data to the **Backend** routes.
2. **Data Processing**: The **Backend** receives the request through `routes/`, validates the user via `middleware/`, and saves the medication data to the database using `config/`.
3. **Automation**: The `cron/` service runs independently in the background to populate the database with daily "Pending" doses based on the user's fixed schedule.
4. **Feedback Loop**: The **Frontend** `Dashboard.jsx` fetches these doses to display real-time alerts and calculate the user's weekly adherence percentage.

---

##  Database Explanation

The project uses **PostgreSQL** to manage relational data effectively.

* **Users Table**: Stores secure credentials and timezone information.
* **Medications Table**: Stores the rules for each medication (dosage, frequency, times).
* **Dose Logs Table**: Tracks the status of every scheduled dose (Taken, Skipped, or Pending).

---

##  Tech Stack

* **Frontend**: React.js, Tailwind CSS, html.
* **Backend**: Node.js, Express.js.
* **Database**: PostgreSQL.
* **Task Scheduling**: Node-Cron.
* **Authentication**: JWT (JSON Web Tokens).

---

##  Future Enhancements

* Implementation of native mobile push notifications.
* "As-needed" (PRN) medication support.
* Refill reminders to alert users when stock is low.
* Caregiver portal for managing dependents' schedules.

---
