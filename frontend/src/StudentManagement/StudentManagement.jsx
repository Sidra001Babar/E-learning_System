import React, { useEffect, useState } from "react";
import { FaTrash, FaUndo } from "react-icons/fa";
import api from "../api"; // axios instance with auth headers

const StudentManager = () => {
  const [students, setStudents] = useState([]);
  const [deleted, setDeleted] = useState({});
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
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

  // ✅ Load students
  useEffect(() => {
    api.get("/my-students").then((res) => setStudents(res.data));
    api.get("/my-courses").then((res) => setCourses(res.data));
  }, []);

  // ✅ Delete student
  const handleDelete = async (enrollmentId) => {
    await api.delete(`/delete-student/${enrollmentId}`);
    setDeleted((prev) => ({ ...prev, [enrollmentId]: true }));
  };

  // ✅ Undo student
  const handleUndo = async (logId, enrollmentId) => {
    await api.post(`/undo-student/${logId}`);
    setDeleted((prev) => ({ ...prev, [enrollmentId]: false }));
  };

  // ✅ Filter + Search logic
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase()) ||
      s.course_code.toLowerCase().includes(search.toLowerCase());

    const matchesCourse = selectedCourse ? s.course_id === selectedCourse : true;

    return matchesSearch && matchesCourse;
  });

  return (
    <div className="px-2 pt-2 pb-11 space-y-4 h-screen overflow-y-auto">
      {/* 🔍 Search + Filter */}
      <div className="flex flex-col md:flex-row gap-2 md:items-center">
        <input
          type="text"
          placeholder="Search by name, email, course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full md:w-1/2"
        />

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(Number(e.target.value))}
          className="p-2 border rounded"
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name} ({course.code})
            </option>
          ))}
        </select>
      </div>

      {/* 👩‍🎓 Students List */}
      {filteredStudents.map((student,index) => {
        const isDeleted = deleted[student.enrollment_id];

        return (
          <div
            key={student.enrollment_id}
            className={`flex justify-between items-center p-3 rounded-md shadow-sm transition  
              ${isDeleted ? "bg-red-100 border border-red-400" : "bg-white"}`}
              style={{
                background: gradients[index % gradients.length], // pick gradient by index
              }}
          >
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 bg-gray-100 rounded-full p-2">{student.username}</h3>
              </div>
              <p className="text-sm text-gray-600">{student.email}</p>
              <p className="text-xs text-gray-500">
                {student.course} ({student.course_code})
              </p>
            </div>

            {!isDeleted ? (
              <button
                onClick={() => handleDelete(student.enrollment_id)}
                className="text-red-500 hover:text-red-700 bg-white rounded-full p-2"
              >
                <FaTrash />
              </button>
            ) : (
              <button
                onClick={() => handleUndo(student.enrollment_id, student.enrollment_id)}
                className="text-green-500 hover:text-green-700"
              >
                <FaUndo />
              </button>
            )}
          </div>
        );
      })}

      {filteredStudents.length === 0 && (
        <p className="text-gray-500 text-center">No students found.</p>
      )}
    </div>
  );
};

export default StudentManager;
