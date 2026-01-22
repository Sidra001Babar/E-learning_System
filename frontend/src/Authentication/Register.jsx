import React, { useState } from "react";
import api from "../api/index";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaUserGraduate } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import RegistrationPageSideImg from '../assets/RegistrationPageSideImg.png';
import DropsBackground from '../Style/RandomDropping/Drops';

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "student" });
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showValidationBox, setShowValidationBox] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", form);
      alert("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  // ✅ One function for both strength + validation
  const evaluatePassword = (value) => {
    const rules = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value),
      specialChar: /[@$!%*?&+\-?<>#^()={}]/.test(value),
    };

    setValidations(rules);

    // Strength = count of passed rules
    let score = Object.values(rules).filter(Boolean).length;
    setStrength(score);
  };
//  Every time user types → we evaluate again.
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    handleChange(e);
    evaluatePassword(value);
  };

  const getStrengthLabel = () => {
    if (strength <= 2) return { text: "Weak", color: "text-red-500", bar: "bg-red-500 w-1/3" };
    if (strength === 3 || strength === 4) return { text: "Medium", color: "text-yellow-600", bar: "bg-yellow-600 w-2/3" };
    if (strength === 5) return { text: "Strong", color: "text-green-600", bar: "bg-green-600 w-full" };
    return { text: "", color: "", bar: "w-0" };
  };

  const { text, color, bar } = getStrengthLabel();

  return (
    <div className="flex flex-col md:flex-row h-screen text-white overflow-y-auto pb-11 bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700"
      // style={{background: 'linear-gradient(90deg,rgba(131, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)'}}
      >
          <DropsBackground />
      
      <div className="hidden md:flex md:w-1/2 items-center justify-center float-animation p-6">
        <img
          src={RegistrationPageSideImg}
          alt="Registration Illustration"
          className="max-w-md rounded-full shadow-2xl"
        />
      </div>
      
      <div className="relative flex w-full md:w-1/2 items-center justify-center p-6 mt-20 ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (strength === 5) {
              handleSubmit(e);
            }
          }}
          className="w-full max-w-md rounded-2xl  pt-14 pb-8 px-8  space-y-6 
          bg-white/10 backdrop-blur-md shadow-xl  md:text-gray-800"
        >
          <div className="absolute top-0 left-0 w-full h-1/5 rounded-2xl bg-purple-800 md:hidden"></div>

          <h2 className="text-2xl font-bold text-center text-white md:text-purple-800 relative z-10"
         
          >Create Account</h2>
          {/* Image on top of form (Mobile Only) */}
          <div className="absolute bottom-[85%] right-1/2 transform translate-x-1/2 flex justify-center mb-4 md:hidden">
            <img
              src={RegistrationPageSideImg}
              alt="Registration Illustration"
              className="w-40 h-40 rounded-full shadow-lg"
            />
          </div>

          {/* Username */}
          <div className="flex items-center border-2 border-purple-900 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-900">
            <FaUser className="text-purple-900 mr-2" />
            <input
              name="username"
              onChange={handleChange}
              placeholder="Username"
              className="w-full outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex items-center border-2 border-purple-900 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-900">
            <MdEmail className="text-purple-900 mr-2" />
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Email"
              className="w-full outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="flex items-center border-2 border-purple-900 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 relative">
              <FaLock className="text-purple-900 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setShowValidationBox(true)}
                onBlur={() => setShowValidationBox(false)}
                placeholder="Password"
                className="w-full outline-none"
              />
              <span
                className="absolute right-3 cursor-pointer text-purple-900"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>

            {/* Strength Bar */}
            {password && (
              <div className="mt-2">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-2 ${bar} transition-all duration-300`}></div>
                </div>
                <p className={`text-sm mt-1 font-medium ${color}`}>
                  Password Strength: {text}
                </p>
              </div>
            )}

            {/* Validation Box */}
            {showValidationBox && (
              <div className="absolute top-full mt-2 w-full bg-gradient-to-r from-blue-800 via-blue-700 to-blue-500 shadow-lg rounded-xl p-4  text-sm z-10">
                <p className={validations.length ? "text-green-300" : "text-red-500"}>
                  {validations.length ? "✔" : "✖"} At least 8 characters
                </p>
                <p className={validations.uppercase ? "text-green-300" : "text-red-500"}>
                  {validations.uppercase ? "✔" : "✖"} At least one uppercase letter
                </p>
                <p className={validations.lowercase ? "text-green-300" : "text-red-500"}>
                  {validations.lowercase ? "✔" : "✖"} At least one lowercase letter
                </p>
                <p className={validations.number ? "text-green-300" : "text-red-500"}>
                  {validations.number ? "✔" : "✖"} At least one number
                </p>
                <p className={validations.specialChar ? "text-green-300" : "text-red-500"}>
                  {validations.specialChar ? "✔" : "✖"} At least one special character
                </p>
              </div> 
            )}
          </div>

          {/* Role */}
          <div className="flex items-center border-2 border-purple-900 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
            <FaUserGraduate className="text-purple-900 mr-2" />
            <select
              name="role"
              onChange={handleChange}
              className="w-full outline-none bg-transparent"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full py-2 font-semibold rounded-xl shadow-md transition duration-200 
              ${strength < 5 
                ? "bg-purple-800 md:bg-purple-800 text-gray-200 cursor-not-allowed" 
                : "bg-purple-800 text-white hover:bg-purple-800"}`}
          >
            Register
          </button>

          {/* Login Link */}
          <p className="text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
