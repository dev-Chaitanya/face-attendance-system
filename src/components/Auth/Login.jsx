import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Auth/Login.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import eyeIcon from "../../assets/eye.png";
import hideIcon from "../../assets/hidden.png";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        // Hide the modal manually before navigation
        const modalElement = document.getElementById("staticBackdrop");
        const modalBackdrop = document.querySelector(".modal-backdrop");
      
        if (modalElement) {
          modalElement.classList.remove("show");
          modalElement.style.display = "none";
          modalElement.setAttribute("aria-hidden", "true");
        }
        if (modalBackdrop) {
          modalBackdrop.remove(); // Remove the black overlay
        }
      
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back, Admin!",
          timer: 2000,
          showConfirmButton: false,
        });
      
        localStorage.setItem("admin", JSON.stringify(data.admin));
        setTimeout(() => navigate("/dashboard"), 2000);
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid credentials!",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({
        icon: "warning",
        title: "Network Error",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div
      class="modal fade"
      id="staticBackdrop"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
       <div class="modal-dialog">

       <div class="popUp-content modal-content">

      <div
        className="Login-PopUp card p-4 shadow-lg"
        style={{ width: "350px" }}
      >
        <div className="card-header d-flex justify-content-around align-items-start p-0  border-0" style={{background:"none"}}>
        <h2 className="text-center mb-4 ">Admin Login </h2>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field with Show/Hide Button */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={togglePasswordVisibility}
              >
                <img
                  className="showpassword"
                  src={showPassword ? eyeIcon : hideIcon}
                  alt={showPassword ? "show" : "hide"}
                />
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
          <button type="button" class="btn btn-secondary w-100  mt-2" data-bs-dismiss="modal">Close</button>
        </form>
      </div>
      </div>
      </div>

    </div>
  );
};

export default Login;
