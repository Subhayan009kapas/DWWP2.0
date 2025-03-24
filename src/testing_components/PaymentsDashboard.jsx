import React, { useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import "./PaymentsDashboard.css";

const PaymentsDashboard = () => {
  const [transactions] = useState([
    { id: "AR-24612474-53", date: "03/25/24 - 18:45", month: "january", method: "GPay **** 9876", amount: "$234.00", status: "Pending" },
    { id: "AR-24543674-45", date: "03/25/24 - 12:30", month: "january", method: "VISA **** 9876", amount: "$1,784.00", status: "Completed" },
    { id: "AR-24636637-44", date: "03/24/24 - 15:20", month: "january", method: "Mastercard **** 2345", amount: "$24.50", status: "Completed" },
    { id: "AR-24655332-11", date: "03/23/24 - 10:55", month: "january", method: "VISA **** 9876", amount: "$158.00", status: "Completed" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeDropdown, setActiveDropdown] = useState(null);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesStatus = filterStatus === "All" || transaction.status === filterStatus;
    const matchesSearchTerm =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearchTerm;
  });

  const toggleDropdown = (transactionId) => {
    setActiveDropdown((prev) => (prev === transactionId ? null : transactionId));
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  const makePaymeny = (id) => {
    console.log(id);
  };

  return (
    <motion.div
      className="pay-con"
      initial={{ y: "-100vh", opacity: 0 }} // Start off-screen
      animate={{ y: 0, opacity: 1 }} // Animate to visible
      transition={{
        duration: 0.8,
        ease: [0.25, 1, 0.5, 1], // Smooth easing
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
              placeholder="Search"
              className="paymentDashboard-search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="paymentDashboard-filter-btn"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <table className="paymentDashboard-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Month</th>
              <th>Payment Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.date}</td>
                <td>{transaction.month}</td>
                <td>{transaction.method}</td>
                <td>{transaction.amount}</td>
                <td className={`paymentDashboard-${transaction.status.toLowerCase()}`}>
                  {transaction.status}
                </td>

                <td className="paymentDashboard-action-cell" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="paymentDashboard-action-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      toggleDropdown(transaction.id);
                    }}
                  >
                    ⋮
                  </button>

                  <div className={`dropdown-menu ${activeDropdown === transaction.id ? "active" : ""}`}>
                    <label className="dropdown-option">
                      <button className="dropdown-option-button" onClick={() => makePaymeny(transaction.id)}>Pay</button>
                    </label>
                    <label className="dropdown-option">
                      <button className="dropdown-option-button" onClick={() => makePaymeny(transaction.id)}>Download</button>
                    </label>
                    <div className="glider-container">
                      <div className="glider"></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="7" className="paymentDashboard-no-data">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default PaymentsDashboard;
