import { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [credentials, setCredentials] = useState({
    fullname: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setError("");
    setCredentials({ fullname: "", username: "", password: "", confirmPassword: "" });
  };

  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(credentials.username)) {
      setError("Invalid Email Format!");
      return;
    }

    if (isRegister) {
      if (credentials.password !== credentials.confirmPassword) {
        setError("Passwords do not match!");
        return;
      }
      try {
        const res = await axios.post("http://localhost:5000/api/auth/register", {
          name: credentials.fullname,
          email: credentials.username,
          password: credentials.password,
        });
        localStorage.setItem("token", res.data.token);
        alert("Registration successful!");
        navigate("/userdashboard");
      } catch (err) {
        setError(err.response?.data?.message || "Registration failed!");
      }
    } else {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: credentials.username,
          password: credentials.password,
        });
        localStorage.setItem("token", res.data.token);
        const role = res.data.role;
        if (role === "admin") navigate("/admindashboard");
        else if (role === "artist") navigate("/artistdashboard");
        else navigate("/userdashboard");
      } catch (err) {
        setError(err.response?.data?.message || "Invalid credentials!");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isRegister ? "Register" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input type="text" name="fullname" placeholder="Full Name" required onChange={handleChange} value={credentials.fullname} />
          )}
          <input type="text" name="username" placeholder="Email" required onChange={handleChange} value={credentials.username} />
          {error && <p className="error-message">{error}</p>}
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} value={credentials.password} />
          {isRegister && (
            <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleChange} value={credentials.confirmPassword} />
          )}
          <button type="submit">{isRegister ? "Register" : "Login"}</button>
        </form>
        <p onClick={toggleForm} className="toggle-text">
          {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
};

export default Auth;