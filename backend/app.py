from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from database import init_db
from routes.auth import auth_bp
from routes.rooms import rooms_bp
from routes.bookings import bookings_bp
from routes.blog import blog_bp
from routes.contact import contact_bp
from routes.gallery import gallery_bp
from routes.features import features_bp
from routes.event_bookings import event_bookings_bp
from routes.newsletter import newsletter_bp
from routes.admin import admin_bp

app = Flask(__name__)
app.url_map.strict_slashes = False
app.config["JWT_SECRET_KEY"] = "resort-secret-key-change-in-production"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False

CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}})
JWTManager(app)

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(rooms_bp, url_prefix="/api/rooms")
app.register_blueprint(bookings_bp, url_prefix="/api/bookings")
app.register_blueprint(blog_bp, url_prefix="/api/blog")
app.register_blueprint(contact_bp, url_prefix="/api/contact")
app.register_blueprint(gallery_bp, url_prefix="/api/gallery")
app.register_blueprint(features_bp, url_prefix="/api/features")
app.register_blueprint(event_bookings_bp, url_prefix="/api/event-bookings")
app.register_blueprint(newsletter_bp, url_prefix="/api/newsletter")
app.register_blueprint(admin_bp,      url_prefix="/api/admin")

if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5000)
