import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const profileResponse = await axios.get(
          "http://localhost:3001/api/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(profileResponse.data.user);

        const listingsResponse = await axios.get(
          "http://localhost:3001/api/my-listings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMyListings(listingsResponse.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Selamat Datang, {user.username}!</h1>

      <Link to="/sell-account">
        <button>Jual Akun Baru</button>
      </Link>
      <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
        Logout
      </button>

      <hr style={{ margin: "20px 0" }} />

      <h2>Lapak Jualan Saya</h2>
      {myListings.length > 0 ? (
        myListings.map((listing) => (
          <Link
            to={`/listing/${listing.id}`}
            key={listing.id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                border: "1px solid grey",
                padding: "10px",
                margin: "10px",
                display: "flex",
                gap: "15px",
              }}
            >
              {listing.image_url && (
                <img
                  src={`http://localhost:3001/${listing.image_url}`}
                  alt={listing.title}
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
              )}
              <div>
                <h4>{listing.title}</h4>
                <p>Rp {listing.price.toLocaleString("id-ID")}</p>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p>Anda belum memiliki lapak jualan.</p>
      )}
    </div>
  );
}

export default ProfilePage;
