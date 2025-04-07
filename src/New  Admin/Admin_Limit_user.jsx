




import { useState, useEffect } from 'react';
import './Admin_Limit_user.css';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Admin_Limit_user = () => {
  // ... existing state declarations ...

  const [maxLimit, setMaxLimit] = useState('');
  const [penaltyLimit, setPenaltyLimit] = useState('');
  const [regularLimit, setRegularLimit] = useState('');
  const [loading, setLoading] = useState(true);
  const limitDocRef = doc(db, 'admin', 'limit');

  useEffect(() => {
        const fetchLimits = async () => {
          try {
            const docSnap = await getDoc(limitDocRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              setMaxLimit(data.max || '');
              setPenaltyLimit(data.penalty || '');
              setRegularLimit(data.regular || '');
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            console.error("Error fetching document: ", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchLimits();
      }, []);
  


  const handleSubmit = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    // Check if user is authenticated
    if (!user) {
      alert('You must be logged in to update limits.');
      return;
    }

    // Convert input values to numbers
    const max = parseFloat(maxLimit);
    const penalty = parseFloat(penaltyLimit);
    const regular = parseFloat(regularLimit);

    // Validate inputs
    if (isNaN(max) || isNaN(penalty) || isNaN(regular)) {
      alert('Please enter valid numbers in all fields.');
      return;
    }

    try {
      await setDoc(limitDocRef, { max, penalty, regular });
      alert('Limits updated successfully');
    } catch (error) {
      console.error("Error updating document: ", error);
      alert(`Failed to update limits: ${error.message}`);
    }
  };

   return (
    <div className="limit-container">
      <h1 className="limit-title">Water Usage Configuration</h1>

      <div className="limit-cards-container">
        {/* Regular Monthly Limit */}
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
              step="0.01"
              value={regularLimit}
              onChange={(e) => setRegularLimit(e.target.value)}
              required
              className="limit-input"
            />
          </div>
          <button className="save-btn" onClick={handleSubmit}>
            Set Daily Threshold
          </button>
        </div>

        {/* Penalty Limit */}
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
              step="0.01"
              value={penaltyLimit}
              onChange={(e) => setPenaltyLimit(e.target.value)}
              required
              className="limit-input"
            />
            <span className="input-unit">Liters</span>
          </div>
          <button className="save-btn" onClick={handleSubmit}>
            Apply Penalty Rate
          </button>
        </div>

        {/* Monthly Max Limit */}
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
              step="0.01"
              value={maxLimit}
              onChange={(e) => setMaxLimit(e.target.value)}
              required
              className="limit-input"
            />
            <span className="input-unit">Liters</span>
          </div>
          <button className="save-btn" onClick={handleSubmit}>
            Update Monthly Limit
          </button>
        </div>
      </div>
    </div>
   )
};

export default Admin_Limit_user;

