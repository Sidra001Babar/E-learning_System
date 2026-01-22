import React, { useState, useEffect } from "react";
import api, { setAuthToken } from "../api/index";
import RichTextEditor from "./Editor";

export default function PostAnnouncement() {
  const token = localStorage.getItem("token");
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const maxWords = 150;

  useEffect(() => {
    setAuthToken(token);
    api.get("/my-courses")
      .then((res) => {
        if (Array.isArray(res.data)) setCourses(res.data);
        else setCourses([]);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setCourses([]);
      });
  }, [token]);

  // Word counter (ignores extra spaces, HTML tags from editor)
  const handleEditorChange = (value) => {
    const text = value.replace(/<[^>]*>/g, " "); // remove HTML tags
    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
    if (words.length <= maxWords) {
      setMessage(value);
    }
  };

  const postAnnouncement = (e) => {
    e.preventDefault();
    if (!selectedCourse) {
      alert("Please select a course first");
      return;
    }
    if (!message.trim()) {
      alert("Message cannot be empty");
      return;
    }
    if (wordCount > maxWords) {
      alert(`Message cannot exceed ${maxWords} words`);
      return;
    }

    api.post("/post-announcement", { course_id: selectedCourse, message })
      .then((res) => {
        alert(res.data.msg || "Announcement posted");
        setMessage("");
        setWordCount(0);
      })
      .catch((err) => {
        console.error("Error posting announcement:", err);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-6 rounded-lg shadow-md bg-white">
        <h3 className="text-xl font-bold mb-3 text-gray-800">📢 Post Announcement</h3>

        <form onSubmit={postAnnouncement} className="flex flex-col space-y-3 overflow-y-auto">
          <select
            className="border p-2 rounded-lg w-full"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>

          {/* Custom Rich Text Editor */}
          <RichTextEditor value={message} onChange={handleEditorChange} className=' border-8 border-amber-500'/>

          {/* Word counter */}
          <p className={`text-sm ${wordCount > maxWords ? "text-red-600" : "text-gray-600"}`}>
            {wordCount}/{maxWords} words
          </p>

          <button
            type="submit"
            className={`p-2 rounded-lg transition ${
              wordCount > maxWords
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700"
            }`}
            disabled={wordCount > maxWords}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
