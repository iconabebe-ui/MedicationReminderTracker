# 💊 MedTracker - Medication Reminder & Tracker (Frontend)

MedTracker is a mobile-first web application built with **React.js** to help patients and caregivers manage medication schedules. It provides automated tracking, stock management, and visual adherence analytics.

## 🚀 Key Features

* **Daily Action Center**: A streamlined "Today" view that displays medications due now with one-tap "Take" or "Skip" buttons.
* **Adherence Dashboard**: Visual 7-day analytics including percentage charts and daily progress bars.
* **Inventory Tracking**: Integrated stock management that triggers "Low Stock" alerts and facilitates easy refills.
* **Dose History**: A searchable record of all past actions to ensure transparency for healthcare providers.
* **In-App Alerts**: A polling system that notifies users when a scheduled dose is due.

## 🛠 Tech Stack

* **Framework**: React.js
* **Styling**: Mobile-First Responsive CSS / Tailwind CSS
* **Icons**: Lucide-React
* **API Communication**: Fetch API with async/await
* **Deployment**: Render (Static Site)

## 🔌 API Integration Reference

The frontend is integrated with the backend API at:  
`https://medication-reminder-tracker.onrender.com/api`

### Integrated Endpoints:

| Category | Endpoint | Method | Purpose |
| :--- | :--- | :--- | :--- |
| **Medication** | `/medications` | `GET/POST` | Fetch all or add new medication |
| **Updates** | `/medications/:id` | `PUT/DELETE` | Edit details, refill stock, or remove |
| **Logging** | `/medications/:id/log` | `POST` | Record dose as "Taken" or "Skipped" |
| **Stats** | `/adherence` | `GET` | Calculate 7-day adherence data |
| **History** | `/dose-logs` | `GET` | Retrieve chronological intake logs |
| **System** | `/health` | `GET` | Sync server time for accurate reminders |

## 📂 Project Structure

```text
src/
├── components/
│ ├── Dashboard/ # Adherence Chart & Today's Schedule
│ ├── Medication/ # Medication CRUD & Card Views
│ ├── Forms/ # Entry forms for meds & doses
│ └── Layout/ # Mobile Navigation & Header
├── context/ # Global state (MedicationContext)
├── utils/ # Adherence logic & Date formatting
└── hooks/ # Custom API and Storage hooks

