# src/app.py - Flask app for compatibility only
from flask import Flask

flask_app = Flask(__name__)  # Ubah nama variable agar tidak conflict

@flask_app.route("/")
def health():
    return {"status": "ok"}

# HANYA untuk testing, bukan untuk production
if __name__ == "__main__":
    flask_app.run(host="0.0.0.0", port=8000)