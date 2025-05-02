import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/Styles/Dashboard.css";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [studentsCount, setStudentsCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [presentToday, setPresentToday] = useState(0);
  const [absentToday, setAbsentToday] = useState(0);
  const [branchWiseData, setBranchWiseData] = useState({});
  const [trends, setTrends] = useState({ dates: [], present: [], absent: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    const admin_id = admin?.id;
    if (!admin_id) return;

    // Fetch students
    fetch("http://localhost:5000/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setStudentsCount(data.students.length);
        const branchMap = {};
        data.students.forEach((s) => {
          const b = s.branch;
          branchMap[b] = (branchMap[b] || 0) + 1;
        });
        setBranchWiseData(branchMap);
      });

    // Fetch attendance
    fetch("http://localhost:5000/api/attendance-records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const allRecords = data.records;
          setAttendanceCount(allRecords.length);
          const unique = [...new Set(allRecords.map((r) => r.date))];
          setUniqueDates(unique);

          const today = new Date().toISOString().split("T")[0];
          const todaysRecords = allRecords.filter((r) => r.date === today);
          setPresentToday(
            todaysRecords.filter((r) => r.status === "Present").length
          );
          setAbsentToday(
            todaysRecords.filter((r) => r.status === "Absent").length
          );

          const sortedDates = [...unique].sort().slice(-7);
          const trendPresent = sortedDates.map(
            (d) =>
              allRecords.filter((r) => r.date === d && r.status === "Present")
                .length
          );
          const trendAbsent = sortedDates.map(
            (d) =>
              allRecords.filter((r) => r.date === d && r.status === "Absent")
                .length
          );

          setTrends({
            dates: sortedDates,
            present: trendPresent,
            absent: trendAbsent,
          });
        }
      });
  }, []);

  return (
    <div className="dashboard-page h-100 d-flex">
      <Sidebar />
      <div className="dashboard container-fluid px-4 py-4">
        <h2 className="text-dark text-center mb-4">📊 Dashboard Overview</h2>

        <div className="row g-4">
          {/* Summary Section */}
          <div className="col-lg-7 dash-card">
            <div className="summary-container  rounded shadow p-4">
              <h4 className="mb-4">📌 Summary</h4>
              <div className="row g-3">
                <div className="col-sm-6 col-md-4">
                  <div className="card stat-card bg-primary text-white">
                    <div className="card-body">
                      <h6>Total Students</h6>
                      <h3>{studentsCount}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="card stat-card bg-success text-white">
                    <div className="card-body">
                      <h6>Total Attendance</h6>
                      <h3>{attendanceCount}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="card stat-card bg-warning text-dark">
                    <div className="card-body">
                      <h6>Total Days</h6>
                      <h3>{uniqueDates.length}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="card stat-card bg-info text-white">
                    <div className="card-body">
                      <h6>Present Today</h6>
                      <h3>{presentToday}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-md-4">
                  <div className="card stat-card bg-danger text-white">
                    <div className="card-body">
                      <h6>Absent Today</h6>
                      <h3>{absentToday}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Line Chart */}
          <div className="col-lg-5 dash-card">
            <div className="trends-container  rounded shadow p-4 h-100">
              <h4 className="mb-4">📈 Attendance Trends</h4>
              {trends.dates.length > 0 ? (
                <div style={{ height: "300px" }}>
                  <Line
                    data={{
                      labels: trends.dates,
                      datasets: [
                        {
                          label: "Present",
                          data: trends.present,
                          borderColor: "#4caf50",
                          backgroundColor: "rgba(76, 175, 80, 0.2)",
                          tension: 0.4,
                        },
                        {
                          label: "Absent",
                          data: trends.absent,
                          borderColor: "#f44336",
                          backgroundColor: "rgba(244, 67, 54, 0.2)",
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <p>No data to display</p>
              )}
            </div>
          </div>
        </div>

        {/* Branch-wise Chart */}
        <div className="row mt-4 dash-card">
          <div className="col-lg-6">
            <div className="branch-container  rounded shadow p-4">
              <h4 className="mb-4">🏫 Branch-wise Student Count</h4>
              {Object.keys(branchWiseData).length > 0 ? (
                <div style={{ height: "300px", width: "100%" }}>
                  <Pie
                    data={{
                      labels: Object.keys(branchWiseData),
                      datasets: [
                        {
                          data: Object.values(branchWiseData),
                          backgroundColor: [
                            "#36A2EB",
                            "#FF6384",
                            "#FFCE56",
                            "#4BC0C0",
                            "#9966FF",
                            "#FF9F40",
                          ],
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "right",
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <p>No data to display</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
