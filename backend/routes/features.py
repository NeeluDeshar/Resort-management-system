from flask import Blueprint, jsonify
from database import get_db

features_bp = Blueprint("features", __name__)


@features_bp.route("/", methods=["GET"])
def get_features():
    db = get_db()
    items = db.execute("SELECT * FROM features").fetchall()
    db.close()
    return jsonify([dict(i) for i in items]), 200


@features_bp.route("/<int:feature_id>", methods=["GET"])
def get_feature(feature_id):
    db = get_db()
    item = db.execute("SELECT * FROM features WHERE id = ?", (feature_id,)).fetchone()
    db.close()
    if not item:
        return jsonify({"error": "Feature not found"}), 404
    return jsonify(dict(item)), 200
