from datetime import timezone
from app import create_app, db
from models import Quiz  # adjust import path

app = create_app()
with app.app_context():
    quizzes = Quiz.query.all()
    for q in quizzes:
        if q.deadline and q.deadline.tzinfo is None:
            q.deadline = q.deadline.replace(tzinfo=timezone.utc)
    db.session.commit()
    print("✅ All quiz deadlines converted to UTC")
