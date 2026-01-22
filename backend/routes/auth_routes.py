from flask import Blueprint, request, jsonify, current_app
from models.user import User
from database import db
from flask_jwt_extended import create_access_token
import bcrypt
import re
import secrets
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from flask_mail import Message
reset_tokens = {} 

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")  # keep it string for validation
    role = data.get("role")

    if not all([username, email, password, role]):
        return jsonify({"msg": "All fields are required"}), 400


    if not re.match(
        r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$',
        password,
      ):
        return jsonify({
            "msg": "Weak password. Must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character."
        }), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"msg": "Username or Email already exists"}), 400

    # hash password after validation
    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    user = User(username=username, email=email, password=hashed_pw, role=role)
    db.session.add(user)
    db.session.commit()
    
    return jsonify({"msg": "User registered successfully"}), 201
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username_or_email = data.get("username")
    password = data.get("password").encode("utf-8")  # bytes

    user = User.query.filter(
        (User.username == username_or_email) | (User.email == username_or_email)
    ).first()

    if user:
        hashed_pw_bytes = user.password.encode("utf-8")  # convert stored string to bytes
        if bcrypt.checkpw(password, hashed_pw_bytes):
            token = create_access_token(
                identity=username_or_email,
                additional_claims={"id": user.id, "role": user.role, "email": user.email}
            )
            return jsonify({
                "access_token": token,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "role": user.role,
                    "email": user.email
                }
            })
    
    return jsonify({"msg": "Invalid credentials"}), 401
# Change Password
@auth_bp.route("/change-password", methods=["POST"])
@jwt_required()
def change_password():
    data = request.json
    old_password = data.get("old_password").encode("utf-8")
    new_password = data.get("new_password")

    current_user_username = get_jwt_identity()
    user = User.query.filter_by(username=current_user_username).first()

    if not user or not bcrypt.checkpw(old_password, user.password.encode("utf-8")):
        return jsonify({"msg": "Old password is incorrect"}), 400

    # ✅ Strong password check (reuse same regex as register)
    import re
    if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$', new_password):
        return jsonify({"msg": "New password is too weak"}), 400

    user.password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    db.session.commit()
    return jsonify({"msg": "Password updated successfully"}), 200
# Reset Password
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.json
    token = data.get("token")
    new_password = data.get("new_password")

    if token not in reset_tokens:
        return jsonify({"msg": "Invalid or expired token"}), 400

    info = reset_tokens[token]
    if datetime.utcnow() > info["expires"]:
        del reset_tokens[token]
        return jsonify({"msg": "Token expired"}), 400

    user = User.query.get(info["user_id"])
    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Strong password check
    import re
    if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$', new_password):
        return jsonify({"msg": "Weak password"}), 400

    # Update password
    user.password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    db.session.commit()

    del reset_tokens[token]  # delete used token
    return jsonify({"msg": "Password reset successfully"}), 200


# Forgot Password
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.json
    email = data.get("email")
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"msg": "No account found with this email"}), 404

    # Generate token
    token = secrets.token_urlsafe(32)
    reset_tokens[token] = {"user_id": user.id, "expires": datetime.utcnow() + timedelta(minutes=15)}

    reset_link = f"http://localhost:5173/reset-password?token={token}"
    mail = current_app.extensions['mail']
    # ✉️ Send email
    msg = Message("Password Reset Request", recipients=[email])
    msg.body = f"Hello {user.username},\n\nClick the link below to reset your password:\n{reset_link}\n\nThis link will expire in 15 minutes."
    mail.send(msg)

    return jsonify({"msg": "Password reset link has been sent to your email"}), 200