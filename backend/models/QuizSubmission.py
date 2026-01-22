from database import db
from datetime import datetime,timezone

class QuizSubmission(db.Model):
    __tablename__ = "quiz_submission"

    id = db.Column(db.Integer, primary_key=True)

    quiz_id = db.Column(db.Integer, db.ForeignKey("quiz.id"), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey("question.id"), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    #  New column to link submission → attempt
    quiz_attempt_id = db.Column(db.Integer, db.ForeignKey("quiz_attempt.id"), nullable=False)

    answer_text = db.Column(db.Text, nullable=True)
    selected_option = db.Column(db.String(255), nullable=True)
    is_correct = db.Column(db.Boolean, default=False)

    submitted_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # relationships
    quiz = db.relationship("Quiz", backref="submissions", lazy=True)
    question = db.relationship("Question", backref="submissions", lazy=True)
    student = db.relationship("User", backref="quiz_submissions", lazy=True)



class QuizAttempt(db.Model):
    __tablename__ = "quiz_attempt"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quiz.id"), nullable=False)
    attempt_number = db.Column(db.Integer, nullable=False)
    start_time = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    submitted_at = db.Column(db.DateTime)
    score = db.Column(db.Integer)
    max_score = db.Column(db.Integer)
    student = db.relationship("User", backref="quiz_attempts")
    quiz = db.relationship("Quiz", backref="attempts") 
    submissions = db.relationship("QuizSubmission", backref="quiz_attempt", lazy=True)

