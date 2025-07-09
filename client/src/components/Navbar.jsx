import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="bg-surface shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            GuluuStore
          </Link>

          {/* Tombol Aksi */}
          <div className="flex items-center gap-4">
            {token ? (
              <>
                <Link to="/profile">
                  <button className="text-text-primary font-semibold hover:text-primary">
                    Profil Saya
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">
                <button className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg">
                  Login / Daftar
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
