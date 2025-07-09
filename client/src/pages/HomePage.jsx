import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"; // Impor Navbar

function HomePage() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ... fungsi fetchListings Anda tetap sama
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <Navbar /> {/* Gunakan Navbar di sini */}
      <main className="container mx-auto p-4 md:p-8">
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            Jelajahi Akun
          </h1>
          <p className="text-md text-text-secondary mt-1">
            Temukan ribuan akun terbaik untuk game favoritmu.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {listings.map((listing) => (
              <Link
                to={`/listing/${listing.id}`}
                key={listing.id}
                className="group"
              >
                {/* Desain Kartu Produk Baru */}
                <div className="bg-surface rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <div className="aspect-w-1 aspect-h-1 w-full">
                    {listing.image_url ? (
                      <img
                        src={`http://localhost:3001/${listing.image_url}`}
                        alt={listing.title}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200" />
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-text-primary truncate">
                      {listing.title}
                    </h3>
                    <p className="text-xs text-text-secondary mt-1">
                      {listing.category}
                    </p>
                    <p className="text-right font-bold text-primary mt-2">
                      Rp {listing.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;
