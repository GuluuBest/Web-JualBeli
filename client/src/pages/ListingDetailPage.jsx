import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ListingDetailPage() {
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // State untuk mengontrol kedua slider
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  useEffect(() => {
    // ... (Fungsi fetchListing Anda tetap sama)
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

  // ... (Fungsi handleDelete Anda tetap sama)
  const handleDelete = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus lapak ini?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3001/api/listings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Lapak berhasil dihapus.");
        navigate("/");
      } catch (error) {
        alert("Gagal menghapus lapak.");
        console.error("Error deleting listing:", error.response);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!listing)
    return (
      <div>
        {" "}
        <h2>Lapak tidak ditemukan.</h2>{" "}
        <Link to="/">Kembali ke Halaman Utama</Link>{" "}
      </div>
    );

  const loggedInUserId = localStorage.getItem("userId");

  return (
    <div>
      <h1>{listing.title}</h1>

      {/* -- BAGIAN GALERI GAMBAR BARU -- */}
      {listing.images && listing.images.length > 0 && (
        <div className="image-gallery-container">
          {/* Slider 1: Gambar Utama */}
          <Slider
            asNavFor={nav2}
            ref={(slider) => setNav1(slider)}
            arrows={false}
          >
            {listing.images.map((img) => (
              <div key={`main-${img.image_url}`}>
                <img
                  src={`http://localhost:3001/${img.image_url}`}
                  alt={listing.title}
                  style={{
                    width: "100%",
                    maxHeight: "500px",
                    margin: "0 auto",
                    objectFit: "contain",
                  }}
                />
              </div>
            ))}
          </Slider>

          {/* Slider 2: Thumbnail Navigasi */}
          <Slider
            asNavFor={nav1}
            ref={(slider) => setNav2(slider)}
            slidesToShow={4}
            swipeToSlide={true}
            focusOnSelect={true}
            centerMode={true}
          >
            {listing.images.map((img) => (
              <div key={`thumb-${img.image_url}`} style={{ margin: "8px" }}>
                <img
                  src={`http://localhost:3001/${img.image_url}`}
                  alt={`Thumbnail ${listing.title}`}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    cursor: "pointer",
                    borderRadius: "8px",
                  }}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
      {/* -- AKHIR BAGIAN GALERI GAMBAR -- */}

      <p>
        <strong>Penjual:</strong> {listing.seller_username}
      </p>
      <p>
        <strong>Harga:</strong> Rp {listing.price.toLocaleString("id-ID")}
      </p>
      <p>
        <strong>Kategori:</strong> {listing.category}
      </p>
      <hr />
      <h3>Deskripsi:</h3>
      <p>{listing.description || "Tidak ada deskripsi."}</p>
      <br />

      {loggedInUserId && parseInt(loggedInUserId) === listing.seller_id && (
        <div style={{ margin: "20px 0" }}>
          <Link to={`/listing/${id}/edit`}>
            <button style={{ backgroundColor: "blue", color: "white" }}>
              Edit Lapak
            </button>
          </Link>
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: "red",
              color: "white",
              marginLeft: "10px",
            }}
          >
            Hapus Lapak
          </button>
        </div>
      )}

      <Link to="/">Kembali ke Halaman Utama</Link>
    </div>
  );
}

export default ListingDetailPage;
