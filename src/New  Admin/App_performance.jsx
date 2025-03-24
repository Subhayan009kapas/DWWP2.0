import React, { useState } from "react";
import "./App_performance.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { IoAnalyticsSharp } from "react-icons/io5";
import { NavLink } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const serverData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Server Response Time (ms)",
      data: [400, 300, 200, 250, 220, 260],
      borderColor: "#8884d8",
      backgroundColor: "rgba(8, 6, 56, 0.2)",
      fill: true,
    },
  ],
};

const clientData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Client-side Load Time (ms)",
      data: [250, 1000, 500, 450, 480, 400],
      borderColor: "#82ca9d",
      backgroundColor: "rgba(17, 226, 98, 0.2)",
      fill: true,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: { beginAtZero: true },
  },
};

const AppPerformance = () => {
  const [activeTab, setActiveTab] = useState("App Performance");

  return (
    <div className="App_performance-container">
      <h1 className="App_performance-title">Application Performence <IoAnalyticsSharp /></h1>
      <br></br>
      <div className="App_performance-tabs">
        <NavLink to="/newadmin/admin_Dashboard">
          <button
            className={`App_performance-tab ${
              activeTab === "User Stats" ? "active" : ""
            }`}
            onClick={() => setActiveTab("User Stats")}
          >
            User Stats
          </button>
        </NavLink>

        <NavLink to="/newadmin/app_performence">
          <button
            className={`App_performance-tab ${
              activeTab === "App Performance" ? "active" : ""
            }`}
            onClick={() => setActiveTab("App Performance")}
          >
            App Performence
          </button>
        </NavLink>
       <NavLink to="/newadmin/Admin_see_UserFeedback">
       <button
          className={`App_performance-tab ${
            activeTab === "User Feedback" ? "active" : ""
          }`}
          onClick={() => setActiveTab("User Feedback")}
        >
          User Feedback
        </button>
       </NavLink>
       
      </div>

      <div className="App_performance-cards">
        <div className="App_performance-card">
          <h2>Server Response Time</h2>

          <p>Average: 250ms</p>
          <br></br>

          <div
            style={{
              background:
                "linear-gradient(to top right, rgb(7 16 45), rgb(58 60 84))",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            <Line data={serverData} options={options} />
          </div>
        </div>

        <div className="App_performance-card">
          <h2>Client-side Performance</h2>
          <p>Average Load Time: 1.2s</p>
          <br></br>

          <div
            style={{
              background:
                "linear-gradient(to top right, rgb(7 16 45), rgb(58 60 84))",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <Line data={clientData} options={options} />
          </div>
        </div>

        <div className="App_performance-card">
          <h2>Error Rate</h2>
          <p>Last 30 days</p>

          <h3 style={{ fontSize: "2rem" }}>0.12%</h3>
          <p style={{ fontSize: "14px" }}>-0.05% from last month</p>
        </div>
      </div>
    </div>
  );
};

export default AppPerformance;
