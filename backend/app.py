"""
Flask backend for CausalFunnel User Analytics Application.
Connects to MongoDB Atlas and exposes APIs for event tracking,
session analytics, and click heatmap data.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
from bson import ObjectId
import os

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all origins (allows frontend on any domain to call these APIs)
CORS(app)

# Connect to MongoDB Atlas using the connection string from .env
client = MongoClient(os.getenv("MONGO_URI"))
db = client["analytics"]
events_collection = db["events"]


def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable dict by converting ObjectId to string."""
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


# ─────────────────────────────────────────
# 1. Health Check API
#    Returns {"status": "ok"} — used for deployment health checks on Render
# ─────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    try:
        return jsonify({"status": "ok"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─────────────────────────────────────────
# 2. Create Event API
#    Accepts JSON with session_id, event_type, page_url,
#    timestamp, x, y — validates required fields, stores in MongoDB
# ─────────────────────────────────────────
@app.route("/api/events", methods=["POST"])
def create_event():
    try:
        data = request.get_json()

        # Validate that required fields are present
        if not data or not all(
            key in data and data[key]
            for key in ["session_id", "event_type", "page_url"]
        ):
            return jsonify({"error": "missing fields"}), 400

        # Build the event document
        event = {
            "session_id": data["session_id"],
            "event_type": data["event_type"],
            "page_url": data["page_url"],
            "timestamp": data.get("timestamp", datetime.utcnow().isoformat()),
            "x": data.get("x", None),
            "y": data.get("y", None),
        }

        # Insert into MongoDB events collection
        events_collection.insert_one(event)

        return jsonify({"status": "success"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─────────────────────────────────────────
# 3. List Sessions API
#    Uses MongoDB aggregation to group events by session_id.
#    Returns per session: session_id, total_events,
#    first_seen, last_seen, pages_visited.
#    Sorted by last_seen descending.
# ─────────────────────────────────────────
@app.route("/api/sessions", methods=["GET"])
def get_sessions():
    try:
        pipeline = [
            {
                "$group": {
                    "_id": "$session_id",
                    "total_events": {"$sum": 1},
                    "first_seen": {"$min": "$timestamp"},
                    "last_seen": {"$max": "$timestamp"},
                    "pages_visited": {"$addToSet": "$page_url"},
                }
            },
            {"$sort": {"last_seen": -1}},
            {
                "$project": {
                    "_id": 0,
                    "session_id": "$_id",
                    "total_events": 1,
                    "first_seen": 1,
                    "last_seen": 1,
                    "pages_visited": 1,
                }
            },
        ]

        sessions = list(events_collection.aggregate(pipeline))
        return jsonify(sessions), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─────────────────────────────────────────
# 4. Session Detail API
#    Finds all events for a given session_id, sorted by
#    timestamp ascending (chronological order).
#    Excludes _id from the response.
# ─────────────────────────────────────────
@app.route("/api/sessions/<session_id>", methods=["GET"])
def get_session_detail(session_id):
    try:
        events = list(
            events_collection.find(
                {"session_id": session_id}, {"_id": 0}
            ).sort("timestamp", 1)
        )

        return jsonify(events), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─────────────────────────────────────────
# 5. Heatmap API
#    Returns click coordinates (x, y) for a given page URL.
#    Filters for event_type "click" with non-null x and y values.
#    Query parameter: ?page=<url>
# ─────────────────────────────────────────
@app.route("/api/heatmap", methods=["GET"])
def get_heatmap():
    try:
        page = request.args.get("page")

        if not page:
            return jsonify({"error": "page parameter is required"}), 400

        clicks = list(
            events_collection.find(
                {
                    "event_type": "click",
                    "page_url": page,
                    "x": {"$ne": None},
                    "y": {"$ne": None},
                },
                {"_id": 0, "x": 1, "y": 1},
            )
        )

        return jsonify(clicks), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Run the Flask dev server
if __name__ == "__main__":
    # use_reloader=False helps avoid OSError [WinError 10038] on some Windows setups
    app.run(debug=True, use_reloader=False)
