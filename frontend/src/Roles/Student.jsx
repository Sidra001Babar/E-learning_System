import  { useState, useEffect } from "react";

export default function Student() {
  const token = localStorage.getItem("token");
  const [code, setCode] = useState("");
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetch("https://elearning-production-1595.up.railway.app/my-enrolled-courses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setCourses(data));
  }, [token]);

  const joinCourse = () => {
    fetch("https://elearning-production-1595.up.railway.app/join-course", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ code })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.msg);
        setCode("");
      });
  };

  const viewAnnouncements = (courseId) => {
    fetch(`https://elearning-production-1595.up.railway.app/announcements/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setAnnouncements(data));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Hello Student - {localStorage.getItem("email")}</h2>

      <h3>Join Course</h3>
      <input 
        value={code} 
        onChange={e => setCode(e.target.value)} 
        placeholder="Enter Course Code" 
      />
      <button onClick={joinCourse}>Join</button>

      <h3>My Courses</h3>
      <ul>
        {courses.map(c => (
          <li key={c.id}>
            {c.name} 
            <button onClick={() => viewAnnouncements(c.id)}>View Announcements</button>
          </li>
        ))}
      </ul>

      <h3>Announcements</h3>
      <ul>
        {announcements.map((a, index) => (
          <li key={index}>{a.date}: {a.message}</li>
        ))}
      </ul>
    </div>
  );
}
