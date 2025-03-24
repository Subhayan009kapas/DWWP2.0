import React from "react";
import { motion } from "framer-motion";
import "./Servo_Control.css";
import ToggleSwitch from "./ToggleSwitch";

const Servo_Control = ({userId}) => {
  return (
    <motion.div 
      className="gate-con"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="servo-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
       
        transition={{ duration: 0.3 }}
      >
        <motion.span 
          className="servo-small-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          Water Supply Control
        </motion.span>
        <div className="fixed-amount">
          <ToggleSwitch userId={userId} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Servo_Control;