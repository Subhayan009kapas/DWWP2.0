import { useState } from "react";
import { auth } from "../firebaseConfig"; // Import Firebase auth
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // If using React Router
import {
  Home,
  Users,
  Briefcase,
  Calendar,
  FileText,
  BarChart2,
  Settings,
  Bell,
  Touchpad,
  IndianRupee,
  ToggleRight,
  ChartNoAxesCombined,
  Album,
  Globe,
  MessageSquareWarning,
} from "lucide-react";
import { CiSettings } from "react-icons/ci";
import "./Dashboard.css";
import { MdOutlineLogout } from "react-icons/md";
import ToggleSwitch from "./ToggleSwitch";
import Servo_Control from "./Servo_Control";
import Online_Status from "./Online_Status";
import Graph from "./Graph";
import { NavLink, Outlet } from "react-router-dom";
import TopBar from "./TopBar";

const Sidebar = () => {
  
  const navigate = useNavigate(); // Navigate after logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
      navigate("/newauth"); // Redirect user to login page after logout
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };
  return (
    <div className="sidebar">
      <div className="logo"><img src="https://i.ibb.co/WN7SLxy9/Domestic-removebg-preview.png"/></div>
      <nav>
        <ul>
          <NavLink
            to="/test/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
            style={{ textDecoration: "none" }}
          >
            <li>
              <Home size={20} /> <span>Dashboard</span>
            </li>
          </NavLink>

          <NavLink
            to="/test/gatecontrol"
            className={({ isActive }) => (isActive ? "active" : "")}
            style={{ textDecoration: "none" }}
          >
            <li>
              <ToggleRight size={20} /> <span>Gate Control</span>
            </li>
          </NavLink>

          <NavLink
            to="/test/graph"
            className={({ isActive }) => (isActive ? "active" : "")}
            style={{ textDecoration: "none" }}
          >
            <li>
              <ChartNoAxesCombined size={20} /> <span>Analytics</span>
            </li>
          </NavLink>

          <NavLink
            to="/test/pay"
            className={({ isActive }) => (isActive ? "active" : "")}
            style={{ textDecoration: "none" }}
          >
            <li>
              <IndianRupee size={20} /> <span>Payment</span>
            </li>
          </NavLink>

          <NavLink
            to="/test/topup"
            className={({ isActive }) => (isActive ? "active" : "")}
            style={{ textDecoration: "none" }}
          >
            <li>
              <Album size={20} /> <span>Subscription</span>
            </li>
          </NavLink>

          <NavLink
            to="/test/onlineStatus"
            className={({ isActive }) => (isActive ? "active" : "")}
            style={{ textDecoration: "none" }}
          >
            <li>
              <Globe size={20} /> <span>Device Status</span>
            </li>
          </NavLink>

          <NavLink
            to="/test/complain"
            className={({ isActive }) => (isActive ? "active" : "")}
            style={{ textDecoration: "none" }}
          >
            <li>
              <MessageSquareWarning size={20} /> <span>Raise Complaint</span>
            </li>
          </NavLink>
          <NavLink
            to="/test/user_settings"
            className={({ isActive }) => (isActive ? "active" : "")}
            style={{ textDecoration: "none" }}
          >
            <li>
              <CiSettings size={25} /> <span>Settings</span>
            </li>
          </NavLink>
        </ul>
      </nav>

      <div className="settings"  onClick={handleLogout}>
        < MdOutlineLogout size={20} /> <span>Logout</span>
      </div>
    </div>
  );
};


const Testing = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  return (
    <>
    
      <div className="dashboard-container">
        
        <Sidebar />
        
        <div className="main-content">
        <TopBar  notificationsEnabled={notificationsEnabled}/>
          <Outlet context={{ setNotificationsEnabled }}/>
        </div>
      </div>
    </>
  );
};
export default Testing;
