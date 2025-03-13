import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import art1 from "../../../assets/home/art1.1.jpg";
import art4 from "../../../assets/home/art4.2.jpg";
import art5 from "../../../assets/home/art5.4.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [bagCount, setBagCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data.slice(0, 3)); // Show only 3 featured products
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();

    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  const handleAddToBag = async (product) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/cart",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBagCount(bagCount + 1);
      alert(`${product.name} has been added to your bag!`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bagCount={bagCount} />
      <main className="flex-grow-1">
        <div className="container my-5">
          <div className="row">
            <div className="col-md-6">
              <h1 className="display-4 fw-bold">Welcome to E-Commerce</h1>
              <p className="lead">Discover unique art and handmade products from talented artists.</p>
              <button className="btn btn-primary btn-lg mt-3" onClick={() => navigate("/shop")}>
                Shop Now
              </button>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-6 mb-3">
                  <img src={art1} alt="Art 1" className="img-fluid rounded" />
                </div>
                <div className="col-6 mb-3">
                  <img src={art4} alt="Art 4" className="img-fluid rounded" />
                </div>
                <div className="col-12">
                  <img src={art5} alt="Art 5" className="img-fluid rounded" />
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-center my-5">Featured Products</h2>
          <div className="row">
            {products.map((product) => (
              <div key={product._id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <img src={product.image} alt={product.name} className="card-img-top" style={{ height: "200px", objectFit: "cover" }} />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">₹{product.price.toFixed(2)}</p>
                    <button className="btn btn-primary" onClick={() => handleAddToBag(product)}>
                      Add to Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;