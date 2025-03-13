import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag as ShoppingBagIcon } from "lucide-react";
import "../styles/Navbar.css";

const Navbar = ({ bagCount }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        <NavLink className="navbar-brand fw-bold" to="/userdashboard">E-Commerce</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/shop">Shop</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/orders">Orders</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/profile">Profile</NavLink>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <NavLink to="/shoppingbag" className="nav-link position-relative me-3">
              <ShoppingBagIcon size={24} />
              {bagCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {bagCount}
                </span>
              )}
            </NavLink>
            {token ? (
              <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
            ) : (
              <NavLink to="/" className="btn btn-outline-primary">Login</NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;