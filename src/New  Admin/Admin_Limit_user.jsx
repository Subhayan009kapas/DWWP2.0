import { useState } from 'react';
import './Admin_Limit_user.css';

const Admin_Limit_user = () => {
  const [limits, setLimits] = useState({
    monthlyLimit: 15000,
    dailyLimit: 500,
    penaltyRate: 100
  });

  const handleChange = (e) => {
    setLimits({
      ...limits,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (field) => {
    // Add API call logic here
    console.log(`Updated ${field}:`, limits[field]);
  };

  return (
    <div className="limit-container">
      <h1 className="limit-title">Water Usage Configuration</h1>
      
      <div className="limit-cards-container">
       
        {/* Daily Limit Card */}
        <div className="limit-card">
          <div className="card-header">
            <h3>Regular Monthly Limit</h3>
            <div className="card-icon">⏳</div>
          </div>
          <p className="card-description">
            Define standard daily water allowance for normal operations
          </p>
          <div className="input-group">
            <input
              type="number"
              name="dailyLimit"
              value={limits.dailyLimit}
              onChange={handleChange}
              className="limit-input"
            />
            <span className="input-unit">Liters/Day</span>
          </div>
          <button 
            className="save-btn"
            onClick={() => handleSubmit('dailyLimit')}
          >
            Set Daily Threshold
          </button>
        </div>

        {/* Penalty Card */}
        <div className="limit-card">
          <div className="card-header">
            <h3>Penalty Limit</h3>
            <div className="card-icon">⚠️</div>
          </div>
          <p className="card-description">
            Configure excess usage penalty rate (percentage surcharge)
          </p>
          <div className="input-group">
            <input
              type="number"
              name="penaltyRate"
              value={limits.penaltyRate}
              onChange={handleChange}
              className="limit-input"
            />
            <span className="input-unit">Liters</span>
          </div>
          <button 
            className="save-btn"
            onClick={() => handleSubmit('penaltyRate')}
          >
            Apply Penalty Rate
          </button>
        </div>

         {/* Monthly Limit Card */}
         <div className="limit-card">
          <div className="card-header">
            <h3>Monthly Maximum Limit</h3>
            <div className="card-icon">📅</div>
          </div>
          <p className="card-description">
            Set maximum allowable water consumption per month (in liters)
          </p>
          <div className="input-group">
            <input
              type="number"
              name="monthlyLimit"
              value={limits.monthlyLimit}
              onChange={handleChange}
              className="limit-input"
            />
            <span className="input-unit">Liters</span>
          </div>
          <button 
            className="save-btn"
            onClick={() => handleSubmit('monthlyLimit')}
          >
            Update Monthly Limit
          </button>
        </div>

      </div>
    </div>
  );
};

export default Admin_Limit_user;