import React from "react";
import { useState } from "react";
import "./Admin_see_UserFeedBack.css";
import { NavLink } from "react-router-dom";
import { MdOutlineFeedback } from "react-icons/md";
const Admin_see_UserFeedBack = () => {
           const [activeTab, setActiveTab] = useState("User Feedback");
  const feedbacks = [
    {
      name: "Rohit Sharma",
      rating: 5,
      comment: "Love the new dashboard feature! It's so intuitive and helpful.",
      img:"https://t4.ftcdn.net/jpg/02/24/86/95/360_F_224869519_aRaeLneqALfPNBzg0xxMZXghtvBXkfIA.jpg"
    },
    {
      name: "Sourav Ganguly",
      rating: 3,
      comment: "Great app overall, but could use some improvements in loading speed.",
      img:"https://static.vecteezy.com/system/resources/thumbnails/005/885/805/small_2x/handsome-black-man-wearing-suit-in-urban-background-photo.jpg"
    },
    {
      name: "Ms Dhoni",
      rating: 5,
      comment: "The customer support is top-notch. They resolved my issue quickly.",
      img:"https://t4.ftcdn.net/jpg/03/80/58/23/360_F_380582318_5lJ52eVLcePphpM4pMHdew3wgopfhQSc.jpg"
    },
  ];

  return (
    <div className="Admin_see_UserFeedBack-container">
      <h2 className="Admin_see_UserFeedBack-title">User FeedBack <MdOutlineFeedback /></h2>

      {/* Tabs Section */}
      <div className="Admin_see_UserFeedBack-tabs">
      <NavLink to="/newadmin/admin_Dashboard">
        <button
          className={`Admin_see_UserFeedBack-tab ${
            activeTab === "User Stats" ? "active" : ""
          }`}
          onClick={() => setActiveTab("User Stats")}
        >
          User Stats
        </button>
      </NavLink>

      <NavLink to="/newadmin/app_performance">
        <button
          className={`Admin_see_UserFeedBack-tab ${
            activeTab === "App Performance" ? "active" : ""
          }`}
          onClick={() => setActiveTab("App Performance")}
        >
          App Performance
        </button>
      </NavLink>

    

      <button
        className={`Admin_see_UserFeedBack-tab ${
          activeTab === "User Feedback" ? "active" : ""
        }`}
        onClick={() => setActiveTab("User Feedback")}
      >
        User Feedback
      </button>
    </div>


     

      {/* User Satisfaction Card */}
      <div className="Admin_see_UserFeedBack-card">
        <h3>User Satisfaction</h3>
        <p>Overall rating: 4.5/5</p>
        <h1>90%</h1>
        <p>Users who would recommend our app</p>
      </div>

      {/* Recent Feedback */}
      <div className="Admin_see_UserFeedBack-card">
        <h3>Recent Feedback</h3>
        <p>Latest user comments</p>

        {feedbacks.map((feedback, index) => (
          <div key={index} className="Admin_see_UserFeedBack-feedback">
            <div className="Admin_see_UserFeedBack-user">
              <div className="Admin_see_UserFeedBack-avatar"><img src={feedback.img}/></div>
              <div>
                <strong className="Admin_see_UserFeedBack-name">{feedback.name}</strong>
                <div className="Admin_see_UserFeedBack-rating">
                  {"⭐".repeat(feedback.rating)}
                </div>
              </div>
            </div>
            <p className="Admin_see_UserFeedBack-comment">{feedback.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin_see_UserFeedBack;
