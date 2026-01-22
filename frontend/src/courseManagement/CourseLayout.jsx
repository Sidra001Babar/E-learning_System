import { Outlet, useNavigate } from "react-router-dom";

export default function LectureLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex">
      {/* Lecture sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 border-r">
        <button
          onClick={() => navigate("/student/StudentViewLecture")}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          ⬅ Back to Courses
        </button>
        <Outlet /> {/* this will show lecture sidebar (from StudentLecturesView) */}
      </div>
    </div>
  );
}
