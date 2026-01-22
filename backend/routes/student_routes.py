from flask import Blueprint, request, jsonify
from models.course import Course
from models.enrollment import Enrollment
from models.announcement import Announcement
from database import db
from models.user import User
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
import os
from utils import allowed_file
from models.Assignment import Assignment
from models.Submission import Submission
from werkzeug.utils import secure_filename
from flask import send_from_directory
from models.announcementReaction import Reaction
from models.quiz import Quiz,Question
from models.QuizSubmission import QuizSubmission,QuizAttempt
from models.lecture import Lecture
from datetime import datetime,timezone
import uuid
student_bp = Blueprint("student", __name__)
# for students assignments 
UPLOAD_FOLDER = "uploads/submissions"
ALLOWED_EXTENSIONS = {"pdf", "docx", "jpg", "png", "zip"}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
@student_bp.route("/join-course", methods=["POST"])
@jwt_required()
def join_course():
    claims = get_jwt()
    if claims['role'] != 'student':
        return jsonify({"msg": "Only students can join courses"}), 403

    data = request.json
    code = data.get("code")
    course = Course.query.filter_by(code=code).first()
    if not course:
        return jsonify({"msg": "Invalid course code"}), 404
    
    already_enrolled = Enrollment.query.filter_by(course_id=course.id, student_id=claims['id']).first()
    if already_enrolled:
        return jsonify({"msg": "Already enrolled"}), 400

    enrollment = Enrollment(course_id=course.id, student_id=claims['id'])
    db.session.add(enrollment)
    db.session.commit()
    return jsonify({"msg": "Joined course successfully"})

@student_bp.route("/my-enrolled-courses", methods=["GET"])
@jwt_required()
def my_enrolled_courses():
    claims = get_jwt()
    
    if claims['role'] != 'student':
        return jsonify({"msg": "Only students can access this"}), 403

    enrollments = Enrollment.query.filter_by(student_id=claims['id']).all()
    courses = [
        {"id": e.course.id, "name": e.course.name, "code": e.course.code,"teacher_name": e.course.teacher.username,"teacher_email": e.course.teacher.email}
        for e in enrollments
    ]

    return jsonify(courses)

# View Announcements
@student_bp.route("/announcements", methods=["GET"])
@jwt_required()
def student_announcements():
    claims = get_jwt()
    role = claims.get("role")
    student_id = claims.get("id")

    # ✅ Only students can access this endpoint
    if role != "student":
        return jsonify({"msg": "Only students can view announcements"}), 403

    # ✅ Check if student is enrolled in any course
    enrolled_courses = Enrollment.query.filter_by(student_id=student_id).all()
    if not enrolled_courses:
        return jsonify({"msg": "You are not enrolled in any course"}), 404

    # ✅ Get announcements with course & teacher info
    announcements = (
        db.session.query(Announcement, Course, User)
        .join(Course, Announcement.course_id == Course.id)
        .join(User, Course.teacher_id == User.id)
        .join(Enrollment, Enrollment.course_id == Course.id)
        .filter(Enrollment.student_id == student_id)
        .all()
    )

    if not announcements:
        return jsonify({"msg": "No announcements found for your courses"}), 404

    result = []
    for ann, course, teacher in announcements:
        result.append({
            "id": ann.id, 
            "date": ann.date,
            "message": ann.message,
            "course_id": course.id,
            "course_name": course.name,
            "teacher_email": teacher.email,
        })

    return jsonify(result), 200


# Endpoint for student to view assignment assigned by teacher
@student_bp.route("/assignments", methods=["GET"])
@jwt_required()
def get_assignments():
    claims = get_jwt()
    role = claims.get("role")
    student_id = claims.get("id")

    if role != "student":
        return jsonify({"msg": "Only students can view assignments"}), 403

    # ✅ get courses where student is enrolled
    enrolled_courses = Enrollment.query.filter_by(student_id=student_id).all()
    course_ids = [e.course_id for e in enrolled_courses]

    assignments = Assignment.query.filter(Assignment.course_id.in_(course_ids)).all()
    return jsonify([
        {
            "id": a.id,
            "title": a.title,
            "filename": a.filename,
            "upload_date": a.upload_date.isoformat(),
            "course": a.course.name,
            "teacher": a.teacher.username
        }
        for a in assignments
    ]), 200

# Students upload assigned assignment to teacher
@student_bp.route("/submit-assignment/<int:assignment_id>", methods=["POST"])
@jwt_required()
def submit_assignment(assignment_id):
    claims = get_jwt()
    role = claims.get("role")
    student_id = claims.get("id")

    if role != "student":
        return jsonify({"msg": "Only students can submit assignments"}), 403
    
     # 🔹 Check if already submitted by this student
    existing_submission = Submission.query.filter_by(
        assignment_id=assignment_id, student_id=student_id
    ).first()

    if existing_submission:
        return jsonify({"msg": "You have already submitted this assignment"}), 400

    if "file" not in request.files:
        return jsonify({"msg": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"msg": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"msg": "File type not allowed"}), 400
    
    # 🔹 Create unique filename to avoid overwrite
    original_filename = secure_filename(file.filename)
    ext = os.path.splitext(original_filename)[1]  # keep extension
    unique_filename = f"{student_id}_{assignment_id}_{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(filepath)

    submission = Submission(
        filename=unique_filename,
        assignment_id=assignment_id,
        student_id=student_id,
    )
    db.session.add(submission)
    db.session.commit()

    return jsonify({"msg": "Assignment submitted successfully"}), 201
# my submissions
@student_bp.route("/my-submissions", methods=["GET"])
@jwt_required()
def my_submissions():
    student_id = get_jwt().get("id")

    submissions = Submission.query.filter_by(student_id=student_id).all()
    result = [
        {"assignment_id": s.assignment_id, "filename": s.filename, "upload_date": s.upload_date}
        for s in submissions
    ]
    return jsonify(result), 200
# Students' submissions for teachers
@student_bp.route("/uploads/submissions/<filename>")
def download_submission(filename):
    return send_from_directory("uploads/submissions", filename, as_attachment=True)

# Students route for reaction
@student_bp.route("/announcements/<int:ann_id>/react", methods=["POST"])
@jwt_required()
def react_announcement(ann_id):
    claims = get_jwt()
    if claims["role"] != "student":
        return jsonify({"msg": "Only students can react"}), 403

    existing = Reaction.query.filter_by(announcement_id=ann_id, user_id=claims["id"]).first()
    if existing:
        db.session.delete(existing)   # toggle off 👍
        db.session.commit()
        return jsonify({"msg": "Reaction removed"}), 200
    else:
        r = Reaction(announcement_id=ann_id, user_id=claims["id"])
        db.session.add(r)
        db.session.commit()
        return jsonify({"msg": "Reacted"}), 201


@student_bp.route("/announcements/<int:ann_id>/reactions", methods=["GET"])
@jwt_required()
def who_reacted(ann_id):
    reacts = (
        db.session.query(User.username)
        .join(Reaction, Reaction.user_id == User.id)
        .filter(Reaction.announcement_id == ann_id)
        .all()
    )
    return jsonify([r[0] for r in reacts]), 200


# Fetch Quiz
# student_routes.py
@student_bp.route("/course-quizzes/<int:course_id>", methods=["GET"])
@jwt_required()
def get_course_quizzes(course_id):
    claims = get_jwt()
    if claims["role"] != "student":
        return jsonify({"msg": "Only students can access this"}), 403

    student_id = claims["id"]

    quizzes = Quiz.query.filter_by(course_id=course_id).all()
    result = []
    now = datetime.now(timezone.utc)

    for q in quizzes:
        # Get how many attempts student has already made
        attempts_made = QuizAttempt.query.filter_by(student_id=student_id, quiz_id=q.id).count()

        # Check if deadline passed
        if q.deadline:
            quiz_deadline = (
                q.deadline.replace(tzinfo=timezone.utc)
                if q.deadline.tzinfo is None else q.deadline
            )
            is_deadline_passed = now > quiz_deadline
        else:
            is_deadline_passed = False

        result.append({
            "id": q.id,
            "title": q.title,
            "description": q.description,
            "timer": q.timer,  # e.g. minutes
            "attempts_allowed": q.attempts_allowed,
            "attempts_made": attempts_made,
            "deadline": q.deadline.isoformat() if q.deadline else None,
            "can_attempt": (
                (not is_deadline_passed) and (attempts_made < q.attempts_allowed)
            )
        })

    return jsonify(result), 200
# Start Quiz
@student_bp.route("/start-quiz/<int:quiz_id>", methods=["POST"])
@jwt_required()
def start_quiz(quiz_id):
    claims = get_jwt()
    if claims["role"] != "student":
        return jsonify({"msg": "Only students can start quizzes"}), 403

    student_id = claims["id"]
    quiz = Quiz.query.get_or_404(quiz_id)
    now = datetime.now(timezone.utc)

    # ✅ Deadline check
    if quiz.deadline:
        quiz_deadline = (
            quiz.deadline.replace(tzinfo=timezone.utc)
            if quiz.deadline.tzinfo is None else quiz.deadline
        )
        if now > quiz_deadline:
            return jsonify({"msg": "Deadline has passed. Quiz locked."}), 403

    # Count attempts
    attempts_made = QuizAttempt.query.filter_by(student_id=student_id, quiz_id=quiz.id).count()
    if attempts_made >= quiz.attempts_allowed:
        return jsonify({"msg": "No attempts left."}), 403

    # Create new attempt record
    attempt = QuizAttempt(
        student_id=student_id,
        quiz_id=quiz.id,
        attempt_number=attempts_made + 1,
        start_time=now,
    )
    db.session.add(attempt)
    db.session.commit()

    # Return questions structured by type
    questions = []
    for ques in quiz.questions:
        q_data = {
            "id": ques.id,
            "question_text": ques.question_text,
            "question_type": ques.question_type,
            "media": ques.media,
        }
        if ques.question_type in ["mcq", "true_false"]:
            q_data["options"] = ques.options
        elif ques.question_type == "short_answer":
            q_data["word_limit"] = ques.word_limit
        questions.append(q_data)

    return jsonify({
        "quiz_id": quiz.id,
        "attempt_number": attempt.attempt_number,
        "timer": quiz.timer,
        "questions": questions
    }), 200

# Submit Quiz
@student_bp.route("/submit-quiz/<int:quiz_id>", methods=["POST"])
@jwt_required()
def submit_quiz(quiz_id):
    claims = get_jwt()
    student_id = claims.get("id")
    data = request.json
    answers = data.get("answers", {})
    score = 0

    quiz = Quiz.query.get_or_404(quiz_id)

    # ✅ Deadline check (safe for naive + aware datetimes)
    if quiz.deadline:
        now = datetime.now(timezone.utc)
        quiz_deadline = (
            quiz.deadline.replace(tzinfo=timezone.utc)
            if quiz.deadline.tzinfo is None
            else quiz.deadline
        )
        if now > quiz_deadline:
            return jsonify({"error": "Quiz is locked. Deadline has passed."}), 403

    attempt = (
        QuizAttempt.query.filter_by(student_id=student_id, quiz_id=quiz_id)
        .order_by(QuizAttempt.start_time.desc())
        .first()
    )

    if not attempt or attempt.submitted_at:  # no active attempt or already submitted
        return jsonify({"error": "No active attempt found or already submitted"}), 400

    attempt.submitted_at = datetime.now(timezone.utc)
    attempt.max_score = len(quiz.questions)

    for qid, ans in answers.items():
        q = Question.query.get(qid)
        is_correct = False

        if q.question_type in ["mcq", "true_false"] and ans == q.correct_option:
            score += 1
            is_correct = True

        submission = QuizSubmission(
            quiz_id=quiz_id,
            question_id=qid,
            student_id=student_id,
            selected_option=ans if q.question_type != "subjective" else None,
            answer_text=ans if q.question_type == "subjective" else None,
            is_correct=is_correct,
            quiz_attempt_id=attempt.id,
        )
        db.session.add(submission)

    attempt.score = score
    db.session.commit()

    return jsonify({"message": "Quiz submitted", "score": score})

# Students view for lectures
@student_bp.route("/student/course/<int:course_id>/lectures", methods=["GET"])
@jwt_required()
def get_course_lectures(course_id):
    claims = get_jwt()
    role = claims.get("role")

    if role != "student":
        return jsonify({"msg": "Only students can view lectures"}), 403

    lectures = Lecture.query.filter_by(course_id=course_id).order_by(Lecture.upload_date).all()
    lecture_list = []

    for l in lectures:
        lecture_list.append({
            "id": l.id,
            "title": l.title,
            "description": l.description,
            "video_url": l.video_url,
            "upload_date": l.upload_date.isoformat()
        })

    return jsonify(lecture_list), 200


