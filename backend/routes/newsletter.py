from flask import Blueprint, request, jsonify
from database import get_db

newsletter_bp = Blueprint("newsletter", __name__)


@newsletter_bp.route("/", methods=["POST"])
def subscribe():
    data = request.get_json()
    email = data.get("email", "").strip().lower()

    if not email or "@" not in email:
        return jsonify({"error": "A valid email address is required."}), 400

    db = get_db()

    existing = db.execute(
        "SELECT id FROM newsletter WHERE email = ?", (email,)
    ).fetchone()

    if existing:
        db.close()
        return jsonify({"error": "This email is already subscribed."}), 409

    db.execute("INSERT INTO newsletter (email) VALUES (?)", (email,))
    db.commit()
    db.close()
    return jsonify({"message": "Thank you for subscribing!"}), 201
