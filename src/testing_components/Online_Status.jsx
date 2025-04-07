// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { db } from "/src/firebaseConfig.js";  
// import { doc, onSnapshot } from "firebase/firestore";
// import { FaEye } from "react-icons/fa";
// import "./Online_Status.css";
// import { useNavigate } from "react-router-dom";

// const Online_Status = ({ userId }) => {
//   const [lastSeen, setLastSeen] = useState(null);
//   const [status, setStatus] = useState("Loading...");
//   const [days, setDays] = useState(0);
//   const navigate = useNavigate();

//   const gotoChangePassword = () => {
//     navigate("/test/user_settings");
//   };

//   useEffect(() => {
//     if (!userId) return;

//     const userDocRef = doc(db, "users", userId);

//     const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
//       if (docSnap.exists()) {
//         const lastSeenData = docSnap.data().lastSeen;
//         console.log(lastSeenData);

       
//         const seconds = Math.floor(lastSeenData /(1000 * 60 * 60 * 24));
//         setLastSeen(seconds);
        
//         console.log(seconds);
//       } else {
//         setLastSeen(null);
//       }
//     });

//     return () => unsubscribe();
//   }, [userId]);

//   useEffect(() => {
//     if (!lastSeen) return;

//     const updateStatus = () => {
//       const now = Date.now();
//       const diffMinutes = Math.floor((now - lastSeen) / (1000 * 60));
//       const diffDays = Math.floor(diffMinutes / (60 * 24));
//       setDays(diffDays);

//       if (diffMinutes < 1) {
//         setStatus("🟢 Online");
//       } else if (diffMinutes < 60) {
//         setStatus(`🟡 Last seen ${diffMinutes} min ago`);
//       } else if (diffMinutes < 1440) {
//         setStatus(`🟡 Last seen ${Math.floor(diffMinutes / 60)} hrs ago`);
//       } else {
//         setStatus(`🔴 Last seen ${diffDays} days ago`);
//       }
//     };

//     updateStatus();
//     const interval = setInterval(updateStatus, 5000);

//     return () => clearInterval(interval);
//   }, [lastSeen]);

//   return (
//     <>
//       <motion.div 
//         className="e-card playing"
//         initial={{ opacity: 0, scale: 0.8 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//         whileHover={{ scale: 1.05 }}
//       >
//         <div className="image"></div>
//         <div className="wave"></div>
//         <div className="wave"></div>
//         <div className="wave"></div>

//         <motion.div 
//           className="infotop"
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.6 }}
//         >
//           <img 
//             src={status === "🟢 Online" ? "https://i.ibb.co/hFkbrrpB/wifi-new-white.png" : "https://i.ibb.co/7dhm8pkm/wifi-disconnected.png"} 
//             alt="WiFi Status"
//           />
//           <br />
//           {status === "🟢 Online" ? '🟢 Online' : 'Offline'}
//           <br />
//           <div className="name">
//             {status === "🟢 Online" ? "All data is up to date" : status}
//           </div>

//           <h3 className="see_password" onClick={gotoChangePassword}>
//             <FaEye /> Check Password
//           </h3>
//         </motion.div>
//       </motion.div>
//       <br />
//     </>
//   );
// };

// export default Online_Status;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "/src/firebaseConfig.js";  
import { doc, onSnapshot } from "firebase/firestore";
import { MdOutlineWifiPassword } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import "./Online_Status.css";
import { useNavigate } from "react-router-dom";

const Online_Status = ({ userId }) => {
  const [lastSeen, setLastSeen] = useState(null);
  const [status, setStatus] = useState("Loading...");
  const [days, setDays] = useState(0);
  const navigate= useNavigate();
  const gotoChangePassword=()=>{
    navigate("/user/user_settings")

  }

  useEffect(() => {
    if (!userId) return;
    
    const userDocRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const timestamp = docSnap.data().lastSeen; 
        setLastSeen(timestamp);
      } else {
        setLastSeen(null);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (!lastSeen) return;

    const updateStatus = () => {
      const now = Date.now();
      const diffSeconds = Math.floor((now - lastSeen) / 1000); // Convert to seconds
      const diffMinutes = Math.floor((now - lastSeen) / (1000 * 60));
      const diffDays = Math.floor(diffMinutes / (60 * 24));
      setDays(diffDays);

      if (diffSeconds < 15) {
        setStatus("🟢 Online");
      } else if (diffSeconds < 60) {
        setStatus(`🟡 Last seen ${diffSeconds} sec ago`);
      } else if (diffSeconds < 3600) {
        setStatus(`🟡 Last seen ${Math.floor(diffSeconds / 60)} min ago`);
      } else if (diffSeconds < 86400) {
        setStatus(`🟡 Last seen ${Math.floor(diffSeconds / 3600)} hrs ago`);
      } else {
        setStatus(`🔴 Last seen ${Math.floor(diffSeconds / 86400)} days ago`);
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000);

    return () => clearInterval(interval);
  }, [lastSeen]);

  return (
    <>
    <motion.div 
      className="e-card playing"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="image"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>

      <motion.div 
        className="infotop"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <img 
          src={status === "🟢 Online" ? "https://i.ibb.co/hFkbrrpB/wifi-new-white.png"  : "https://i.ibb.co/7dhm8pkm/wifi-disconnected.png"} 
          alt="" 
        />
        <br />
        {status === "🟢 Online" ? '🟢 online' : 'offline'}
        <br />
        <div className="name">{status === "🟢 Online" ? "Device Synced" : status}</div>
        
        {/* <h3 className="see_password" onClick={gotoChangePassword}><FaEye  /> Check Password</h3> */}
      </motion.div>
      
      
    </motion.div>
    <br></br>
    

    
    </>
    
  );
};

export default Online_Status;
