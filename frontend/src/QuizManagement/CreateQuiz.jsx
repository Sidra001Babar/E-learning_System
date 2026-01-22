// QuizForm.jsx

import React, { useState, useEffect} from "react";
import api from "../api/index";
import { FiPlusCircle, FiTrash2, FiCheckCircle, FiPaperclip } from "react-icons/fi";
export default function QuizCreator() {
  const [courses, setCourses] = useState([]);
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    course_id: "",
    questions: [],
    timer: "",            
    attempts_allowed: "", 
    deadline: "",         
  });

  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    question_type: "mcq",
    options: [],
    word_limit: "",
    media: null,
    correct_option: "",
  });

  useEffect(() => {
    api.get("/my-courses").then((res) => setCourses(res.data));
  }, []);
// remove file manually after clicking on add Question
const fileInputRef = React.useRef(null);


const addQuestion = () => {
  const cleanedQuestion = {
    ...newQuestion,
    word_limit:
      newQuestion.question_type === "subjective"
        ? newQuestion.word_limit || null
        : null, // only subjective should have word_limit
    options:
      newQuestion.question_type === "mcq"
        ? newQuestion.options.filter((opt) => opt.trim() !== "")
        : [], // only mcq should have options
    // Addition of correct option 
    correct_option:
    newQuestion.question_type === "subjective"
      ? null
      : newQuestion.correct_option,
  };

  setQuiz({
    ...quiz,
    questions: [...quiz.questions, cleanedQuestion],
  });

  setNewQuestion({
    question_text: "",
    question_type: "mcq",
    options: [],
    word_limit: "",
    media: null,
  });
  // remove file manually after clicking on add Question
  if (fileInputRef.current) {
    fileInputRef.current.value = null;
  }
};
const removeQuestion = (index) => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", quiz.title);
    formData.append("description", quiz.description);
    formData.append("course_id", quiz.course_id);
    formData.append("timer", quiz.timer);
    formData.append("attempts_allowed", quiz.attempts_allowed);
    formData.append("deadline", quiz.deadline);
    formData.append("questions", JSON.stringify(quiz.questions));

    quiz.questions.forEach((q, index) => {
      if (q.media) {
        // formData.append("media", q.media);
        formData.append(`media_${index}`, q.media);   // This is still not working
      }
    });

    try {
      await api.post("/create-quiz", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Quiz created successfully!");
      setQuiz({ title: "", description: "", course_id: "", questions: [] });
    } catch (err) {
      alert("Error creating quiz");
    }
  };

  return (
  <div className="max-w-4xl mx-auto p-0 md:p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg h-screen overflow-y-auto">
    <h2 className="text-2xl font-extrabold mb-6 text-center text-blue-700">
      ✨ Create a New Quiz
    </h2>

    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quiz Info Section */}
      <div className="p-1 sm:p-6 bg-white rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          📋 Quiz Information
        </h3>
        <input
          type="text"
          placeholder="Quiz Title"
          value={quiz.title}
          onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
          className="border border-gray-300 rounded-lg p-3 w-full mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <textarea
          placeholder="Description"
          value={quiz.description}
          onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
          className="border border-gray-300 rounded-lg p-3 w-full mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <select
          value={quiz.course_id}
          onChange={(e) => setQuiz({ ...quiz, course_id: e.target.value })}
          className="border border-gray-300 rounded-lg p-3 w-full mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Timer (minutes)"
            value={quiz.timer}
            onChange={(e) => setQuiz({ ...quiz, timer: e.target.value })}
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Allowed Attempts"
            value={quiz.attempts_allowed}
            onChange={(e) => setQuiz({ ...quiz, attempts_allowed: e.target.value })}
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Add Deadline
          </label>
          <input
            type="datetime-local"
            value={quiz.deadline}
            placeholder="add deadline"
            onChange={(e) => setQuiz({ ...quiz, deadline: e.target.value })}
            className="border border-gray-300 rounded-lg p-3 w-full mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Add Question Section */}
      <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">➕ Add Question</h3>
        <textarea
          placeholder="Question Text"
          
          value={newQuestion.question_text}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, question_text: e.target.value })
          }
          className="border border-gray-300 rounded-lg p-3 w-full mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <select
          value={newQuestion.question_type}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, question_type: e.target.value })
          }
          className="border border-gray-300 rounded-lg p-3 w-full mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="mcq">MCQ</option>
          <option value="true_false">True/False</option>
          <option value="subjective">Subjective</option>
        </select>

        {newQuestion.question_type === "mcq" && (
          <input
            type="text"
            placeholder="Comma separated options"
            value={newQuestion.options.join(",")}
            onChange={(e) =>
              setNewQuestion({
                ...newQuestion,
                options: e.target.value.split(","),
              })
            }
            className="border border-gray-300 rounded-lg p-3 w-full mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        )}

        {(newQuestion.question_type === "mcq" ||
          newQuestion.question_type === "true_false") && (
          <select
            value={newQuestion.correct_option}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, correct_option: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-3 w-full mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Select Correct Option</option>
            {newQuestion.question_type === "mcq" &&
              newQuestion.options.map((opt, idx) => (
                <option key={idx} value={opt.trim()}>
                  {opt.trim()}
                </option>
              ))}
            {newQuestion.question_type === "true_false" && (
              <>
                <option value="True">True</option>
                <option value="False">False</option>
              </>
            )}
          </select>
        )}

        {newQuestion.question_type === "subjective" && (
          <input
            type="number"
            placeholder="Word Limit"
            value={newQuestion.word_limit}
            onChange={(e) =>
              setNewQuestion({
                ...newQuestion,
                word_limit: e.target.value ? parseInt(e.target.value, 10) : null,
              })
            }
            className="border border-gray-300 rounded-lg p-3 w-full mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        )}

        {/* <input
          type="file"
          ref={fileInputRef}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, media: e.target.files[0] })
          }
          className="border border-gray-300 rounded-lg p-3 w-full mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        /> */}

        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FiPlusCircle size={18} /> Add Question
        </button>
      </div>

      {/* Questions Preview */}
      <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          📝 Questions Preview
        </h3>
        {quiz.questions.length === 0 && (
          <p className="text-gray-500 italic">No questions added yet.</p>
        )}
        {quiz.questions.map((q, i) => (
          <div
            key={i}
            className="p-4 mb-3 rounded-lg bg-gray-50 flex justify-between items-center shadow transition"
          >
            <div>
              <p className="font-medium text-gray-800">
                <b>{q.question_type.toUpperCase()}</b>: {q.question_text}
              </p>
              {q.options.length > 0 && (
                <ul className="ml-5 list-disc text-gray-700">
                  {q.options.map((opt, idx) => (
                    <li key={idx}>{opt}</li>
                  ))}
                </ul>
              )}
              {q.word_limit && (
                <p className="text-gray-600">Word Limit: {q.word_limit}</p>
              )}
              {q.media && (
                <p className="text-gray-600 flex items-center gap-1">
                  <FiPaperclip  size={14} /> {q.media.name}
                </p>
              )}
              {q.correct_option && (
                <p className="text-green-600 flex items-center gap-1 mt-1">
                  <FiCheckCircle size={16} /> Correct Answer:{" "}
                  <b>{q.correct_option}</b>
                </p>
              )}
            </div>
            <button
              onClick={() => removeQuestion(i)}
              className="ml-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Submit Quiz */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
      >
        🚀 Create Quiz
      </button>
    </form>

    <div className="mt-8">
    </div>
  </div>
);
}
