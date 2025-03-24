// import { useState } from 'react';
// import './Admin_Broadcast.css';
// import { db } from "../firebaseConfig";
// import { doc, getDoc } from "firebase/firestore";

// const Admin_Broadcast = () => {
//   const [selectedPurpose, setSelectedPurpose] = useState('');
//   const [customMessage, setCustomMessage] = useState('');
//   const [selectedIcon, setSelectedIcon] = useState('📢');

//   const predefinedMessages = [
//     { purpose: 'Payment Reminder', message: 'Friendly reminder: Your water bill payment is due in 3 days.', icon: '💳' },
//     { purpose: 'Usage Alert', message: 'Alert: Your water consumption has exceeded 80% of the monthly limit.', icon: '🚨' },
//     { purpose: 'Maintenance Notice', message: 'Scheduled maintenance on 25th March 10PM-2AM.', icon: '🔧' },
//     { purpose: 'Service Update', message: 'New feature: Track real-time water usage in your dashboard.', icon: '🆕' }
//   ];

//   const handlePurposeChange = (e) => {
//     const purpose = e.target.value;
//     setSelectedPurpose(purpose);
//     const selected = predefinedMessages.find(msg => msg.purpose === purpose);
//     if (selected) {
//       setCustomMessage(selected.message);
//       setSelectedIcon(selected.icon);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!selectedPurpose) return;
//     const messageData = {
//       icon: selectedIcon,
//       message: customMessage,
//       timestamp: new Date().toISOString()
//     };

//     try {
//       const usersSnapshot = await getDocs(collection(db, "users"));
//       usersSnapshot.forEach(async (userDoc) => {
//         const userRef = doc(db, "users", userDoc.id);
//         await updateDoc(userRef, {
//           notification: messageData
//         });
//       });
//       alert('Message sent successfully!');
//     } catch (error) {
//       console.error("Error sending message: ", error);
//     }

//     setSelectedPurpose('');
//     setCustomMessage('');
//     setSelectedIcon('📢');
//   };

//   return (
//     <div className="broadcast-container">
//       <h1 className="broadcast-title">User Notifications</h1>
      
//       <div className="broadcast-card">
//         <div className="form-group">
//           <label>Select Purpose</label>
//           <select
//             className="purpose-select"
//             value={selectedPurpose}
//             onChange={handlePurposeChange}
//           >
//             <option value="">Choose notification purpose</option>
//             {predefinedMessages.map((msg, index) => (
//               <option key={index} value={msg.purpose}>
//                 {msg.icon} {msg.purpose}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Message Content</label>
//           <div className="message-box">
//             <div className="message-header">
//               <span className="message-icon">{selectedIcon}</span>
//               <input
//                 type="text"
//                 className="icon-input"
//                 value={selectedIcon}
//                 onChange={(e) => setSelectedIcon(e.target.value)}
//                 maxLength="2"
//               />
//             </div>
//             <textarea
//               className="message-input"
//               value={customMessage}
//               onChange={(e) => setCustomMessage(e.target.value)}
//               placeholder="Compose your message..."
//               rows="5"
//             />
//           </div>
//         </div>

//         <button
//           className="send-button"
//           onClick={handleSendMessage}
//           disabled={!selectedPurpose}
//         >
//           📤 Send Notification
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Admin_Broadcast;


import { useState } from 'react';
import './Admin_Broadcast.css';
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const Admin_Broadcast = () => {
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📢');

  const predefinedMessages = [
    { purpose: 'Payment Reminder', message: 'Friendly reminder: Your water bill payment is due in 3 days.', icon: '💳' },
    { purpose: 'Usage Alert', message: 'Alert: Your water consumption has exceeded 80% of the monthly limit.', icon: '🚨' },
    { purpose: 'Maintenance Notice', message: 'Scheduled maintenance on 25th March 10PM-2AM.', icon: '🔧' },
    { purpose: 'Service Update', message: 'New feature: Track real-time water usage in your dashboard.', icon: '🆕' }
  ];

  const handlePurposeChange = (e) => {
    const purpose = e.target.value;
    setSelectedPurpose(purpose);
    const selected = predefinedMessages.find(msg => msg.purpose === purpose);
    if (selected) {
      setCustomMessage(selected.message);
      setSelectedIcon(selected.icon);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedPurpose) return;
    
    const messageData = {
      icon: selectedIcon,
      message: customMessage,
      timestamp: new Date().toISOString()
    };

    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      usersSnapshot.forEach(async (userDoc) => {
        const userRef = doc(db, "users", userDoc.id);
        await updateDoc(userRef, {
          notification: messageData
        });
      });
      alert('Message sent successfully!');
    } catch (error) {
      console.error("Error sending message: ", error);
    }

    setSelectedPurpose('');
    setCustomMessage('');
    setSelectedIcon('📢');
  };

  return (
    <div className="broadcast-container">
      <h1 className="broadcast-title">User Notifications</h1>
      
      <div className="broadcast-card">
        <div className="form-group">
          <label>Select Purpose</label>
          <select
            className="purpose-select"
            value={selectedPurpose}
            onChange={handlePurposeChange}
          >
            <option value="">Choose notification purpose</option>
            {predefinedMessages.map((msg, index) => (
              <option key={index} value={msg.purpose}>
                {msg.icon} {msg.purpose}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Message Content</label>
          <div className="message-box">
            <div className="message-header">
              <span className="message-icon">{selectedIcon}</span>
              <input
                type="text"
                className="icon-input"
                value={selectedIcon}
                onChange={(e) => setSelectedIcon(e.target.value)}
                maxLength="2"
              />
            </div>
            <textarea
              className="message-input"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Compose your message..."
              rows="5"
            />
          </div>
        </div>

        <button
          className="send-button"
          onClick={handleSendMessage}
          disabled={!selectedPurpose}
        >
          📤 Send Notification
        </button>
      </div>
    </div>
  );
};

export default Admin_Broadcast;


