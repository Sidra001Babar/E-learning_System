import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" />;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.role === role ? children : <Navigate to="/" />;
}
