import React, { useState, useEffect } from "react";
import api from "../api/index";
import { FaEye } from "react-icons/fa";
import FloatingBooks from '../Style/AssignmentIconFloating/AssignmentIconAni';
import { FaUpload } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

export default function StudentAssignments() {
  const token = localStorage.getItem("token");

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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

  // search + filter
  const [searchTerm, setSearchTerm] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("");

  // Fetch courses
 useEffect(() => {
  if (!token) return;

  api.get("/my-enrolled-courses")
    .then((res) => {
      const data = res.data;

      if (Array.isArray(data)) {
        setCourses(data);
        setError("");
      } else {
        setError("Unexpected response from server");
        setCourses([]);
      }
    })
    .catch((err) => {
      console.error("API error:", err);

      if (err.response) {
        setError(err.response.data?.msg || "Failed to fetch courses");
      } else {
        setError("Unable to connect to server");
      }

      setCourses([]);
    });
}, [token]);
  // Fetch all assignments once
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get("/assignments");
        setAssignments(res.data);
      } catch (err) {
        console.error("Error fetching assignments:", err);
        setMessage("Error fetching assignments.");
      }
    };
    fetchAssignments();
  }, []);

  // Back to courses
  const handleBack = () => {
    setSelectedCourse(null);
    setSearchTerm("");
    setAssignmentFilter("");
    setMessage("");
  };

  // File change handler
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Submit assignment
  const handleSubmit = async (assignmentId) => {
    if (!selectedFile) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await api.post(`/submit-assignment/${assignmentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.msg || "Assignment submitted!");
       alert(res.data.msg || "Assignment submitted successfully ✅");
      setSelectedFile(null);
    } catch (err) {
      console.error("Error submitting assignment:", err);
      alert(err.response?.data?.msg || "Error submitting assignment");
      // setMessage("Error submitting assignment. Try again.");
    }
  };

  // Filter assignments by selected course
  const courseAssignments = selectedCourse
    ? assignments.filter((a) => a.course === selectedCourse.name)
    : [];

  // Unique assignment titles for dropdown filter
  const assignmentTitles = [...new Set(courseAssignments.map((a) => a.title))];

  // Apply search + filter
  const filteredAssignments = courseAssignments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.teacher.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      assignmentFilter === "" || a.title === assignmentFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-5 max-w-4xl mx-auto h-screen overflow-y-auto">
      {!selectedCourse ? (
        <>
          <h2 className="text-2xl font-bold mb-4">My Assignments</h2>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((c,index) => (
                <div 
                  key={c.id}
                    className=" shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition cursor-pointer"
                     style={{background: gradients[index % gradients.length], // pick gradient by index
                      }}> 
                    <FloatingBooks />

                  <div
                    key={c.id}
                    className="p-2"
                    onClick={() => setSelectedCourse(c)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-gray-800 bg-gray-100 rounded-full p-2">{c.name}</h3>
                      <FaEye className="text-gray-500 hover:text-blue-600 bg-gray-100 rounded-full p-2" size={40} />
                    </div>
                    <p className="text-gray-100 mt-2">
                      Code:{" "}
                      <span className="font-semibold text-gray-100">{c.code}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <button
            onClick={handleBack}
            className="mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-4 py-2 rounded-full"
          >
            <FaArrowLeft className="text-white" size={16} />
          </button>
          <h2 className="text-xl font-bold mb-4">📚 Assignments for {selectedCourse.name}</h2>
          <h3 className="p-2"><span className="font-bold text-red-600">Note: </span>You can submit assignment only once</h3>

          {/* Search + Filter */}
          <div className="flex flex-col md:flex-row gap-3 mb-4 ">
            <input
              type="text"
              placeholder="🔍 Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded-full w-full"
            />

            <select
              value={assignmentFilter}
              onChange={(e) => setAssignmentFilter(e.target.value)}
              className="border p-2 rounded-full w-full"
            >
              <option value="">🎯 All Assignments</option>
              {assignmentTitles.map((title, idx) => (
                <option key={idx} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          {filteredAssignments.length === 0 ? (
            <p>No assignments Found.</p>
          ) : (
            filteredAssignments.map((a,index) => (
              <div
                style={{
                background: gradients[index % gradients.length], // pick gradient by index
                }}
                key={a.id}
                className="p-4 rounded-lg mb-4 shadow-sm text-white flex flex-col gap-3"
              >
                <h3 className="text-lg font-semibold ">{a.title}</h3>
                <p >
                  Course: {a.course} | Teacher: {a.teacher}
                </p>
                <p className="text-sm text-gray-800">
                  Uploaded on: {new Date(a.upload_date).toLocaleString()}
                </p>

                {/* Download Assignment */}
                <div>
                <span>📁</span>
                <a
                  href={`${api.defaults.baseURL}/uploads/assignments/${a.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline"
                >
                  Download Assignment
                </a>


                </div>

                {/* Upload submission */}
                <div className="mt-3">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className=" p-2 rounded-lg w-full mb-2"
                  />
                  <button
                      onClick={() => handleSubmit(a.id)}
                       disabled={a.student_submitted}   // ✅ disable if submitted
                        className={`flex items-center gap-3 px-3 py-2 font-medium rounded-full shadow-md transition ${
                          a.student_submitted
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                            : "bg-white text-gray-800 hover:bg-gray-100"
                        }`}>
                         <span className="flex items-center justify-center w-8 h-8 rounded-full" style={{background: gradients[index % gradients.length], // pick gradient by index
                         }}>
                        <FaUpload className="text-white" size={16} />
                      </span>

                     {a.student_submitted ? "Already Submitted" : "Submit"}
                    </button>

                </div>
              </div>
            ))
          )}
        </>
      )}

      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </div>
  );
}
