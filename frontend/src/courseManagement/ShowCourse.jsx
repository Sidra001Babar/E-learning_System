import { useState, useEffect } from "react";
import api from "../api/index";   
export default function ShowCourse() {
  const token = localStorage.getItem("token");
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const gradients = [
 "linear-gradient(90deg, #9d57c4 0%, #ff4d4d 50%, #ffd27f 100%)",
  "linear-gradient(90deg, #6ee7f0 0%, #8aaaf0 100%)",
  "linear-gradient(90deg, #ff7fd6 0%, #d94d9a 100%)",
  "linear-gradient(90deg, #8e3ff5 0%, #4a91ff 100%)",
  "linear-gradient(90deg, #ffb84d 0%, #ffe866 100%)",
  "linear-gradient(90deg, #ff9a7f 0%, #ffcc9f 100%)",
  "linear-gradient(90deg, #4ddcff 0%, #3399ff 100%)",
  "linear-gradient(90deg, #ff6f47 0%, #66eeff 100%)",
  "linear-gradient(90deg, #ff87a6 0%, #8a9bff 100%)",
  "linear-gradient(90deg, #ffdff5 0%, #d0dbff 100%)",
  "linear-gradient(90deg, #d891f9 0%, #ff95e0 100%)",
  "linear-gradient(90deg, #6cffae 0%, #66ffe8 100%)",
  "linear-gradient(90deg, #6fe5e7 0%, #5d3ab0 100%)",
  "linear-gradient(90deg, #fff3e0 0%, #ffd6c2 100%)",
  "linear-gradient(90deg, #ffb088 0%, #ff8085 100%)",
  "linear-gradient(90deg, #4aff88 0%, #4da6ff 100%)"
  ];
useEffect(() => {
  if (!token) return;

  api.get("/my-courses")
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
        // Backend returned error
        setError(err.response.data?.msg || "Failed to fetch courses");
      } else {
        // Network / server down
        setError("Unable to connect to server");
      }

      setCourses([]);
    });
}, [token]);

  return (
    <div className="p-7 overflow-y-auto h-screen text-white">
      {error ? (
        <p className="text-red-500 font-semibold" style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> 
          {courses.map((c,index) => (
            <div key={c.id}
              className="bg-white shadow-md rounded-xl p-4 border border-gray-200 hover:shadow-lg transition"
              style={{background: gradients[index % gradients.length], // pick gradient by index
              }}
            >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800 bg-gray-100 rounded-full p-2">{c.name}</h3>
            </div>
            <p className="text-gray-600">
                Code: <span className="font-semibold text-blue-600">{c.code}</span>
            </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
