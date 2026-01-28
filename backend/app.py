from flask import Flask
# from flask_mail import Mail
from flask_jwt_extended import JWTManager
from database import db
from config import Config
from routes.auth_routes import auth_bp
from routes.teacher_routes import teacher_bp
from routes.student_routes import student_bp
# from routes.mixedRoutesForBoth import MixForBoth_bp
from flask_cors import CORS
from config import UPLOAD_FOLDER, MAX_CONTENT_LENGTH
from werkzeug.utils import secure_filename
import os
from extensions import mail,migrate

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)#, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)  # Allow requests from React frontend

db.init_app(app)
jwt = JWTManager(app)

app.register_blueprint(auth_bp)
app.register_blueprint(teacher_bp)
app.register_blueprint(student_bp)
# app.register_blueprint(MixForBoth_bp)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH
# emal for forgot password
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'sidrab349@gmail.com'
app.config['MAIL_PASSWORD'] = ''
app.config['MAIL_DEFAULT_SENDER'] = 'sidrab349@gmail.com'

# Init extensions
mail.init_app(app)
migrate.init_app(app, db)

# mail = Mail(app)
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    # app.run(debug=True)
    port = int(os.getenv("PORT", 5000))  # Railway provides PORT automatically
    app.run(host="0.0.0.0", port=port, debug=False)
