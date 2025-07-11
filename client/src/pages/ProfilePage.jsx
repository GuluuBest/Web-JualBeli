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
        // Mengambil data profil dan lapak secara bersamaan
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

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen font-sans">
        <Navbar />
        <div className="text-center p-10 text-text-muted">Loading...</div>
      </div>
    );
  }

  // Pengecekan jika user tidak ditemukan setelah loading
  if (!user) {
    return (
      <div className="bg-background min-h-screen font-sans">
        <Navbar />
        <div className="text-center p-10 text-text-muted">
          Gagal memuat data pengguna.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen font-sans">
      <Navbar />

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kolom Kiri: Info Profil */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="bg-surface p-6 rounded-xl shadow-soft animate-slideInUp">
              <h2 className="text-2xl font-bold text-text">{user.username}</h2>
              <p className="text-sm text-text-muted">ID Pengguna: {user.id}</p>
              <hr className="my-4" />
              <Link to="/sell-account">
                <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-soft hover:shadow-lifted">
                  + Jual Akun Baru
                </button>
              </Link>
            </div>
          </aside>

          {/* Kolom Kanan: Daftar Lapak */}
          <section className="lg:col-span-8 xl:col-span-9">
            <h3 className="text-2xl font-bold text-text mb-4 animate-fadeIn">
              Lapak Jualan Saya
            </h3>
            {myListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((listing, index) => (
                  <div
                    key={listing.id}
                    className="bg-surface rounded-lg shadow-soft overflow-hidden transition-all duration-300 hover:shadow-lifted hover:-translate-y-1 animate-slideInUp"
                    style={{
                      animationDelay: `${index * 75}ms`,
                      opacity: 0,
                      animationFillMode: "forwards",
                    }}
                  >
                    <img
                      src={`http://localhost:3001/${listing.image_url}`}
                      alt={listing.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4 flex flex-col h-full">
                      <h4 className="font-semibold text-text truncate">
                        {listing.title}
                      </h4>
                      <p className="text-right font-bold text-primary mt-2">
                        Rp {listing.price.toLocaleString("id-ID")}
                      </p>
                      <div className="mt-auto pt-4">
                        <Link to={`/listing/${listing.id}/edit`}>
                          <button className="w-full text-sm bg-gray-100 hover:bg-gray-200 text-text-muted font-semibold py-2 px-3 rounded-lg transition-colors">
                            Kelola Lapak
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface p-8 rounded-xl shadow-soft text-center animate-fadeIn">
                <p className="text-text-muted">
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
