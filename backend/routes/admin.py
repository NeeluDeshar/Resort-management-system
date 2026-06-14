from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash
from database import get_db
import os

admin_bp = Blueprint("admin", __name__)

# ── helpers ──────────────────────────────────────────────────────────────────

ADMIN_EMAIL    = os.environ.get("ADMIN_EMAIL",    "admin@resort.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")

def verify_admin(identity):
    """Return True when the JWT identity is the special admin marker."""
    return identity == "admin"

def admin_required(fn):
    """Decorator: jwt_required + must be admin identity."""
    from functools import wraps
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        if not verify_admin(get_jwt_identity()):
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)
    return wrapper

# ── auth ─────────────────────────────────────────────────────────────────────

@admin_bp.route("/login", methods=["POST"])
def admin_login():
    data     = request.get_json()
    email    = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if email != ADMIN_EMAIL.lower() or password != ADMIN_PASSWORD:
        return jsonify({"error": "Invalid admin credentials"}), 401

    token = create_access_token(identity="admin")
    return jsonify({"token": token, "admin": {"email": ADMIN_EMAIL, "name": "Admin"}}), 200

# ── dashboard stats ───────────────────────────────────────────────────────────

@admin_bp.route("/dashboard", methods=["GET"])
@admin_required
def dashboard():
    db = get_db()
    stats = {
        "total_users":          db.execute("SELECT COUNT(*) FROM users").fetchone()[0],
        "total_bookings":       db.execute("SELECT COUNT(*) FROM bookings").fetchone()[0],
        "pending_bookings":     db.execute("SELECT COUNT(*) FROM bookings WHERE status='pending'").fetchone()[0],
        "confirmed_bookings":   db.execute("SELECT COUNT(*) FROM bookings WHERE status='confirmed'").fetchone()[0],
        "total_events":         db.execute("SELECT COUNT(*) FROM event_bookings").fetchone()[0],
        "pending_events":       db.execute("SELECT COUNT(*) FROM event_bookings WHERE status='pending'").fetchone()[0],
        "total_contacts":       db.execute("SELECT COUNT(*) FROM contact").fetchone()[0],
        "total_rooms":          db.execute("SELECT COUNT(*) FROM rooms").fetchone()[0],
        "available_rooms":      db.execute("SELECT COUNT(*) FROM rooms WHERE available=1").fetchone()[0],
        "newsletter_subs":      db.execute("SELECT COUNT(*) FROM newsletter").fetchone()[0],
        "total_revenue":        db.execute(
            """SELECT COALESCE(SUM(r.price * (julianday(b.check_out) - julianday(b.check_in))), 0)
               FROM bookings b JOIN rooms r ON b.room_id = r.id
               WHERE b.status IN ('confirmed','checked_in')"""
        ).fetchone()[0],
    }
    # recent 5 bookings
    recent = db.execute(
        """SELECT b.id, b.full_name, b.check_in, b.check_out, b.status,
                  r.name as room_name
           FROM bookings b JOIN rooms r ON b.room_id = r.id
           ORDER BY b.created_at DESC LIMIT 5"""
    ).fetchall()
    stats["recent_bookings"] = [dict(r) for r in recent]
    db.close()
    return jsonify(stats), 200

# ── users ─────────────────────────────────────────────────────────────────────

@admin_bp.route("/users", methods=["GET"])
@admin_required
def get_users():
    db = get_db()
    users = db.execute(
        "SELECT id, name, email, created_at FROM users ORDER BY created_at DESC"
    ).fetchall()
    db.close()
    return jsonify([dict(u) for u in users]), 200

@admin_bp.route("/users/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_user(user_id):
    db = get_db()
    db.execute("DELETE FROM users WHERE id = ?", (user_id,))
    db.commit()
    db.close()
    return jsonify({"message": "User deleted"}), 200

# ── room bookings ─────────────────────────────────────────────────────────────

@admin_bp.route("/bookings", methods=["GET"])
@admin_required
def get_all_bookings():
    status = request.args.get("status")
    db = get_db()
    if status:
        rows = db.execute(
            """SELECT b.*, r.name as room_name, r.room_type, r.price
               FROM bookings b JOIN rooms r ON b.room_id = r.id
               WHERE b.status = ? ORDER BY b.created_at DESC""", (status,)
        ).fetchall()
    else:
        rows = db.execute(
            """SELECT b.*, r.name as room_name, r.room_type, r.price
               FROM bookings b JOIN rooms r ON b.room_id = r.id
               ORDER BY b.created_at DESC"""
        ).fetchall()
    db.close()
    return jsonify([dict(r) for r in rows]), 200

@admin_bp.route("/bookings/<int:booking_id>/status", methods=["PATCH"])
@admin_required
def update_booking_status(booking_id):
    data   = request.get_json()
    status = data.get("status", "").strip()
    allowed = {"pending", "confirmed", "checked_in", "cancelled"}
    if status not in allowed:
        return jsonify({"error": f"Status must be one of {allowed}"}), 400
    db = get_db()
    db.execute("UPDATE bookings SET status = ? WHERE id = ?", (status, booking_id))
    db.commit()
    db.close()
    return jsonify({"message": "Booking status updated"}), 200

@admin_bp.route("/bookings/<int:booking_id>", methods=["DELETE"])
@admin_required
def delete_booking(booking_id):
    db = get_db()
    db.execute("DELETE FROM bookings WHERE id = ?", (booking_id,))
    db.commit()
    db.close()
    return jsonify({"message": "Booking deleted"}), 200

# ── event bookings ────────────────────────────────────────────────────────────

@admin_bp.route("/event-bookings", methods=["GET"])
@admin_required
def get_all_event_bookings():
    status = request.args.get("status")
    db = get_db()
    if status:
        rows = db.execute(
            "SELECT * FROM event_bookings WHERE status = ? ORDER BY created_at DESC", (status,)
        ).fetchall()
    else:
        rows = db.execute(
            "SELECT * FROM event_bookings ORDER BY created_at DESC"
        ).fetchall()
    db.close()
    return jsonify([dict(r) for r in rows]), 200

@admin_bp.route("/event-bookings/<int:booking_id>/status", methods=["PATCH"])
@admin_required
def update_event_booking_status(booking_id):
    data   = request.get_json()
    status = data.get("status", "").strip()
    allowed = {"pending", "confirmed", "completed", "cancelled"}
    if status not in allowed:
        return jsonify({"error": f"Status must be one of {allowed}"}), 400
    db = get_db()
    db.execute("UPDATE event_bookings SET status = ? WHERE id = ?", (status, booking_id))
    db.commit()
    db.close()
    return jsonify({"message": "Event booking status updated"}), 200

@admin_bp.route("/event-bookings/<int:booking_id>", methods=["DELETE"])
@admin_required
def delete_event_booking(booking_id):
    db = get_db()
    db.execute("DELETE FROM event_bookings WHERE id = ?", (booking_id,))
    db.commit()
    db.close()
    return jsonify({"message": "Event booking deleted"}), 200

# ── rooms management ──────────────────────────────────────────────────────────

@admin_bp.route("/rooms", methods=["GET"])
@admin_required
def get_rooms():
    db = get_db()
    rooms = db.execute("SELECT * FROM rooms ORDER BY id").fetchall()
    db.close()
    return jsonify([dict(r) for r in rooms]), 200

@admin_bp.route("/rooms", methods=["POST"])
@admin_required
def add_room():
    data = request.get_json()
    name      = data.get("name", "").strip()
    room_type = data.get("room_type", "").strip()
    price     = data.get("price")
    image     = data.get("image", "").strip()
    desc      = data.get("description", "").strip()
    available = data.get("available", 1)
    if not all([name, room_type, price]):
        return jsonify({"error": "name, room_type, and price are required"}), 400
    db = get_db()
    db.execute(
        "INSERT INTO rooms (name, room_type, price, image, description, available) VALUES (?,?,?,?,?,?)",
        (name, room_type, price, image, desc, available)
    )
    db.commit()
    db.close()
    return jsonify({"message": "Room added"}), 201

@admin_bp.route("/rooms/<int:room_id>", methods=["PUT"])
@admin_required
def update_room(room_id):
    data = request.get_json()
    db = get_db()
    db.execute(
        """UPDATE rooms SET name=?, room_type=?, price=?, image=?, description=?, available=?
           WHERE id=?""",
        (data.get("name"), data.get("room_type"), data.get("price"),
         data.get("image"), data.get("description"), data.get("available", 1), room_id)
    )
    db.commit()
    db.close()
    return jsonify({"message": "Room updated"}), 200

@admin_bp.route("/rooms/<int:room_id>", methods=["DELETE"])
@admin_required
def delete_room(room_id):
    db = get_db()
    db.execute("DELETE FROM rooms WHERE id = ?", (room_id,))
    db.commit()
    db.close()
    return jsonify({"message": "Room deleted"}), 200

@admin_bp.route("/rooms/<int:room_id>/toggle", methods=["PATCH"])
@admin_required
def toggle_room(room_id):
    db = get_db()
    room = db.execute("SELECT available FROM rooms WHERE id=?", (room_id,)).fetchone()
    if not room:
        db.close()
        return jsonify({"error": "Room not found"}), 404
    new_val = 0 if room["available"] else 1
    db.execute("UPDATE rooms SET available=? WHERE id=?", (new_val, room_id))
    db.commit()
    db.close()
    return jsonify({"available": new_val}), 200

# ── contact messages ──────────────────────────────────────────────────────────

@admin_bp.route("/contacts", methods=["GET"])
@admin_required
def get_contacts():
    db = get_db()
    rows = db.execute("SELECT * FROM contact ORDER BY created_at DESC").fetchall()
    db.close()
    return jsonify([dict(r) for r in rows]), 200

@admin_bp.route("/contacts/<int:contact_id>", methods=["DELETE"])
@admin_required
def delete_contact(contact_id):
    db = get_db()
    db.execute("DELETE FROM contact WHERE id = ?", (contact_id,))
    db.commit()
    db.close()
    return jsonify({"message": "Message deleted"}), 200

# ── newsletter subscribers ────────────────────────────────────────────────────

@admin_bp.route("/newsletter", methods=["GET"])
@admin_required
def get_newsletter():
    db = get_db()
    rows = db.execute("SELECT * FROM newsletter ORDER BY subscribed_at DESC").fetchall()
    db.close()
    return jsonify([dict(r) for r in rows]), 200

@admin_bp.route("/newsletter/<int:sub_id>", methods=["DELETE"])
@admin_required
def delete_subscriber(sub_id):
    db = get_db()
    db.execute("DELETE FROM newsletter WHERE id = ?", (sub_id,))
    db.commit()
    db.close()
    return jsonify({"message": "Subscriber removed"}), 200
