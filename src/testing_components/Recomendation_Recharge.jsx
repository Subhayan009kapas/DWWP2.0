import react from "react";
import './Recomended_recharge.css';

import { useNavigate } from "react-router-dom";

const Recomended_recharge = ({price , type , descrip , icon}) => {
          const naviagte=useNavigate()

const handelNevigation=()=>{
          naviagte("/test/topup");

}
  return (
    <>
      <div className="pricing-card">

        <div className="price-card-content">

        <div className="title">
                    <h3>Popular {type} Plan {icon}</h3>
                    <p>{descrip}.</p>
          </div>
          <br>
          </br>
          <div className="price">
                    <span class="price_value">₹ {price}<span style={{fontWeight:"0"}}> /</span></span>
                    <span class="quantity">100 L</span>
          </div>
         
        
        <div className="pricing-footer" onClick={handelNevigation}>
          <a className="pricing-button" href="#">
            ✨Get Plan
          </a>
        </div>


        </div>

          

      </div>
    </>
  );
};
export default Recomended_recharge;
