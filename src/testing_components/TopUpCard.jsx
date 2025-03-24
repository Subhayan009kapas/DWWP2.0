import React, { useState } from "react";
import "./TopUpCard.css";

const TopUpCard = ({addon , price  , Refill}) => {
  const [paymentMethod, setPaymentMethod] = useState("Visa");

  const handleTopUp = () => {
    alert(`Recharge successful! Added $${price} for your water balance using ${paymentMethod}.`);
  };

  return (
    <div className="top-up_card">
      <span className="small-text">{addon}</span>
      <span className="title">Refill Your Water {Refill} L</span>

      {/* Fixed Amount Display */}
      <div className="fixed-amount">₹ {price}</div>

      {/* Payment Method Dropdown */}
      <div className="dropdown">
        <label>Select Quentity:</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="1">Pack of 1</option>
          <option value="2">Pack of 2</option>
          <option value="3">Pack of 3</option>
          <option value="4">Pack of 4</option>
        </select>
      </div>

      {/* Top Up Button */}
      <button className="topup-button" onClick={handleTopUp}>
        Recharge Now
      </button>
    </div>
  );
};

export default TopUpCard;
