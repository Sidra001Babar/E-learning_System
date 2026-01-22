import React, { useEffect, useState } from "react";
import api from "../api/index";
import { FaEye } from "react-icons/fa";
import { FaArrowLeft,FaArrowRight } from "react-icons/fa";

export default function StudentQuizAttempt() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
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
  // Load enrolled courses
  useEffect(() => {
    api.get("/my-enrolled-courses").then((res) => setCourses(res.data));
  }, []);
  // Timer Setting
  useEffect(() => {
  if (selectedQuiz?.timer) {
    setTimeLeft(selectedQuiz.timer * 60); // convert minutes → seconds
  }
}, [selectedQuiz]);
useEffect(() => {
  if (timeLeft === null) return;
  if (timeLeft <= 0) {
    handleSubmit(selectedQuiz.quiz_id);
    return;
  }
  const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
  return () => clearInterval(interval);
}, [timeLeft]);
  // Fetch quizzes when course is selected
  const handleCourseClick = async (course) => {
    setSelectedCourse(course);
    setSelectedQuiz(null);
    setAnswers({});
    const res = await api.get(`/course-quizzes/${course.id}`);
    setQuizzes(res.data);
  };

  // Start quiz (calls backend /start-quiz)
  const handleStartQuiz = async (quiz) => {
    try {
      const res = await api.post(`/start-quiz/${quiz.id}`);
      setSelectedQuiz(res.data); // contains questions + timer
      setAttemptId(res.data.attempt_number ? res.data.attempt_id : null);
      setAnswers({});
    } catch (err) {
    if (err.response?.status === 403) {
      alert("This quiz is locked. The deadline has passed.");
    } else {
      alert(err.response?.data?.msg || "Error starting quiz");
    }
  }
  };

  const handleChange = (qid, value) => {
    setAnswers({ ...answers, [qid]: value });
  };

const handleSubmit = async (quizId) => {
  try {
    await api.post(`/submit-quiz/${quizId}`, {
      answers: answers,  // send as object, not array
    });
    alert("Quiz submitted successfully!");
    setSelectedQuiz(null);
    setAttemptId(null);
    setAnswers({});
  } catch (err) {
    alert(err.response?.data?.msg || "Error submitting quiz");
  }
};

  return (
    <div className="p-6 h-screen overflow-y-auto">
      {/* Courses Section */}
      {!selectedCourse && (
        <div>
       <h1 className="text-2xl font-bold mb-8 text-gray-800">View Quizes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
         
          {courses.map((c,index) => (
            <div
              key={c.id}
              className="rounded-lg shadow p-4 bg-white cursor-pointer hover:bg-gray-100"
              onClick={() => handleCourseClick(c)}
              style={{
                background: gradients[index % gradients.length], 
              }}
            >
              <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg p-2 rounded-full">{c.name}</h3>
                  <FaEye className="text-gray-500 hover:text-blue-600 bg-gray-100 rounded-full p-2" size={40} />
              </div>
                <p className="text-gray-100 mt-2">
                    Code:{" "}
                    <span className="font-semibold text-gray-100">{c.code}</span>
                </p>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Quizzes Section */}
      {selectedCourse && !selectedQuiz && (
        <div>
          <button
            onClick={() => setSelectedCourse(null)}
            className="mb-4 text-white p-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 "
          >
            <FaArrowLeft className="text-white" size={16} />
          </button>
            
          <h2 className="text-xl font-bold mb-4">
            Quizzes for {selectedCourse.name}
          </h2>
          <div className="flex gap-4 flex-wrap flex-col">
            {quizzes.map((quiz, index) => (
              <div
                key={quiz.id}
                className={`min-w-[250px] flex flex-col gap-2 rounded-lg shadow p-4 bg-white ${
                  quiz.can_attempt
                    ? "cursor-pointer hover:bg-gray-100"
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => quiz.can_attempt && handleStartQuiz(quiz)}
                style={{
                    background: gradients[index % gradients.length], // pick gradient by index
                   }}
                  >
                <h3 className="font-bold bg-gray-100 p-2 rounded-full inline-block w-fit">{quiz.title}</h3>
                <p className="text-sm text-gray-600">{quiz.description}</p>
                <p className="text-sm text-gray-500">
                  Attempts: {quiz.attempts_made}/{quiz.attempts_allowed}
                </p>
                {quiz.deadline && (
                  <p className="text-sm text-red-600">
                    Deadline: {new Date(quiz.deadline).toLocaleString()}
                  </p>
                )}
                {!quiz.can_attempt && (
                  <p className="text-sm text-red-500 mt-1">
                    Locked (deadline passed or no attempts left)
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Attempt Section */}
      {selectedQuiz && (
        <div className="relative w-full max-w-2xl mx-auto bg-white shadow-md p-4 sm:p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">{selectedQuiz.title}</h2>

        {/* Timer */}
        {timeLeft !== null && (
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-orange-200 text-orange-700 font-semibold shadow-sm text-sm sm:text-base">
            <span className="text-lg">⏳</span>
            <span className="tracking-wide">
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </span>
          </div>
        )}

      {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
          <div
            className="bg-orange-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / selectedQuiz.questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Text below or above progress bar */}
        <p className="text-sm text-gray-600 mt-2 text-center">
          Question {currentIndex + 1} of {selectedQuiz.questions.length}
        </p>


        
        {/* Show only one question */}
        {(() => {
          const q = selectedQuiz.questions[currentIndex];
          return (
            <div key={q.id} className="mb-4">
              <p className="font-semibold mb-2 rounded-2xl text-white p-2"
              style={{background: 'linear-gradient(90deg,rgba(131, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)'}}
              >{q.question_text}</p>

              {q.question_type === "mcq" &&
                q.options.map((opt, i) => (
                  <label key={i}
                  className={`flex items-center gap-2 sm:gap-3 border-2 rounded-lg px-3 sm:px-4 py-2 mb-2 cursor-pointer transition
                ${answers[q.id] === opt 
                  ? "border-orange-500 bg-orange-100/50" 
                  : "border-orange-300 hover:border-orange-500"
                }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      className="w-4 h-4 sm:w-5 sm:h-5 focus:ring-orange-400"
                      onChange={(e) => handleChange(q.id, e.target.value)}
                    />
                    {opt}
                  </label>
                ))}

              {q.question_type === "true_false" && (
              <div className="space-y-3">
                  {["True", "False"].map((val) => (
                    <label
                      key={val}
                      className={`flex items-center gap-3 border-2 rounded-lg px-4 py-2 cursor-pointer transition
                        ${answers[q.id] === val
                          ? "border-orange-500 bg-orange-100/50"
                          : "border-orange-300 hover:border-orange-500"
                        }`}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={val}
                        checked={answers[q.id] === val}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-400"
                      />
                      <span className="text-gray-700 font-medium">{val}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.question_type === "subjective" && (
                <textarea
                  className="border-2 border-orange-400 w-full p-3 rounded-lg 
               focus:outline-none focus:border-orange-500 focus:ring-2 
               focus:ring-orange-200 transition placeholder-gray-400 text-gray-700"
                  placeholder={`Answer (Word limit: ${q.word_limit || "∞"})`}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}
            </div>
          );
        })()}
        {/* Question Navigation Bar */}
        <div className="w-full mt-4">
          <div
            className="flex flex-wrap gap-2 overflow-x-auto max-w-full px-1 sm:px-2 py-2
                      scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
            style={{ scrollbarWidth: "thin", msOverflowStyle: "auto" }}
          >
            {selectedQuiz.questions.map((q, i) => {
              const isAttempted = answers[q.id] && answers[q.id].length > 0;
              const isActive = currentIndex === i;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`
                    flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 
                    rounded-full text-xs sm:text-sm md:text-base 
                    text-white font-semibold transition
                    ${isActive
                      ? "bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600"
                      : isAttempted
                        ? "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700"
                        : "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600"
                    }
                  `}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>






        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-600 p-6 text-white px-4 py-2 rounded-full disabled:opacity-50"
          >
           <FaArrowLeft className="text-sm sm:text-base md:text-lg"/>
          </button>

          {currentIndex < selectedQuiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
               className="px-3 sm:px-4 py-2 text-sm sm:text-base rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 text-white"
            >
              <FaArrowRight />
            </button>
          ) : (
            <button
              onClick={() => handleSubmit(selectedQuiz.quiz_id)}
              className="px-3 sm:px-5 py-2 text-sm sm:text-base rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-700 text-white"
            >
              Submit
            </button>
          )}
        </div>
      </div>

      )}
    </div>
  );
}
