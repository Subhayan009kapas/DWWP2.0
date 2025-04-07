import { useState } from 'react';
import './Admin_View_user.css';

const Admin_View_user = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      aadhar: '1234 5678 9012',
      phone: '+91 98765 43210',
      servoState: 'Active',
      currentUsage: '4500 L',
      dueBill: '₹ 1200',
      usage: [1200, 2800, 4500, 3000, 4200, 3800, 4100, 4300, 4000, 3800, 4200, 4500]
    },
    {
      id: 2,
      name: 'Priya Patel',
      aadhar: '2345 6789 0123',
      phone: '+91 87654 32109',
      servoState: 'Inactive',
      currentUsage: '3800 L',
      dueBill: '₹ 950',
      usage: [1000, 2700, 4200, 3800, 4000, 3500, 3900, 4100, 3800, 3600, 4000, 4200]
    },
    {
      id: 3,
      name: 'Amit Singh',
      aadhar: '3456 7890 1234',
      phone: '+91 76543 21098',
      servoState: 'Active',
      currentUsage: '5100 L',
      dueBill: '₹ 1500',
      usage: [3500, 3200, 4800, 4200, 4500, 4000, 4400, 4600, 4200, 4000, 4500, 4800]
    },
    {
          id: 4,
          name: 'Rohit Singh',
          aadhar: '3456 7890 1234',
          phone: '+91 76543 21098',
          servoState: 'Active',
          currentUsage: '5100 L',
          dueBill: '₹ 1500',
          usage: [3500, 3200, 4800, 4200, 4500, 4000, 4400, 4600, 4200, 4000, 4500, 4800]
        },
        {
          id: 5,
          name: 'Aman Singh',
          aadhar: '3456 7890 1234',
          phone: '+91 76543 21098',
          servoState: 'Active',
          currentUsage: '5100 L',
          dueBill: '₹ 1500',
          usage: [500, 3200, 4800, 4200, 4500, 4000, 4400, 4600, 4200, 4000, 4500, 4800]
        },
  ]);

  return (
    <div className="admin-view-container">
      <h1 className="admin-view-title">User Management Dashboard</h1>
      
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Servo State</th>
              <th>Current Usage</th>
              <th>Due Bill</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="user-row">
                <td>{user.name}</td>
                <td>
                  <span className={`servo-state ${user.servoState.toLowerCase()}`}>
                    {user.servoState}
                  </span>
                </td>
                <td>{user.currentUsage}</td>
                <td>{user.dueBill}</td>
                <td>
                  <button 
                    className="view-details-btn"
                    onClick={() => setSelectedUser(user)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="user-details-modal">
          <div className="modal-content">
            <button 
              className="close-btn"
              onClick={() => setSelectedUser(null)}
            >
              &times;
            </button>
            
            <div className="user-info-section">
              <h2>{selectedUser.name}</h2>
              <div className="info-grid">
                <div className="info-column">
                  <div className="info-item">
                    <span className="info-label">Aadhar Number:</span>
                    <span className="info-value">{selectedUser.aadhar}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone Number:</span>
                    <span className="info-value">{selectedUser.phone}</span>
                  </div>
                </div>
                <div className="info-column">
                  <div className="info-item">
                    <span className="info-label">Servo State:</span>
                    <span className={`info-value ${selectedUser.servoState.toLowerCase()}`}>
                      {selectedUser.servoState}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Due Bill:</span>
                    <span className="info-value">{selectedUser.dueBill}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="usage-section">
              <h3>Monthly Water Usage ({new Date().getFullYear()})</h3>
              <div className="usage-grid">
                {selectedUser.usage.map((amount, index) => (
                  <div key={index} className="usage-item">
                    <span className="month">
                      {new Date(0, index).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="amount-bar" style={{ height: `${amount/100}px` }}></span>
                    <span className="amount">{amount} L</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin_View_user;

