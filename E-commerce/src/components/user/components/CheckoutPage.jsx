import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || { name: "Unknown Product", price: 0, artistId: "Unknown" };

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    paymentType: "UPI",
    cardDetails: "",
    address: "",
    pincode: "",
    picture: null,
    description: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, picture: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formDataToSend = new FormData();
    formDataToSend.append("productId", product._id);
    formDataToSend.append("customer", formData.name);
    formDataToSend.append("total", product.price);
    formDataToSend.append("description", formData.description);
    if (formData.picture) formDataToSend.append("picture", formData.picture);

    try {
      const res = await axios.post("http://localhost:5000/api/orders", formDataToSend, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      navigate("/orders", { state: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "1200px" }}>
        <h2 className="text-center mb-3">Checkout</h2>
        <h4 className="text-center text-muted mb-4">Buying: {product.name} - ₹{product.price.toFixed(2)}</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name:</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Mobile:</label>
            <input type="text" className="form-control" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Payment Type:</label>
            <select className="form-select" name="paymentType" value={formData.paymentType} onChange={handleInputChange}>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
            </select>
          </div>
          {formData.paymentType === "Card" && (
            <div className="mb-3">
              <input type="text" className="form-control" name="cardDetails" value={formData.cardDetails} onChange={handleInputChange} placeholder="Enter Card Details" required />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Address:</label>
            <input type="text" className="form-control" name="address" value={formData.address} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Pincode:</label>
            <input type="text" className="form-control" name="pincode" value={formData.pincode} onChange={handleInputChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Upload Picture:</label>
            <input type="file" className="form-control" name="picture" onChange={handleFileChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Product Description:</label>
            <textarea className="form-control" name="description" value={formData.description} onChange={handleInputChange}></textarea>
          </div>
          <div className="mb-3">
            <p className="text-danger text-center fw-bold">Note: This is a non-refundable payment.</p>
          </div>
          <button type="submit" className="btn btn-primary w-100">Place Order</button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;