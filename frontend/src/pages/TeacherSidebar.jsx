import { useState,useEffect } from "react";
import {FaHome,FaSignOutAlt,FaBullhorn,FaBars,FaBook,FaUsers,FaKey,FaBookOpen,FaVideo
} from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import userImg from '../assets/userImg.jpg';
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function TeacherSidebar() {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/register");
  };

    useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false); // always collapsed
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { name: "Change Password", icon: <FaKey className="ml-1"/>, path: "/changePassword" },
    { name: "Home", icon: <FaHome className="ml-1" />, path: "/teacher" },
    { name: "Courses", icon: <FaBookOpen className="ml-1" />, path: "/teacher/courses" },
    { name: "Announcement", icon: <FaBullhorn className="ml-1"/>, path: "/teacher/announcementOptions" },
    { name: "Assignment", icon: <FaBook className="ml-1" />, path: "/teacher/assignmentOptions" },
    { name: "Quiz", icon: <MdQuiz className="ml-1" />, path: "/teacher/quizOptions" },
    { name: "Lecture", icon: <FaVideo className="ml-1"/>, path: "/teacher/uploadLecture" },
    { name: "Students", icon: <FaUsers className="ml-1"/>, path: "/teacher/manageStudent" },
    { name: "Logout", icon: <FaSignOutAlt className="ml-1" />, action: logout }, 
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`h-screen pl-1 sidebarZindex overflow-y-auto text-white flex flex-col transition-all bg-gradient-to-b from-teal-500 via-blue-900 to-pink-700
         duration-300 
        ${isOpen ? "w-64" : "w-16"}`}

      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between h-20 border-b border-gray-700 px-4">
          {/* Hide menu button if mobile */}
        {!isMobile && (
        <button
          className="text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars size={20} />
        </button>
        )}
        </div>

        {/* Menu */}
        <nav className="flex-1 px-2 py-6">
          <ul className="space-y-3">
            {menuItems.map((item, index) => {
              const active = location.pathname === item.path;
              return (
                <li key={index}>
                  {item.path ? (
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 p-2 rounded-md transition-colors duration-200 
                        ${active
                          ? "bg-pink-500/70 text-white shadow-md"
                          : "bg-white/10 hover:bg-white/20 text-white"
                        }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {isOpen && <span>{item.name}</span>}
                    </Link>
                  ) : (
                    <button
                      onClick={item.action}
                      className="flex items-center space-x-3 p-2 rounded-md w-full text-left"
                    >
                      <span className="text-lg">{item.icon}</span>
                      {isOpen && <span>{item.name}</span>}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
