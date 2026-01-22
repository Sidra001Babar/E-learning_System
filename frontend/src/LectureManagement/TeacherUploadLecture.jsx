// UploadLectureForm.jsx
import React, { useState, useEffect } from "react";
import api from "../api/index";
import { MdTitle } from "react-icons/md";        // Title
import { MdDescription } from "react-icons/md";  // Description
import { FaVideo } from "react-icons/fa";        // Video
import { FaCheckSquare } from "react-icons/fa";  // Select
export default function UploadLectureForm() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    course_id: "",
    title: "",
    description: "",
    video: null,
  });

  useEffect(() => {
    // Fetch teacher's courses
    api.get("/my-courses").then((res) => setCourses(res.data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, video: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploadData = new FormData();
    uploadData.append("title", formData.title);
    uploadData.append("description", formData.description);
    uploadData.append("course_id", formData.course_id);
    uploadData.append("teacher_id", 1); // get from auth later
    uploadData.append("video", formData.video);

    await api.post("/upload-lecture", uploadData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Lecture uploaded successfully!");
  };

  return (
   <div className="overflow-y-auto h-screen">
    <form
    onSubmit={handleSubmit}
    className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-5 space-y-4 border border-gray-300"
    >
    <h2 className="text-xl font-semibold text-gray-800 text-center">
        Upload Lecture
    </h2>

    {/* Course Dropdown */}
    <div>
      <div className="flex items-center gap-3 mb-2">
        {/* Icon with black background & white color */}
        <div className="p-1 bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700 rounded-full flex items-center justify-center">
          <FaCheckSquare className="text-white text-sm" />
        </div>

        {/* Label */}
        <label className="text-gray-700 font-medium">
          Select Course
        </label>
      </div>
        <select
        name="course_id"
        value={formData.course_id}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <option value="">Select Course</option>
        {courses.map((course) => (
            <option key={course.id} value={course.id}>
            {course.name}
            </option>
        ))}
        </select>
    </div>

    {/* Lecture Title */}
    <div>
      <div className="flex items-center gap-3 mb-2">
        {/* Icon with black background & white color */}
        <div className="p-1 bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700 rounded-full flex items-center justify-center">
          <MdTitle className="text-white text-sm" />
        </div>

        {/* Label */}
        <label className="text-gray-700 font-medium">
          Lecture Title
        </label>
      </div>
        <input
        type="text"
        name="title"
        placeholder="Enter Lecture Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>

    {/* Description */}
    <div>
      
       <div className="flex items-center gap-3 mb-2">
        {/* Icon with black background & white color */}
        <div className="p-1 bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700 rounded-full flex items-center justify-center">
          <MdDescription className="text-white text-sm" />
        </div>

        {/* Label */}
        <label className="text-gray-700 font-medium">
         Lecture Description
        </label>
      </div>

        <textarea
        name="description"
        placeholder="Enter Lecture Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
        />
    </div>

    {/* File Upload */}
    <div>
        <div className="flex items-center gap-3 mb-2">
        {/* Icon with black background & white color */}
          <div className="p-1 bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700 rounded-full flex items-center justify-center">
            <FaVideo className="text-white text-sm" />
          </div>

          {/* Label */}
          <label className="text-gray-700 font-medium">
          Upload Video
          </label>
      </div>
        <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="w-full border border-blue-600 rounded-lg p-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>

    {/* Submit Button */}
    <button
        type="submit"
        className="w-full bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700 text-white py-2 px-4 rounded-lg transition duration-200"
    >
        Upload Lecture
    </button>
    </form>
  </div>
  );
}
