# models.py
from datetime import datetime,timezone
from database import db

# Model for teacher (upload assignments for students)
class Assignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    upload_date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    course = db.relationship("Course", backref="assignments", lazy=True)
    teacher = db.relationship("User", backref="assignments", lazy=True)
