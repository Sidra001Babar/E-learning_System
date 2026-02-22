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
# 📸 Project Screenshots

## 1. Authentication
<p align="center">
  <img width="400" alt="1" src="https://github.com/user-attachments/assets/4afb736f-b483-42a0-9ca7-a58b15ea17ba" />
  <img width="400" alt="2" src="https://github.com/user-attachments/assets/a535e68c-01e8-43c3-8e27-88644d1a80e0" />

</p>

## 2. Teacher Modules
### Course Management
<p align="center">
 <img width="400"  alt="15" src="https://github.com/user-attachments/assets/314bc7cb-0fc6-4522-9837-11d5af10e8ba" />
 <img width="400" alt="16" src="https://github.com/user-attachments/assets/7f81f174-2b31-4e50-a35c-7bf908a2915e" />
</p>

### Announcement Management
<p align="center" style="display:flex; justify-content:center; gap:10px";>
<img width="300" height="200" alt="17" src="https://github.com/user-attachments/assets/4ba5d8a1-1036-40e2-8a11-b41d117c3014" />
<img  width="300" height="200" alt="18" src="https://github.com/user-attachments/assets/1e3e7207-0dfd-4051-bbd2-189442352f7b" />
<img width="300" height="200" alt="19" src="https://github.com/user-attachments/assets/3aaf433d-db06-47f6-bc4a-bd8c60041911" />

</p
  
### Assignment Management
<p align="center">
 <img width="400" alt="20" src="https://github.com/user-attachments/assets/01b34394-7e9b-4c8f-aeae-e8d079d0264a" />
<img width="400" alt="21" src="https://github.com/user-attachments/assets/4578bc68-7069-44a2-9b38-a3bf0a148371" />
<img width="400" alt="22" src="https://github.com/user-attachments/assets/d1560d06-2458-48ee-8886-19be2b041f49" />
</p>

### Quiz Management
<p align="center">
<img width="400"  alt="29" src="https://github.com/user-attachments/assets/6034ec51-6112-4d00-897d-820c92667b8f" />
<img width="400"  alt="23" src="https://github.com/user-attachments/assets/6c6a4ee2-7d17-4738-9f5c-f4e105566491" />
<img width="400"  alt="24" src="https://github.com/user-attachments/assets/8e2a61bb-2c4f-4cca-b10c-9afa95841307" />
</p>

### Lecture Management
<p align="center">
<img width="400" alt="25" src="https://github.com/user-attachments/assets/5ed3fae8-74a7-4d99-b8d7-9196d9fa31f5" />
</p>

### Student Management
<p align="center">
<img width="400" alt="26" src="https://github.com/user-attachments/assets/c2236995-214a-4203-847b-df0085e046a1" />

</p>

## 3. Student Modules
### Course Management
<p align="center">
 <img width="400"  alt="3" src="https://github.com/user-attachments/assets/e7a1649a-a101-4ab2-a4db-eda7409cd867" />
 <img width="400"  alt="4" src="https://github.com/user-attachments/assets/2ffbf483-6f54-4fae-b70a-2907b8a8f225" />

</p>

### Announcement Management
<p align="center">
 <img width="400" alt="5" src="https://github.com/user-attachments/assets/8779e0fb-a94d-4b77-a4f1-ac833e346829" />
 <img width="400" alt="6" src="https://github.com/user-attachments/assets/5aea3475-fc7b-4f95-8c00-0400790336e9" />
 <img width="400" alt="7" src="https://github.com/user-attachments/assets/ef34bee1-46da-4dae-93d3-fb29b71d925b" />


</p>

### Assignment Management
<p align="center">
 <img width="400" alt="8" src="https://github.com/user-attachments/assets/f0b5254f-a1f0-4bc7-ba50-f22865fc33be" />
<img width="400" alt="9" src="https://github.com/user-attachments/assets/c66299b1-7c9a-480f-b31e-c0c7678fe685" />

</p>

### Quiz Management
<p align="center">
 <img width="400" alt="10" src="https://github.com/user-attachments/assets/37513174-587d-497d-8418-29da31e15180" />
 <img width="400" alt="13" src="https://github.com/user-attachments/assets/c2395bb7-4f06-419b-a0d0-e5660744d6ee" />
 <img width="400" alt="28" src="https://github.com/user-attachments/assets/28407fdb-94e8-4e3d-a457-c0c0c34d8e5c" />
 <img width="400" alt="14" src="https://github.com/user-attachments/assets/5ceca077-4c4a-4436-9d25-8b65b545ee62" />
 <img width="400" alt="27" src="https://github.com/user-attachments/assets/9d5f2b3a-96c5-4fd9-b4f8-4c4f86ff3ca4" />

</p>

### Lecture Management
<p align="center">
 <img width="400" alt="11" src="https://github.com/user-attachments/assets/84d27159-73f0-4b0d-9eed-e78e0ebfa992" />
 <img width="400" alt="12" src="https://github.com/user-attachments/assets/64453ef9-5d5a-475d-bd72-e97271370ea5" />



✨ **This ELMS ensures smooth interaction between teachers and students with a modern, dynamic, and engaging learning experience.**
