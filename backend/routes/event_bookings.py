from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import get_db

event_bookings_bp = Blueprint("event_bookings", __name__)


@event_bookings_bp.route("/", methods=["POST"])
@jwt_required()
def create_event_booking():
    user_id = get_jwt_identity()
    data = request.get_json()

    event_type       = data.get("event_type", "").strip()
    full_name        = data.get("full_name", "").strip()
    phone            = data.get("phone", "").strip()
    email            = data.get("email", "").strip()
    event_date       = data.get("event_date", "").strip()
    guests           = data.get("guests", 1)
    duration         = data.get("duration", "").strip()
    special_requests = data.get("special_requests", "").strip()
    payment_method   = data.get("payment_method", "Cash on Arrival").strip()
    reference_number = data.get("reference_number", "").strip()

    if not all([event_type, full_name, phone, email, event_date]):
        return jsonify({"error": "event_type, full_name, phone, email, and event_date are required"}), 400

    # Reference number required for non-cash payments
    if payment_method != "Cash on Arrival" and not reference_number:
        return jsonify({"error": "Reference number is required for the selected payment method"}), 400

    db = get_db()
    db.execute(
        """INSERT INTO event_bookings
           (user_id, event_type, full_name, phone, email, event_date, guests, duration, special_requests, payment_method, reference_number)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (user_id, event_type, full_name, phone, email, event_date, guests, duration, special_requests, payment_method, reference_number),
    )
    db.commit()
    db.close()
    return jsonify({"message": "Event booking submitted successfully"}), 201


@event_bookings_bp.route("/", methods=["GET"])
@jwt_required()
def get_my_event_bookings():
    user_id = get_jwt_identity()
    db = get_db()
    rows = db.execute(
        "SELECT * FROM event_bookings WHERE user_id = ? ORDER BY created_at DESC",
        (user_id,),
    ).fetchall()
    db.close()
    return jsonify([dict(r) for r in rows]), 200
