"""WSGI entry point for Render deployment (gunicorn binds to this)."""

from app import app

if __name__ == "__main__":
    app.run()
