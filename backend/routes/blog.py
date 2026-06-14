from flask import Blueprint, jsonify
from database import get_db

blog_bp = Blueprint("blog", __name__)


@blog_bp.route("/", methods=["GET"])
def get_blogs():
    db = get_db()
    blogs = db.execute("SELECT * FROM blog ORDER BY created_at DESC").fetchall()
    db.close()
    return jsonify([dict(b) for b in blogs]), 200


@blog_bp.route("/<int:blog_id>", methods=["GET"])
def get_blog(blog_id):
    db = get_db()
    blog = db.execute("SELECT * FROM blog WHERE id = ?", (blog_id,)).fetchone()
    db.close()
    if not blog:
        return jsonify({"error": "Blog not found"}), 404
    return jsonify(dict(blog)), 200
