// src/pages/EditListingPage.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

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
      alert("Anda harus mengunggah minimal 2 dan maksimal 7 gambar baru.");
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
    <div className="bg-background min-h-screen">
      <Navbar />

      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto bg-surface p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Edit Lapak
          </h2>

          <div className="mb-4">
            <p className="block text-sm font-medium text-text-secondary">
              Gambar Saat Ini:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {listing.images &&
                listing.images.map((img) => (
                  <img
                    key={img.image_url}
                    src={`http://localhost:3001/${img.image_url}`}
                    alt="listing"
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-xs text-center text-red-500 bg-red-100 p-2 rounded-md">
              Perhatian: Jika Anda mengunggah gambar baru, semua gambar lama
              akan diganti.
            </p>

            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium text-text-secondary"
              >
                Unggah Gambar Baru (Pilih 2-7 gambar)
              </label>
              <input
                id="images"
                type="file"
                multiple
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-text-secondary"
              >
                Judul Lapak
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={listing.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-text-secondary"
              >
                Deskripsi
              </label>
              <textarea
                id="description"
                name="description"
                value={listing.description}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-text-secondary"
              >
                Harga (Rp)
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={listing.price}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-text-secondary"
              >
                Kategori
              </label>
              <select
                id="category"
                name="category"
                value={listing.category}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="Game Mobile">Game Mobile</option>
                <option value="Game PC">Game PC</option>
                <option value="Akun Media Sosial">Akun Media Sosial</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Update Lapak
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditListingPage;
