import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/Styles/ManageAttandance.css";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const videoConstraints = {
  width: 400,
  facingMode: "user",
};

const ManageAttendance = () => {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("user");
  const [loading, setLoading] = useState(false);
  const [cameraKey, setCameraKey] = useState(0);

  const captureImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setLoading(true);

    try {
      const storedAdmin = localStorage.getItem("admin");
      const admin = storedAdmin ? JSON.parse(storedAdmin) : null;

      if (!admin || !admin.id) {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Not Logged In',
          text: 'Admin not logged in. Please log in again.',
          confirmButtonColor: '#d33',
        });
        return;
      }

      const blob = await (await fetch(imageSrc)).blob();
      const formData = new FormData();
      formData.append("image", blob, "capture.jpg");
      formData.append("admin_id", admin.id);

      const response = await fetch("http://localhost:5000/api/mark-attendance", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      Swal.fire({
        icon: result.success ? 'success' : 'info',
        title: result.success ? 'Attendance Marked' : 'Notice',
        text: result.message || "No response from server.",
        confirmButtonColor: result.success ? '#28a745' : '#3085d6',
      });

    } catch (error) {
      console.error("Error marking attendance:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong while marking attendance.',
        confirmButtonColor: '#d33',
      });
    }

    setLoading(false);
  };

  const handleCameraSwitch = (e) => {
    setFacingMode(e.target.value);
    setCameraKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="manage-attandance d-flex flex-column flex-md-row bg-light vh-100 ">
      <Sidebar />
      <div className="container-fluid mt-5 pt-4 px-3 px-md-5 text-center">
        <h2 className="mb-4 text-dark">📷 Manage Attendance (Face Recognition)</h2>

        {/* Camera Selector */}
        <div className="mb-3">
          <label className="form-label me-2">Select Camera:</label>
          <select
            value={facingMode}
            onChange={handleCameraSwitch}
            className="form-select d-inline w-50 w-md-auto"
          >
            <option value="user">Front Camera</option>
            <option value="environment">Back Camera</option>
          </select>
        </div>

        <div className="d-flex justify-content-center">
          <div className="webcam-wrapper" style={{ maxWidth: "100%" }}>
            <Webcam
              key={cameraKey}
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="img-fluid border border-dark rounded"
              videoConstraints={{ ...videoConstraints, facingMode }}
              style={{ width: "100%", maxWidth: 400 }}
            />
          </div>
        </div>

        <div className="mt-3">
          <button onClick={captureImage} className="btn btn-success">
            {loading ? "Marking Attendance..." : "Capture & Mark Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageAttendance;
