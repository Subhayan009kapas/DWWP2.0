// fetchUsers.js
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig';

// Helper function to fetch usage data from currentMonth collection
const fetchMonthUsage = async (userEmail) => {
  try {
    const monthRef = collection(db, "users", userEmail, "currentMonth");
    const monthDocs = await getDocs(monthRef);
    
    let totalUsage = 0;
    let servoState = false;
    let paidStatus = false;
    
    for (const doc of monthDocs.docs) {
      if (doc.id === "waterflowSensor") {
        const docData = doc.data();
        totalUsage = docData.totalusages || docData.totalUsages || docData.total_usages || docData.usage || 0;
      } else if (doc.id === "servoControl") {
        servoState = doc.data().servoState || false;
      } else if (doc.id === "paidStatus") {
        paidStatus = doc.data().paid || false;
      }
    }
    
    return { totalUsage, servoState, paidStatus };
  } catch (error) {
    console.error(`Error fetching currentMonth for ${userEmail}:`, error);
    return { totalUsage: 0, servoState: false, paidStatus: false };
  }
};

export const fetchAllUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const userDocs = await getDocs(usersRef);

    const users = [];

    for (const userDoc of userDocs.docs) {
      const userEmail = userDoc.id;
      const userData = userDoc.data();

      // Fetch only current month data
      const currentMonthData = await fetchMonthUsage(userEmail);
      
      const currentServoState = currentMonthData.servoState ? "Active" : "Inactive";
      const currentPaidStatus = currentMonthData.paidStatus ? "Paid" : "Unpaid";
      
      // Get current month name
      const now = new Date();
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];
      const currentMonthName = monthNames[now.getMonth()];

      // Get userDetails object
      const userDetails = userData.userDetails || {};
      
      users.push({
        id: userEmail,
        name: userDetails.fullName || "Unknown",
        emailId: userDetails.emailId || userEmail,
        phone: userDetails.mobileNo || "N/A",
        accountNumber: userDetails.accountNumber || "N/A",
        consumerNumber: userDetails.consumerNumber || "N/A",
        meterNumber: userDetails.meterNumber || "N/A",
        address: userDetails.address || "N/A",
        supplyZone: userDetails.supplyZone || "N/A",
        wifi_ssid: userDetails.wifi_ssid || "N/A",
        wifi_pass: userDetails.wifi_pass || "N/A",
        servoState: currentServoState,
        currentUsage: currentMonthData.totalUsage,
        currentUsageFormatted: `${currentMonthData.totalUsage.toFixed(2)} L`,
        dueBill: currentPaidStatus === "Paid" ? "₹ 0" : "₹ 1200",
        currentMonthName: currentMonthName,
        currentYear: now.getFullYear(),
        userDetails: userDetails, // Store full userDetails object
      });
    }

    return users;
  } catch (err) {
    console.error("Error loading users:", err);
    return [];
  }
};
