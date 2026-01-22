// StudentLayout.jsx
import { useState } from "react";
import StudentSidebar from "../pages/StudentSidebar";
import StudentLecturesView from "./StudentLectureView";

export default function StudentLayoutt() {
  const [showMainSidebar, setShowMainSidebar] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true); 
  return (
   <div className="flex h-screen w-full">
      {showMainSidebar && (
        <div className="fixed top-0 left-0 h-full z-20">
          <StudentSidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        </div>
      )}

      {/* main content margin matches sidebar width */}
      <div
        className={`flex-1 transition-all duration-300 ${
          showMainSidebar ? (isExpanded ? "ml-16" : "ml-16") : "ml-0"
        }`}
      >
        <StudentLecturesView setShowMainSidebar={setShowMainSidebar} />
      </div>
    </div>
  );
}
