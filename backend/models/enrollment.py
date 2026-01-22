from database import db

class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    # without it course name cannot read,SQLAlchemy will link each Enrollment to the corresponding Course object automatically. 
    course = db.relationship('Course', backref='enrollments')
    # for email
    student = db.relationship('User', backref='enrollments')   # add this for direct access