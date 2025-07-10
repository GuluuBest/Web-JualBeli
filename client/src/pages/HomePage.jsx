import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function HomePage() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/listings");
        setListings(response.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f9ff] to-[#e3ebf7]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-700">
            Temukan Akun Impianmu
          </h1>
          <p className="mt-2 text-gray-600">
            Marketplace akun game yang aman, cepat, dan terpercaya.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <Link
                to={`/listing/${listing.id}`}
                key={listing.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
              >
                <img
                  src={`http://localhost:3001/${listing.image_url}`}
                  alt={listing.title}
                  className="rounded-t-xl h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg truncate">
                    {listing.title}
                  </h3>
                  <p className="text-sm text-gray-500">{listing.category}</p>
                  <p className="text-right text-indigo-600 font-bold mt-2">
                    Rp {listing.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
