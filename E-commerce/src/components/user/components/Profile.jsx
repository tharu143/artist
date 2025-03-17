import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Profile.css";
import userIcon from "../../../assets/home/user.png";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 container my-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm p-4">
              <div className="text-center mb-4">
                <img src={userIcon} alt="User" className="rounded-circle" style={{ width: "100px", height: "100px" }} />
              </div>
              <h2 className="text-center mb-4">Profile</h2>
              <div className="mb-3">
                <label className="form-label fw-bold">Name:</label>
                <p>{user.name}</p>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Email:</label>
                <p>{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;