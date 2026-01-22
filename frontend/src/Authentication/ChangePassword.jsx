import React, { useState } from "react";
import api from "../api/index"; // your axios instance with setAuthToken support

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await api.post("/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setMessage(res.data.msg);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Change Password
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">{error}</div>
        )}
        {message && (
          <div className="bg-green-100 text-green-600 p-2 mb-4 rounded">
            {message}
          </div>
        )}

        {/* Old password */}
        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-1">
            Old Password
          </label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        {/* New password */}
        <div className="mb-6">
          <label className="block text-gray-600 text-sm mb-1">
            New Password
          </label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 8 characters, include uppercase, lowercase, number, and special character.
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-900 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
