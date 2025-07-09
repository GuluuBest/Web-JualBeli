import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/api/login", {
        email: email,
        password: password,
      });

      localStorage.setItem("token", response.data.token);

      const decodedToken = JSON.parse(atob(response.data.token.split(".")[1]));
      localStorage.setItem("userId", decodedToken.id);

      alert("Login Berhasil!");
      navigate("/profile");
    } catch (error) {
      console.error("Login Gagal:", error.response.data.message);
      alert("Login Gagal: " + error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Halaman Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
