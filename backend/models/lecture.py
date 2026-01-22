# models.py
from database import db
from datetime import datetime,timezone

class Lecture(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    video_url = db.Column(db.String(255), nullable=False)  # path or URL to the uploaded video
    upload_date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    teacher_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)

    teacher = db.relationship('User', backref='lectures')
    course = db.relationship('Course', backref='lectures')
