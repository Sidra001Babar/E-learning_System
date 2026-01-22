import React, { useState, useEffect } from "react";
import api from "../api/index";

export default function AssignmentUpload() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

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

  // Handle file select
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      setMessage("File size exceeds 10 MB limit.");
      setFile(null);
    } else {
      setFile(selectedFile);
      setMessage("");
    }
  };

  // Submit assignment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !title || !file) {
      setMessage("Please fill all fields and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("course_id", selectedCourse);
    formData.append("title", title);
    formData.append("file", file);

    try {
      const res = await api.post("/post-assignment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(res.data.msg || "Assignment uploaded successfully!");
      setTitle("");
      setFile(null);
      setSelectedCourse("");
    } catch (err) {
      console.error("Error uploading assignment:", err);
      setMessage("Error uploading assignment. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="max-w-lg mx-auto p-4 border border-gray-300 rounded-lg shadow-md bg-white">
      <h3 className="text-xl font-bold mb-3 text-gray-800">📑 Upload Assignment</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Course Selection */}
        <select
          className="border border-gray-300 p-2 rounded-lg w-full"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        {/* Title Input */}
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Assignment Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* File Upload */}
        <input
          type="file"
          className="border border-gray-300 p-2 rounded-lg w-full"
          onChange={handleFileChange}
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full text-white py-2 rounded-lg bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700"
        >
          Upload Assignment
        </button>
      </form>

      {message && (
        <p className="mt-3 text-center text-red-600 font-medium">{message}</p>
      )}
    </div>
    </div>
  );
}
