import { Outlet,useLocation } from "react-router-dom";
import StudentSidebar from "../pages/StudentSidebar";

export default function StudentLayout() {
  const location = useLocation();

  // ✅ Hide sidebar if in lectures page
  const hideSidebar = location.pathname.startsWith("/student/StudentViewLecture");
  return (
    <div className="flex">
      {!hideSidebar && <StudentSidebar />}
      {/* <StudentSidebar /> */}
      <div className="flex-1 p-6">
        <Outlet /> 
      </div>
    </div>
  );
}
