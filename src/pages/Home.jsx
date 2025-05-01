import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Home.css";
import HeroImg from "../assets/Hero.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Cards } from "../components/Cards.jsx";
import Automated from "../assets/Automated.png"
import Secure from "../assets/Secure.png"
import timeSaving from "../assets/Saving.png"
import userFriendly from "../assets/userFriendly.png"
import realTime from "../assets/RealTime.png"
import Footer from "../components/Footer.jsx";
import Login from "../components/Auth/Login.jsx";
import Register from "../components/Auth/Register.jsx";
const Home = () => {
  const cardContents = [
    {
      title: "Automated Attendance",
      description: "Mark attendance effortlessly using face recognition technology.",
      order:0,
      img:Automated
    },
    {
      title: "Secure and Reliable",
      description: "Ensure data security with advanced facial recognition algorithms.",
      order:1,
      img:Secure
    },
    {
      title: "Time-Saving Solution",
      description: "Save time by automating the attendance process for classrooms.",
      order:0,
      img:timeSaving
    },
    {
      title: "User-Friendly Interface",
      description: "Easily navigate and manage attendance with an intuitive design.",
      order:1,
      img:userFriendly
    },
    {
      title: "Real-Time Processing",
      description: "Capture and process attendance data instantly and accurately.",
      order:0,
      img:realTime
    }
  ];
  const handleLoginPopUp=()=>{

  }
  return (

    <div className="Home">
      <Navbar handleLogin={handleLoginPopUp}/>
      <Login/>
      <Register/>
      {/* Hero Section */}
      <div className="Hero-Box  container-fluid  text-dark overflow-hidden">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col col-sm-12 col-md-6 col-lg-6 ">
            <div className="Hero-left-card  card  p-4 ">
              <div className="card-header  border-0" style={{ background: "none" }}>
                <h1 className="card-title  ">
                  Face Recognition Attendance System
                </h1>
              </div>
              <div className="card-body bg-0">
                <p className="card-text bg-none  fs-4">
                  This is a web application that uses face recognition technology to take attendance. It allows teachers to easily mark attendance for their students using their faces. The system uses a camera to capture the faces of the students and matches them with the stored images in the database. The attendance is then recorded automatically, saving time and effort for teachers.
                </p>
              </div>
              <div className="card-footer bg-0 border-0">
                <p className="card-text fs-4">
                  For more information, visit our       
                  <Link className="Hero-btn" to="/about">About</Link> page or <Link className="Hero-btn" to="/contact">Contact Us</Link>.
                </p>
              </div>
            </div>
          </div>
          <div className="co-6 col-sm-auto col-md-6 col-lg-6 ">
            <img src={HeroImg} className="HeroImg p-0 d-none d-sm-block d-md-block d-lg-block rounded-start" alt="..."/>     
          </div>
        </div>
      </div>
      {/* <div className="Section-content container-fluid p-2 "> 
        {cardContents.map((card, index) => {
          return (
            <Cards key={index} title={card.title} description={card.description} order={card.order} image={card.img} />
          );
        })}
      </div> */}
      <Footer/> 
         </div>
  );
};

export default Home;
