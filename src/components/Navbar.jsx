import React from "react";
import { Link } from "react-router-dom";
import "./Styles/Navbar.css";

const Navbar = ({ handleLogin }) => {
  return (
    <nav className="navbar-custom navbar navbar-expand-lg fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand glow-text" to="/">
          FaceTrack
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <button
                type="button"
                class="btn border-0"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
              >
                Login
              </button>
  
            </li>
            <li className="nav-item">
              <button
                type="button"
                class="btn border-0"
                data-bs-toggle="modal"
                data-bs-target="#exampleModalRegister"
              >
           Register
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
