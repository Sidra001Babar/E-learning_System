// TeacherDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api/index";  // axios instance with JWT token
import { FaEye } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

export default function StudentAttemptedQuizes() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [grading, setGrading] = useState({}); // {attemptId: newScore}
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

  // fetch teacher courses
  useEffect(() => {
    api.get("/my-courses")
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  const fetchAttempts = (courseId) => {
    setSelectedCourse(courseId);
    api.get(`/course/${courseId}/attempts`)
      .then(res => setAttempts(res.data))
      .catch(err => console.error(err));
  };

  const updateScore = (attemptId) => {
    api.put(`/attempt/${attemptId}/grade`, {
      score: grading[attemptId]
    }).then(res => {
      alert("Score updated!");
      fetchAttempts(selectedCourse);
    }).catch(err => console.error(err));
  };

  if (!selectedCourse) {
    return (
      <div className="grid grid-cols-3 gap-4 p-6 ">
        {courses.map((course,index) => (
          <div key={course.id}
               onClick={() => fetchAttempts(course.id)}
               className="cursor-pointer p-4 rounded-xl shadow"
                style={{
                background: gradients[index % gradients.length], // pick gradient by index
                }}
               >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800 bg-gray-100 rounded-full p-2">{course.name}</h3>
              <FaEye className="text-gray-500 hover:text-blue-600 bg-gray-100 rounded-full p-2" size={40} />
            </div>
            <p className="p-2 text-gray-600">Code: {course.code}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 h-screen overflow-y-auto">
      <button onClick={() => setSelectedCourse(null)} className="mb-4 p-2 bg-blue-800 text-white rounded-full"><FaArrowLeft /></button>
      
      <h2 className="text-xl font-bold mb-4">Quiz Attempts</h2>
      {attempts.map(attempt => (
        <div key={attempt.attempt_id} className="border border-gray-300  p-4 mb-4 rounded shadow">
          <p><b>Student</b> {attempt.student_username}</p>
          <p><b>Score:</b> {attempt.score} / {attempt.max_score}</p>
          <h3 className="text-lg font-bold text-blue-900">{attempt.quiz_title}</h3>
          <p className="text-sm text-gray-600 mb-2">{attempt.quiz_description}</p>

          <h3 className="mt-3 font-semibold">Subjective Answers</h3>
          {attempt.submissions
            .filter(sub => sub.answer_text)
            .map(sub => (
              <div key={sub.id} className="border p-2 mb-2 rounded bg-gray-50">
                <p><b>Q{sub.question_id}:</b> {sub.answer_text}</p>
              </div>
            ))
          }

          <div className="mt-3">
            <input
              type="number"
              placeholder="Enter new score"
              value={grading[attempt.attempt_id] || ""}
              onChange={e => setGrading({...grading, [attempt.attempt_id]: e.target.value})}
              className="border px-2 py-1 rounded mr-2"
            />
            <button
              onClick={() => updateScore(attempt.attempt_id)}
              className="bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700 text-white px-3 py-1 rounded">
              Update Score
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
