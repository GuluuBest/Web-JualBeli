import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/register", {
        username,
        email,
        password,
      });
      alert("Pendaftaran berhasil! Silakan login.");
      navigate("/login");
    } catch (error) {
      alert(
        "Gagal daftar: " +
          (error.response?.data?.message || "Terjadi kesalahan")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-violet-100 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Daftar Akun Baru
        </h1>
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-1 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-1 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            Daftar
          </button>
        </form>
        <p className="text-sm text-center mt-6 text-gray-600">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:underline font-medium"
          >
            Masuk sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
