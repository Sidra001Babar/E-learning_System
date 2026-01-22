import { useState, useEffect } from "react";
import { FaHome, FaBullhorn, FaBook, FaClipboard, FaQuestion, FaVideo, FaSignOutAlt, FaKey, FaBars } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
// import userImg from "../assets/userImg.jpg";
export default function StudentSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  // check screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsExpanded(false); // always collapsed
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/register");
  };

  return (
    <div
      className={`h-screen pl-1 sidebarZindex overflow-y-auto text-white flex flex-col transition-all duration-300 
      ${isExpanded ? "w-64" : "w-16"}`}
     style={{ background:
        "linear-gradient(180deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)",}}

    >
      {/* Header */}
      <div className="flex items-center justify-between h-20 border-b border-orange-700 px-4">

        {/* {isExpanded &&             
        <div className="flex items-center space-x-2 p-2">
            <img
              src={userImg}
              alt="Logo"
              className="h-10 w-10 rounded-full"
            />
            <h1 className="text-xl font-bold">Me</h1>
        </div>
        } */}
        {/* Hide menu button if mobile */}
        {!isMobile && (
        <button
          className="text-white p-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <FaBars size={20} />
        </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6">
        <ul className="space-y-4 text-white">
          <li className="bg-white/10 hover:bg-white/20 p-2 rounded-xl">
            <NavLink
              to="/changePassword"
              className="flex items-center space-x-3 rounded-xl"
            >
              <FaKey className="text-white ml-1"/>
              {isExpanded && <span>Change Password</span>}
            </NavLink>
          </li>
          <li className="">
            <NavLink
              to="/student"
              end
              className={({ isActive }) =>
                `flex items-center space-x-3 p-2 rounded-xl ${
                  isActive ? "bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white" : "bg-white/10 hover:bg-white/20"
                }`
              }
            >
              <FaHome className="text-white ml-1" />
              {isExpanded && <span>Home</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/Studentcourses"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-2 rounded-xl ${
                  isActive ? "bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white" : "bg-white/10 hover:bg-white/20"
                }`
              }
            >
              <FaBook className="text-white ml-1"/>
              {isExpanded && <span>Courses</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/ViewAnnouncement"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-2 rounded-xl ${
                  isActive ? "bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white" : "bg-white/10 hover:bg-white/20"
                }`
              }
            >
              <FaBullhorn className="text-white ml-1"/>
              {isExpanded && <span>Announcement</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/ViewAssignment"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-2 rounded-xl ${
                  isActive ? "bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white" : "bg-white/10 hover:bg-white/20"
                }`
              }
            >
              <FaClipboard className="text-white0 ml-1"/>
              {isExpanded && <span>Assignment</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/ViewQuiz"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-2 rounded-xl ${
                  isActive ? "bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white" : "bg-white/10 hover:bg-white/20"
                }`
              }
            >
              <FaQuestion className="text-white ml-1"/>
              {isExpanded && <span>Quiz</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/StudentViewLecture"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-2 rounded-xl ${
                  isActive ? "bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white" : "bg-white/10 hover:bg-white/20"
                }`
              }
            >
              <FaVideo className="text-white ml-1" />
              {isExpanded && <span>Lecture</span>}
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-blue-700">
        <button
          onClick={logout}
          className="flex items-center space-x-3 rounded "
        >
          <FaSignOutAlt />
          {isExpanded && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
