import { Link } from "react-router-dom";
import { FaBullhorn, FaEye } from "react-icons/fa";

export default function AssignmentOptions() {
  return (
    <div className="flex flex-col items-center justify-center overflow-y-auto h-screen w-full pb-3 md:p-3 ">
      <h1 className="text-2xl font-bold  text-gray-800 pb-4">
        Assignment
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Post Announcement Box */}
        <Link
          to="/teacher/postAssignment"
          className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center hover:shadow-2xl hover:scale-105 transition transform duration-200"
          style={{
                background: "linear-gradient(to bottom, #14b8a6 0%, #1e3a8a 70%, #be185d 100%)",
              
              }}
         >
          <FaBullhorn className="text-pink-600 text-5xl bg-white p-3 rounded-full" />
          <h2 className="text-xl font-semibold text-gray-300">
            Post Assignment
          </h2>
          <p className="text-gray-500 mt-2 text-center">
            Share a new assignment with your students.
          </p>
        </Link>

        {/* View Announcements Box */}
        <Link
          to="/teacher/viewStuAssignment"
          className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center hover:shadow-2xl hover:scale-105 transition transform duration-200"
          style={{
                background: "linear-gradient(to bottom, #14b8a6 0%, #1e3a8a 70%, #be185d 100%)",
              
              }}
           >
          <FaEye className="text-blue-800 text-5xl bg-white p-3 rounded-full" />
          <h2 className="text-xl font-semibold text-gray-300">
            View Students Assignments
          </h2>
          <p className="text-gray-500 mt-2 text-center">
            Check your students assignments you’ve already posted.
          </p>
        </Link>
      </div>
    </div>
  );
}
