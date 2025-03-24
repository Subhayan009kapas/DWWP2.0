import { useState } from 'react';
import './Admin_setPrice.css';

const Admin_setPrice = () => {
  const [prices, setPrices] = useState({
    regularPrice: 0.5,
    penaltyPrice: 2
  });

  const handleChange = (e) => {
    setPrices({
      ...prices,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (field) => {
    // Add API call logic here
    console.log(`Updated ${field}:`, prices[field]);
  };

  return (
    <div className="price-container">
      <h1 className="price-title">Pricing Configuration</h1>
      
      <div className="price-cards-container">
        {/* Regular Price Card */}
        <div className="price-card">
          <div className="card-header">
            <div className="header-content">
              <div className="price-icon">💰</div>
              <h3>Standard Water Rate</h3>
            </div>
            <div className="current-price">
              ₹{prices.regularPrice}/L
            </div>
          </div>
          <p className="card-description">
            Set base price per liter for standard water consumption
          </p>
          <div className="input-group">
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              name="regularPrice"
              value={prices.regularPrice}
              onChange={handleChange}
              className="price-input"
              min="0"
            />
            <span className="input-unit">per liter</span>
          </div>
          <button 
            className="save-btn"
            onClick={() => handleSubmit('regularPrice')}
          >
            Update Standard Rate
          </button>
        </div>

        {/* Penalty Price Card */}
        <div className="price-card">
          <div className="card-header">
            <div className="header-content">
              <div className="price-icon">⚖️</div>
              <h3>Excess Usage Penalty</h3>
            </div>
            <div className="current-price">
              ₹{prices.penaltyPrice}/L
            </div>
          </div>
          <p className="card-description">
            Configure premium rate for consumption beyond allowed limits
          </p>
          <div className="input-group">
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              name="penaltyPrice"
              value={prices.penaltyPrice}
              onChange={handleChange}
              className="price-input"
              min="0"
            />
            <span className="input-unit">per liter</span>
          </div>
          <button 
            className="save-btn danger"
            onClick={() => handleSubmit('penaltyPrice')}
          >
            Apply Penalty Rate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin_setPrice;