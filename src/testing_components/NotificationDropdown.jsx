// import React, { useEffect } from "react";
// import "./NotificationDropdown.css";
// import { IoMdInformationCircle } from "react-icons/io";
// const NotificationDropdown = ({ isOpen, onClose }) => {
//   const notifications = [
//           {
//                     id: 1,
//                     icon: "💦",
//                     message: "Your order has been shipped.",
//                     time: "2 hours ago",
//                   },
//                   {
//                     id: 2,
//                     icon: "fas fa-exclamation-triangle",
//                     message: "Your subscription is expiring soon.",
//                     time: "1 day ago",
//                   },
//                   {
//                     id: 3,
//                     icon: "fas fa-check-circle",
//                     message: "Your payment was successful.",
//                     time: "3 days ago",
//                   },
//     // Add more notifications as needed
//   ];

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (isOpen && !e.target.closest(".notification-dropdown") && !e.target.closest(".notification-icon")) {
//         onClose();
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   return (
//     <div className="notification-dropdown">
//       <div className="notification-header">
//         <h4>Notifications</h4>
//         <button className="mark-all-read">Mark all as read</button>
//       </div>
//       <div className="notification-list">
//         {notifications.map((notification) => (
//           <div key={notification.id} className="notification-item">
//             <div className="notification-icon">
//               <i className={notification.icon} />
//             </div>
//             <div className="notification-content">
//               <p>{notification.message}</p>
//               <span className="notification-time">{notification.time}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default NotificationDropdown;

import React, { useEffect, useState } from "react";
import "./NotificationDropdown.css";
import { db } from "../firebaseConfig"; // Adjust path as needed
import { doc, getDoc } from "firebase/firestore";

const NotificationDropdown = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const docRef = doc(db, "admin", "broadcast");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const msgArray = docSnap.data().msg || [];
          // Sort messages by timestamp (latest first)
          const sorted = msgArray.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
          setNotifications(sorted);
        } else {
          console.log("No broadcast document found.");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest(".notification-dropdown") && !e.target.closest(".notification-icon")) {
        onClose();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h4>Notifications</h4>
        <button className="mark-all-read">Mark all as read</button>
      </div>
      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index} className="notification-item">
              <div className="notification-icon">
                <span>{notification.icon || "🔔"}</span>
              </div>
              <div className="notification-content">
                <p>{notification.message || "No message"}</p>
                <span className="notification-time">
                  {notification.timestamp?.seconds
                    ? new Date(notification.timestamp.seconds * 1000).toLocaleString()
                    : "Just now"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-notifications">No notifications</div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
