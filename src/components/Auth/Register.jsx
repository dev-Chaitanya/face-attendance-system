import React, { useState } from "react";
import "../Auth/Register.css";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom"; // 👈 import this at the top
import eye from "../../assets/eye.png";
import hide from "../../assets/hidden.png";
import Swal from "sweetalert2";

function Register() {
  const navigate = useNavigate(); // 👈 initialize inside the component

  let Showpassword = {
    show: <img className="showpassword" src={eye} alt="eye" />,
    hide: <img className="showpassword" src={hide} alt="eye" />,
  };

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Handle text input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Validate form fields
  const validateForm = () => {
    let newErrors = {};

    if (!user.name.trim()) newErrors.name = "Name is required";

    if (!user.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!user.password.trim()) {
      newErrors.password = "Password is required";
    } else if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!user.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (user.password !== user.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await fetch("https://face-attendance-system-rr87.onrender.com/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password,
        }),
      });

      const result = await res.json();

      if (result.success) {
        const registerModal = document.getElementById("exampleModalRegister");
        const modalBackdrop = document.querySelector(".modal-backdrop");
      
        if (registerModal) {
          registerModal.classList.remove("show");
          registerModal.style.display = "none";
          registerModal.setAttribute("aria-hidden", "true");
        }
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
      
        Swal.fire({
          icon: "success",
          title: "Registered Successfully!",
          text: "Welcome, Admin!",
          timer: 2000,
          showConfirmButton: false,
        });
      
        const adminData = {
          id: result.admin_id,
          name: user.name,
          email: user.email,
        };
        localStorage.setItem("admin", JSON.stringify(adminData));
      
        setTimeout(() => navigate("/dashboard"), 2000);
      }else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: result.message || "Something went wrong!",
        });
      }
    } catch (err) {
      console.error("Error registering admin:", err);
      Swal.fire({
        icon: "warning",
        title: "Server Error",
        text: "Please try again later.",
      });
    }
  };

  return (
    <div
      class="modal fade"
      id="exampleModalRegister"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="Register-content modal-content">
          <div className="Form-box d-flex flex-column justify-content-center container w-50 text-white">
            <div className="d-flex justify-content-around">
            <h2 className="text-center">Admin Register</h2>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit} className="p-3 mx-auto">
              {/* Name Field */}
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  value={user.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              {/* Email Field */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  value={user.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              {/* Password Field with Show/Hide Toggle */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    value={user.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? Showpassword.show : Showpassword.hide}
                  </button>
                </div>
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={`form-control ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                  value={user.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary w-100">
                Register
              </button>
              <button type="button" class="btn btn-secondary w-100 mt-2" data-bs-dismiss="modal">Close</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
