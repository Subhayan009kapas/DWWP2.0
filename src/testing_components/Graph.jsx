// import React, { useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const sampleData = {
//   January: 1200,
//   February: 1100,
//   March: 1300,
//   April: 1250,
//   May: 1400,
//   June: 1350,
//   July: 1500,
//   August: 1450,
//   September: 1380,
//   October: 1420,
//   November: 1280,
//   December: 1340,
// };

// const WaterUsageGraph = ({ data = sampleData }) => {
//   const [isCollapsed, setIsCollapsed] = useState(true);
//   const currentMonth = new Date().toLocaleString('default', { month: 'long' });

//   const handleToggle = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   const months = Object.keys(data);
//   const usageData = months.map(month => data[month] || 0);

//   const chartData = {
//     labels: months,
//     datasets: [
//       {
//         label: 'Water Usage (Liters)',
//         data: usageData,
//         fill: false,
//         borderColor: 'skyblue',
//         backgroundColor: 'white',
//         tension: 0.1,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         labels: {
//           color: 'white',
//         },
//       },
//       tooltip: {
//         enabled: true,
//       },
//     },
//     scales: {
//       x: {
//         ticks: {
//           color: 'white',
//         },
//         grid: {
//           color: 'rgba(255, 255, 255, 0.2)',
//         },
//       },
//       y: {
//         ticks: {
//           color: 'white',
//         },
//         grid: {
//           color: 'rgba(255, 255, 255, 0.2)',
//         },
//       },
//     },
//   };

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '50px', backgroundColor: ''  , }}>
//       <div style={{ backgroundColor: '', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(194, 190, 190, 0.1)', width: '800px', position: 'relative' , left:'5vw' , }}>
//         <div style={{ backgroundColor: 'rgb(6, 10, 43)', padding: '20px', borderRadius: '10px' , background:'linear-gradient(to top right, rgb(7 16 45), rgb(58 60 84))' }}>
//           <Line data={chartData} options={chartOptions} height={450} width={700} />
//         </div>
//         <div style={{ position: 'absolute', top: '20px', right: '20px', color: 'darkblue' }}>
//           <button 
//             onClick={handleToggle} 
//             style={{ backgroundColor: 'transparent', color:"white", border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '16px', marginTop:"5px" }}
//           >
//             {isCollapsed ? <FaChevronDown /> : <FaChevronUp />} Current Month: {data[currentMonth] || 0} Liters
//           </button>
//           {!isCollapsed && (
//             <ul style={{ listStyle: 'none', padding: '10px', margin: 0, backgroundColor: 'black', color:"white" , border: '1px solid #ddd', borderRadius: '5px', transition: 'all 0.3s ease' , cursor:"pointer" }}>
//               {months.map(month => (
//                 <li key={month} style={{ margin: '5px 0', padding: '5px' }}  onMouseEnter={(e) => {
//                   e.currentTarget.style.backgroundColor = '#333';
                 
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.backgroundColor = 'black';
//                   e.currentTarget.style.transform = 'scale(1)';
//                 }}>{month}: {data[month]} Liters</li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WaterUsageGraph;  



import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";  // Ensure correct Firebase config path

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WaterUsageGraph = ({ userId }) => {
  const [waterUsage, setWaterUsage] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchWaterUsage(userId);
    }
  }, [userId]);

  // Fetch water usage data from Firestore
  const fetchWaterUsage = async (userId) => {
    try {
      const usageRef = collection(db, `users/${userId}/monthlyUsages`);
      const querySnapshot = await getDocs(usageRef);

      const fetchedData = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const { dailyUsage } = data;
        if (dailyUsage) {
          const totalUsage = Object.values(dailyUsage).reduce((sum, value) => sum + value, 0);
          const monthName = getMonthName(doc.id); // Convert YYYY-MM to month name
          fetchedData[monthName] = totalUsage;
        }
      });

      setWaterUsage(fetchedData);
    } catch (error) {
      console.error("Error fetching water usage:", error);
    }
  };

  // Convert YYYY-MM to Month Name
  const getMonthName = (dateString) => {
    const [year, month] = dateString.split("-");
    return new Date(year, month - 1).toLocaleString("default", { month: "long" });
  };

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const months = Object.keys(waterUsage);
  const usageData = months.map((month) => waterUsage[month] || 0);

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
        ticks: { color: "white" },
        grid: { color: "rgba(255, 255, 255, 0.2)" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255, 255, 255, 0.2)" },
      },
    },
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "50px" }}>
      <div style={{ backgroundColor: "", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 12px rgba(194, 190, 190, 0.1)", width: "800px", position: "relative", left: "5vw" }}>
        <div style={{ backgroundColor: "rgb(6, 10, 43)", padding: "20px", borderRadius: "10px", background: "linear-gradient(to top right, rgb(7 16 45), rgb(58 60 84))" }}>
          <Line data={chartData} options={chartOptions} height={450} width={700} />
        </div>
        <div style={{ position: "absolute", top: "20px", right: "20px", color: "darkblue" }}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ backgroundColor: "transparent", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "16px", marginTop: "5px" }}
          >
            {isCollapsed ? <FaChevronDown /> : <FaChevronUp />} Current Month: {waterUsage[currentMonth] || 0} Liters
          </button>
          {!isCollapsed && (
            <ul style={{ listStyle: "none", padding: "10px", margin: 0, backgroundColor: "black", color: "white", border: "1px solid #ddd", borderRadius: "5px", transition: "all 0.3s ease", cursor: "pointer" }}>
              {months.map((month) => (
                <li
                  key={month}
                  style={{ margin: "5px 0", padding: "5px" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#333")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "black")}
                >
                  {month}: {waterUsage[month]} Liters
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaterUsageGraph;


