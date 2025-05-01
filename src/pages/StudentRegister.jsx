import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Sidebar.jsx";
import "../components/Styles/StudentRegister.css";
import Swal from 'sweetalert2';

const StudentRegister = () => {
  const storedAdmin = localStorage.getItem("admin");
  const admin = storedAdmin ? JSON.parse(storedAdmin) : null;
  if (!admin) {
    Swal.fire({
      icon: 'error',
      title: 'Unauthorized',
      text: 'Please log in as admin to register students.',
      confirmButtonColor: '#d33',
    });
    return null;
  }
  const [capturedImage, setCapturedImage] = useState(null);
  const [student, setStudent] = useState({
    name: "",
    email: "",
    studentId: "",
    branch: "",
    year: "",
    image: null,
  });

  const [useWebcam, setUseWebcam] = useState(false);
  const webcamRef = useRef(null);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setStudent({ ...student, image: file });
  };

  const captureImageFromWebcam = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc); // Save for preview
    setUseWebcam(false); // Close webcam preview

    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "webcam_image.jpg", {
          type: "image/jpeg",
        });
        setStudent({ ...student, image: file });
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!student.image) {
      Swal.fire({
        icon: 'warning',
        title: 'No Image',
        text: 'Please upload an image or capture from webcam.',
        confirmButtonColor: '#f0ad4e',
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", student.name);
    formData.append("email", student.email);
    formData.append("roll_number", student.studentId);
    formData.append("course", student.branch);
    formData.append("semester", student.year);
    formData.append("image", student.image);
    formData.append("admin_id", admin.id); // Now it will work!
    console.log("Sending form data:", student, admin);
    try {
      const response = await fetch(
        "http://localhost:5000/api/student/register",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Student registered successfully!',
          confirmButtonColor: '#28a745',
        });
      }  else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: data.message || 'Registration failed!',
          confirmButtonColor: '#d33',
        });
      }
    } catch (error) {
      console.error("Error registering student:", error);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'Something went wrong. Please try again.',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div className="Student-div  d-flex">
      <Sidebar />
      <div className="register-wrapper container-fluid px-3 px-sm-4 px-md-5">
        <div className="register-layout d-flex flex-wrap justify-content-between align-items-center gap-4">
          <div className="right-form card Student-Register-Card p-4 shadow-lg flex-grow-1">
            <form
              className="Student-Register-form text-start"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <div className="mb-1">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={student.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-1">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={student.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-1">
                <label className="form-label">Student ID / Roll Number</label>
                <input
                  type="text"
                  name="studentId"
                  className="form-control"
                  value={student.studentId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-1">
                <label className="form-label">Branch</label>
                <input
                  type="text"
                  name="branch"
                  className="form-control"
                  value={student.branch}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-1">
                <label className="form-label">Year</label>
                <select
                  name="year"
                  className="form-control"
                  value={student.year}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="form-label">Choose Image Option</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="imageOption"
                    id="uploadOption"
                    checked={!useWebcam}
                    onChange={() => setUseWebcam(false)}
                  />
                  <label className="form-check-label" htmlFor="uploadOption">
                    Upload Photo
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="imageOption"
                    id="webcamOption"
                    checked={useWebcam}
                    onChange={() => setUseWebcam(true)}
                  />
                  <label className="form-check-label" htmlFor="webcamOption">
                    Use Webcam
                  </label>
                </div>
              </div>

              {useWebcam ? (
                <div className="mb-3 text-center">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="webCam mb-2 rounded "
                    videoConstraints={{
                      facingMode: "user",
                      width: 320,
                      height: 240,
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-warning mt-2"
                    onClick={captureImageFromWebcam}
                  >
                    Capture Image
                  </button>
                </div>
              ) : (
                <>
                  {capturedImage && (
                    <div className="mb-3 text-center">
                      <p className="text-success">Captured Image:</p>
                      <img
                        src={capturedImage}
                        alt="Captured"
                        className="img-fluid rounded"
                        width="200"
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Upload Photo</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </>
              )}

              <button type="submit" className="btn btn-primary w-100">
                Register Student
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
