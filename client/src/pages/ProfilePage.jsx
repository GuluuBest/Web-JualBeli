import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [profileResponse, listingsResponse] = await Promise.all([
          axios.get("http://localhost:3001/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3001/api/my-listings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(profileResponse.data.user);
        setMyListings(listingsResponse.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <Navbar />
        <div className="text-center p-10">Loading...</div>
      </div>
    );
  }

  // Tambahkan pengecekan jika user null setelah loading selesai
  if (!user) {
    return (
      <div className="bg-background min-h-screen">
        <Navbar />
        <div className="text-center p-10">Gagal memuat data pengguna.</div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Kolom Kiri: Info Profil */}
          <aside className="lg:col-span-1">
            <div className="bg-surface p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-text-primary">
                {user.username}
              </h2>
              <p className="text-sm text-text-secondary">
                ID Pengguna: {user.id}
              </p>
              <hr className="my-4" />
              <Link to="/sell-account">
                <button className="w-full bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  Jual Akun Baru
                </button>
              </Link>
            </div>
          </aside>

          {/* Kolom Kanan: Daftar Lapak */}
          <section className="lg:col-span-3">
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Lapak Jualan Saya
            </h3>
            {myListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-surface rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
                  >
                    <img
                      src={`http://localhost:3001/${listing.image_url}`}
                      alt={listing.title}
                      className="w-full h-40 object-cover" // Class ini yang mengatur ukuran gambar
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-text-primary truncate">
                        {listing.title}
                      </h4>
                      <p className="text-right font-bold text-primary mt-2">
                        Rp {listing.price.toLocaleString("id-ID")}
                      </p>
                      <Link to={`/listing/${listing.id}/edit`}>
                        <button className="w-full mt-4 text-sm bg-gray-200 hover:bg-gray-300 text-text-primary font-semibold py-1 px-3 rounded">
                          Edit
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface p-6 rounded-lg shadow-md text-center">
                <p className="text-text-secondary">
                  Anda belum memiliki lapak jualan.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
