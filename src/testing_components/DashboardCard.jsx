import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronCircleRight } from "react-icons/fa";
import { RiSpeedFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import { db } from "../firebaseConfig"; // Adjust the path as necessary
import { doc, onSnapshot , getDoc } from "firebase/firestore"; // Import onSnapshot
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
  const [waterData, setWaterData] = useState({
    totalUsage: 0,
    regularPrice: 0,
    penalty: 0,
    totalPrice: 0,
    usagePercentage: 0,
    safeLimit: 70,
  });
  const [todayUsage, setTodayUsage] = useState(  parseFloat(sessionStorage.getItem("todayUsage")) || 0);

  const [totalUsage, setTotalUsage] = useState(  parseFloat(sessionStorage.getItem("totalUsage")) || 0);
  const [penaltyPrice, setPenaltyPrice] = useState(  parseFloat(sessionStorage.getItem("penaltyPrice")) || 0);
  const [regularPrice, setRegularPrice] = useState( parseFloat(sessionStorage.getItem("regularPrice")) || 0);
  let [regularLimit, setRegularLimit] = useState( parseFloat(sessionStorage.getItem("regularLimit")) || 0);
  const [penaltyLimit, setPenaltyLimit] = useState( parseFloat(sessionStorage.getItem("penaltyLimit")) || 0); 
  const [addedLimit, setAddedLimit] = useState( parseFloat(sessionStorage.getItem("addedLimit")) || 0); 

  const [limitBYUser,  setLimitByUser] = useState( parseFloat(sessionStorage.getItem("limitBYUser")) || 0); // limit by user 

  const [maxLimit, setMaxLimit] = useState( parseFloat(sessionStorage.getItem("maxLimit")) || 0);

  // States to track if each data point has been fetched
  const [isWaterFlowFetched, setIsWaterFlowFetched] = useState(false);
  const [isPriceFetched, setIsPriceFetched] = useState(false);
  const [isLimitFetched, setIsLimitFetched] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  const [isLoading, setIsLoading] = useState(true);




  useEffect(() => {
    if (!userId) return; 
  
        // Get the current year and month dynamically
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Ensure two-digit format
        // const day = String(now.getDate()); // Ensure two-digit format
        const day = String(now.getDate()).padStart(2, "0");
        const yearMonth = `${year}-${month}`; // Format: "YYYY-MM"
        let today = `${year}-${month}-${day}`; // Format: "YYYY-MM"
    
        const usageDocRef = doc(db, "users", userId, "monthlyUsages", yearMonth);

    const unsubscribe = onSnapshot(usageDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        today = today.toString()
        setTodayUsage(data[today] || 0 );
  
        // Sum all values from the document (each field is a date with a number)
        const total = Object.entries(data)
          .filter(([key]) => key.startsWith(yearMonth)) // Only include keys with "YYYY-MM"
          .reduce((sum, [, usage]) => sum + (usage || 0), 0);
  
        const userLimit = data.limit || 0; // Fetch limit value directly
        
        setLimitByUser(userLimit);
        sessionStorage.setItem("limitBYUser", userLimit);
  
        setTotalUsage(total);
        sessionStorage.setItem("totalUsage", total);
      }
      setIsWaterFlowFetched(true);
    }, (error) => {
      console.error("Error fetching water usage:", error);
    });
  
    // Cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, [userId]);
  

  useEffect(() => {
    if (!userId) return;
    // Listener for waterflowSensor
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Ensure two-digit format
        const yearMonth = `${year}-${month}`; // Format: "YYYY-MM"
      const unsubscribeWaterFlow = onSnapshot(
      doc(db, "users", userId, "monthlyUsages", yearMonth) , 
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          // console.log("Realtime Firestore data:", data);

          // Sum all field values (assuming they are numbers)
          const total = Object.entries(data)
          .filter(([key]) => key.startsWith(yearMonth)) // Only include keys with "YYYY-MM"
          .reduce((sum, [, usage]) => sum + (usage || 0), 0);

          const userLimit = Object.entries(data)
          .find(([key]) => key === "limit"); // Find the key-value pair directly
          
          const limitValue = userLimit ? Number(userLimit[1]) : 0; // Convert to number, default to 0
          
          setLimitByUser(limitValue);
          sessionStorage.setItem("limitBYUser", limitValue);
          
          setTotalUsage(total);
          sessionStorage.setItem("totalUsage", total);

        } else {
          console.log("No water usage data for this month.");
          setTotalUsage(0);
        }
        setIsWaterFlowFetched(true);
      },
      (error) => {
        console.error("Error fetching water usage:", error);
        setIsWaterFlowFetched(true);
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
          sessionStorage.setItem("penaltyPrice", data.penaltyPrice);
          sessionStorage.setItem("regularPrice", data.regularPrice);
          // console.log("Prices fetched: 😒😒", data);
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
          setPenaltyLimit(data.penalty || 0);
          setRegularLimit(data.regular || 100);
          setMaxLimit(data.max) ; 

          sessionStorage.setItem("regularLimit", data.regular);
          sessionStorage.setItem("penaltyLimit", data.penalty);
          sessionStorage.setItem("maxLimit", data.max);


          setIsLimitFetched(true);
          // console.log("Limits fetched: ", data);
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


    // for the added limit 
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const yearMonth = `${year}-${month}`;

    const addonDocRef = doc(db, `users/${userId}/monthlyUsages/${yearMonth}/addon/addon_details`);
    // fetch added limit 
    useEffect(() => {
      if (!userId) return;
    
      const fetchAddedLimit = async () => {
        try {
        const addonSnap = await getDoc(addonDocRef);
          if (addonSnap.exists()) {
            const addonData = addonSnap.data();
            setAddedLimit(addonData.added_limit)
          }else {
            console.log("No added_limit document found.");
          }
        } catch (error) {
          console.error("Error fetching addedLimit:", error);
        }
      };
    
      fetchAddedLimit();
    }, [userId,limitBYUser ]);


  // check data is fetched or not ??
  useEffect(() => {
    // Check if all data has been fetched
    if (isWaterFlowFetched && isPriceFetched && isLimitFetched) {
      setLoading(false);
    }
  }, [isWaterFlowFetched, isPriceFetched, isLimitFetched]);

  regularLimit = limitBYUser ; 
  const regularUsage = Math.min(totalUsage, regularLimit);
  const penaltyUsage =
    totalUsage > regularLimit ? totalUsage - regularLimit : 0;

  const regularPriceTotal = regularUsage * regularPrice;
  const penaltyPriceTotal = penaltyUsage * penaltyPrice;
  

  const totalPrice = regularPriceTotal + penaltyPriceTotal;

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setWaterData({
        totalUsage: 0,
        regularPrice: 0,
        penalty: 0,
        totalPrice: 0,
        usagePercentage: 0,
        safeLimit: 0,
      });
      setIsLoading(false);
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




  // const isUsageExceeded = totalUsage >= maxLimit;
  // console.log(maxLimit , totalUsage , penaltyLimit);

  
const penaltyThreshold = regularLimit + penaltyLimit;        // 100 + 150 = 250
const maxThreshold = penaltyThreshold + maxLimit;            // 250 + 400 = 650

const cappedUsage = Math.min(totalUsage, maxThreshold);   
  
  // const greenWidth = Math.min(totalUsage, regularLimit)||50;
  // const orangeWidth = Math.min(Math.max(totalUsage - regularLimit, 0), penaltyLimit - regularLimit)||20;
  // const redWidth = Math.min(Math.max(totalUsage - penaltyLimit, 0), maxLimit - penaltyLimit);
  
  const greenWidth = Math.min(cappedUsage, regularLimit); 
  // Up to 100
  
  const orangeWidth = Math.min(Math.max(cappedUsage - regularLimit, 0), penaltyLimit); 
  // Between 100–250
  
  const redWidth = Math.max(cappedUsage - penaltyThreshold, 0); 
  // Between 250–650
  const totalBarWidth = regularLimit + penaltyLimit + addedLimit ;



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
                <span className="metric-label">Today </span>
                <span className="metric-value">
                  {isLoading ? "..." : todayUsage.toFixed(0) } L
                </span>
              </div>
              <div className="metric-content">
                <span className="metric-label">This month</span>
                <span className="metric-value">
                  {isLoading ? "..." : totalUsage.toFixed(2) } L
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
                  ₹ {isLoading ? "..." :   regularPriceTotal.toFixed(2) }
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
                ₹ {isLoading ? "..." : penaltyPriceTotal.toFixed(2) }
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
                  ₹ {isLoading ? "..." : totalPrice.toFixed(2) }
                </span>
              </div>
            </div>
          </div>
          {/* <p>{addedLimit}</p> */}
        <div className="bar-containers">
          {totalUsage < regularLimit ? (
            <div className="bars">
              <div
                className="bar-greens"
                style={{ width: `${(greenWidth / regularLimit) * 100}%` }}
              ></div>
            </div>
          ) : (
            <div className="bars">
              <div
                className="bar-greens"
                style={{ width: `${(greenWidth / totalBarWidth) * 100}%` }}
              ></div>
              <div
                className="bar-oranges"
                style={{ width: `${(orangeWidth / totalBarWidth) * 100}%` }}
              ></div>
              <div
                className="bar-reds"
                style={{ width: `${(redWidth / totalBarWidth) * 100}%` }}
              ></div>
            </div>
          )}
        </div>


              
        </div>

        <div className="network_connnection">
          <Online_Status userId= {userId} />
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
          <p class="text">Limit:</p>
          <p class="price-value"> {regularLimit} L</p>
        </div>
        <div className="com-box">
          <p class="text">Price/Ltr :</p>
          <p class="price-value">₹ {regularPrice}</p>
        </div>
        <div className="com-box">
          <p class="text">Penalty/Ltr :</p>
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
                icon={""}
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