import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Include Bootstrap JS with Popper
import "sweetalert2/dist/sweetalert2.min.css";

// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard"; // Corrected the file path
import StudentRegister from "./pages/StudentRegister";
import AttendanceRecords from "./pages/AttendanceRecords";
import ManageAttendance from "./pages/ManageAttendance";
import Records from "./pages/Records";
import "./App.css";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App vh-100">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} />     */}
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register-student" element={<StudentRegister />} />
        <Route path="/attendance-records" element={<AttendanceRecords />} />
        <Route path="/manage-attendance" element={<ManageAttendance />} />
        <Route path="/Records" element={<Records />} />
      </Routes>
    </div>
  );
}

export default App;
