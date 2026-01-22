import { useState, useEffect } from "react";
import CreateCourse from '../courseManagement/CreateCourse';
import ShowCourse from '../courseManagement/ShowCourse';
import Announcement from '../AnnouncementManagement/PostAnnouncement';
export default function Teacher() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Hello Teacher - {localStorage.getItem("email")}</h2>

      <h3>Create New Course</h3>
      <CreateCourse />

      {/* <h3>Your Courses</h3>
      <ShowCourse />

      <h3>Post Announcement</h3>
      <Announcement /> */}
    </div>
  );
}
