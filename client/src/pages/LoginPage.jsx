import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  // Kita ganti state `email` menjadi `identifier` agar lebih umum
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Kirim `identifier` ke back-end
      const response = await axios.post("http://localhost:3001/api/login", {
        identifier, // <-- Diubah
        password,
      });

      // ... sisa logika setelah login berhasil (tetap sama) ...
      localStorage.setItem("token", response.data.token);
      const decoded = JSON.parse(atob(response.data.token.split(".")[1]));
      localStorage.setItem("userId", decoded.id);
      navigate("/");
    } catch (err) {
      alert(
        "Login Gagal: " + (err.response?.data?.message || "Terjadi kesalahan")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Masuk ke Akun
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            {/* Label dan Input diubah */}
            <label className="block text-sm text-gray-600">
              Username atau Email
            </label>
            <input
              type="text" // <-- Diubah dari "email"
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center mt-6 text-gray-600">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:underline font-medium"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
