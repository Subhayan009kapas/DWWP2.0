import { useState, useEffect } from 'react';
import './Admin_View_user.css';
import { fetchAllUsers } from './fetchUsers';

const Admin_View_user = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch users from Firebase
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      const data = await fetchAllUsers();
      setUsers(data);
      setLoading(false);
    };
    loadUsers();
  }, []);

  return (
    <div className="admin-view-container">
      <h1 className="admin-view-title">User Management Dashboard</h1>

      {/* Loader */}
      {loading ? (
        <div className="loading-text">Loading users...</div>
      ) : (
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
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user.id} className="user-row">
                    <td>{user.name}</td>
                    <td>
                      <span className={`servo-state ${user.servoState.toLowerCase()}`}>
                        {user.servoState}
                      </span>
                    </td>
                    <td>{user.currentUsageFormatted}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                    No users found in Firestore.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="user-details-modal">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setSelectedUser(null)}
            >
              &times;
            </button>

            {/* Compact Header */}
            <div className="user-header-compact">
              <div className="user-avatar-small">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="header-info">
                <h2>{selectedUser.name}</h2>
                <p className="user-email">{selectedUser.emailId}</p>
              </div>
            </div>

            {/* Main Content Grid - 2 Columns */}
            <div className="main-content-grid">
              {/* Left Column */}
              <div className="content-column">
                {/* Personal Info */}
                <div className="compact-section">
                  <h3 className="compact-section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                    Personal Info
                  </h3>
                  <div className="compact-info-card">
                    <div className="compact-info-row">
                      <span className="compact-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        Mobile
                      </span>
                      <span className="compact-value">{selectedUser.phone}</span>
                    </div>
                    <div className="compact-info-row">
                      <span className="compact-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Email
                      </span>
                      <span className="compact-value">{selectedUser.emailId}</span>
                    </div>
                    <div className="compact-info-row">
                      <span className="compact-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        Address
                      </span>
                      <span className="compact-value address-compact">{selectedUser.address}</span>
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div className="compact-section">
                  <h3 className="compact-section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    Account Details
                  </h3>
                  <div className="compact-info-card">
                    <div className="compact-info-row">
                      <span className="compact-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                        Account No.
                      </span>
                      <span className="compact-value">{selectedUser.accountNumber}</span>
                    </div>
                    <div className="compact-info-row">
                      <span className="compact-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        Consumer No.
                      </span>
                      <span className="compact-value">{selectedUser.consumerNumber}</span>
                    </div>
                    <div className="compact-info-row">
                      <span className="compact-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Meter No.
                      </span>
                      <span className="compact-value">{selectedUser.meterNumber}</span>
                    </div>
                    <div className="compact-info-row">
                      <span className="compact-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        </svg>
                        Supply Zone
                      </span>
                      <span className="compact-value">{selectedUser.supplyZone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="content-column">
                {/* System Status Section */}
                <div className="compact-section">
                  <h3 className="compact-section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    System Status
                  </h3>
                  <div className="status-card-professional">
                    <div className="status-item-professional">
                      <div className={`status-icon-wrapper ${selectedUser.servoState.toLowerCase() === 'active' ? 'servo-active-icon' : 'servo-inactive-icon'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3"></circle>
                          <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m8.24 4.24l-4.24-4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m8.24-4.24l-4.24 4.24"></path>
                        </svg>
                      </div>
                      <div className="status-content">
                        <span className="status-label-professional">Servo State</span>
                        <span className={`status-value-professional ${selectedUser.servoState.toLowerCase()}`}>
                          {selectedUser.servoState}
                        </span>
                      </div>
                    </div>
                    <div className="status-divider"></div>
                    <div className="status-item-professional">
                      <div className="status-icon-wrapper bill-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="1" x2="12" y2="23"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                      </div>
                      <div className="status-content">
                        <span className="status-label-professional">Due Bill</span>
                        <span className="status-value-professional bill-value">
                          {selectedUser.dueBill}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage Section */}
                <div className="compact-section">
                  <h3 className="compact-section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2.69l-5.66 5.66a8 8 0 1 0 11.32 0L12 2.69z"/>
                    </svg>
                    Usage - {selectedUser.currentMonthName} {selectedUser.currentYear}
                  </h3>
                  <div className="usage-compact-card">
                    <div className="usage-value-compact">
                      {selectedUser.currentUsageFormatted || '0.00 L'}
                    </div>
                    <div className="usage-progress-compact">
                      <div 
                        className="usage-bar-compact"
                        style={{ 
                          width: `${Math.min((selectedUser.currentUsage || 0) / 5000 * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin_View_user;
