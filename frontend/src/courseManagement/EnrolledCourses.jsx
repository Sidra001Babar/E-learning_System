import { useEffect, useState } from "react";
import api from "../api/index";
import { MdPerson, MdEmail } from "react-icons/md";
import DropsBackground from '../Style/RandomDropping/Drops';

export default function StudentCourses({ onCourseSelect }) {
  const [courses, setCourses] = useState([]);

  // Array of gradient colors
  const gradients = [
  "linear-gradient(90deg, #833AB4 0%, #FD1D1D 50%, #FCB045 100%)",
  "linear-gradient(90deg, #36d1dc 0%, #5b86e5 100%)",
  "linear-gradient(90deg, #f953c6 0%, #b91d73 100%)",
  "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
  "linear-gradient(90deg, #f7971e 0%, #ffd200 100%)",
  "linear-gradient(90deg, #ff7e5f 0%, #feb47b 100%)",
  "linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)",
  "linear-gradient(90deg, #ff4b1f 0%, #1fddff 100%)",
  "linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%)",
  "linear-gradient(90deg, #fbc2eb 0%, #a6c1ee 100%)",
  "linear-gradient(90deg, #c471f5 0%, #fa71cd 100%)",
  "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(90deg, #30cfd0 0%, #330867 100%)",
  "linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(90deg, #ff9966 0%, #ff5e62 100%)",
  "linear-gradient(90deg, #00f260 0%, #0575e6 100%)"
  ];

  useEffect(() => {
    api.get("/my-enrolled-courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-12 h-screen overflow-y-auto">
      <h3 className="text-2xl font-bold mb-6 text-purple-500">My Enrolled Courses</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <div
            key={course.id}
            className="rounded-xl shadow-lg overflow-hidden cursor-pointer relative flex flex-col"
            onClick={() => onCourseSelect(course.id)}
          >
            {/* Gradient top section with dynamic gradient */}
            <div
              className="h-32 relative rounded-2xl "
              style={{
                background: gradients[index % gradients.length], // pick gradient by index
              }}
            >
              {/* Circle for course name/code */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-md">
                <h4 className="text-orange-500 font-bold text-center text-sm">{course.name}</h4>
                <p className="text-gray-500 text-xs text-center">{course.code}</p>
              </div>
            </div>

            {/* Bottom section for teacher info */}
            <div className="mt-12 p-4 bg-white flex flex-col gap-3 shadow overflow-x-auto">
              <div className="flex items-center gap-2">
                <MdPerson className="text-orange-500" size={20} />
                <span className="text-gray-700 font-medium">{course.teacher_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <MdEmail className="text-orange-500" size={20} />
                <span className="text-gray-500 text-sm">{course.teacher_email}</span>
              </div>
            </div>
          </div>
        ))}
        <DropsBackground />
      </div>
    </div>
  );
}
