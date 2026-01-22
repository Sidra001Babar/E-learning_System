import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import api, { setAuthToken } from "../api/index";
import { FaUser, FaLock } from "react-icons/fa";
import DropsBackground from '../Style/RandomDropping/Drops';


export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post("/login", form);  // send data to database 
      // Send the form data (username & password) to the backend's /login endpoint
      // 'res' will contain the backend's response (usually a JWT toke
      localStorage.setItem("token", res.data.access_token);
      // Store the JWT access token in the browser's localStorage so it can be used later
      // This allows the user to stay logged in after page refresh
      setAuthToken(res.data.access_token);
      // Set the Authorization header in the API client with this token
      // This means all future API requests will be authenticated

      const payload = JSON.parse(atob(res.data.access_token.split(".")[1]));
      // Decode the JWT token:
      // 1. Split it into 3 parts: header, payload, signature
      // 2. Take the payload (second part) and Base64 decode it
      // 3. Parse the decoded string into a JavaScript object

      localStorage.setItem("email", payload.email);
      localStorage.setItem("id", payload.id);
      localStorage.setItem("role", payload.role);
      // Save the user's email in localStorage for later use (e.g., displaying in the UI)
      if (payload.role === "teacher") navigate("/teacher");
      else navigate("/student");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
          <DropsBackground />

      {/* Top-left shape */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700"
        style={{ clipPath: "circle(clamp(150px, 25vw, 300px) at 0 0)" }}
      ></div>

      {/* Bottom-right shape */}
      <div
        className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700"
        style={{clipPath: "circle(clamp(150px, 25vw, 300px) at 100% 100%)"  }}
      ></div>
     
      <form 
        onSubmit={handleSubmit} 
        className="relative z-10 max-w-sm w-full p-8 bg-white shadow-2xl rounded-2xl flex flex-col space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-white relative z-10">Login</h2>
        <div className="absolute top-0 left-0 w-full h-1/5 rounded-2xl bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700"
        ></div>

        {/* Username */}
        <div className="flex items-center border-2 border-purple-900 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-900">
          <FaUser className="text-purple-900 mr-2" />
          <input
            name="username"
            onChange={handleChange}
            placeholder="Username or Email"
            className="w-full outline-none"
          />
        </div>
        <div className="flex items-center border-2 border-purple-900 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-900">
          <FaLock className="text-purple-900 mr-2" />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Password"
          className="w-full outline-none"
        />
        </div>
        <button
          type="submit"
          className="w-full py-2  text-purple-800 border font-semibold rounded-xl shadow-md hover:bg-purple-900 hover:text-white transition duration-200"
        >
          Login
        </button>
        {/* <p className="text-sm text-gray-500 text-center">
          Forgotten Password? <Link to="/forgotPassword" className="text-purple-800 hover:underline">Click here to reset</Link>
        </p> */}
        
        <p className="text-sm text-gray-500 text-center">
          Don’t have an account? <Link to="/register" className="text-purple-800 hover:underline">Sign up</Link>
        </p>
      </form>

    </div>
  );
}
