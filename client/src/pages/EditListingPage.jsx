import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditListingPage() {
  const [listing, setListing] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });
  const [newImages, setNewImages] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/listings/${id}`
        );
        setListing(response.data);
      } catch (error) {
        console.error("Gagal mengambil data lapak:", error);
        navigate("/");
      }
    };
    fetchListing();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListing((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      newImages.length > 0 &&
      (newImages.length < 2 || newImages.length > 7)
    ) {
      alert("Anda harus mengunggah minimal 2 dan maksimal 7 gambar.");
      return;
    }

    const formData = new FormData();
    formData.append("title", listing.title);
    formData.append("description", listing.description);
    formData.append("price", listing.price);
    formData.append("category", listing.category);

    for (let i = 0; i < newImages.length; i++) {
      formData.append("images", newImages[i]);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:3001/api/listings/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Lapak berhasil diupdate!");
      navigate(`/listing/${id}`);
    } catch (error) {
      alert("Gagal mengupdate lapak.");
      console.error("Error updating listing:", error.response);
    }
  };

  return (
    <div>
      <h2>Edit Lapak Anda</h2>
      <p>Gambar saat ini:</p>
      <div>
        {listing.images &&
          listing.images.map((img) => (
            <img
              key={img.image_url}
              src={`http://localhost:3001/${img.image_url}`}
              alt="listing"
              style={{ width: "100px", height: "100px", marginRight: "10px" }}
            />
          ))}
      </div>
      <hr />

      <form onSubmit={handleSubmit}>
        <p>
          <strong>Perhatian:</strong> Jika Anda mengunggah gambar baru, semua
          gambar lama akan diganti.
        </p>
        <div>
          <label>Unggah Gambar Baru (Pilih 2-7 gambar):</label>
          <input type="file" multiple onChange={handleImageChange} />
        </div>
        <br />
        <div>
          <label>Judul Lapak:</label>
          <input
            type="text"
            name="title"
            value={listing.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Deskripsi:</label>
          <textarea
            name="description"
            value={listing.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Harga (Rp):</label>
          <input
            type="number"
            name="price"
            value={listing.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Kategori:</label>
          <select
            name="category"
            value={listing.category}
            onChange={handleChange}
          >
            <option value="Game Mobile">Game Mobile</option>
            <option value="Game PC">Game PC</option>
            <option value="Akun Media Sosial">Akun Media Sosial</option>
          </select>
        </div>
        <button type="submit">Update Lapak</button>
      </form>
    </div>
  );
}

export default EditListingPage;
