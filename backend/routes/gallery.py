from flask import Blueprint, jsonify
from database import get_db

gallery_bp = Blueprint("gallery", __name__)


@gallery_bp.route("/", methods=["GET"])
def get_gallery():
    db = get_db()
    items = db.execute("SELECT * FROM gallery").fetchall()
    db.close()
    return jsonify([dict(i) for i in items]), 200
