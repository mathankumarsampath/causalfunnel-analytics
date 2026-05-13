from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
import os

# ──────────────────────────────────────────────────────
# LOAD ENV VARIABLES
# ──────────────────────────────────────────────────────
load_dotenv()

# ──────────────────────────────────────────────────────
# INITIALIZE FLASK APP
# ──────────────────────────────────────────────────────
app = Flask(__name__)

# Enable CORS for frontend access
CORS(app)

# ──────────────────────────────────────────────────────
# DATABASE CONNECTION
# ──────────────────────────────────────────────────────
client = MongoClient(os.getenv("MONGO_URI"))

db = client["analytics"]

events_collection = db["events"]

# ──────────────────────────────────────────────────────
# HEALTH CHECK API
# ──────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    try:
        return jsonify({
            "status": "ok",
            "message": "Analytics API running"
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# ──────────────────────────────────────────────────────
# CREATE EVENT API
# ──────────────────────────────────────────────────────
@app.route("/api/events", methods=["POST"])
def create_event():
    try:
        data = request.get_json()

        # Validate request body
        if not data:
            return jsonify({
                "error": "missing request body"
            }), 400

        required_fields = [
            "session_id",
            "event_type",
            "page_url"
        ]

        missing_fields = [
            field for field in required_fields
            if not data.get(field)
        ]

        if missing_fields:
            return jsonify({
                "error": "missing required fields",
                "missing": missing_fields
            }), 400

        # Validate event type
        allowed_event_types = ["page_view", "click"]

        if data["event_type"] not in allowed_event_types:
            return jsonify({
                "error": "invalid event_type",
                "allowed": allowed_event_types
            }), 400

        # Build event document
        event = {
            # Core tracking
            "session_id": data["session_id"],
            "event_index": data.get("event_index"),

            "event_type": data["event_type"],

            "page_url": data["page_url"],
            "page_title": data.get("page_title"),

            "timestamp": data.get(
                "timestamp",
                datetime.utcnow().isoformat()
            ),

            # Click coordinates
            "x": data.get("x"),
            "y": data.get("y"),

            # DOM metadata
            "element_tag": data.get("element_tag"),
            "element_text": data.get("element_text"),
            "element_id": data.get("element_id"),
            "element_class": data.get("element_class"),

            # Viewport info
            "viewport_width": data.get("viewport_width"),
            "viewport_height": data.get("viewport_height"),

            # Screen info
            "screen_width": data.get("screen_width"),
            "screen_height": data.get("screen_height"),

            # Scroll tracking
            "scroll_x": data.get("scroll_x"),
            "scroll_y": data.get("scroll_y"),

            # Device/browser metadata
            "device_type": data.get("device_type"),
            "language": data.get("language"),
            "user_agent": data.get("user_agent"),

            # Backend metadata
            "created_at": datetime.utcnow().isoformat(),
        }

        # Insert event into MongoDB
        result = events_collection.insert_one(event)

        return jsonify({
            "status": "success",
            "event_id": str(result.inserted_id)
        }), 201

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# ──────────────────────────────────────────────────────
# LIST SESSIONS API
# ──────────────────────────────────────────────────────
@app.route("/api/sessions", methods=["GET"])
def get_sessions():
    try:
        pipeline = [
            {
                "$group": {
                    "_id": "$session_id",

                    "total_events": {
                        "$sum": 1
                    },

                    "first_seen": {
                        "$min": "$timestamp"
                    },

                    "last_seen": {
                        "$max": "$timestamp"
                    },

                    "pages_visited": {
                        "$addToSet": "$page_url"
                    },

                    "device_types": {
                        "$addToSet": "$device_type"
                    }
                }
            },

            {
                "$sort": {
                    "last_seen": -1
                }
            },

            {
                "$project": {
                    "_id": 0,

                    "session_id": "$_id",

                    "total_events": 1,

                    "first_seen": 1,

                    "last_seen": 1,

                    "pages_visited": 1,

                    "device_types": 1
                }
            }
        ]

        sessions = list(
            events_collection.aggregate(pipeline)
        )

        return jsonify(sessions), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# ──────────────────────────────────────────────────────
# SESSION DETAIL API
# ──────────────────────────────────────────────────────
@app.route("/api/sessions/<session_id>", methods=["GET"])
def get_session_detail(session_id):
    try:
        events = list(
            events_collection.find(
                {"session_id": session_id},
                {"_id": 0}
            ).sort("event_index", 1)
        )

        return jsonify(events), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# ──────────────────────────────────────────────────────
# HEATMAP API
# ──────────────────────────────────────────────────────
@app.route("/api/heatmap", methods=["GET"])
def get_heatmap():
    try:
        page = request.args.get("page")

        if not page:
            return jsonify({
                "error": "page parameter is required"
            }), 400

        clicks = list(
            events_collection.find(
                {
                    "event_type": "click",

                    "page_url": page,

                    "x": {"$ne": None},

                    "y": {"$ne": None},
                },

                {
                    "_id": 0,

                    "x": 1,
                    "y": 1,

                    "scroll_y": 1,

                    "viewport_width": 1,
                    "viewport_height": 1,

                    "device_type": 1
                }
            )
        )

        return jsonify(clicks), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# ──────────────────────────────────────────────────────
# RUN FLASK SERVER
# ──────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(
        debug=True,
        use_reloader=False
    )