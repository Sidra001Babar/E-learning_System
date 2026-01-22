import { Link } from "react-router-dom";
import { FaBullhorn, FaEye } from "react-icons/fa";

export default function QuizOptions() {
  return (
    <div className="flex flex-col items-center justify-center overflow-y-auto h-screen w-full pb-3 md:p-3 ">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">
       Quiz
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Post Quiz Box */}
        <Link
          to="/teacher/createQuiz"
          className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center hover:shadow-2xl hover:scale-105 transition transform duration-200"
          style={{
                background: "linear-gradient(to bottom, #14b8a6 0%, #1e3a8a 70%, #be185d 100%)",
              
              }}
           >
          <FaBullhorn className="text-blue-800 text-5xl bg-white p-3 rounded-full" />
          <h2 className="text-xl font-semibold text-gray-300">
            Post Quiz
          </h2>
          <p className="text-gray-500 mt-2 text-center">
            Share a new Quiz with your students.
          </p>
        </Link>

        {/* View Students Quiz Box */}
        <Link
          to="/teacher/attemptedQuizes"
          className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center hover:shadow-2xl hover:scale-105 transition transform duration-200"
          style={{
                background: "linear-gradient(to bottom, #14b8a6 0%, #1e3a8a 70%, #be185d 100%)",
              
              }}
          >
          <FaEye className="text-pink-600 text-5xl bg-white p-3 rounded-full" />
          <h2 className="text-xl font-semibold text-gray-300">
            View Students Quizes
          </h2>
          <p className="text-gray-500 mt-2 text-center">
            Check your students' attempted quizes and mark subjective type.
          </p>
        </Link>
        {/* View Own Quiz Box
        <Link
          to="/teacher/teacherQuizLibrary"
          className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center hover:shadow-2xl hover:scale-105 transition transform duration-200"
        >
          <FaEye className="text-green-600 text-5xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">
            View Your Quizes
          </h2>
          <p className="text-gray-500 mt-2 text-center">
            Check your quiz library and peform editing and repost
          </p>
        </Link> */}
      </div>
    </div>
  );
}
