import React, { useState } from "react";
import "./New_AdminDashboard.css";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { MdDashboardCustomize } from "react-icons/md";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
import { NavLink, Outlet } from "react-router-dom";
const New_AdminDashboard = () => {
   const [activeTab, setActiveTab] = useState("User Stats");
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "User Growth",
        data: [800, 1100, 1300, 1600, 1900, 2200],
        backgroundColor: "#77B1D4",
      },
    ],
  };

  return (
    <div className="admin-dashboard-whole-container">
       <div className="admin-dashboard-container">
      <h2 className="admin-dashboard-title">Admin Dashboard <MdDashboardCustomize /></h2>
      <div className="admin-dashboard-tabs">
        
        <button className={`admin-dashboard-tab ${
            activeTab === "User Stats" ? "active" : ""
          }`}
          onClick={() => setActiveTab("User Stats")} >
          User Stats
          </button>
       
        
        <NavLink to="/newadmin/app_performance">
        <button className="admin-dashboard-tab">
          App Performance
          </button>
          </NavLink>
        

       
          <NavLink to="/newadmin/Admin_see_UserFeedback">
          <button className={`admin-dashboard-tab ${
            activeTab === "User Feedback" ? "active" : ""
          }`}
          onClick={() => setActiveTab("User Feedback")}>User Feedback
          </button>
          </NavLink>
        
          
      </div>
      <div className="admin-dashboard-stats-cards">
        <div className="admin-dashboard-card">
          <h4>Total Users</h4>
          <h3>12,345</h3>
          <p>+20% from last month</p>
        </div>
        <div className="admin-dashboard-card">
          <h4>Active Users</h4>
          <h3>8,765</h3>
          <p>+15% from last month</p>
        </div>
        <div className="admin-dashboard-card">
          <h4>New Sign-ups</h4>
          <h3>1,234</h3>
          <p>+10% from last month</p>
        </div>
        <div className="admin-dashboard-card">
          <h4>User Retention</h4>
          <h3>85%</h3>
          <p>+5% from last month</p>
        </div>
      </div>
      <div className="admin-dashboard-chart-container" >
        <h3>User Growth</h3>
        <br></br>
        <div style={{ background:"linear-gradient(to top right, rgb(7 16 45), rgb(58 60 84))", padding: "25px", borderRadius: "10px" }}>
      <Bar data={data}  />
    </div>
      </div>
    </div>
    </div>
   
  );
};

export default New_AdminDashboard;
