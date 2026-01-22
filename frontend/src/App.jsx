import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";
import ChangePassword from './Authentication/ChangePassword';
import ForgotPassword from './Authentication/ForgotPassword';
import ResetPassword from './Authentication/ResetPassword';

import ProtectedRoute from "./security/ProtectedRoute";
import StudentLayout from "./Roles/StudentLayout";
import JoinCourseByStu from './courseManagement/JoinCourse';
import StudentCourses from './courseManagement/EnrolledCourses';
import StudentAnnouncements from './AnnouncementManagement/ViewAnnouncement';
import StudentAssignments from './AssignmentManagement/StudentsAssignments';
import StudentQuizAttempt from './QuizManagement/AttemptQuiz';
// import StudentLecturesView from './LectureManagement/StudentLectureView';
import StudentLayoutt from './LectureManagement/StudentLayout';

import TeacherLayout from "./Roles/TeacherLayout";
import Teacher from "./courseManagement/createCourse"; 
import ShowCourse from "./courseManagement/ShowCourse";
import AnnouncementOptions from './AnnouncementManagement/Announcement';
import AssignmentOptions from './AssignmentManagement/Assignment';
import AssignmentUpload from './AssignmentManagement/PostAssignment';
import TeacherViewForStuAssignment from './AssignmentManagement/TeacherViewStuAssignment';
import QuizOptions from './QuizManagement/Quiz';
import QuizCreator from "./QuizManagement/CreateQuiz";
import StudentAttemptedQuizes from './QuizManagement/StudentsAttemptedQuizes';
import TeacherQuizLibrary from './QuizManagement/TeacherQuizLibrary';
import UploadLectureForm from './LectureManagement/TeacherUploadLecture';
import StudentManager from './StudentManagement/StudentManagement';
import PostAnnouncement from './AnnouncementManagement/PostAnnouncement';
import TeacherAnnouncements from './AnnouncementManagement/TeachersViewOwnAnnouncement';
// function TeacherLayout() {
//   return (
//     <div className="flex">
//       <TeacherSidebar />
//       <div className="flex-1 p-6">
//         <Teacher />
//       </div>
//     </div>
//   );
// }

// function StudentLayout() {
//   return (
//     <div className="flex">
//       <StudentSidebar />
//       <div className="flex-1 p-6">
//         <Student />
//       </div>
//     </div>
//   );
// }

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default should go to Register */}
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Teacher Dashboard */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute role="teacher">
              <TeacherLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Teacher />} /> {/* default inside /teacher */}
          <Route path="courses" element={<ShowCourse />} />
          <Route path="announcementOptions" element={<AnnouncementOptions />} />
          <Route path="TeacherviewAnnouncements" element={<TeacherAnnouncements />} />
          <Route path="postAnnouncement" element={<PostAnnouncement />} />
          <Route path="assignmentOptions" element={<AssignmentOptions />} />
          <Route path="postAssignment" element={<AssignmentUpload />} />
          <Route path="viewStuAssignment" element={<TeacherViewForStuAssignment />} />
          <Route path="quizOptions" element={<QuizOptions />} />
          <Route path="createQuiz" element={<QuizCreator />} />
          <Route path="attemptedQuizes" element={<StudentAttemptedQuizes />} />
          <Route path="teacherQuizLibrary" element={<TeacherQuizLibrary />} />
          <Route path="uploadLecture" element={<UploadLectureForm />} />
          <Route path="manageStudent" element={<StudentManager />} />
          
        </Route>


        {/* Student Dashboard */}
          <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<JoinCourseByStu />} /> {/* default inside /teacher */}
          <Route path="Studentcourses" element={<StudentCourses />} />
          <Route path="ViewAnnouncement" element={<StudentAnnouncements />} />
          <Route path="ViewAssignment" element={<StudentAssignments />} />
          <Route path="ViewQuiz" element={<StudentQuizAttempt />} />
          <Route path="StudentViewLecture" element={<StudentLayoutt />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
