import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [user, setUser] = useState({ username: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUser({
        username: decoded.username,
        email: decoded.email,
      });
    } catch (err) {
      console.error("Token tidak valid");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0e7ff] via-[#f0f4ff] to-[#dbeafe] px-4 py-12 dark:from-gray-900 dark:to-gray-800 transition-all">
      <div className="bg-white/70 dark:bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 w-full max-w-md p-8 text-center">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-2 tracking-tight">
          {user.username || "Pengguna"}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
          {user.email || "Email tidak ditemukan"}
        </p>

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition-all shadow-md"
        >
          Keluar
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
