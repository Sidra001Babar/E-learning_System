import { useState, useEffect } from "react";
import api from "../api/index"; // your axios instance
import { MdArrowDropDown } from "react-icons/md"
import MovingShapes from '../Style/DroppingShapes/MovingShapes';
export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [openBox, setOpenBox] = useState(null); 
  const [courses, setCourses] = useState([]);
  const gradients = [
  "linear-gradient(90deg, #833AB4 0%, #FD1D1D 50%, #FCB045 100%)",
  "linear-gradient(90deg, #36d1dc 0%, #5b86e5 100%)",
  "linear-gradient(90deg, #f953c6 0%, #b91d73 100%)",
  "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
  "linear-gradient(90deg, #f7971e 0%, #ffd200 100%)",
  "linear-gradient(90deg, #ff7e5f 0%, #feb47b 100%)",
  "linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)",
  "linear-gradient(90deg, #ff4b1f 0%, #1fddff 100%)",
  "linear-gradient(90deg, #fc5c7d 0%, #6a82fb 100%)",
  "linear-gradient(90deg, #fbc2eb 0%, #a6c1ee 100%)",
  "linear-gradient(90deg, #c471f5 0%, #fa71cd 100%)",
  "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(90deg, #30cfd0 0%, #330867 100%)",
  "linear-gradient(90deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(90deg, #ff9966 0%, #ff5e62 100%)",
  "linear-gradient(90deg, #00f260 0%, #0575e6 100%)"
  ];

  // filters
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [sortOrder, setSortOrder] = useState("new"); // default: newest first

  // Fetch announcements + reactions
  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/announcements");
      const anns = res.data;

      // For each announcement, fetch reactions
      const withReactions = await Promise.all(
        anns.map(async (a) => {
          const r = await api.get(`/announcements/${a.id}/reactions`);
          return { ...a, reactions: r.data };
        })
      );

      setAnnouncements(withReactions);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch student's enrolled courses
  const fetchCourses = async () => {
    try {
      const res = await api.get("/my-enrolled-courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchCourses();
  }, []);

  // Toggle reaction for a student
  const toggleReaction = async (annId) => {
    try {
      await api.post(`/announcements/${annId}/react`);
      fetchAnnouncements(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered + Sorted list
  const filteredAnnouncements = announcements
    .filter((a) =>
      a.message.toLowerCase().includes(search.toLowerCase())
    )
    .filter((a) => (selectedCourse ? a.course_id === Number(selectedCourse) : true))

    .sort((a, b) => {
      if (sortOrder === "new") {
        return new Date(b.date) - new Date(a.date);
      }
      return new Date(a.date) - new Date(b.date);
    });

  return (
    <div className="p-4 h-screen overflow-y-auto">
      <MovingShapes />
      <h3 className="text-xl font-bold mb-4">Your Announcements</h3>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search announcements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-full sm:w-40 w-full"
        />

        {/* Filter by course */}
        <div className="relative sm:w-40 w-full">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(Number(e.target.value) || "")}
            className="appearance-none border border-black px-3 py-2 rounded-full bg-white sm:w-40 w-full"
            
          >
            <option value="">🎯 All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
           <MdArrowDropDown
            size={24}
            className="absolute right-1 top-1/2 -translate-y-1/2"
          />
        </div>
        {/* Sort */}
        <div className="relative sm:w-40 w-full">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="appearance-none border border-black px-3 py-2 rounded-full w-full bg-white pr-8"
          >
            <option value="new">🔼 Newest First</option>
            <option value="old">Oldest First</option>
          </select>

          {/* Custom dropdown icon */}
          <MdArrowDropDown
            size={24}
            className="absolute right-1 top-1/2 -translate-y-1/2"
          />
        </div>
      </div>

      {/* Announcements list */}
      <div className="space-y-4 ">
        {filteredAnnouncements.map((a,index) => (
          <div
            key={a.id}
            className="relative rounded-lg shadow p-4 bg-white"
            style={{
                background: gradients[index % gradients.length], // pick gradient by index
              }}
          >
            {/* Announcement Info */}
            <div className="flex  justify-between mb-2 text-sm ">
              <span className="p-3 rounded-full bg-gray-100 shadow">
                <b>{a.course_name}</b>
              </span>
              <span  className="p-3 rounded-full bg-gray-100 shadow">{a.teacher_email}</span>
            </div>

            <div
              className="text-gray-100 rte-content"
              dangerouslySetInnerHTML={{ __html: a.message }}
            ></div>
            <p className="text-xs text-gray-300 mt-2">{a.date}</p>

            {/* Reactions */}
            <div className="mt-3 flex items-center space-x-4">
              <button
                onClick={() => toggleReaction(a.id)}
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 bg-white p-2 rounded-full shadow"
              >
                <span className="">👍</span>
                <span>{a.reactions?.length || 0}</span>
              </button>

              {a.reactions && a.reactions.length > 0 && (
                <button
                  onClick={() =>
                    setOpenBox(openBox === a.id ? null : a.id)
                  }
                  className="text-sm text-gray-100 hover:underline rounded "
                >
                  See who reacted
                </button>
              )}
            </div>

            {/* Popup box */}
            {openBox === a.id && (
              <div className="absolute top-full left-0 mt-2 w-full bg-gray-50 border rounded-lg shadow p-3 z-10">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">
                    Reacted by:
                  </span>
                  <button
                    onClick={() => setOpenBox(null)}
                    className="text-red-500 hover:text-red-700 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {a.reactions.map((u, idx) => (
                    <li key={idx}>{u}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
