import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/Styles/AttandaceRecord.css";
import Swal from "sweetalert2";

const AttendanceRecords = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filters, setFilters] = useState({ name: "", date: "", status: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  const recordsPerPage = 10;

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const [summery, setSummery] = useState({
    totalStudents: null,
    notMarked: [],
    marked: [],
    absent: [],
    present: [],
  });

  async function summeryStatsUpdate(data) {
    let totalStudent = await data.records.length;
    let notMarked = await data.records.filter((rec, index) => {
      if (rec.status === "Not Marked") {
        return rec;
      }
    });

    let marked = await data.records.filter((rec, index) => {
      if (rec.status != "Not Marked") {
        return rec;
      }
    });
    let present = await data.records.filter((rec) => {
      if (rec.status === "Present") {
        return rec;
      }
    });
    let absent = await data.records.filter((rec, index) => {
      if (rec.status === "Absent") {
        return rec;
      }
    });
    setSummery({
      totalStudents: totalStudent,
      notMarked: notMarked,
      marked: marked,
      absent: absent,
      present: present,
    });
  }

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    const admin_id = admin?.id;
    if (!admin_id) return console.error("No admin_id found.");

    fetch("http://localhost:5000/api/attendance-records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRecords(data.records);
          setFilteredRecords(data.records);
          summeryStatsUpdate(data);
        }
      })
      .catch((err) => console.error("Error fetching records:", err));
  }, []);

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

  useEffect(() => {
    if (records.length > 0 && filteredRecords.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Records Found",
        text: "Try adjusting your filters or check if attendance was marked.",
        timer: 2500,
        showConfirmButton: false,
      });
    }
  }, [filteredRecords, records]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  };

  const applyFilters = (recordsToFilter = records) => {
    const filtered = recordsToFilter.filter((record) => {
      const matchesName = record.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const matchesDate = record.date.includes(filters.date);
      const matchesStatus = filters.status
        ? record.status === filters.status
        : true;
      return matchesName && matchesDate && matchesStatus;
    });

    setFilteredRecords(filtered);
    setCurrentPage(1);

    if (recordsToFilter.length > 0 && filtered.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Records Found",
        text: "Try adjusting your filters or check if attendance was marked.",
        timer: 2500,
        showConfirmButton: false,
      });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const exportToCSV = () => {
    if (filteredRecords.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Nothing to Export",
        text: "There are no attendance records matching your filters.",
      });
      return;
    }
    const headers = ["Student Name", "Student ID", "branch", "Date", "Status"];
    const rows = filteredRecords.map((record) => [
      record.name,
      record.id || record.student_id,
      record.course,
      record.date,
      record.status,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchAttendanceRecords = () => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    const admin_id = admin?.id;

    fetch("http://localhost:5000/api/attendance-records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRecords(data.records);
          applyFilters(data.records); // pass records to filter
          summeryStatsUpdate(data.records);
        }
      });
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      return Swal.fire(
        "No Records Selected",
        "Please select at least one attendance record to delete.",
        "warning"
      );
    }

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedIds.length} attendance record(s). This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
    }).then((result) => {
      if (result.isConfirmed) {
        Promise.all(
          selectedIds.map((id) =>
            fetch(`http://localhost:5000/api/delete-attendance-record/${id}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ record_id: id }),
            }).then((res) => res.json())
          )
        ).then((responses) => {
          const successCount = responses.filter((res) => res.success).length;
          Swal.fire(
            "Deleted!",
            `${successCount} record(s) deleted.`,
            "success"
          );
          //update
          fetchAttendanceRecords();
          setSelectedIds([]);
        });
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const displayRecords = filteredRecords.length > 0 ? filteredRecords : records;

  return (
    <div className="attendance-page h-100 d-flex flex-column flex-md-row">
      <Sidebar />
      <div className="container-fluid px-3 py-4">
        <h2
          className="text-center text-white mb-4"
          style={{ fontSize: "1.5rem" }}
        >
          📋 Attendance Records
        </h2>

        {/* Filters */}
        <div className="row g-2 mb-3">
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name"
              name="name"
              value={filters.name}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="col-12 col-md-4">
            <input
              type="date"
              className="form-control"
              name="date"
              value={filters.date}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="col-12 col-md-4">
            <select
              className="form-control"
              name="status"
              value={filters.status}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            >
              <option value="">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>

        {/* Export Button */}
        <div className="mb-3 text-end">
          <button className="btn btn-outline-primary" onClick={exportToCSV}>
            📤 Export to CSV
          </button>
          <button
            className="btn btn-outline-danger ms-2"
            onClick={handleDeleteSelected}
          >
            🗑️ Delete Selected
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              const reset = { name: "", date: "", status: "" };
              setFilters(reset);
              setFilteredRecords(records); // Ensure all records are restored
            }}
          >
            🔄 Reset Filters
          </button>
        </div>

        {/* Summary */}
        <div className="Attendance-Summary row mb-4 p-3 bg-light border rounded gy-2">
          <h5>📊 Attendance Summary</h5>

          <div className="col-6 col-md-4">
            <strong>Total Registered Students: </strong> {summery.totalStudents}
          </div>

          <div className="col-6 col-md-4">
            <strong>Attendance Marked: </strong>
            {summery.marked.length}
          </div>

          <div className="col-6 col-md-4">
            <strong>Not Marked: </strong>
            {summery.notMarked.length}
          </div>
          <div className="col-6 col-md-4">
            <strong>Present: </strong>
            {summery.present.length}
          </div>

          <div className="col-6 col-md-4">
            <strong>Absent: </strong>
            {summery.absent.length}
          </div>

          <div className="col-6 col-md-4">
            <strong>Dates Found:</strong>{" "}
            {[...new Set(displayRecords.map((r) => r.date))].length}
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover border-success">
            <thead className="table-dark">
              <tr>
                <th>Select</th>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Branch</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const id = record.attendance_id;
                        if (e.target.checked) {
                          setSelectedIds([...selectedIds, id]);
                        } else {
                          setSelectedIds(
                            selectedIds.filter((sid) => sid !== id)
                          );
                        }
                      }}
                    />
                  </td>
                  <td>{record.name}</td>
                  <td>{record.id}</td>
                  <td>{record.course}</td>
                  <td>{record.date}</td>

                  <td>
                    <span
                      className={`badge ${
                        record.status === "Present" ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRecords.length > 0 ? null : (
            <p className="w-100 text-center">"No Records Found !"</p>
          )}
        </div>

        {/* Pagination */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-3 gap-2">
          <button
            className="btn btn-outline-light"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            ⬅ Prev
          </button>
          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-outline-light"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRecords;
