import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';  // Adjust the path as necessary
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './Admin_setPrice.css';

const Admin_setPrice = () => {


  const [penaltyPrice, setPenaltyPrice] = useState('');
  const [regularPrice, setRegularPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const priceDocRef = doc(db, 'admin', 'price');

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const docSnap = await getDoc(priceDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPenaltyPrice(data.penaltyPrice || '');
          setRegularPrice(data.regularPrice || '');
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const handleSubmit = async (field) => {
    try {
      await setDoc(priceDocRef, {
        penaltyPrice: parseFloat(penaltyPrice),
        regularPrice: parseFloat(regularPrice),
      });
      alert(`${field === 'penaltyPrice' ? 'Penalty' : 'Standard'} Price updated successfully`);
    } catch (error) {
      console.error("Error updating document: ", error);
      alert('Failed to update prices');
    }
  };
  


  // const [prices, setPrices] = useState({
  //   regularPrice: 0.5,
  //   penaltyPrice: 2
  // });

  // const handleChange = (e) => {
  //   setPrices({
  //     ...prices,
  //     [e.target.name]: e.target.value
  //   });
  // };

  // const handleSubmit = (field) => {
  //   // Add API call logic here
  //   console.log(`Updated ${field}:`, prices[field]);
  // };

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
              ₹{regularPrice}/L
            </div>
          </div>
          <p className="card-description">
            Set base price per liter for standard water consumption
          </p>
          <div className="input-group">
            <span className="currency-symbol">₹</span>
            <input
                 type="number"
                 step="0.01"
                 value={regularPrice}
                 onChange={(e) => setRegularPrice(e.target.value)}
                 required
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
              ₹{penaltyPrice}/L
            </div>
          </div>
          <p className="card-description">
            Configure premium rate for consumption beyond allowed limits
          </p>
          <div className="input-group">
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              step="0.01"
              value={penaltyPrice}
              onChange={(e) => setPenaltyPrice(e.target.value)}
              required
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