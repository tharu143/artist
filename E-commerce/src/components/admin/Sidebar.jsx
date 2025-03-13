import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { House, Cart, People, CreditCard, BoxArrowRight } from "react-bootstrap-icons";

const navItems = [
  { name: "Dashboard", to: "/admindashboard", icon: <House size={20} className="me-2" /> },
  { name: "Orders", to: "/adminorders", icon: <Cart size={20} className="me-2" /> },
  { name: "Artists", to: "/adminartists", icon: <People size={20} className="me-2" /> },
  { name: "Payments", to: "/adminpayments", icon: <CreditCard size={20} className="me-2" /> },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="bg-dark text-white d-flex flex-column min-vh-100 " style={{ width: '250px' }}>
      <div className="p-3 border-bottom border-warning">
        <h3 className="m-0">Admin </h3>
      </div>
      <div className="flex-grow-1">
        <ul className="nav flex-column p-2">
          {navItems.map((item, index) => (
            <li key={index} className="nav-item">
              <NavLink 
                to={item.to}
                className={({ isActive }) => `nav-link text-white py-2 px-3 rounded ${isActive ? 'bg-warning' : ''}`}
              >
                {item.icon}
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-top border-warning p-3">
        <button className="btn btn-danger w-100 d-flex align-items-center justify-content-center" onClick={handleLogout}>
          <BoxArrowRight size={20} className="me-2" />
          Logout
        </button>
      </div>
    </div>
  );
}
