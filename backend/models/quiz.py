from datetime import datetime,timezone
from database import db

class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    timer = db.Column(db.Integer)  # in minutes
    attempts_allowed = db.Column(db.Integer, default=1)
    deadline = db.Column(db.DateTime)

    questions = db.relationship("Question", backref="quiz", lazy=True)

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quiz.id"), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    question_type = db.Column(db.String(50), nullable=False)  # mcq, true_false, short_answer
    options = db.Column(db.JSON, nullable=True)  # for mcq/true_false
    word_limit = db.Column(db.Integer, nullable=True)
    media = db.Column(db.String(255), nullable=True)

    correct_option = db.Column(db.String(255))  # For MCQs/TrueFalse only
