import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "../components/Navbar"; // 1. Impor Navbar

function ListingDetailPage() {
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/listings/${id}`
        );
        setListing(response.data);
      } catch (error) {
        console.error("Gagal mengambil detail lapak:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleDelete = async () => {
    // ... fungsi handleDelete Anda tetap sama
  };

  if (isLoading) return <div className="text-center p-10">Loading...</div>;
  if (!listing)
    return (
      <div className="text-center p-10">
        <h2>Lapak tidak ditemukan.</h2>
        <Link to="/" className="text-primary hover:underline">
          Kembali
        </Link>
      </div>
    );

  const loggedInUserId = localStorage.getItem("userId");

  return (
    <div className="bg-background min-h-screen">
      <Navbar /> {/* 2. Gunakan Navbar */}
      <main className="container mx-auto p-4 md:p-8">
        {/* Layout utama dengan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Kolom Kiri: Galeri Gambar */}
          <div className="w-full">
            {listing.images && listing.images.length > 0 ? (
              <div>
                <Slider
                  asNavFor={nav2}
                  ref={(slider) => setNav1(slider)}
                  arrows={false}
                  fade={true}
                >
                  {listing.images.map((img) => (
                    <div key={`main-${img.image_url}`}>
                      <img
                        src={`http://localhost:3001/${img.image_url}`}
                        alt={listing.title}
                        className="w-full h-96 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  ))}
                </Slider>
                <Slider
                  asNavFor={nav1}
                  ref={(slider) => setNav2(slider)}
                  slidesToShow={4}
                  swipeToSlide={true}
                  focusOnSelect={true}
                  className="mt-4"
                >
                  {listing.images.map((img) => (
                    <div key={`thumb-${img.image_url}`} className="p-1">
                      <img
                        src={`http://localhost:3001/${img.image_url}`}
                        alt={`Thumbnail ${listing.title}`}
                        className="w-full h-20 object-cover rounded-md cursor-pointer"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">No Image</p>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Detail & Aksi */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-text-primary">
              {listing.title}
            </h1>
            <p className="text-md text-text-secondary mt-2">
              Dijual oleh:{" "}
              <span className="font-semibold text-primary">
                {listing.seller_username}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Kategori: {listing.category}
            </p>

            <div className="my-6">
              <p className="text-3xl font-bold text-primary">
                Rp {listing.price.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold text-lg text-text-primary">Deskripsi</h3>
              <p className="text-text-secondary mt-2">
                {listing.description || "Tidak ada deskripsi."}
              </p>
            </div>

            {/* Tombol Aksi untuk pemilik */}
            {loggedInUserId &&
              parseInt(loggedInUserId) === listing.seller_id && (
                <div className="mt-auto pt-6 flex gap-4">
                  <Link to={`/listing/${id}/edit`} className="flex-1">
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                      Edit Lapak
                    </button>
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Hapus Lapak
                  </button>
                </div>
              )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ListingDetailPage;
