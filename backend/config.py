import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "mysecretkey")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        # "DATABASE_URL","mysql+pymysql://root:NNKKquuifxCWJcbzOteunVbvDkBgRSQC@turntable.proxy.rlwy.net:46833/railway"
        "DATABASE_URL",
        "mysql+pymysql://root:yourPassword@localhost:3306/techstu_db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwtsecret")
    
    

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads", "assignments")
MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB

ALLOWED_EXTENSIONS = {"pdf", "docx", "doc", "pptx", "zip"}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
