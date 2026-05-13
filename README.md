# CausalFunnel User Analytics Application

## Overview

This project was built as part of the CausalFunnel Full Stack Engineer assignment.

The application tracks user interactions on a webpage, stores analytics events in MongoDB, and provides APIs for session analysis and heatmap visualization.

Tracked events:
- page_view
- click

Additional metadata captured:
- click coordinates
- viewport size
- device type
- scroll position
- DOM element details
- ordered event tracking using `event_index`

---

# Tech Stack

## Frontend
- React / Next.js
- Tailwind CSS
- Vanilla JavaScript tracker

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
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│
├── tracker/
│   └── tracker.js
│
└── README.md
```

---

# Setup

## 1. Clone Repository

```bash
git clone <repo-url>
cd causalfunnel-analytics
```

---

## 2. Backend Setup

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

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/analytics?retryWrites=true&w=majority
PORT=5000
```

Run server:

```bash
python app.py
```

Backend runs on:

```text
http://localhost:5000
```

---

## 3. Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

# Tracker Integration

```html
<script src="./tracker.js"></script>
```

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
  "page_url": "http://localhost:3000",
  "x": 300,
  "y": 220,
  "device_type": "desktop"
}
```

---

## List Sessions

```http
GET /api/sessions
```

Returns aggregated session analytics.

---

## Session Details

```http
GET /api/sessions/<session_id>
```

Returns all events for a session in chronological order.

---

## Heatmap Data

```http
GET /api/heatmap?page=<page_url>
```

Returns click coordinates for heatmap rendering.

---

# Example API Test

```bash
curl -X POST http://localhost:5000/api/events \
-H "Content-Type: application/json" \
-d '{
  "session_id": "sess_001",
  "event_index": 1,
  "event_type": "click",
  "page_url": "http://localhost:3000",
  "x": 300,
  "y": 220
}'
```

---

# Design Decisions

- `event_index` is used alongside timestamps to guarantee reliable event ordering during rapid interactions.
- `localStorage` is used for lightweight session persistence.
- MongoDB was chosen because event payloads are flexible and analytics data evolves over time.
- Additional viewport and device metadata were added to improve heatmap accuracy and session analysis.

---

# Author

**Mathankumar S**
 
LinkedIn: https://in.linkedin.com/in/mathankumarsam