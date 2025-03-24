import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronCircleRight } from "react-icons/fa";
import { RiSpeedFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import { db } from "../firebaseConfig"; // Adjust the path as necessary
import { doc, onSnapshot } from "firebase/firestore"; // Import onSnapshot
import {
  GiWaterDrop,
  GiMoneyStack,
  GiPayMoney,
  GiWaterTank,
} from "react-icons/gi";
import { MdSpeed } from "react-icons/md";
import { FaIndianRupeeSign } from "react-icons/fa6";
import "./DashboardCard.css";
import Online_Status from "./Online_Status";
import Rechargecard from "./History_dash";
import Recomended_recharge from "./Recomendation_Recharge";

const DashboardCard = ({ userId }) => {
  // const [waterData, setWaterData] = useState({
  //   totalUsage: 0,
  //   regularPrice: 0,
  //   penalty: 0,
  //   totalPrice: 0,
  //   usagePercentage: 0,
  //   safeLimit: 70,
  // });

  const [totalUsage, setTotalUsage] = useState(0);
  const [penaltyPrice, setPenaltyPrice] = useState(0);
  const [regularPrice, setRegularPrice] = useState(0);
  const [regularLimit, setRegularLimit] = useState(100); // Regular limit set to 100 liters
  const [penaltyLimit, setPenaltyLimit] = useState(150); // Penalty limit set to 150 liters

  const [maxLimit, setMaxLimit] = useState(200);

  // States to track if each data point has been fetched
  const [isWaterFlowFetched, setIsWaterFlowFetched] = useState(false);
  const [isPriceFetched, setIsPriceFetched] = useState(false);
  const [isLimitFetched, setIsLimitFetched] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return; // Prevent unnecessary execution
  
    const unsubscribeWaterFlow = onSnapshot(
      doc(db, "users", userId, "currentMonth", "waterflowSensor"),
      (snapshot) => {
        if (snapshot.exists()) {
          setTotalUsage(snapshot.data().totalusages || 0);
        }
        setIsWaterFlowFetched(true);
      }
    );
  
    return () => unsubscribeWaterFlow(); // Cleanup on unmount
  }, [userId]);
  

  useEffect(() => {
    if (!userId) return;
    // Listener for waterflowSensor
    const unsubscribeWaterFlow = onSnapshot(
      doc(db, "users", userId, "currentMonth", "waterflowSensor"),
      (waterFlowDocSnap) => {
        if (waterFlowDocSnap.exists()) {
          setTotalUsage(waterFlowDocSnap.data().totalusages || 0);
          setIsWaterFlowFetched(true);
          console.log(
            "Water usage updated:",
            waterFlowDocSnap.data().totalusages || 0
          );
        } else {
          console.log("No such waterflowSensor document!");
          setIsWaterFlowFetched(true); // Even if document doesn't exist, consider it fetched
        }
      },
      (error) => {
        console.error("Error fetching waterflowSensor document: ", error);
        setIsWaterFlowFetched(true); // Prevent indefinite loading on error
      }
    );

    // Listener for price
    const unsubscribePrice = onSnapshot(
      doc(db, "admin", "price"),
      (priceDocSnap) => {
        if (priceDocSnap.exists()) {
          const data = priceDocSnap.data();
          setPenaltyPrice(data.penaltyPrice || 0);
          setRegularPrice(data.regularPrice || 0);
          setIsPriceFetched(true);
          console.log("Prices fetched:", data);
        } else {
          console.log("No such price document!");
          setIsPriceFetched(true); // Even if document doesn't exist, consider it fetched
        }
      },
      (error) => {
        console.error("Error fetching price document: ", error);
        setIsPriceFetched(true); // Prevent indefinite loading on error
      }
    );

    // Listener for limit
    const unsubscribeLimit = onSnapshot(
      doc(db, "admin", "limit"),
      (limitDocSnap) => {
        if (limitDocSnap.exists()) {
          const data = limitDocSnap.data();
          setPenaltyLimit(data.penalty || 150);
          setRegularLimit(data.regular || 100);
          setIsLimitFetched(true);
          console.log("Limits fetched:", data);
        } else {
          console.log("No such limit document!");
          setIsLimitFetched(true); // Even if document doesn't exist, consider it fetched
        }
      },
      (error) => {
        console.error("Error fetching limit document: ", error);
        setIsLimitFetched(true); // Prevent indefinite loading on error
      }
    );

    // Cleanup the listeners when the component unmounts
    return () => {
      unsubscribeWaterFlow();
      unsubscribePrice();
      unsubscribeLimit();
    };
  }, [userId]);

  // check data is fetched or not ??

  useEffect(() => {
    // Check if all data has been fetched
    if (isWaterFlowFetched && isPriceFetched && isLimitFetched) {
      setLoading(false);
    }
  }, [isWaterFlowFetched, isPriceFetched, isLimitFetched]);

  // Calculate the regular usage and penalty usage
  const regularUsage = Math.min(totalUsage, regularLimit);
  const penaltyUsage =
    totalUsage > regularLimit ? totalUsage - regularLimit : 0;

    const regularPriceTotal = Math.round(regularUsage * regularPrice);
  const penaltyPriceTotal = Math.round(penaltyUsage * penaltyPrice);
  

  const totalPrice = Math.round(regularPriceTotal + penaltyPriceTotal);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // setWaterData({
      //   totalUsage: 8500,
      //   regularPrice: 1200,
      //   penalty: 300,
      //   totalPrice: 1500,
      //   usagePercentage: 85,
      //   safeLimit: 70,
      // });
      // setIsLoading(false);
    };

    fetchData();
  }, []);

  const calculateMarkerPosition = () => {
    const position = Math.min(waterData.usagePercentage, 100);
    return `${position}%`;
  };
  const navigate = useNavigate();
  const goToPayment = () => {
    navigate("/test/pay");
  };
  const goToGate = () => {
    navigate("/test/gatecontrol");
  };
  const goToComplain = () => {
    navigate("/test/complain");
  };




  const isUsageExceeded = totalUsage >= maxLimit;
  
  const greenWidth = Math.min(totalUsage, regularLimit)||50;
  const orangeWidth = Math.min(Math.max(totalUsage - regularLimit, 0), penaltyLimit - regularLimit)||20;
  const redWidth = Math.min(Math.max(totalUsage - penaltyLimit, 0), maxLimit - penaltyLimit);

  const getBarColor = () => {
    if (totalUsage < regularLimit) return '#90EE90'; // Green
    if (totalUsage >= regularLimit && totalUsage < maxLimit) return '#ff9900'; // Orange
    return 'red'; // Red
  };


  return (
    <>
      <div className="dashboardCard_Online-con">
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="dashboard-card-title">User Dashboard</h2>
          </div>

          <div className="metrics-container">
            <div className="" id="total_useage">
              <div className="metric-icon">
                <GiWaterDrop size="1.5em" color="#2196F3" />
              </div>
              <div className="metric-content">
                <span className="metric-label">Total Usage</span>
                <span className="metric-value">
                  
                  {Math.round(totalUsage)} L
                </span>
              </div>
            </div>

            <div className="" id="regular_price">
              <div className="metric-icon">
                <GiMoneyStack size="1.5em" color="#4CAF50" />
              </div>
              <div className="metric-content">
                <span className="metric-label">Regular Price</span>
                <span className="metric-value">
                  {  regularPrice }₹/L
                </span>
              </div>
            </div>

            <div className="" id="new_penalty">
              <div className="metric-icon">
                <GiPayMoney size="1.5em" color="#FF5722" />
              </div>
              <div className="metric-content">
                <span className="metric-label">Penalty</span>
                <span className="metric-value" style={{ color: "#ff5252" }}>
                  { penaltyPriceTotal} ₹/L
                </span>
              </div>
            </div>

            <div className="" id="total_price">
              <div className="metric-icon">
                <FaIndianRupeeSign size="1.2em" color="#9C27B0" />
              </div>
              <div className="metric-content">
                <span className="metric-label">Total Price</span>
                <span className="metric-value" style={{ color: "#4CAF50" }}>
                  ₹ { totalPrice }
                </span>
              </div>
            </div>
          </div>

          <h3>hrejfedv</h3>



          <div className="bar-container">
            {(totalUsage<regularLimit)?(
            <div className="bar">
              <div className="bar-green" style={{ width: `${(greenWidth / regularLimit) * 100}%` }}></div>
            </div>
             ):(
              <div className="bar">
                <div className="bar-green" style={{ width: `${(greenWidth / maxLimit) * 100}%` }}></div>
                <div className="bar-orange" style={{ width: `${(orangeWidth / maxLimit) * 100}%` }}></div>
                <div className="bar-red" style={{ width: `${(redWidth / maxLimit) * 100}%` }}></div>
              </div>
             )} 
          </div>







        
          
          
        </div>

        <div className="network_connnection">
          <Online_Status  userId={userId}/>
          <br></br>
          <div className="box">
            <Rechargecard />
          </div>
        </div>

        <div className="password-change">
          
        </div>
      </div>

      <div className="second-row">
        <div className="com-box">
          <p class="text">Price/Ltr :</p>
          <p class="price-value">₹ {regularPrice}</p>
        </div>
        <div className="com-box">
          <p class="text">Penelty/Ltr :</p>
          <p class="price-value">₹ {penaltyPrice}</p>
        </div>
      </div>

      {/* // third Row */}

      <div className="third_row_whole_con">
        <div className="third_row_left-con">
          <h3 class="recomended-title">
            Recomended For You{" "}
            <FaChevronCircleRight
              style={{ position: "relative", left: "10px" }}
            />{" "}
          </h3>

          <br></br>

          <div className="third_row">
            <div className="third-row-child">
              <Recomended_recharge
                price={20}
                type={"Summar"}
                descrip={
                  " Enjoy this Summar with Our special Summar plan with that will be helpfull for you and Get water easily "
                }
                icon={"⚡"}
              />
              <Recomended_recharge
                price={30}
                type={"Festive"}
                descrip={
                  "Enjoy this Festival with Our special Summar plan with that will be helpfull for you and Get water easily "
                }
                icon={"✨"}
              />
            </div>
          </div>
        </div>
        <div className="third_row_right-con">
          <h3 className="title">
            Quick access{" "}
            <RiSpeedFill color="#40c4ff" style={{ marginLeft: "10px" }} />{" "}
          </h3>
          <div className="quick_access-con">
            <div className="back-glass-effect">
              <div className="quick_access_Payment" onClick={goToPayment}>
                <img src="https://i.ibb.co/MDp1vYXN/bill.png" />
                <div className="head">
                  <p>Dues & payment</p>
                </div>
              </div>
            </div>

            <div className="back-glass-effect">
              <div className="quick_access_gate" onClick={goToGate}>
                <img src="https://i.ibb.co/tpwL7Pyv/valve.png" />
                <div className="head">
                  <p>Control Gate</p>
                </div>
              </div>
            </div>

            <div className="back-glass-effect">
              <div className="quick_access_complain" onClick={goToComplain}>
                <img src="https://i.ibb.co/mC3mWZ6P/complaint.png" />
                <div className="head">
                  <p>Raise Complain</p>
                </div>
              </div>
            </div>
            <div className="back-glass-effect">
              <div className="quick_access_gate">
                <img src="https://i.ibb.co/FLXqJ5Pk/feed-back.png" />
                <div className="head">
                  <p>Give Feedback</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardCard;
