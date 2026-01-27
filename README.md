# 📘 E-Learning Management System (ELMS)

A user-friendly **E-Learning Management System** that supports **two main roles**:  
👨‍🏫 **Teacher** and 👨‍🎓 **Student**, designed for interactive learning, content management, and progress tracking.

---

## 👥 User Roles

### 1️⃣ Teacher  
Teachers manage course content, assessments, and student engagement.

### 2️⃣ Student  
Students enroll in courses, access learning material, and complete assessments.

---
## 🔐 Authentication & Authorization

### 🔑 Authentication
- Secure **user registration & login**
- Username/email + password authentication
- Password hashing & encryption
- Session-based / JWT-based authentication

### 🛡️ Authorization (Role-Based Access Control)
- **Teacher and Student have different access rights**
- Teachers **cannot access student-only features**
- Students **cannot create or manage course content**
- Middleware enforces role-based permissions
- Protected routes for sensitive actions

## 👨‍🏫 Teacher Module

### 📚 Course Management
- Create and manage multiple courses


---

### 📢 Announcements
- Post announcements for enrolled students
- With text editor
- Students can **react** (👍) to announcements


---

### 📝 Assignments
- Create assignments with:
  - Title & description
  - File upload support (PDF, DOCX,  etc.)

- View student submissions


---

### 🧠 Quizzes
Create **interactive quizzes** with the following features:

#### Quiz Settings
- Quiz title & description
- Start & end date (deadline)
- Time limit (timer-based)
- Attempts allowed (e.g., 1, 2, unlimited)
- Auto-submit on timeout

#### Question Types
- ✅ **True / False**
- 🎯 **Objective (MCQs)**
- ✍️ **Subjective (Long answer)**


---

### 🎥 Video Lectures
- Upload video lectures (MP4, YouTube embed, etc.)
- Add:
  - Lecture title
  - Description
  - Duration
- Lectures are added **dynamically** to the course
- Each lecture appears automatically in its **own sidebar section**


---

## 👨‍🎓 Student Module

### 🔐 Course Enrollment
- Join courses using:
  - Course code 
- View enrolled courses 

---

### 📢 Announcements
- View all teacher announcements
- React to announcements
- Read in chronological order
- Search and sort announcements 

---

### 📝 Assignments
- View assignment details
- Check deadlines
- Upload submissions


---

### 🧠 Quizzes
- Attempt quizzes in an **interactive interface**
- Features:
  - Countdown timer
  - Progress indicator
  - Question navigation panel

- View allowed attempts remaining

---

### 🎥 Lectures
- Access video lectures uploaded by teacher
- Sidebar shows:
  - Lecture list
  - Currently playing lecture
- Watch lectures with description
- Resume from last watched position

---

## 📊 System Features (Common)

- Responsive & user-friendly UI
- Role-based access control
- Real-time updates (announcements, lectures)
- Secure file uploads
- Progress tracking dashboard
- Notifications for deadlines & new content


---

✨ **This ELMS ensures smooth interaction between teachers and students with a modern, dynamic, and engaging learning experience.**
