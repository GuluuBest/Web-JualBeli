import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import CreateListingPage from "./pages/CreateListingPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import EditListingPage from "./pages/EditListingPage";
import "./index.css";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/listing/:id" element={<ListingDetailPage />} />{" "}
      {/* Tambahkan rute ini */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/sell-account" element={<CreateListingPage />} />
      <Route path="/listing/:id/edit" element={<EditListingPage />} />{" "}
      {/* Tambahkan ini */}
    </Routes>
  );
}

export default App;
