import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateListingPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Game Mobile");
  const [image, setImage] = useState(null); // State untuk file gambar
  const navigate = useNavigate();

  // ... (useEffect tetap sama)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      // Kirim sebagai multipart/form-data
      await axios.post("http://localhost:3001/api/listings/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Lapak berhasil dibuat!");
      navigate("/profile");
    } catch (error) {
      alert("Gagal membuat lapak.");
      console.error("Error creating listing:", error.response);
    }
  };

  return (
    <div>
      <h2>Jual Akun Anda</h2>
      <form onSubmit={handleSubmit}>
        {/* BAGIAN YANG HILANG */}
        <div>
          <label>Judul Lapak:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Deskripsi:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Harga (Rp):</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Kategori:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Game Mobile">Game Mobile</option>
            <option value="Game PC">Game PC</option>
            <option value="Akun Media Sosial">Akun Media Sosial</option>
          </select>
        </div>

        {/* BAGIAN YANG SUDAH ADA */}
        <div>
          <label>Gambar Utama:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>
        <button type="submit">Buat Lapak</button>
      </form>
    </div>
  );
}

export default CreateListingPage;
