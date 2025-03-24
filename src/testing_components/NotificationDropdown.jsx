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

// User Side: Notification Dropdown
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import "./NotificationDropdown.css";

const NotificationDropdown = ({ isOpen, onClose, userEmail }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (userEmail) {
      const fetchNotifications = async () => {
        try {
          const userRef = doc(db, "users", userEmail);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists() && userSnap.data().notification) {
            setNotifications([userSnap.data().notification]);
          }
        } catch (error) {
          console.error("Error fetching notifications: ", error);
        }
      };
      fetchNotifications();
    }
  }, [userEmail]);

  if (!isOpen) return null;

  return (
    <div className="notification-dropdown">
      <h4>Notifications</h4>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div key={index} className="notification-item">
            <span>{notification.icon}</span>
            <p>{notification.message}</p>
            <span>{new Date(notification.timestamp).toLocaleString()}</span>
          </div>
        ))
      ) : (
        <p>No notifications</p>
      )}
    </div>
  );
};

export default NotificationDropdown;

