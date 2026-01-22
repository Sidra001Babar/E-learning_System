import { useState, useEffect } from "react";
import api from "../api/index";
import AnimatedCard from "../Style/AnimatedCardUtility"
import { motion } from "framer-motion";
import { MdEmail } from "react-icons/md";
import courseImg from "../assets/courseImg.jpg";
import DropsBackground from '../Style/RandomDropping/Drops';
export default function JoinCourseByStu() {
   const [showImage, setShowImage] = useState(window.innerWidth >= 768);
  const token = localStorage.getItem("token");
  const [code, setCode] = useState("");
   useEffect(() => {
    const handleResize = () => setShowImage(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
const joinCourse = () => {
  api.post("/join-course", { code })
    .then((res) => {
      const data = res.data;
      alert(data.msg);
      setCode("");
    })
    .catch((err) => {
      console.error("Join course error:", err);

      if (err.response) {
        alert(err.response.data?.msg || "Failed to join course");
      } else {
        alert("Unable to connect to server");
      }
    });
};



  return (
        <div className="flex justify-center items-center min-h-screen">
          <DropsBackground />
          <AnimatedCard>
            <div className="relative ">
              <div className="hidden sm:block absolute bottom-32 md:bottom-64 left-4 md:left-34">
                  {showImage && (
                  <img
                    src={courseImg}
                    alt="join course"
                    className="w-40 h-40 rounded-full mx-auto"
                  />
                )}
              </div>
              <div className="pt-6 sm:pt-12 pl-4 sm:pl-10 pb-2 rounded-xl" style={{background: 'linear-gradient(90deg,rgba(131, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)'}}>
                  <h2 className="text-2xl font-bold text-gray-100 ">
                    Hello Student <span className="inline-block animate-handWave">👋</span>
                  </h2>
                  <p className="text-gray-300 text-sm flex items-center ">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-white rounded-full mr-2">
                      <MdEmail className="text-orange-600" size={20} />
                    </span>
                    {localStorage.getItem("email")}
                  </p>
              </div>
              <div className="p-10" style={{background: "rgba(255, 255, 255, 0.1)",backdropFilter: "blur(10px)",WebkitBackdropFilter: "blur(10px)"}}>
              <h3
                className="text-lg font-semibold text-gray-700 mb-4"
      
              >
                Join a Course
              </h3>

              <div className="flex flex-col sm:flex-row gap-3 ">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter Course Code"
                  className="w-full sm:flex-1 px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <motion.button
                  onClick={joinCourse}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{background: 'linear-gradient(90deg,rgba(131, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)'}}
                  className=" text-white px-5 py-3 rounded-full shadow-md hover:bg-blue-700 transition"
                >
                  Join
                </motion.button>
              </div>
              </div>
            </div>
          </AnimatedCard>
         </div>

  );
}
