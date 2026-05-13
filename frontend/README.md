# CausalFunnel User Analytics Application

## Overview

This project was built as part of the CausalFunnel Full Stack Engineer assignment.

The application tracks user interactions on a webpage, stores analytics events in MongoDB, and provides a dashboard for session analytics and click heatmap visualization.

Tracked events:
- `page_view`
- `click`

Additional tracking metadata:
- click coordinates
- viewport dimensions
- device type
- scroll position
- DOM element details
- ordered event tracking using `event_index`

---

# Tech Stack

## Frontend
- React (Vite)
- Tailwind CSS
- Axios
- Recharts

## Backend
- Python
- Flask
- Flask-CORS

## Database
- MongoDB Atlas
- PyMongo

---

# Project Structure

```text
causalfunnel-analytics/
├── backend/                # Flask API (Python)
│   ├── app.py              # Main API & MongoDB logic
│   ├── .env                # Database credentials
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # React Dashboard (Vite + Tailwind)
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Dashboard & Heatmap views
│   │   └── api/            # Backend API calls
│   └── vite.config.js
│
├── demo/                   # Test Environment
│   ├── index.html          # Demo webpage
│   └── tracker.js          # Tracking script
│
└── README.md
```

---

# Features

## Event Tracking
The tracking script captures:
- page views
- click events
- click coordinates
- viewport size
- device information
- scroll position
- DOM element metadata

Session tracking is handled using `localStorage`.

---

## Sessions Dashboard
The dashboard displays:
- total sessions
- total events
- session activity
- device information
- chronological event timelines

---

## Heatmap Visualization
The heatmap page visualizes click activity using:
- click coordinate plotting
- page-based filtering
- device distribution analytics

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone <your-repository-url>
cd causalfunnel-analytics
```

---

# Backend Setup

## Create Virtual Environment

```bash
cd backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Mac/Linux

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Configure Environment Variables

Create a `.env` file inside `backend/`

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/analytics?retryWrites=true&w=majority
PORT=5000
```

---

## Run Backend

```bash
python app.py
```

Backend runs on:

```text
http://localhost:5000
```

---

# Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Tracker Setup

Open:

```text
/demo/index.html
```

The demo page automatically loads:

```text
tracker.js
```

which sends analytics events to the backend API.

---

# API Endpoints

## Health Check

```http
GET /api/health
```

---

## Create Event

```http
POST /api/events
```

Sample payload:

```json
{
  "session_id": "sess_001",
  "event_index": 1,
  "event_type": "click",
  "page_url": "http://localhost:5173",
  "x": 320,
  "y": 180,
  "device_type": "desktop"
}
```

---

## Get Sessions

```http
GET /api/sessions
```

---

## Get Session Events

```http
GET /api/sessions/<session_id>
```

---

## Get Heatmap Data

```http
GET /api/heatmap?page=<page_url>
```

---

# Design Decisions

- `event_index` is used alongside timestamps to maintain reliable event ordering.
- MongoDB was chosen because analytics events are flexible and schema-friendly.
- Additional metadata such as viewport size and device type improves heatmap accuracy.
- Flask was selected for a lightweight backend API implementation.

---

# Author

**Mathankumar S**

LinkedIn: https://www.linkedin.com/in/mathankumarsam/