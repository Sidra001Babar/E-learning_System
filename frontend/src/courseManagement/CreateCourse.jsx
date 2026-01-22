import { useState, useEffect } from "react";
import courseImg from "../assets/courseImg.jpg";
import { MdEmail } from "react-icons/md";
import { motion } from "framer-motion";
import DropsBackground from '../Style/RandomDropping/Drops';
import AnimatedCard from "../Style/AnimatedCardUtility"
import api from "../api/index";

export default function Teacher() {
  const token = localStorage.getItem("token");
  const [courseName, setCourseName] = useState("");
  const [courses, setCourses] = useState([]);
  

const CreateCourse = () => {
  api.post("/create-course",
    { name: courseName },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  .then(res => {
    const data = res.data;
    alert(`Course Created! Code: ${data.course_code}`);
    setCourseName("");
    setCourses([...courses, { name: courseName, code: data.course_code, id: data.id }]);
  })
  .catch(err => {
    console.error(err);
    alert("Error creating course");
  });
};
  return (
    <div className="flex justify-center items-center min-h-screen">
      <DropsBackground />
      <AnimatedCard>
      <div className="relative">
        <div className="hidden sm:block absolute bottom-32 md:bottom-64 left-4 md:left-34">
          <img src={courseImg} alt="join course" className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full mx-auto" />
        </div>
        <div className="pt-6 sm:pt-12 pl-4 sm:pl-10 pb-2 rounded-xl bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700">
          <h2 className="text-2xl font-bold text-gray-100 ">
            Hello Teacher <span className="inline-block animate-handWave">👋</span>
          </h2>
           <p className="text-gray-300 text-sm flex items-center ">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-white rounded-full mr-2">
              <MdEmail className="text-blue-900" size={20} />
            </span>
            {localStorage.getItem("email")}
          </p>
        </div>
         
          <div className="p-10" style={{background: "rgba(255, 255, 255, 0.1)",backdropFilter: "blur(10px)",WebkitBackdropFilter: "blur(10px)"}}>
              <h3
                className="text-lg font-semibold text-gray-700 mb-4"
      
              >
                Create New Course
              </h3>

              <div className="flex flex-col sm:flex-row gap-3 ">
                 <input
                  value={courseName} 
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Course Name"
                  className="w-full sm:flex-1 px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <motion.button
                  onClick={CreateCourse}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className=" text-white px-5 py-3 rounded-full shadow-md hover:bg-blue-700 transition bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700"
                >
                  Create
                </motion.button>
              </div>
              </div>
        </div>
        </AnimatedCard>
  </div>

  );
}