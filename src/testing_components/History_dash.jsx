import React from "react";
import "./History_dash.css";
import { useNavigate } from "react-router-dom";
import { FaArrowCircleRight } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { MdAutoGraph } from "react-icons/md";
const Rechargecard = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/test/graph");
  };
  return (
    <>
      <div class="card">
        {/* <span class="small-text">Recharge Now!</span> */}
        <br></br>
        <span class="title">
          <img src="https://i.ibb.co/GQ6fTbLf/graph.png" />
        </span>
        <span class="desc">
          {/* Recharge from our Site &amp; get fullfill Your Water Requirement. */}
          This month water usages increased by
        </span>
        <div className="button-container">
          <button className="water-recharge-btn" >
            <MdAutoGraph size={"25px"} />
            <span
              style={{
                fontSize: "1rem",
                position: "relative",
                bottom: "5px",
                left: "2px",
              }}
            >
              +5.4%
            </span>
          </button>
        </div>
        <div class="view-full-history-btn" onClick={handleNavigation} >
          <span>
            View Full History {" "}
            
          </span>
        </div>
      </div>
    </>
  );
};
export default Rechargecard;
