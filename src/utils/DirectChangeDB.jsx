// this file is only used for the purpose of changes in database 📊
// 
// ⚠️ IMPORTANT: This utility requires Firestore security rules to allow writes.
// 
// To enable writes, update your Firestore rules in Firebase Console:
// Firebase Console → Firestore Database → Rules
// 
// For development/testing, you can temporarily use:
// match /users/{userId} {
//   allow read, write: if true;
//   match /currentMonth/{document=**} {
//     allow read, write: if true;
//   }
// }
//
// ⚠️ WARNING: Only use permissive rules for development! For production, implement proper authentication-based rules.

import React, { useState } from "react";
import { db } from "../firebaseConfig.js";
import { doc, setDoc } from "firebase/firestore";

const DirectChangeDB = () => {
  const [loading, setLoading] = useState(false);

  const handleAddNewUser = async () => {
    // New user email - this will be used as the document ID
    const userEmail = "newuser@example.com";

    // Check if user wants to proceed
    if (!window.confirm(`Add new user with email: ${userEmail}?`)) {
      return;
    }

    setLoading(true);

    try {
      const userDocRef = doc(db, "users", userEmail);

      // Complete user details object
      const userDetails = {
        fullName: "John Doe",
        mobileNo: "9876543210",
        emailId: userEmail,
        address: "123 Main Street, City, State, 123456",
        accountNumber: "ACC12345",
        consumerNumber: "CON56789",
        meterNumber: "MTR98765",
        supplyZone: "Zone-1",
        wifi_ssid: "JohnDoeWiFi",
        wifi_pass: "password123",
      };

      // Add new user document with all details
      await setDoc(userDocRef, {
        userDetails,
        lastSeen: Date.now(),
        notification: "New user added successfully",
        createdAt: new Date().toISOString(),
      });

      // Initialize currentMonth collection with default data
      // Add default waterflowSensor document
      const waterflowSensorRef = doc(db, "users", userEmail, "currentMonth", "waterflowSensor");
      await setDoc(waterflowSensorRef, {
        totalusages: 0,
        totalUsages: 0,
        usage: 0,
      });

      // Add default servoControl document
      const servoControlRef = doc(db, "users", userEmail, "currentMonth", "servoControl");
      await setDoc(servoControlRef, {
        servoState: false,
      });

      // Add default paidStatus document
      const paidStatusRef = doc(db, "users", userEmail, "currentMonth", "paidStatus");
      await setDoc(paidStatusRef, {
        paid: false,
      });

      alert(`✅ New user "${userDetails.fullName}" added successfully!\nEmail: ${userEmail}`);
      console.log("✅ User added:", { email: userEmail, userDetails });
    } catch (error) {
      console.error("❌ Error adding new user:", error);
      
      // Provide specific guidance for permission errors
      if (error.code === 'permission-denied' || error.message.includes('permissions')) {
        const errorMsg = `❌ Permission Denied!\n\n` +
          `Your Firestore security rules are blocking writes.\n\n` +
          `To fix this, update your Firestore rules in Firebase Console:\n` +
          `1. Go to Firebase Console → Firestore Database → Rules\n` +
          `2. Temporarily allow writes (for development):\n\n` +
          `rules_version = '2';\n` +
          `service cloud.firestore {\n` +
          `  match /databases/{database}/documents {\n` +
          `    match /users/{userId} {\n` +
          `      allow read, write: if true;\n` +
          `      match /currentMonth/{document=**} {\n` +
          `        allow read, write: if true;\n` +
          `      }\n` +
          `    }\n` +
          `  }\n` +
          `}\n\n` +
          `⚠️ WARNING: Only use these rules for development/testing!`;
        
        alert(errorMsg);
        console.error("Security Rules Example:", errorMsg);
      } else {
        alert(`❌ Failed to add new user. Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExistingUser = async () => {
    const userEmail = "abnew@gmail.com"; // Existing user email

    if (!window.confirm(`Update user details for: ${userEmail}?`)) {
      return;
    }

    setLoading(true);

    try {
      const userDocRef = doc(db, "users", userEmail);

      const userDetails = {
        fullName: "Akash Bera",
        mobileNo: "9876543210",
        emailId: "johndoe@example.com",
        address: "312, Rajasthan House, UEM Jaipur, Chomu Rajasthan, 303807",
        accountNumber: "ACC12345",
        consumerNumber: "CON56789",
        meterNumber: "MTR98765",
        supplyZone: "Zone-3",
        wifi_ssid: "AB",
        wifi_pass: "akashbera",
      };

      await setDoc(
        userDocRef,
        {
          userDetails,
          lastSeen: Date.now(),
          notification: "User details updated successfully",
        },
        { merge: true }
      );

      alert(`✅ User details updated successfully for ${userEmail}!`);
    } catch (error) {
      console.error("Error updating user details:", error);
      
      // Provide specific guidance for permission errors
      if (error.code === 'permission-denied' || error.message.includes('permissions')) {
        const errorMsg = `❌ Permission Denied!\n\n` +
          `Your Firestore security rules are blocking writes.\n\n` +
          `Please update your Firestore security rules in Firebase Console to allow writes.`;
        alert(errorMsg);
        console.error("Security Rules Issue:", errorMsg);
      } else {
        alert(`❌ Failed to update user details. Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ color: "#fff", marginBottom: "15px" }}>Database Operations</h3>
      
      <button
        onClick={handleAddNewUser}
        disabled={loading}
        style={{
          marginRight: "10px",
          marginTop: "10px",
          padding: "10px 20px",
          borderRadius: "6px",
          backgroundColor: loading ? "#6c757d" : "#28a745",
          color: "#fff",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "600",
        }}
      >
        {loading ? "Processing..." : "➕ Add New User"}
      </button>

      <button
        onClick={handleUpdateExistingUser}
        disabled={loading}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          borderRadius: "6px",
          backgroundColor: loading ? "#6c757d" : "#007bff",
          color: "#fff",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "600",
        }}
      >
        {loading ? "Processing..." : "🔄 Update Existing User"}
      </button>

      <div style={{ marginTop: "20px", color: "#b0b0b0", fontSize: "0.9rem" }}>
        <p>• Add New User: Creates a complete new user with all details</p>
        <p>• Update User: Updates existing user (abnew@gmail.com)</p>
      </div>
    </div>
  );
};

export default DirectChangeDB;