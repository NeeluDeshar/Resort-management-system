from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import get_db

bookings_bp = Blueprint("bookings", __name__)


@bookings_bp.route("/", methods=["POST"])
@jwt_required()
def create_booking():
    user_id = get_jwt_identity()
    data = request.get_json()
    room_id          = data.get("room_id")
    check_in         = data.get("check_in")
    check_out        = data.get("check_out")
    guests           = data.get("guests", 1)
    full_name        = data.get("full_name", "").strip()
    phone            = data.get("phone", "").strip()
    special_requests = data.get("special_requests", "").strip()
    payment_method   = data.get("payment_method", "Cash on Arrival").strip()
    reference_number = data.get("reference_number", "").strip()

    if not all([room_id, check_in, check_out, full_name, phone]):
        return jsonify({"error": "room_id, check_in, check_out, full_name, and phone are required"}), 400

    # Reference number required for non-cash payments
    if payment_method != "Cash on Arrival" and not reference_number:
        return jsonify({"error": "Reference number is required for the selected payment method"}), 400

    db = get_db()
    room = db.execute("SELECT * FROM rooms WHERE id = ? AND available = 1", (room_id,)).fetchone()
    if not room:
        return jsonify({"error": "Room not found or unavailable"}), 404

    db.execute(
        """INSERT INTO bookings
           (user_id, room_id, full_name, phone, check_in, check_out, guests, special_requests, payment_method, reference_number)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (user_id, room_id, full_name, phone, check_in, check_out, guests, special_requests, payment_method, reference_number),
    )
    db.commit()
    db.close()
    return jsonify({"message": "Booking created successfully"}), 201


@bookings_bp.route("/", methods=["GET"])
@jwt_required()
def get_my_bookings():
    user_id = get_jwt_identity()
    db = get_db()
    bookings = db.execute(
        """SELECT b.id, b.check_in, b.check_out, b.guests, b.status,
                  r.name as room_name, r.room_type, r.price
           FROM bookings b JOIN rooms r ON b.room_id = r.id
           WHERE b.user_id = ? ORDER BY b.created_at DESC""",
        (user_id,),
    ).fetchall()
    db.close()
    return jsonify([dict(b) for b in bookings]), 200
