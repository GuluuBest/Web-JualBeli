// src/pages/HomePage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

// Komponen untuk ikon kategori (SVG)
const CategoryIcon = ({ d, label }) => (
  <div className="flex flex-col items-center gap-2 text-center group">
    <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center shadow-soft group-hover:bg-primary transition-all duration-300">
      <svg
        className="w-8 h-8 text-primary group-hover:text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={d}
        />
      </svg>
    </div>
    <p className="text-xs font-semibold text-text-muted group-hover:text-primary">
      {label}
    </p>
  </div>
);

function HomePage() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/listings");
        setListings(response.data);
      } catch (error) {
        console.error("Gagal mengambil data lapak:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="bg-background min-h-screen font-sans">
      <Navbar />

      {/* -- HERO SECTION BARU -- */}
      <section
        className="relative h-80 md:h-96 flex items-center justify-center bg-cover bg-center"
        // Ganti URL ini dengan gambar background Anda sendiri
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        {/* Overlay untuk menggelapkan gambar */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10 text-center text-white p-4 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Marketplace Akun Terpercaya
          </h1>
          <p className="mt-2 text-lg">
            Temukan, Beli, dan Jual Akun dengan Aman & Mudah
          </p>
          <div className="mt-6 max-w-xl mx-auto">
            <input
              type="search"
              placeholder="Cari game atau akun..."
              className="w-full p-4 rounded-full text-text shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>
      </section>
      {/* -- AKHIR HERO SECTION -- */}

      <main className="container py-12">
        {/* -- IKON KATEGORI -- */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text mb-6 text-center">
            Kategori Populer
          </h2>
          <div className="flex justify-center flex-wrap gap-6 md:gap-10">
            <CategoryIcon
              d="M12 18.35l-6.35-6.35a2.5 2.5 0 1 1 3.54-3.54l2.81 2.81 2.81-2.81a2.5 2.5 0 1 1 3.54 3.54L12 18.35z"
              label="Game Mobile"
            />
            <CategoryIcon
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              label="Game PC"
            />
            <CategoryIcon
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              label="Akun Sosmed"
            />
          </div>
        </section>
        {/* -- AKHIR IKON KATEGORI -- */}

        <hr className="my-8 border-gray-200" />

        {/* -- PRODUK TERBARU -- */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-6">Produk Terbaru</h2>
          {isLoading ? (
            <div className="text-center text-text-muted">Memuat produk...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {listings.map((listing, index) => (
                <Link
                  to={`/listing/${listing.id}`}
                  key={listing.id}
                  className="group animate-slideInUp"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    opacity: 0,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="bg-surface rounded-lg shadow-soft overflow-hidden transition-all duration-300 hover:shadow-lifted hover:-translate-y-1">
                    <img
                      src={`http://localhost:3001/${listing.image_url}`}
                      alt={listing.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-text truncate">
                        {listing.title}
                      </h3>
                      <p className="text-right font-bold text-primary mt-2">
                        Rp {listing.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
        {/* -- AKHIR PRODUK TERBARU -- */}
      </main>
    </div>
  );
}

export default HomePage;
