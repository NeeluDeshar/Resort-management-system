from flask import Blueprint, request, jsonify
from database import get_db

contact_bp = Blueprint("contact", __name__)


@contact_bp.route("/", methods=["POST"])
def submit_contact():
    data = request.get_json()
    fname = data.get("fname", "").strip()
    lname = data.get("lname", "").strip()
    phone = data.get("phone", "")
    email = data.get("email", "").strip()
    subject = data.get("subject", "")
    company = data.get("company", "")
    message = data.get("message", "")

    if not all([fname, lname, email]):
        return jsonify({"error": "First name, last name, and email are required"}), 400

    db = get_db()
    db.execute(
        "INSERT INTO contact (fname, lname, phone, email, subject, company, message) VALUES (?,?,?,?,?,?,?)",
        (fname, lname, phone, email, subject, company, message),
    )
    db.commit()
    db.close()
    return jsonify({"message": "Message sent successfully"}), 201
