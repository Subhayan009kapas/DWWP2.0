import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./App.css";

import Testing from "./testing_components/Dashboard.jsx";
import WaterUsageGraph from "./testing_components/Graph.jsx";
import Servo_Control from "./testing_components/Servo_Control.jsx";
import PaymentsDashboard from "./testing_components/PaymentsDashboard.jsx";
import Subscription from "./testing_components/Subscription.jsx";
import Online_Status from "./testing_components/Online_Status.jsx";
import DashboardCard from "./testing_components/DashboardCard.jsx";
import RaiseComplaint from "./testing_components/RaiseComplain.jsx";
import UserSettingsSection from "./testing_components/User_section_settings.jsx";

import Admin_main from "./New  Admin/Admin_main.jsx";
import Admin_View_user from "./New  Admin/Admin_View_user.jsx";
import Admin_Limit_user from "./New  Admin/Admin_Limit_user.jsx";
import Admin_setPrice from "./New  Admin/Admin_setPrice.jsx";
import Admin_Broadcast from "./New  Admin/Admin_Broadcast.jsx";
import NewDWWPAuth from "./New Authentication 2.0/New_dwwp_auth.jsx";
import New_AdminDashboard from "./New  Admin/New_AdminDashboard.jsx";
import AppPerformance from "./New  Admin/App_performance.jsx";
import Admin_see_UserFeedBack from "./New  Admin/Admin_see_UserFeedBack.jsx";
import New_Dwwp2_0_landing from "./New_Dwwp2_0_landing.jsx";
import New_dwwp_auth from "./New Authentication 2.0/New_dwwp_auth.jsx";

function App() {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email); // Set user email if logged in
      } else {
        setEmail(null); // No user logged in
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  console.log("main :"+email); // Debugging: Check if email is being fetched

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<New_Dwwp2_0_landing />} />

        {/* DWP 2.0 User */}
        <Route path="test" element={<Testing />}>
          {email ? (
            <>
            {console.log(email)}
              <Route
                path="gateControl"
                element={<Servo_Control userId={email} />}
              />
              <Route
                path="graph"
                element={<WaterUsageGraph userId={email} />}
              />
              <Route
                path="pay"
                element={<PaymentsDashboard userId={email} />}
              />
              <Route path="topup" element={<Subscription userId={email} />} />
              <Route
                path="onlineStatus"
                element={
                  <Online_Status userId={email} status="offline" days={14} />
                }
              />
              <Route
                path="dashboard"
                element={<DashboardCard userId={email} />}
              />
              <Route
                path="complain"
                element={<RaiseComplaint userId={email} />}
              />
              <Route
                path="user_settings"
                element={<UserSettingsSection userId={email} />}
              />
            </>
          ) : (
            <Route path="*" element={<New_dwwp_auth />} />
          )}
        </Route>

        {/* DWP 2.0 Admin */}
        <Route path="newadmin" element={<Admin_main />}>
          <Route path="admin_view_user" element={<Admin_View_user />} />
          <Route path="admin_limit_user" element={<Admin_Limit_user />} />
          <Route path="admin_setPrice" element={<Admin_setPrice />} />
          <Route path="admin_Broadcast" element={<Admin_Broadcast />} />
          <Route path="admin_Dashboard" element={<New_AdminDashboard />} />
          <Route path="app_performance" element={<AppPerformance />} />
          <Route
            path="Admin_see_UserFeedback"
            element={<Admin_see_UserFeedBack />}
          />
        </Route>

        {/* Authentication */}
        <Route path="newAuth" element={<NewDWWPAuth />} />

        {/* Extra Landing Route */}
        <Route path="land" element={<New_Dwwp2_0_landing />} />
      </Routes>
    </Router>
  );
}


export default App;
