// import React, { useState, useEffect } from "react";
// import "./ToggleSwitch.css"; // Assuming you will add the CSS separately or inline.
// import { db } from "../firebaseConfig"; // Adjust the path as necessary
// import { doc, getDoc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";

// const ToggleSwitch = ({ userId }) => {
//   console.log("fetch " + userId);
//   const [isChecked, setIsChecked] = useState(true); // Default is checked

//   const [servoState, setServoState] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [totalUsage, setTotalUsage] = useState(0); // Track total water usage
//   const [maxLimit, setMaxLimit] = useState(200); // Assuming default max limit
//   const [penaltyLimit, setPenaltyLimit] = useState(150);
//   const [regularLimit, setRegularLimit] = useState(100);

//   // Define Firestore document references
//   const servoControlDocRef = doc(
//     db,
//     "users",
//     userId,
//     "currentMonth",
//     "servoControl"
//   );

//   const waterFlowDocRef = doc(
//     db,
//     "users",
//     userId,
//     "currentMonth",
//     "waterflowSensor"
//   ); // Reference for water usage
//   const limitDocRef = doc(db, "admin", "limit"); // Assuming limit is stored in admin collection

//   useEffect(() => {
//     // Fetch initial servo state and limits
//     const fetchInitialData = async () => {
//       try {
//         const [servoSnap, limitSnap] = await Promise.all([
//           getDoc(servoControlDocRef),
//           getDoc(limitDocRef),
//         ]);

//         if (servoSnap.exists()) {
//           setServoState(servoSnap.data().servoState);

//           // console.log("Initial servoState:", servoSnap.data().servoState);
//         } else {
//           console.log("No such servoControl document!");
//         }

//         if (limitSnap.exists()) {
//           const data = limitSnap.data();
//           setMaxLimit(data.max || 200);
//           setPenaltyLimit(data.penalty || 150);
//           setRegularLimit(data.regular || 100);
//           // console.log("Limits fetched:", data);
//         } else {
//           console.log("No such limit document!");
//         }
//       } catch (error) {
//         console.error("Error fetching initial data: ", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialData();

//     // Real-time listener for water usage
//     const unsubscribeWaterUsage = onSnapshot(waterFlowDocRef, (docSnap) => {
//       if (docSnap.exists()) {
//         setTotalUsage(docSnap.data().totalusages || 0);
//         // console.log("Water usage updated:", docSnap.data().totalusages || 0);
//       } else {
//         console.log("No such waterflowSensor document!");
//       }
//     });

//     // Real-time listener for servoControl
//     const unsubscribeServoControl = onSnapshot(
//       servoControlDocRef,
//       (docSnap) => {
//         if (docSnap.exists()) {
//           setServoState(docSnap.data().servoState);
//           // console.log("Servo state updated via Firestore:", docSnap.data().servoState);
//         } else {
//           console.log("No such servoControl document!");
//         }
//       }
//     );

//     // Cleanup subscriptions on unmount
//     return () => {
//       unsubscribeWaterUsage();
//       unsubscribeServoControl();
//     };
//   }, [userId, servoControlDocRef, waterFlowDocRef, limitDocRef]);

//   useEffect(() => {
//     // Monitor totalUsage and update servoState if necessary
//     const checkUsageAndUpdateServo = async () => {
//       if (totalUsage >= maxLimit && servoState) {
//         try {
//           await updateDoc(servoControlDocRef, { servoState: false });
//           setServoState(false);
//           // console.log("Max limit exceeded. Servo turned off.");
//         } catch (error) {
//           console.error("Error updating servoControl document: ", error);
//         }
//       }
//     };

//     checkUsageAndUpdateServo();
//   }, [totalUsage, maxLimit, servoState, servoControlDocRef]);

//   const handleToggle = async () => {
//     const newState = !servoState;

//     // Prevent toggling on if usage exceeds max limit
//     if (newState && totalUsage >= maxLimit) {
//       alert("Cannot turn on servo. Max water usage limit exceeded.");
//       return;
//     }

//     try {
//       await updateDoc(servoControlDocRef, { servoState: newState });
//       setServoState(newState);
//       // console.log(`Servo state updated to: ${newState}`);
//     } catch (error) {
//       console.error("Error updating servoControl document: ", error);
//     }
//   };

//   const isUsageExceeded = totalUsage >= maxLimit;

//   const getUsageMessage = () => {
//     if (totalUsage < regularLimit) return "You are in safe usage.";
//     if (totalUsage >= regularLimit && totalUsage < maxLimit)
//       return "You're using more water than regular.";
//     else {
//       return "Sorry, the water supply is cut due to excessive use and will be renewed next month.";
//     }
//   };

//   return (
//     <>
// <p className="usages-title ">
//         Water Supply Status:

//         <strong>
//           {servoState !== null ? (servoState ? <p  style={{color:"#488aec"}}>On</p> : <p style={{color:"red"}}>Off</p>) : "N/A"}
//         </strong>
//       </p>

// <div className="container">

//       <label className="switch">
//         <input
//           type="checkbox"
//           className="togglesw"
//           // React controls the checkbox state
//           onChange={handleToggle} // Handle toggle on change
//           checked={servoState && !isUsageExceeded}
//           disabled={isUsageExceeded}
//           aria-label="Toggle Servo State"
//         />
//         <div className={`indicator left ${isChecked ? "active" : ""}`}></div>
//         <div className={`indicator right ${!isChecked ? "active" : ""}`}></div>
//         <div className={`button ${isChecked ? "active" : ""}`}></div>
//       </label>
//     </div>

//     </>

//   );
// };

// export default ToggleSwitch;
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Adjust the path as necessary
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from "firebase/firestore"; // Import updateDoc for updating fields
import "./ToggleSwitch.css"; // Assuming you will add the CSS separately or inline.

const ToggleSwitch = ({ userId }) => {
  if (!userId) {
    console.error("userId is undefined in ToggleSwitch");
    return null; // Don't render the component if userId is missing
  }

  const [servoState, setServoState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(true); // Default is checked

  const servoControlDocRef = doc(db, "users", userId);

  const handleToggle = async () => {
    const newState = !servoState;

    try {
      await updateDoc(servoControlDocRef, { servoState: newState });
      setServoState(newState);
      // console.log(`Servo state updated to: ${newState}`);
    } catch (error) {
      console.error("Error updating servoControl document: ", error);
    }
  };

  useEffect(() => {
    // Fetch initial servo state and limits
    const fetchInitialData = async () => {
      try {
        const [servoSnap] = await Promise.all([getDoc(servoControlDocRef)]);

        if (servoSnap.exists()) {
          setServoState(servoSnap.data().servoState);
          console.log(servoState);
        } else {
          console.log("No such servoControl document!");
        }
      } catch (error) {
        console.error("Error fetching initial data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Real-time listener for servoControl
    const unsubscribeServoControl = onSnapshot(
      servoControlDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setServoState(docSnap.data().servoState);
          // console.log("Servo state updated via Firestore:", docSnap.data().servoState);
        } else {
          console.log("No such servoControl document!");
        }
      }
    );
    return () => {
      unsubscribeServoControl();
    };
  }, [userId, servoControlDocRef]);
  console.log(userId);

  return (
    <>
    <p className="usages-title ">
        Water Supply Status:

        <strong>
          {servoState !== null ? (servoState ? <p  style={{color:"#488aec"}}>On</p> : <p style={{color:"red"}}>Off</p>) : "N/A"}
        </strong>
      </p>

    <div className="container">
      <label className="switch">
        <input
          type="checkbox"
          className="togglesw"
          checked={!!servoState}
          onChange={handleToggle}
        />
        <div className={`indicator left ${servoState ? "active" : ""}`}></div>
        <div className={`indicator right ${!servoState ? "active" : ""}`}></div>
        <div className={`button ${servoState ? "active" : ""}`}></div>
      </label>
    </div>
    </>
  );
};

export default ToggleSwitch;
