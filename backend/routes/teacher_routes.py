from flask import Blueprint, request, jsonify
from models.course import Course
from models.announcement import Announcement
from database import db
from flask_jwt_extended import jwt_required, get_jwt
import random, string
from utils import allowed_file
import os
from models.Assignment import Assignment
from werkzeug.utils import secure_filename
from flask import send_from_directory
from models.Submission import Submission
from models.quiz import Quiz,Question
from models.QuizSubmission import QuizAttempt,QuizSubmission
from models.lecture import Lecture
from datetime import datetime,timezone,timedelta
from models.user import User
from dateutil import parser
from models.DeletedStudentLog import DeletedStudentLog
from models.enrollment import Enrollment
# Import email fuction from utils
from utils import send_notification_email
teacher_bp = Blueprint("teacher", __name__)

# Folder for uploading assignments
UPLOAD_FOLDER = "uploads/assignments"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# Folder for uploading quizzes
QUIZ_UPLOAD_FOLDER = "uploads/quiz"
os.makedirs(QUIZ_UPLOAD_FOLDER, exist_ok=True)
# Folder for uploading the lectures
LECTURE_UPLOAD_FOLDER = "uploads/videos"   # local storage folder
os.makedirs(LECTURE_UPLOAD_FOLDER, exist_ok=True)
def generate_course_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@teacher_bp.route("/create-course", methods=["POST"])
@jwt_required()
def create_course():
    claims = get_jwt()
    if claims['role'] != 'teacher':
        return jsonify({"msg": "Only teachers can create courses"}), 403
    
    data = request.json
    name = data.get("name")
    code = generate_course_code()
    new_course = Course(name=name, code=code, teacher_id=claims['id'])
    db.session.add(new_course)
    db.session.commit()
    return jsonify({"msg": "Course created", "course_code": code})
@teacher_bp.route("/my-courses", methods=["GET"])
@jwt_required()
def my_courses():
    claims = get_jwt()
    if claims["role"] != "teacher":
        return jsonify({"msg": "Access denied"}), 403
    
    courses = Course.query.filter_by(teacher_id=claims["id"]).all()
    return jsonify([
        {"id": c.id, "name": c.name, "code": c.code}
        for c in courses
    ])

@teacher_bp.route("/post-announcement", methods=["POST"])
@jwt_required()
def post_announcement():
    claims = get_jwt()
    if claims['role'] != 'teacher':
        return jsonify({"msg": "Only teachers can post announcements"}), 403

    data = request.json
    course_id = data.get("course_id")
    message = data.get("message")

    course = Course.query.filter_by(id=course_id, teacher_id=claims['id']).first()
    if not course:
        return jsonify({"msg": "Not your course"}), 403

    ann = Announcement(course_id=course_id, message=message)
    db.session.add(ann)
    db.session.commit()

    # ✅ Get teacher info from DB
    teacher = User.query.get(claims['id'])

    # Get all enrolled students
    enrollments = Enrollment.query.filter_by(course_id=course_id).all()
    students = [en.student for en in enrollments] 
    recipients = [s.email for s in students]

    subject = f"New Announcement in {course.name}"
    body = f"Teacher {teacher.username} posted an announcement in {course.name}."
    # print(" Students in course:", [s.username for s in students])
    # print(" Recipients list:", recipients)

    if recipients:
        send_notification_email(subject, recipients, body)
    return jsonify({
        "msg": "Announcement posted",
        "announcement": {
            "id": ann.id,
            "course_id": ann.course_id,
            "message": ann.message,
            "date": ann.date.strftime("%Y-%m-%d %H:%M"),
            "course_name": course.name,
            "teacher_email": teacher.email
        }
    })

# my announcements blueprint
@teacher_bp.route("/my-announcements", methods=["GET"])
@jwt_required()
def my_announcements():
    claims = get_jwt()
    if claims['role'] != 'teacher':
        return jsonify({"msg": "Only teachers can view their announcements"}), 403

    # get all announcements posted by this teacher's courses
    anns = (
        db.session.query(Announcement, Course)
        .join(Course, Course.id == Announcement.course_id)
        .filter(Course.teacher_id == claims["id"])
        .order_by(Announcement.date.desc())
        .all()
    )

    result = []
    for ann, course in anns:
        result.append({
            "id": ann.id,
            "course_id": ann.course_id,
            "course_name": course.name,
            "message": ann.message,
            "date": ann.date.strftime("%Y-%m-%d %H:%M"),
            "teacher_email": claims["email"]
        })

    return jsonify(result), 200
@teacher_bp.route("/post-assignment", methods=["POST"])
@jwt_required()
def post_assignment():
    claims = get_jwt()
    role = claims.get("role")
    teacher_id = claims.get("id")

    #  Only teachers allowed
    if role != "teacher":
        return jsonify({"msg": "Only teachers can post assignments"}), 403

    #  Title validation
    title = request.form.get("title")
    course_id = request.form.get("course_id")
    if not title or not course_id:
        return jsonify({"msg": "Title and course_id are required"}), 400

    #  File validation
    if "file" not in request.files:
        return jsonify({"msg": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"msg": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"msg": "File type not allowed"}), 400

    #  Save file
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    #  Save to DB
    new_assignment = Assignment(
        title=title,
        filename=filename,
        course_id=course_id,
        teacher_id=teacher_id,
    )
    db.session.add(new_assignment)
    db.session.commit()

      # ✅ Email Notification
    # Get course info
    course = Course.query.get(course_id)
    teacher = User.query.get(teacher_id)

    # Get enrolled students
    enrollments = Enrollment.query.filter_by(course_id=course_id).all()
    students = [en.student for en in enrollments]   # because of relationship we added
    recipients = [s.email for s in students]

    # Prepare email
    subject = f"New Assignment in {course.name}"
    body = f"Teacher {teacher.username} posted a new assignment in {course.name}."

    if recipients:
        send_notification_email(subject, recipients, body)
        # print("📧 Assignment email sent to:", recipients)
    else:
        print("⚠️ No students enrolled, no emails sent.")

    return jsonify({"msg": "Assignment posted successfully"}), 201

# Download Teachers' uploaded assignments from this endpoint
@teacher_bp.route("/uploads/assignments/<filename>")
def download_assignment(filename):
    return send_from_directory("uploads/assignments", filename, as_attachment=True)

# End point for teacher to view assignment of Students
@teacher_bp.route("/course/<int:course_id>/Stu-Ass-submissions", methods=["GET"])
@jwt_required()
def student_Ass_submissions(course_id):
    claims = get_jwt()
    if claims["role"] != "teacher":
        return jsonify({"msg": "Access denied"}), 403

    teacher_id = claims["id"]

    # Check if this course belongs to teacher
    course = Course.query.filter_by(id=course_id, teacher_id=teacher_id).first()
    if not course:
        return jsonify({"msg": "Course not found or unauthorized"}), 404

    #  Fetch submissions of assignments in this course
    submissions = (
        db.session.query(Submission)
        .join(Assignment, Submission.assignment_id == Assignment.id)
        .filter(Assignment.course_id == course_id)
        .all()
    )

    return jsonify([
        {
            "id": s.id,
            "filename": s.filename,
            "upload_date": s.upload_date.isoformat(),
            "student": s.student.username,   # assuming User has username
            "assignment_title": s.assignment.title,
        }
        for s in submissions
    ])
# Quiz
@teacher_bp.route("/create-quiz", methods=["POST"])
@jwt_required()
def create_quiz():
    claims = get_jwt()
    if claims["role"] != "teacher":
        return jsonify({"msg": "Access denied"}), 403

    data = request.form
    title = data.get("title")
    description = data.get("description")
    course_id = data.get("course_id")
    timer = data.get("timer")
    attempts_allowed = data.get("attempts_allowed")
    deadline = data.get("deadline")

    if not title or not course_id:
        return jsonify({"msg": "Missing title or course_id"}), 400
    # ✅ Parse deadline as UTC-aware datetime
    parsed_deadline = None
    if deadline:
        # deadline is expected in ISO format (e.g. 2025-09-20T18:30)
        parsed_deadline = datetime.strptime(deadline, "%Y-%m-%dT%H:%M")
        parsed_deadline = parsed_deadline.replace(tzinfo=timezone.utc)
    # Create quiz
    quiz = Quiz(
        title=title,
        description=description,
        course_id=course_id,
        teacher_id=claims["id"],
        timer=int(timer) if timer else None,
        attempts_allowed=int(attempts_allowed) if attempts_allowed else 1,
        deadline=parsed_deadline
    )
    db.session.add(quiz)
    db.session.flush()  # so quiz.id is available immediately

    # Parse questions (coming as JSON string in request.form["questions"])
    import json
    try:
        questions_data = json.loads(data.get("questions", "[]"))
    except Exception:
        return jsonify({"msg": "Invalid questions format"}), 400

    for q in questions_data:
        
        media_path = None

        # Handle media file (if uploaded)
        file = request.files.get("media")
        if file:
            filename = secure_filename(file.filename)
            media_path = os.path.join(QUIZ_UPLOAD_FOLDER, filename)
            file.save(media_path)

        #  Fix word_limit issue (convert to int if provided, else None)
        word_limit = q.get("word_limit")
        if word_limit:
            try:
                word_limit = int(word_limit)
            except ValueError:
                word_limit = None  # fallback if frontend sends wrong type

        question = Question(
            quiz_id=quiz.id,
            question_text=q.get("question_text"),
            question_type=q.get("question_type"),
            options=q.get("options"),
            word_limit=word_limit,
            media=media_path,
            correct_option=q.get("correct_option")
        )
        db.session.add(question)

    db.session.commit()

    return jsonify({"msg": "Quiz created successfully", "quiz_id": quiz.id}), 201

# Endpoint for teachers to viw atudents' attempted courses
@teacher_bp.route("/course/<int:course_id>/attempts", methods=["GET"])
@jwt_required()
def get_course_attempts(course_id):
    claims = get_jwt()
    if claims["role"] != "teacher":
        return jsonify({"msg": "Access denied"}), 403

    # make sure teacher owns this course
    course = Course.query.filter_by(id=course_id, teacher_id=claims["id"]).first()
    if not course:
        return jsonify({"msg": "Course not found or not yours"}), 404

    attempts = (
        db.session.query(QuizAttempt)
        .join(Quiz, QuizAttempt.quiz_id == Quiz.id)
        .filter(Quiz.course_id == course_id)
        .all()
    )

    data = []
    for attempt in attempts:
        submissions = [
            {
                "id": sub.id,
                "question_id": sub.question_id,
                "answer_text": sub.answer_text,
                "selected_option": sub.selected_option,
                "is_correct": sub.is_correct,
            }
            for sub in attempt.submissions
        ]
        quiz = attempt.quiz 
        data.append(
            {
                "attempt_id": attempt.id,
                "student_id": attempt.student_id,
                "student_username": attempt.student.username if attempt.student else None,
                "quiz_id": attempt.quiz_id,
                "quiz_title": quiz.title if quiz else None,
                "quiz_description": quiz.description if quiz else None,
                "score": attempt.score,
                "max_score": attempt.max_score,
                "submissions": submissions,
            }
        )
    return jsonify(data)

@teacher_bp.route("/attempt/<int:attempt_id>/grade", methods=["PUT"])
@jwt_required()
def grade_attempt(attempt_id):
    claims = get_jwt()
    if claims["role"] != "teacher":
        return jsonify({"msg": "Access denied"}), 403

    data = request.json
    score = data.get("score")

    attempt = QuizAttempt.query.get(attempt_id)
    if not attempt:
        return jsonify({"msg": "Attempt not found"}), 404

    attempt.score = score
    attempt.submitted_at = datetime.now(timezone.utc)

    db.session.commit()
    return jsonify({"msg": "Score updated", "score": attempt.score,"student_username": attempt.student.username if attempt.student else None,})

# upload lectures by the teacher
@teacher_bp.route("/upload-lecture", methods=["POST"])
@jwt_required()
def upload_lecture():
    claims = get_jwt()
    role = claims.get("role")
    teacher_id = claims.get("id")

    #  Only teachers allowed
    if role != "teacher":
        return jsonify({"msg": "Only teachers can upload lectures"}), 403

    #  Required fields
    title = request.form.get("title")
    description = request.form.get("description")
    course_id = request.form.get("course_id")

    if not title or not course_id:
        return jsonify({"msg": "Title and course_id are required"}), 400

    #  File validation
    if "video" not in request.files:
        return jsonify({"msg": "No video file provided"}), 400

    file = request.files["video"]

    if file.filename == "":
        return jsonify({"msg": "No video file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"msg": "Video file type not allowed"}), 400

    #  Save file securely
    filename = secure_filename(file.filename)
    filepath = os.path.join(LECTURE_UPLOAD_FOLDER, filename)
    file.save(filepath)
    video_url = f"/uploads/videos/{filename}".replace("\\", "/")
    #  Save to DB
    new_lecture = Lecture(
        title=title,
        description=description,
        video_url=video_url,
        teacher_id=teacher_id,
        course_id=course_id,
    )
    db.session.add(new_lecture)
    db.session.commit()

    return jsonify({"msg": "Lecture uploaded successfully","video_url": video_url}), 201

# Server Lectures to the students
@teacher_bp.route("/uploads/videos/<path:filename>")
def serve_lecture(filename):
    return send_from_directory(LECTURE_UPLOAD_FOLDER, filename, mimetype="video/mp4")

#  Get all students in teacher's courses
@teacher_bp.route("/my-students", methods=["GET"])
@jwt_required()
def get_students():
    claims = get_jwt()
    if claims["role"] != "teacher":
        return jsonify({"msg": "Only teachers can view students"}), 403

    teacher_id = claims["id"]
    students = (
        db.session.query(Enrollment, User, Course)
        .join(User, Enrollment.student_id == User.id)
        .join(Course, Enrollment.course_id == Course.id)
        .filter(Course.teacher_id == teacher_id)
        .all()
    )

    result = []
    for enrollment, student, course in students:
        result.append({
            "enrollment_id": enrollment.id,
            "student_id": student.id,
            "username": student.username,
            "email": student.email,
            "course": course.name,
            "course_code": course.code,   
            "course_id": course.id       
        })

    return jsonify(result)


#  Delete student (soft delete with undo option)
@teacher_bp.route("/delete-student/<int:enrollment_id>", methods=["DELETE"])
@jwt_required()
def delete_student(enrollment_id):
    claims = get_jwt()
    if claims["role"] != "teacher":
        return jsonify({"msg": "Only teachers can delete students"}), 403

    enrollment = (
        db.session.query(Enrollment)
        .join(Course, Enrollment.course_id == Course.id)
        .filter(Enrollment.id == enrollment_id, Course.teacher_id == claims["id"])
        .first()
    )
    if not enrollment:
        return jsonify({"msg": "Not found or unauthorized"}), 404

    # Record deletion log
    log = DeletedStudentLog(
        enrollment_id=enrollment.id,
        student_id=enrollment.student_id,
        course_id=enrollment.course_id,
        teacher_id=claims["id"],
        action="delete"
    )
    db.session.add(log)

    db.session.delete(enrollment)
    db.session.commit()

    return jsonify({"msg": "Student deleted. Undo available for 10 days."})


#  Undo delete
@teacher_bp.route("/undo-student/<int:log_id>", methods=["POST"])
@jwt_required()
def undo_student(log_id):
    claims = get_jwt()
    if claims["role"] != "teacher":
        return jsonify({"msg": "Only teachers can undo"}), 403

    log = DeletedStudentLog.query.filter_by(id=log_id, teacher_id=claims["id"], action="delete").first()
    if not log:
        return jsonify({"msg": "No record found"}), 404

    # Check if within 10 days
    if datetime.now(timezone.utc) - log.timestamp > timedelta(days=10):
        return jsonify({"msg": "Undo period expired"}), 400

    # Recreate enrollment
    enrollment = Enrollment(student_id=log.student_id, course_id=log.course_id)
    db.session.add(enrollment)

    # Add undo log
    undo_log = DeletedStudentLog(
        enrollment_id=enrollment.id,
        student_id=log.student_id,
        course_id=log.course_id,
        teacher_id=claims["id"],
        action="undo"
    )
    db.session.add(undo_log)
    db.session.commit()

    return jsonify({"msg": "Student restored successfully"})