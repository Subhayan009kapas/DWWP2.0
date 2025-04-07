import React, { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { collection, getDocs, doc, getDoc ,updateDoc , onSnapshot   } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { handlePayment } from "../utils/razorpayPayment"; 
import { downloadPDF } from "../utils/downloadPDF"; 
import "./PaymentsDashboard.css";
import Loader from "../Loader/Loader";

const PaymentsDashboard = ({ userId }) => {
  
  const [transactions, setTransactions] = useState([]);
  const [expandedMonths, setExpandedMonths] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async (userEmail) => {
    try {
      setLoading(true);
      const monthlyUsagesRef = collection(db, `users/${userEmail}/monthlyUsages`);
      const monthlyUsagesSnap = await getDocs(monthlyUsagesRef);
      const fetchedTransactions = [];

      for (const monthDoc of monthlyUsagesSnap.docs) {
        const yearMonth = monthDoc.id;
        
        // Fetch payment details
        const paymentDocRef = doc(db, `users/${userEmail}/monthlyUsages/${yearMonth}/payment/payment_details`);
        const paymentSnap = await getDoc(paymentDocRef);

        if (paymentSnap.exists()) {
          const paymentData = paymentSnap.data();
          fetchedTransactions.push({
            id: paymentData.razor_pay_id || "N/A",
            date: paymentData.date || new Date().toISOString(),
            month: yearMonth,
            type: "Regular",
            amount: `₹${paymentData.amount || 0}`,
            status: paymentData.status || "Pending",
          });
        }

        // Fetch addon details
        const addonDocRef = doc(db, `users/${userEmail}/monthlyUsages/${yearMonth}/addon/addon_details`);
        const addonSnap = await getDoc(addonDocRef);

        if (addonSnap.exists()) {
          const addonData = addonSnap.data();
          const transactionsToAdd = (addonData.razor_pay_id || []).map((id, index) => ({
            id: id || "N/A",
            date: (addonData.timeStamp || [])[index] || new Date().toISOString(),
            month: yearMonth,
            type: "Addon",
            amount: `₹${(addonData.amount || [])[index] || 0}`,
            status: "Completed",
          }));
          
          fetchedTransactions.push(...transactionsToAdd);
        }
      }

      // Sort transactions by date descending
      const sortedTransactions = fetchedTransactions.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setTransactions(sortedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTransactions(userId);
    }
  }, [userId, fetchTransactions]);

  const closeDropdown = () => setActiveDropdown(null);

  const viewDetails = (transaction) => {
    console.log(transaction) ; 
    setSelectedTransaction(transaction);
  };

  const filteredTransactions = React.useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const lowerFilterStatus = filterStatus.toLowerCase(); // Normalize filter status
  
    return transactions.filter(transaction => {
      const matchesStatus =
        lowerFilterStatus === "all" || 
        transaction.status.toLowerCase() === lowerFilterStatus ||
        transaction.type.toLowerCase() === lowerFilterStatus; // Check type too
  
      const matchesSearch = Object.values(transaction).some(
        value => String(value).toLowerCase().includes(lowerSearch)
      );
  
      return matchesStatus && matchesSearch;
    });
  }, [transactions, searchTerm, filterStatus]);
  
  // Automatically expand months that contain matching transactions
  useEffect(() => {
    if (searchTerm.trim() === "") return; 
  
    const matchingMonths = {};
    filteredTransactions.forEach(transaction => {
      matchingMonths[transaction.month] = true;
    });
  
    setExpandedMonths(matchingMonths);
  }, [filteredTransactions, searchTerm]); // Runs when search or filtered transactions update
  

  // Memoized grouped transactions
  const groupedTransactions = React.useMemo(() => 
    filteredTransactions.reduce((acc, transaction) => {
      const { month } = transaction;
      acc[month] = acc[month] || [];
      acc[month].push(transaction);
      return acc;
    }, {}), 
  [filteredTransactions]);

  const sortedMonths = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));

  const toggleMonth = (month) => {
    setExpandedMonths(prev => ({ ...prev, [month]: !prev[month] }));
  };

  const toggleDropdown = (transactionId) => {
    setActiveDropdown(prev => (prev === transactionId ? null : transactionId));
  };

  if (loading) {
    <Loader/>
  }

  // Import from your icon library
  const ChevronDown = () => (
    <svg width="25" height="25" viewBox="0 2 24 24" fill="none"> 
      <path d="M6 10L12 16L18 10" stroke="#488AEC" strokeWidth="3" 
            strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  
  return (
    <>
    
    <RechargeCard userId={userId} />
  
    <motion.div
      className="pay-con"
      initial={{ y: "-100vh", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 1, 0.5, 1],
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
    >
      <div className="paymentDashboard-container" onClick={closeDropdown}>
        <div className="paymentDashboard-header">
          <div className="paymentDashboard-header-left">
            <img src="https://i.ibb.co/JFp06q4R/payment-history.png" alt="Payment History" />
            <h2>Transactions History</h2>
          </div>
          <div className="paymentDashboard-search-container">
            <input
              type="text"
              placeholder="Search transactions..."
              className="paymentDashboard-search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="paymentDashboard-filter-btn"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="regular">Regular</option>
              <option value="addon">Addon</option>
            </select>
          </div>
        </div>
        { loading ? (
           <Loader/>
          ) : filteredTransactions.length === 0 ? (
            <div className="no-results">No matching transactions found.</div>
          ) : (
          <table className="paymentDashboard-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Month</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedMonths.map(month => (
                <React.Fragment key={month}>
                  <tr className="month-header" onClick={() => toggleMonth(month)}>
                    <td colSpan="7" className="month-header-content">
                      <span className={`month-chevron ${expandedMonths[month] ? "expanded" : ""}`}>
                        <ChevronDown />
                      </span>
                      {month} ({groupedTransactions[month].length} transactions)
                    </td>
                  </tr>

                  {expandedMonths[month] && groupedTransactions[month].map(transaction => (
                    <tr key={transaction.id}>
                      <td>{transaction.id}</td>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>{transaction.month}</td>
                      <td>{transaction.type}</td>
                      <td>{transaction.amount}</td>
                      <td className={`status-${transaction.status.toLowerCase()}`}>
                        {transaction.status}
                      </td>
                      <td className="action-cell" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(transaction.id);
                          }}
                        >
                          ⋮ 
                        </button>
                        <div className={`dropdown ${activeDropdown === transaction.id ? 'active' : ''}`}>
                          <button onClick={() => viewDetails(transaction)}>
                            View Details
                          </button>
                          <button onClick={() => downloadPDF(transaction  )}>
                            Download Receipt
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Outlet />
    </motion.div>


      
      {selectedTransaction && (
        <TransactionModal 
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </>
  );
  
};


const TransactionModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="transaction-modal-overlay">
      <div className="transaction-modal">
        <div className="transaction-modal-header">
          <h3>Transaction Details</h3>
          <button className="transaction-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        
        <div className="transaction-modal-content">
          <div className="detail-row">
            <span className="detail-label">Transaction ID:</span>
            <span className="detail-value">{transaction.id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date:</span>
            <span className="detail-value">
              {new Date(transaction.date).toLocaleDateString()}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Month:</span>
            <span className="detail-value">{transaction.month}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Type:</span>
            <span className="detail-value">{transaction.type}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Amount:</span>
            <span className="detail-value">{transaction.amount}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <span className={`status-${transaction.status.toLowerCase()}`}>
              {transaction.status}
            </span>
          </div>
        </div>

        <div className="transaction-modal-actions">
          <button 
            className="download-button"
            onClick={() => downloadPDF(transaction)}
          >
            Download Receipt
          </button>
          <button className="transaction-close-modal-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};




  
const RechargeCard = ({ userId }) => {


  const [totalUsage, setTotalUsage] = useState(  parseFloat(sessionStorage.getItem("totalUsage")) || 0);
  const [penaltyPrice, setPenaltyPrice] = useState(  parseFloat(sessionStorage.getItem("penaltyPrice")) || 0);
  const [regularPrice, setRegularPrice] = useState( parseFloat(sessionStorage.getItem("regularPrice")) || 0);
  let [regularLimit, setRegularLimit] = useState( parseFloat(sessionStorage.getItem("regularLimit")) || 0);
  const [penaltyLimit, setPenaltyLimit] = useState( parseFloat(sessionStorage.getItem("penaltyLimit")) || 0); 

  const [limitBYUser,  setLimitByUser] = useState( parseFloat(sessionStorage.getItem("limitBYUser")) || 0); // limit by user 

  const [maxLimit, setMaxLimit] = useState( parseFloat(sessionStorage.getItem("maxLimit")) || 0);

  // States to track if each data point has been fetched
  const [isWaterFlowFetched, setIsWaterFlowFetched] = useState(false);
  const [isPriceFetched, setIsPriceFetched] = useState(false);
  const [isLimitFetched, setIsLimitFetched] = useState(false);

  const [loading, setLoading] = useState(true); // Loading state
  // price and usages section 
  
    useEffect(() => {
      if (!userId) return; 
    
          // Get the current year and month dynamically
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, "0"); // Ensure two-digit format
          const yearMonth = `${year}-${month}`; // Format: "YYYY-MM"
      
          // Firestore document path: /users/{userId}/monthlyUsages/{YYYY-MM}
          const usageDocRef = doc(db, "users", userId, "monthlyUsages", yearMonth);
      
          // Fetch water usage for the month
          const fetchWaterUsage = async () => {
            try {
              const docSnap = await getDoc(usageDocRef);
              if (docSnap.exists()) {
                const data = docSnap.data();
      
                // Sum all values from the document (each field is a date with a number)
                const total = Object.entries(data)
                .filter(([key]) => key.startsWith(yearMonth)) // Only include keys with "YYYY-MM"
                .reduce((sum, [, usage]) => sum + (usage || 0), 0);
              
                const userLimit = Object.entries(data)
                .find(([key]) => key === "limit"); // Find the key-value pair directly
              
              const limitValue = userLimit ? Number(userLimit[1]) : 0; // Convert to number, default to 0
              // console.log(limitValue);
              
              setLimitByUser(limitValue);
              sessionStorage.setItem("limitBYUser", limitValue);
  
                setTotalUsage(total);
                sessionStorage.setItem("totalUsage", total);
              }
              setIsWaterFlowFetched(true);
            } catch (error) {
              console.error("Error fetching water usage:", error);
            }
          };
      
          fetchWaterUsage();
        }, [userId]);
    
  
    useEffect(() => {
      if (!userId) return;
      // Listener for waterflowSensor
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, "0"); // Ensure two-digit format
          const yearMonth = `${year}-${month}`; // Format: "YYYY-MM"
        const unsubscribeWaterFlow = onSnapshot(
        doc(db, "users", userId, "monthlyUsages", yearMonth) , 
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            // console.log("Realtime Firestore data:", data);
  
            // Sum all field values (assuming they are numbers)
            const total = Object.entries(data)
            .filter(([key]) => key.startsWith(yearMonth)) // Only include keys with "YYYY-MM"
            .reduce((sum, [, usage]) => sum + (usage || 0), 0);
  
            const userLimit = Object.entries(data)
            .find(([key]) => key === "limit"); // Find the key-value pair directly
            
            const limitValue = userLimit ? Number(userLimit[1]) : 0; // Convert to number, default to 0
            
            setLimitByUser(limitValue);
            sessionStorage.setItem("limitBYUser", limitValue);
            
            setTotalUsage(total);
            sessionStorage.setItem("totalUsage", total);
  
          } else {
            console.log("No water usage data for this month.");
            setTotalUsage(0);
          }
          setIsWaterFlowFetched(true);
        },
        (error) => {
          console.error("Error fetching water usage:", error);
          setIsWaterFlowFetched(true);
        }
      );
  
      // Listener for price
      const unsubscribePrice = onSnapshot(
        doc(db, "admin", "price"),
        (priceDocSnap) => {
          if (priceDocSnap.exists()) {
            const data = priceDocSnap.data();
            setPenaltyPrice(data.penaltyPrice || 0);
            setRegularPrice(data.regularPrice || 0);
            setIsPriceFetched(true);
            sessionStorage.setItem("penaltyPrice", data.penaltyPrice);
            sessionStorage.setItem("regularPrice", data.regularPrice);
            // console.log("Prices fetched: 😒😒", data);
          } else {
            console.log("No such price document!");
            setIsPriceFetched(true); // Even if document doesn't exist, consider it fetched
          }
        },
        (error) => {
          console.error("Error fetching price document: ", error);
          setIsPriceFetched(true); // Prevent indefinite loading on error
        }
      );
  
      // Listener for limit
      const unsubscribeLimit = onSnapshot(
        doc(db, "admin", "limit"),
        (limitDocSnap) => {
          if (limitDocSnap.exists()) {
            const data = limitDocSnap.data();
            setPenaltyLimit(data.penalty || 0);
            setRegularLimit(data.regular || 100);
            setMaxLimit(data.max) ; 
  
            sessionStorage.setItem("regularLimit", data.regular);
            sessionStorage.setItem("penaltyLimit", data.penalty);
            sessionStorage.setItem("maxLimit", data.max);
  
  
            setIsLimitFetched(true);
            // console.log("Limits fetched: ", data);
          } else {
            console.log("No such limit document!");
            setIsLimitFetched(true); // Even if document doesn't exist, consider it fetched
          }
        },
        (error) => {
          console.error("Error fetching limit document: ", error);
          setIsLimitFetched(true); // Prevent indefinite loading on error
        }
      );
  
      return () => {
        unsubscribeWaterFlow();
        unsubscribePrice();
        unsubscribeLimit();
      };
    }, [userId]);
  
    useEffect(() => {
      if (isWaterFlowFetched && isPriceFetched && isLimitFetched) {
        setLoading(false);
      }
    }, [isWaterFlowFetched, isPriceFetched, isLimitFetched]);
  
    regularLimit = limitBYUser ; 
    const regularUsage = Math.min(totalUsage, regularLimit);
    const penaltyUsage =
      totalUsage > regularLimit ? totalUsage - regularLimit : 0;
  
    const regularPriceTotal = regularUsage * regularPrice;
    const penaltyPriceTotal = penaltyUsage * penaltyPrice;
    
  
    const totalPrice = (regularPriceTotal + penaltyPriceTotal).toFixed(0);
  




  // rechagre section 

  const [rechargeDetails, setRechargeDetails] = useState({
    amount: 0,
    usage: 0 ,
    status: '...',
    dueDate: '',
    isLoading: true
  });

  useEffect(() => {
    const fetchCurrentRecharge = async () => {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const yearMonth = `${year}-${month}`;

        const docRef = doc(db, `users/${userId}/monthlyUsages/${yearMonth}/payment/payment_details`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const dueDate = new Date(now.getFullYear(), now.getMonth() + 1, 5); // 5th of next month
          
          setRechargeDetails({
            amount: totalPrice,
            usage: totalUsage.toFixed(2),
            status: data.status,
            dueDate: dueDate.toLocaleDateString(),
            isLoading: false
          });
        } else {
          // Handle missing document
          const dueDate = new Date(now.getFullYear(), now.getMonth() + 1, 5);
          setRechargeDetails({
            amount: 0,
            usage: 0, 
            status: 'pending', // Default to Pending
            dueDate: dueDate.toLocaleDateString(),
            isLoading: false
          });
        }
      } catch (error) {
        console.error("Error fetching recharge details:", error);
        setRechargeDetails(prev => ({...prev, isLoading: false}));
      }
    };

    if (userId) fetchCurrentRecharge();
  }, [userId]);
  // console.log('Recharge Details:', rechargeDetails);
  


  const handleRechargePayment = async () => {
    // Implement payment logic here
    console.log("Initiating recharge payment...");
    try {
      console.log(rechargeDetails.amount);
      
      const paymentId = await handlePayment(userId, rechargeDetails.amount, 1, 0, "recharge");
      if (paymentId) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const yearMonth = `${year}-${month}`;
  
        // Reference to Firestore document
        const docRef = doc(db, `users/${userId}/monthlyUsages/${yearMonth}/payment/payment_details`);
  
        // Update Firestore document
        await updateDoc(docRef, {
          amount: rechargeDetails.amount,
          forMonth: yearMonth,
          razor_pay_id: paymentId,
          status: "Completed",
          timeStamp: now.toISOString(), // Store timestamp of payment
        });
  
        // Update local state
        setRechargeDetails(prev => ({
          ...prev,
          status: "Completed",
        }));
  
        console.log("Payment success! Firestore updated.");
      }
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };



  if (rechargeDetails.isLoading) return <div className="loading-recharge">Checking for pending Rechage...</div>;

  return (
    <div className="recharge-card">
      <div className="rc-header">
        <h3>Current Recharge</h3>
        <span className="rc-status">
          <span className={`status-dot ${rechargeDetails.status.toLowerCase()}`}></span>
          {rechargeDetails.status}
        </span>
      </div>
      
      <div className="rc-details">
        <div className="rc-amount">
          <span className="rc-label">Amount:</span>
          <span className="rc-value">₹{rechargeDetails.amount}</span>
        </div>
        <div className="rc-usage">
          <span className="rc-label">Usages:</span>
          <span className="rc-value">{rechargeDetails.usage}</span>
        </div>
        
        <div className="rc-due-date">
          <span className="rc-label">Due Date:</span>
          <span className="rc-value">{rechargeDetails.dueDate}</span>
        </div>
      </div>

      {rechargeDetails.status === 'pending' && (
        <button 
          className="rc-pay-button"
          onClick={handleRechargePayment}
        >
          Pay Now
        </button>
      )}
    </div>
  );
};

export default PaymentsDashboard;