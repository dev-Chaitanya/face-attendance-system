import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Styles/Sidebar.css";
import Swal from "sweetalert2";


const Sidebar = (props) => {
  const [adminName, setAdminName] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    if (adminData) {
      const admin = JSON.parse(adminData);
      setAdminName(admin.name);
    }
  }, []);

   const deleteAdmin = async () => {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "Your account and access will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete my account",
      });
    
      if (confirm.isConfirmed) {
        const admin = JSON.parse(localStorage.getItem("admin"));
        try {
          const res = await fetch(`http://127.0.0.1:5000/api/delete-admin/${admin.id}`, {
            method: "DELETE",
          });
    
          const data = await res.json();
          if (data.success) {
            Swal.fire("Deleted!", "Your admin account is gone.", "success");
            localStorage.removeItem("admin");
            navigate("/");
          } else {
            Swal.fire("Error", data.message, "error");
          }
        } catch (err) {
          console.error("Admin delete error:", err);
          Swal.fire("Error", "Something went wrong", "error");
        }
      }
    };
  return (
    <nav className="off-canvas-side navbar bg-body-tertiary fixed-top">
      <div className="container-fluid  Side-NavBar">
        <a className="navbar-brand text-white" href="/">
          FaceTrack
        </a>
        <button
          className="navbar-toggler border border-0 "
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span className="menuIcon navbar-toggler-icon  "></span>
        </button>
        <div
          className="Sidebar offcanvas offcanvas-start"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5
              className="offcanvas-title text-white"
              id="offcanvasNavbarLabel"
            >
              {adminName}
            </h5>
            <button
              type="button"
              className="btn-close closeSideBar-btn"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link text-white">
                  📊 Dashboard
                </Link>
              </li>
              <li>
                <Link to="/register-student" className="nav-link text-white">
                  📝 Register Student
                </Link>
              </li>
              <li>
                <Link to="/attendance-records" className="nav-link text-white">
                  📋 View Attendance
                </Link>
              </li>
              <li>
                <Link to="/manage-attendance" className="nav-link text-white">
                  📅 Manage Attendance
                </Link>
              </li>
              <li>
                <Link to="/records" className="nav-link text-white">
                  📋 Records
                </Link>
              </li>
              <button
                className="btn btn-warning w-100 mt-3"
                onClick={() => {
                  localStorage.removeItem("admin"); // clear login data
                  navigate("/"); // redirect
                }}
              >
                Logout
              </button>
              <button
                className="btn btn-danger w-100 mt-3"
                onClick={deleteAdmin}
              >
                Delete Admin Account
              </button>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
