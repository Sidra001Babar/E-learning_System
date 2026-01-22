import { Outlet } from "react-router-dom";
import TeacherSidebar from "../pages/TeacherSidebar";

export default function TeacherLayout() {
  return (
    <div className="flex">
      <TeacherSidebar />
      <div className="flex-1 p-6">
        <Outlet /> {/* this will show Teacher or ShowCourse */}
      </div>
    </div>
  );
}
