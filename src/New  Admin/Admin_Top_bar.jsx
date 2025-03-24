import React, { useState, useEffect } from "react";
import "./Admin_Top_bar.css";
import { auth } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import "./Admin_side_notification.css";
import { Bell } from "lucide-react";

import { onAuthStateChanged } from "firebase/auth";
import md5 from "md5";

import Admin_side_notification from "./Admin_side_notification.jsx";

const Admin_Top_bar = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [profileImageurl, setProfileImageurl] = useState("");
  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
    phone: ""
  });
const [user, setUser] = useState("");
  const getGravatarUrl = (userEmail) => {
    const hash = md5(userEmail.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  };

//   const [notificationsEnabled, setNotificationsEnabled] = useState(false);

// const handleNotificationToggle = () => {
//   setNotificationsEnabled((prev) => !prev);
// };


//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         setUserEmail(user.email);
//         try {
//           const userDocRef = doc(db, 'users', user.email);
//           const userDoc = await getDoc(userDocRef);
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             setProfileImageurl(userData.profileImageUrl || "");
//             setUsername(userData.userDetails?.[0] || "User");
//             setUserDetails({
//               name: userData.userDetails?.[0] || "",
//               address: userData.userDetails?.[1] || "",
//               phone: userData.userDetails?.[2] || ""
//             });
//           }
//         } catch (error) {
//           console.error("Error fetching user details:", error);
//         }
//       }
//     });
//     return () => unsubscribe();
//   }, []);

 useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);


  const handleInputChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userDocRef = doc(db, 'users', userEmail);
      await updateDoc(userDocRef, {
        userDetails: [userDetails.name, userDetails.address, userDetails.phone]
      });
      setUsername(userDetails.name);
      setIsProfileModalOpen(false);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  return (
    <div className="top-bar">
      <div className="notificatio-profile">
        <div 
          className="notification-icon" 
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
        >
          <Bell size={20} />
        </div>
        
        <Admin_side_notification 
          isOpen={isNotificationsOpen} 
          onClose={() => setIsNotificationsOpen(false)}
        />
        
        <div className="user-profile" onClick={() => setIsProfileModalOpen(true)}>
          <img
            src={profileImageurl || getGravatarUrl(userEmail)}
            alt="User"
            className="user-icon"
            onError={(e) => { e.target.src = "https://i.ibb.co/93vpqhDS/profile-pic.png"; }}
          />
          <span>{user.email}</span>
        </div>

        {isProfileModalOpen && (
          <div className="modal-overlay">
            <div className="profile-modal">
              <div className="modal-header">
                <h2>Edit Profile</h2>
                <button 
                  className="close-button"
                  onClick={() => setIsProfileModalOpen(false)}
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={userDetails.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={userDetails.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number:</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userDetails.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setIsProfileModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>

  //   <div className="top-bar">
  //   <div className="notificatio-profile">
  //     {notificationsEnabled && (  // ✅ Conditionally render notification icon
  //       <div 
  //         className="notification-icon" 
  //         onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
  //       >
  //         <Bell size={20} />
  //       </div>
  //     )}
      
  //     {notificationsEnabled && ( // ✅ Conditionally render dropdown
  //       <NotificationDropdown 
  //         isOpen={isNotificationsOpen} 
  //         onClose={() => setIsNotificationsOpen(false)}
  //       />
  //     )}

  //     <div className="user-profile" onClick={() => setIsProfileModalOpen(true)}>
  //       <img
  //         src={profileImageurl || getGravatarUrl(userEmail)}
  //         alt="User"
  //         className="user-icon"
  //         onError={(e) => { e.target.src = "https://i.ibb.co/93vpqhDS/profile-pic.png"; }}
  //       />
  //       <span>{username}</span>
  //     </div>
  //   </div>
  // </div>
    

    
    
 
  );
};

export default Admin_Top_bar;