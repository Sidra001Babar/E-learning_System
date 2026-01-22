import React, { useState, useEffect } from "react";
import api from "../api/index";
import { FaEye, FaDownload,FaArrowLeft } from "react-icons/fa";
export default function TeacherViewForStuAssignment() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [message, setMessage] = useState("");
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
  // New states for search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("");

  // ✅ New states for preview modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  // Fetch teacher courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/my-courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  // Fetch submissions for selected course
  const handleCourseClick = async (courseId) => {
    try {
      setSelectedCourse(courseId);
      const res = await api.get(`/course/${courseId}/Stu-Ass-submissions`);
      setSubmissions(res.data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setMessage("Error fetching submissions");
    }
  };

  // Reset back to courses view
  const handleBack = () => {
    setSelectedCourse(null);
    setSubmissions([]);
    setSearchTerm("");
    setAssignmentFilter("");
  };

  // Unique assignment titles for dropdown
  const assignmentTitles = [...new Set(submissions.map((s) => s.assignment_title))];

  // Apply search & filter
  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      s.assignment_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.filename.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAssignment =
      assignmentFilter === "" || s.assignment_title === assignmentFilter;

    return matchesSearch && matchesAssignment;
  });

  // ✅ Open preview modal
    const handlePreview = (filename) => {
      // Use Axios baseURL instead of hard-coded URL
      const fileUrl = `${api.defaults.baseURL}/uploads/submissions/${filename}`;

      // Google Docs Viewer makes it previewable in any browser
      setPreviewUrl(`https://docs.google.com/viewer?url=${fileUrl}&embedded=true`);
      setPreviewOpen(true);
    };


  return (
    <div className="max-w-4xl mx-auto px-2 pt-3 pb-6 h-screen overflow-y-auto">
      {!selectedCourse ? (
        <>
          <h2 className="text-2xl font-bold mb-4">📘 My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course,index) => (
              <div
                key={course.id}
                className="p-4 rounded-lg shadow-md bg-white cursor-pointer hover:shadow-lg"
                onClick={() => handleCourseClick(course.id)}
                style={{
                background: gradients[index % gradients.length], // pick gradient by index
              }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800 bg-gray-100 rounded-full p-2">{course.name}</h3>
                  <FaEye className="text-gray-500 hover:text-blue-600 bg-gray-100 rounded-full p-2" size={40} />
                </div>
                <p className="text-gray-500 p-2">Code: {course.code}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            onClick={handleBack}
            className="mb-4 bg-blue-900 text-white px-4 py-2 rounded-lg "
          >
            <FaArrowLeft/>
          </button>

          <h3 className="text-xl font-semibold mb-3">📂 Submissions</h3>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="🔍 Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <select
              value={assignmentFilter}
              onChange={(e) => setAssignmentFilter(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">🎯 All Assignments</option>
              {assignmentTitles.map((title, idx) => (
                <option key={idx} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          {filteredSubmissions.length === 0 ? (
            <p>No submissions match your search/filter.</p>
          ) : (
            filteredSubmissions.map((s,index) => (
              <div
                key={s.id}
                className="p-4 mb-2 rounded-lg bg-gray-50 shadow"
                style={{
                background: gradients[index % gradients.length], // pick gradient by index
              }}
                
              >
                <div className="flex  justify-between mb-2 text-sm ">
                  <span className="p-3 rounded-full bg-gray-100 shadow">
                    <b>{s.assignment_title}</b>
                  </span>
                </div>

                
                <p className="text-gray-300">👩‍🎓 {s.student}</p>
                <p className="text-sm text-gray-500 pl-1">
                  Uploaded: {new Date(s.upload_date).toLocaleString()}
                </p>
                <div className="flex gap-4 mt-2">
                  <a
                  href={`${api.defaults.baseURL}/uploads/submissions/${s.filename}`}
                    className="text-blue-600 underline bg-white p-2 rounded-2xl"
                    download
                  >
                    <FaDownload/>
                  </a>
                  {/* <button
                    onClick={() => handlePreview(s.filename)}
                    className="text-green-600 underline bg-white p-2 rounded-2xl"
                  >
                    <FaEye/>
                  </button> */}
                </div>
              </div>
            ))
          )}
        </>
      )}

      {message && <p className="text-red-600 mt-4">{message}</p>}

      {/* ✅ Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 h-5/6 rounded-xl shadow-lg flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">📄 File Preview</h2>
              <button
                onClick={() => setPreviewOpen(false)}
                className="text-red-600 font-bold text-xl"
              >
                ✖
              </button>
            </div>

            {/* Iframe Preview */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={previewUrl}
                title="File Preview"
                className="w-full h-full"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
