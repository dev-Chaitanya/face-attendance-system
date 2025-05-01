import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Swal from "sweetalert2";
import "./Records.css";
import {  useNavigate } from "react-router-dom";
  const Records = () => {
  let [AllStudents, setAllStudents] = useState([]);
  let [SelectedIds, setSelectedIds] = useState([]);
  const navigate=useNavigate;
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    const admin_id = admin?.id;
    if (!admin_id) {
      Swal.fire({
        icon: "warning",
        title: "Unauthorized",
        text: "Please login as admin to access this page.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    fetch("http://localhost:5000/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_id }),
    })
      .then((res) => res.json())
      .then((data) => setAllStudents(data.students))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  //Deleteing Students 
    const handleDeleteSelected = () => {
      if (SelectedIds.length === 0) {
        return Swal.fire("No Students Selected", "Please select at least one student to delete.", "warning");
      }
    
      Swal.fire({
        title: "Are you sure? After Deletaion Student will Removed From Recodr Data Base",
        text: `You are about to delete ${SelectedIds.length} student(s). This action cannot be undone!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete them!",
      }).then((result) => {
        if (result.isConfirmed) {
          Promise.all(
            SelectedIds.map((id) =>
              fetch("http://localhost:5000/api/delete-student", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ student_id: id }),
              }).then((res) => res.json())
            )
          ).then((responses) => {
            const successCount = responses.filter((res) => res.success).length;
            Swal.fire("Deleted!", `${successCount} student(s) have been deleted.`, "success");
      
          });
          // Refresh student and record data after deletion

          setAllStudents((prev) => prev.filter((s) => !SelectedIds.includes(s._id)));
          setSelectedIds([]);
        }
      });

      
    };
    
  

  return (
    <div className="Records container-fluid h-100 border border-danger  flex-column">
      <Sidebar />
      <div className="Recodr-Container ">
      <div className="Attendance-Summary row mb-4 p-3 bg-light border  gy-2">
          <h5>📊 Attendance Summary</h5>
          <div className="col-6 col-md-4">
            <strong>Total Registered Students:</strong> {AllStudents.length}
          </div>
          <div>
            <p>
             ! Note : You Can Delete Studentes On One Click -- Delete Selected Button  
            </p>
          </div>
    
        </div>
        <div>

  <button className="btn btn-outline-danger ms-2"   onClick={handleDeleteSelected}  >
          🗑️ Delete Selected
        </button>
      </div>
      <div className="Record-Table-content table-responsive">
        <table className="table table-bordered table-striped table-hover border-success">
          <thead className="table-dark">
            <tr>
              <th>Select</th>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Branch</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            {AllStudents.map((record, index) => (
              <tr key={index}>
                {/* {console.log("record details ", record)} */}
                <td>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const id = record._id;
                      if (e.target.checked) {
                        setSelectedIds([...SelectedIds, id]);
                      } else {
                        setSelectedIds(SelectedIds.filter((sid) => sid !== id));
                      }
                    }}
                  />
                </td>
                <td>{record.name}</td>
                <td>{record.roll_number}</td>
                <td>{record.course}</td>
                <td>{record.semester}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

    </div>
  );
};

export default Records;