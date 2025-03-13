import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { Button } from "react-bootstrap";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();
  }, []);

  const deleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container my-5">
        <h2 className="text-center mb-4">Your Orders</h2>
        {orders.length === 0 ? (
          <center>
            <h4 style={{ paddingTop: '80px' }}>No orders found. Please complete your checkout.</h4>
          </center>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="ecommerce-box my-4 p-3 border rounded shadow">
              <div className="image-container text-center">
                {order.pictureUrl ? <img src={order.pictureUrl} alt="Uploaded Reference" className="product-image" /> : <p>No image uploaded</p>}
              </div>
              <div className="product-details text-center mt-3">
                <h5 className="product-name">{order.productId.name}</h5>
                <p className="product-price">₹{order.total.toFixed(2)}</p>
                {order.description && <p className="product-description">{order.description}</p>}
                <Button variant="danger" size="sm" onClick={() => deleteOrder(order._id)}>Delete</Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;