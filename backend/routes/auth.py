from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    cpassword = data.get("cpassword", "")

    if not all([name, email, password, cpassword]):
        return jsonify({"error": "All fields are required"}), 400
    if password != cpassword:
        return jsonify({"error": "Passwords do not match"}), 400

    hashed = generate_password_hash(password)
    db = get_db()
    try:
        db.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", (name, email, hashed))
        db.commit()
        return jsonify({"message": "Account created successfully"}), 201
    except Exception:
        return jsonify({"error": "Email already registered"}), 409
    finally:
        db.close()


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    db = get_db()
    user = db.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    db.close()

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user["id"]))
    return jsonify({"token": token, "user": {"id": user["id"], "name": user["name"], "email": user["email"]}}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    db = get_db()
    user = db.execute("SELECT id, name, email FROM users WHERE id = ?", (user_id,)).fetchone()
    db.close()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(dict(user)), 200
