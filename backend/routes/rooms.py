from flask import Blueprint, jsonify
from database import get_db

rooms_bp = Blueprint("rooms", __name__)


@rooms_bp.route("/", methods=["GET"])
def get_rooms():
    db = get_db()
    rooms = db.execute("SELECT * FROM rooms").fetchall()
    db.close()
    return jsonify([dict(r) for r in rooms]), 200


@rooms_bp.route("/<int:room_id>", methods=["GET"])
def get_room(room_id):
    db = get_db()
    room = db.execute("SELECT * FROM rooms WHERE id = ?", (room_id,)).fetchone()
    db.close()
    if not room:
        return jsonify({"error": "Room not found"}), 404
    return jsonify(dict(room)), 200
