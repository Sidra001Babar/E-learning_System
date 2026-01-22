from database import db
from datetime import datetime, timedelta, timezone

class DeletedStudentLog(db.Model):
    __tablename__ = "deleted_student_log"

    id = db.Column(db.Integer, primary_key=True)
    enrollment_id = db.Column(db.Integer, nullable=False)
    student_id = db.Column(db.Integer, nullable=False)
    course_id = db.Column(db.Integer, nullable=False)
    teacher_id = db.Column(db.Integer, nullable=False)
    action = db.Column(db.String(20), nullable=False)  # 'delete' or 'undo'
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
