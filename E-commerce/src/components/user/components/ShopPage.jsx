import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import '../styles/ShopPage.css';

const ShopPage = ({ addToBag, bagCount, setBagCount }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const handleBuyNow = (product) => {
    navigate("/checkout", { state: { product } });
  };

  const handleAddToBag = async (product) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/cart",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addToBag(product);
      setBagCount(bagCount + 1);
      alert(`${product.name} has been added to your bag!`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar bagCount={bagCount} />
      <div className="container-fluid my-5">
        <h2 className="text-center mb-4">Shop Our Products</h2>
        <div className="ecommerce-box-list">
          {products.map((product) => (
            <div key={product._id} className="ecommerce-box">
              <div className="image-container">
                <img src={product.image} alt={product.name} className="product-image" style={{ height: "300px", objectFit: "fill" }} />
              </div>
              <div className="product-details">
                <h5 className="product-name">{product.name}</h5>
                <p className="product-price">₹{product.price.toFixed(2)}</p>
                <div className="action-buttons">
                  <button onClick={() => handleAddToBag(product)} className="btn btn-primary">Add to bag</button>
                  <button onClick={() => handleBuyNow(product)} className="btn btn-success">Buy Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopPage;