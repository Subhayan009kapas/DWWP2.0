import React, { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";


import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

import { db } from "../firebaseConfig"; // Adjust the path as necessary
import { doc, onSnapshot, getDoc } from "firebase/firestore"; // Import onSnapshot

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WaterUsageGraph = ({ userId }) => {
  // let [limitBYUser,  setLimitByUser] = useState(0); // limit by user
  const [todayUsage, setTodayUsage] = useState(0);
  // const [totalUsage, setTotalUsage] = useState(0);
  let [data, setData] = useState([]);
  const [isWaterFlowFetched, setIsWaterFlowFetched] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  useEffect(() => {
    if (!userId) return;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Ensure two-digit format
    const day = String(now.getDate()).padStart(2, "0");
    const yearMonth = `${year}-${month}`; // Format: "YYYY-MM"
    let today = `${year}-${month}-${day}`; // Format: "YYYY-MM"

    const usageDocRef = doc(db, "users", userId, "monthlyUsages", yearMonth);

    const unsubscribe = onSnapshot(
      usageDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          today = today.toString();
          setTodayUsage(data[today] || 0);

          let dataEnrty = Object.entries(data).filter(([key]) =>
            key.startsWith(yearMonth)
          );
          dataEnrty.sort((a, b) => new Date(a[0]) - new Date(b[0]));

          setData(dataEnrty);
        }
        setIsWaterFlowFetched(true);
      },
      (error) => {
        console.error("Error fetching water usage:", error);
      }
    );

    // Cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, [userId]);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const months = data.map(([date]) => date);
  const usageData = data.map(([_, value]) => value);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Water Usage (Liters)",
        data: usageData,
        fill: false,
        borderColor: "skyblue",
        backgroundColor: "white",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        padding: "50px",
        backgroundColor: "",
      }}
    >
      <div
        style={{
          backgroundColor: "",
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(194, 190, 190, 0.1)",
          width: "800px",
          position: "relative",
          left: "5vw",
        }}
      >
        <div
          style={{
            backgroundColor: "rgb(6, 10, 43)",
            padding: "20px",
            borderRadius: "10px",
            background:
              "linear-gradient(to top right, rgb(7 16 45), rgb(58 60 84))",
          }}
        >
          <Line
            data={chartData}
            options={chartOptions}
            height={450}
            width={700}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            color: "darkblue",
          }}
        >
          <button
            onClick={handleToggle}
            style={{
              backgroundColor: "black",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "16px",
              borderRadius: "10px",
              color: "#40c4ff",
              marginTop: "5px",
              padding: "8px",
              marginRight: "1vw",
            }}
          >
            {isCollapsed ? <FaChevronDown /> : <FaChevronUp />} Current Month:{" "}
            {todayUsage || 0} Liters
          </button>
          <AnimatePresence>
  {!isCollapsed && (
    <motion.ul
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      style={{
        listStyle: "none",
        padding: "10px",
        margin: 0,
        width: "190px",
        backgroundColor: "black",
        border: "0.5px solid rgba(221, 221, 221, 0.2)",
        borderRadius: "5px",
        color: "rgba(64, 196, 255, 0.6)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
      }}
    >
      {data.map(([month, value]) => (
        <motion.li
          key={month}
          style={{
            margin: "5px 0",
            padding: "5px 10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {month}: {value} Liters
        </motion.li>
      ))}
    </motion.ul>
  )}
</AnimatePresence>

        </div>
      </div>
    </div>
  );
};

export default WaterUsageGraph;
