import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import '../styles/ShoppingBag.css';

const ShoppingBag = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your shopping bag.");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Cart data:', res.data); // Debug log
        setCartItems(res.data.items || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching cart:', err.response?.data);
        setError("Failed to load your shopping bag.");
      }
    };
    fetchCart();
  }, [navigate]);

  const handleBuyNow = (item) => {
    if (item.productId) {
      navigate("/checkout", { state: { product: item.productId } });
    } else {
      setError("Cannot proceed to checkout: Product data is missing.");
    }
  };

  const removeFromBag = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(cartItems.filter((item) => item.productId?._id !== productId));
      alert("Item removed from bag!");
    } catch (err) {
      console.error('Error removing item:', err.response?.data);
      setError(`Failed to remove item: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div>
      <Navbar /> {/* Add bagCount prop if needed */}
      <div className="container-fluid my-5">
        <h2 className="text-center mb-4">Your Shopping Bag</h2>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {cartItems.length === 0 && !error ? (
          <p className="text-center">Your bag is empty.</p>
        ) : (
          <div className="row">
            {cartItems.map((item) => (
              <div key={item.productId?._id || item._id} className="col-md-3 mb-3">
                <div className="card">
                  <img
                    src={item.productId?.image ? `http://localhost:5000${item.productId.image}` : "/placeholder.jpg"}
                    alt={item.productId?.name || "Unknown Product"}
                    className="card-img-top"
                    style={{ height: "300px", objectFit: "cover", padding: "13px", borderRadius: "10px" }}
                    onError={(e) => (e.target.src = "/placeholder.jpg")}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.productId?.name || "N/A"}</h5>
                    <p className="card-text">₹{item.productId?.price?.toFixed(2) || "N/A"}</p>
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => removeFromBag(item.productId?._id)}
                        className="btn btn-danger flex-fill"
                        disabled={!item.productId}
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => handleBuyNow(item)}
                        className="btn btn-success flex-fill"
                        disabled={!item.productId}
                      >
                        Buy Now
                      </button>
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