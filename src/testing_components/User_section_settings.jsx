import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';  // Adjust the path as necessary
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';  // Import updateDoc for updating fields
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdSignalWifi1BarLock } from "react-icons/md";
import './User_section_settings.css';
import Online_Status from './Online_Status';

const UserSettingsSection = ({ userId }) => {
  if (!userId) {
    console.error("userId is undefined in ToggleSwitch");
    return null; // Don't render the component if userId is missing
  }
  const [showPassword, setShowPassword] = useState(false);
  const [ssid, setSsid] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWiFiCredentials = async () => {
      try {
        const ssidPassDocRef = doc(db, 'users', userId);
        const docSnap = await getDoc(ssidPassDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSsid(data.wifi_ssid || '');
          setPass(data.wifi_pass || '');
        } else {
          console.warn("No such document!");
        }
      } catch (error) {
        console.error("Error fetching WiFi credentials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWiFiCredentials();
  }, [userId]);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  if (loading) return <p>Loading...</p>;
  return (
    <motion.div 
      className="settings-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="device_and_pass">
        <Online_Status userId={userId}/>
        <motion.div 
          className="settings-card"
          whileHover={{ scale: 1.02 }}
        >
          <h2><MdSignalWifi1BarLock /> Device SSID & Password</h2>

          <div className="input-group">
            <label>User ID:</label>
            <div className="password-input" style={{ marginLeft: "20px" }}>
              <input
                type="text"
                value={ssid}
                readOnly
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password:</label>
            <div className="password-input" style={{ marginLeft: "20px" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={pass}
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
           <p className='instruction'>Please Use this SSID & Password to connect Device</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserSettingsSection;