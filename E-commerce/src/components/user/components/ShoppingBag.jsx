import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import '../styles/ShoppingBag.css';

const ShoppingBag = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data.items || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, []);

  const handleBuyNow = (item) => {
    navigate("/checkout", { state: { product: item.productId } });
  };

  const removeFromBag = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(cartItems.filter((item) => item.productId._id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid my-5">
        <h2 className="text-center mb-4">Your Shopping Bag</h2>
        {cartItems.length === 0 ? (
          <p className="text-center">Your bag is empty.</p>
        ) : (
          <div className="row">
            {cartItems.map((item) => (
              <div key={item.productId._id} className="col-md-3 mb-3">
                <div className="card">
                  <img src={item.productId.image} alt={item.productId.name} className="card-img-top" style={{ height: "300px", objectFit: "cover", padding: "13px", borderRadius: "10px" }} />
                  <div className="card-body">
                    <h5 className="card-title">{item.productId.name}</h5>
                    <p className="card-text">₹{item.productId.price.toFixed(2)}</p>
                    <div className="d-flex gap-2">
                      <button onClick={() => removeFromBag(item.productId._id)} className="btn btn-danger flex-fill">Remove</button>
                      <button onClick={() => handleBuyNow(item)} className="btn btn-success flex-fill">Buy Now</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingBag;