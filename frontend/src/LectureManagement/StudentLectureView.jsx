import React, { useEffect, useState } from "react";
import api from "../api/index"; // axios instance with JWT set
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { FaEye } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

export default function StudentLecturesView({ setShowMainSidebar }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // gradients
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

  // ✅ Step 1: Load enrolled courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/my-enrolled-courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses", err);
      }
    };
    fetchCourses();
  }, []);

  // ✅ Step 2: Load lectures for selected course
  const fetchLectures = async (courseId) => {
    try {
      const res = await api.get(`/student/course/${courseId}/lectures`);
      setLectures(res.data);
      setCurrentLectureIndex(0);
    } catch (err) {
      console.error("Error fetching lectures", err);
    }
  };

  // ✅ Handlers
   const handleCourseClick = (course) => {
    setSelectedCourse(course);
    fetchLectures(course.id);
    setShowMainSidebar(false); // 🔥 hide main sidebar
  };

  const handleLectureClick = (index) => {
    setCurrentLectureIndex(index);
  };

  const handlePrev = () => {
    if (currentLectureIndex > 0) {
      setCurrentLectureIndex(currentLectureIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentLectureIndex < lectures.length - 1) {
      setCurrentLectureIndex(currentLectureIndex + 1);
    }
  };

  return (
<div className="p-4 md:p-6 w-full ml-[-20px] h-screen overflow-y-auto bg-gwhite">
  {/* ✅ Step 1: Course cards */}
  {!selectedCourse && (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course,index) => (
        <div
          key={course.id}
          className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition duration-300 cursor-pointer border border-gray-100"
          style={{background: gradients[index % gradients.length], // pick gradient by index
          }}
          onClick={() => handleCourseClick(course)}
        >
          
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 bg-gray-100 rounded-full p-2">
              {course.name}
            </h2>
            <FaEye className="text-gray-500 hover:text-blue-600 bg-gray-100 rounded-full p-2" size={40} />
          </div>
          <p className="text-gray-100 mt-2">Code: {course.code}

          </p>
          <p className="text-gray-600 font-medium">{course.teacher_name}</p>
          <p className="text-sm text-gray-500">{course.teacher_email}</p>
        </div>
      ))}
    </div>
  )}

  {/* ✅ Step 2-5: Course page with sidebar + lectures */}
  {selectedCourse && (
    <div className="flex flex-col md:flex-row gap-6 relative">
      {/* 📱 Mobile top bar with Menu button */}
      <div className="md:hidden flex justify-between items-center  p-1 rounded"style={{background: 'linear-gradient(90deg,rgba(131, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)'}}>
        <h2 className="text-xl font-bold px-2">{selectedCourse.name}</h2>
        <button
          className="p-2 bg-white text-black rounded-lg"
          onClick={() => setSidebarOpen(true)}
          
        >
          <HiOutlineMenu size={24} />
        </button>
      </div>

      {/* Sidebar (drawer on mobile, static on desktop) */}
      <div
        className={`fixed ml-[-22px] mt-[-21px] overflow-y-auto h-screen  w-64 bg-white shadow-xl p-4 transform transition-transform duration-300 
        z-20 md:relative md:translate-x-0 md:shadow rounded-r-2xl
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background:
        "linear-gradient(180deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)",}}
      >
        {/* Close button (only on mobile) */}
        <div className="flex justify-between items-center  md:hidden">
          <h3 className="font-bold text-lg">{selectedCourse.name} Lectures</h3>
          <button
            className="p-2 text-gray-600 hover:text-gray-800"
            onClick={() => setSidebarOpen(false)}
          >
            <HiOutlineX size={24} />
          </button>
        </div>

        <ul className="space-y-2">
          {lectures.map((lec, index) => (
            <li
              key={lec.id}
              className={`p-3 rounded-lg cursor-pointer transition duration-200 ${
                currentLectureIndex === index
                  ? "bg-orange-500/70 text-white shadow-md"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              onClick={() => {
                handleLectureClick(index);
                setSidebarOpen(false); // close after click on mobile
              }}
            >
              {lec.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main lecture view */}
      <div className="w-full h-48  relative z-0">
        
        
        {lectures.length > 0 ? (
          <div className="bg-white p-0 md:p-6 rounded-2xl ">
            <h2 className="text-2xl font-bold  text-gray-900">
              {lectures[currentLectureIndex].title}
            </h2>

            {/* Smaller video */}
            <div className="flex justify-center  w-full">
              <video
                key={lectures[currentLectureIndex].video_url}
                controls
                className="w-full md:w-11/12 lg:w-5/6 max-h-[300px] rounded-xl shadow-md object-contain"
              >
                <source
                  src={`${api.defaults.baseURL}/${lectures[currentLectureIndex].video_url}`}
                  type="video/mp4"
                />

                Your browser does not support the video tag.
              </video>
            </div>

            <p className="text-gray-700  leading-relaxed">
              {lectures[currentLectureIndex].description}
            </p>

            {/* Prev / Next buttons */}
            <div className="flex justify-between">
              <button
                onClick={handlePrev}
                disabled={currentLectureIndex === 0}
                className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition disabled:opacity-50"
              >
               <FiChevronLeft size={20} /> 
              </button>
              <button
                onClick={handleNext}
                disabled={currentLectureIndex === lectures.length - 1}
                className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium shadow transition disabled:opacity-50"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No lectures uploaded yet.
          </p>
        )}
      </div>
    </div>
  )}
</div>

  );
}
