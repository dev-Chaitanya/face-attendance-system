import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./Footer.css";

const Footer = () => {
  return (
    // 
  <footer className="footer bg-dark text-white py-4">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
          <h3 className="mb-2">FaceTrack</h3>
          <p className="mb-0">Enhancing attendance with facial recognition technology.</p>
        </div>
        <div className="col-md-6 text-center text-md-end">
          <ul className="list-inline mb-0">
            <li className="list-inline-item mx-2">
              <a href="#" className="text-white">
                <i className="fab fa-facebook-f fa-lg"></i>
              </a>
            </li>
            <li className="list-inline-item mx-2">
              <a href="#" className="text-white">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
            </li>
            <li className="list-inline-item mx-2">
              <a href="#" className="text-white">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
            </li>
            <li className="list-inline-item mx-2">
              <a href="#" className="text-white">
                <i className="fab fa-linkedin-in fa-lg"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom text-center mt-3">
        <p className="mb-0">&copy; {new Date().getFullYear()} FaceTrack. All rights reserved.</p>
      </div>
    </div>
  </footer>
  
  );
};

export default Footer;