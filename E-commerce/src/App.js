import "./App.css";
import Auth from "./Auth";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/user/components/HomePage";
import ShopPage from "./components/user/components/ShopPage";
import ShoppingBag from "./components/user/components/ShoppingBag";
import CheckoutPage from "./components/user/components/CheckoutPage";
import Orders from "./components/user/components/Orders";
import Profile from "./components/user/components/Profile"; // Import Profile
import ArtistDashboard from "./components/artist/ArtistDashboard";
import ArtistPayments from "./components/artist/ArtistPayments";
import ArtistOrders from "./components/artist/ArtistOrders";
import ArtistProductUpload from "./components/artist/ArtistProductUpload";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminOrders from "./components/admin/AdminOrders";
import AdminArtists from "./components/admin/AdminArtists";
import AdminPayments from "./components/admin/AdminPayments";

function App() {
  const [shoppingBag, setShoppingBag] = useState([]);
  const [bagCount, setBagCount] = useState(0);

  const addToBag = (product) => {
    setShoppingBag((prevBag) => [...prevBag, product]);
    setBagCount((prevCount) => prevCount + 1);
  };

  const removeFromBag = (index) => {
    setShoppingBag((prevBag) => prevBag.filter((_, i) => i !== index));
    setBagCount((prevCount) => prevCount - 1);
  };

  return (
    <Router>
      <div className="container-fluid">
        <Routes>
          <Route path="/userdashboard" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage addToBag={addToBag} bagCount={bagCount} setBagCount={setBagCount} />} />
          <Route path="/shoppingbag" element={<ShoppingBag shoppingBag={shoppingBag} removeFromBag={removeFromBag} />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} /> {/* Added Profile route */}
          <Route path="/" element={<Auth />} />
          <Route path="/artistdashboard" element={<ArtistDashboard />} />
          <Route path="/artistorders" element={<ArtistOrders />} />
          <Route path="/artistproductupload" element={<ArtistProductUpload />} />
          <Route path="/artistpayments" element={<ArtistPayments />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/adminorders" element={<AdminOrders />} />
          <Route path="/adminartists" element={<AdminArtists />} />
          <Route path="/adminpayments" element={<AdminPayments />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;