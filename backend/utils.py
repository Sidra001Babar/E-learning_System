import os
import threading
from flask_mail import Message
from extensions import mail
from flask import current_app
# Define allowed extensions (can also put in config.py)
ALLOWED_EXTENSIONS = {"pdf", "doc", "docx", "txt", "png", "jpg", "jpeg","mp4", "mov"}

def allowed_file(filename):
    """Check if uploaded file has an allowed extension"""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def send_async_email(app, msg):
    with app.app_context():
        try:
            mail.send(msg)
            print("✅ Email sent successfully to:", msg.recipients)
        except Exception as e:
            print("❌ Email sending failed:", str(e))

def send_notification_email(subject, recipients, body):
    app = current_app._get_current_object()
    msg = Message(subject=subject, recipients=recipients, body=body)
    thr = threading.Thread(target=send_async_email, args=(app, msg))
    thr.start()
