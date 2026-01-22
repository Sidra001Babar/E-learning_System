from database import db
from datetime import datetime,timezone

# models.py
class Submission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    upload_date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    assignment_id = db.Column(db.Integer, db.ForeignKey("assignment.id"), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    assignment = db.relationship("Assignment", backref="submissions", lazy=True)
    student = db.relationship("User", backref="submissions", lazy=True)
