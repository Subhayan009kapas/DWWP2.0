import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { BsBellFill } from "react-icons/bs";
import { MdSignalWifi1BarLock } from "react-icons/md";
import './User_section_settings.css';

const UserSettingsSection = ({ user, onNotificationToggle }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('********');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch current password from Firebase on mount
  useEffect(() => {
    const fetchPassword = async () => {
      // Add your Firebase fetch logic here
      const storedPassword = await fetchFirebasePassword();
      setCurrentPassword(storedPassword);
    };
    fetchPassword();
  }, []);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle password update
  const handlePasswordUpdate = async () => {
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    setIsUpdating(true);
    try {
      await updateFirebasePassword(newPassword);
      alert('Password updated successfully!');
      setCurrentPassword(newPassword);
      setNewPassword('');
    } catch (error) {
      alert('Error updating password: ' + error.message);
    }
    setIsUpdating(false);
  };

  // Handle notification toggle
  const handleNotificationToggle = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    onNotificationToggle(newState);
  };

  // Demo Firebase functions (replace with actual implementations)
  const fetchFirebasePassword = async () => {
    return 'currentStoredPassword'; // Replace with real Firebase fetch
  };

  const updateFirebasePassword = async (password) => {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <motion.div 
      className="settings-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Account Security Section */}
      <motion.div 
        className="settings-card"
        whileHover={{ scale: 1.02 }}
      >
        <h2><MdSignalWifi1BarLock /> Account Security</h2>
        <div className="input-group">
          <label>Current Password :</label>
          <div className="password-input" style={{marginLeft:"20px"}}>
            <input
              type="text"
              value={showPassword ? currentPassword : '********'}
              readOnly
            />
            <button 
              className="eye-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <div className="input-group">
          <label style={{marginLeft:"10px"}}>New Password :</label>
          <div className="password-input" style={{marginLeft:"35px"}}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <br></br>
         
          
        </div>
        <div>
          <button 
            className="update-btn"
            onClick={handlePasswordUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Password'}
          </button>

          </div>
      </motion.div>

     
    </motion.div>
  );
};

export default UserSettingsSection;