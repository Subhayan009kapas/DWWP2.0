import React from "react";
import { motion } from "framer-motion";
import TopUpCard from "./TopUpCard";
import "./Subscription.css";

const Subscription = ({userId}) => {
  return (
    <>
    {/* <Outlet /> */}
      <motion.div
        className="top-up-con"
        initial={{ y: "-100vh", opacity: 0 }} // Start position (off-screen)
        animate={{ y: 0, opacity: 1 }} // End position (fully visible)
        transition={{
          duration: 0.8, 
          ease: [0.25, 1, 0.5, 1], // Smooth cubic bezier easing
          type: "spring", // Spring effect for natural motion
          stiffness: 100, // Controls the bounce
          damping: 15, // Reduces excessive bouncing
        }}
      >
        <div className="top-up-cards">
          <TopUpCard  msg={" Beat the heat with "} addon={"Summer"} price={20} Refill={50} userId = {userId} url={"https://i.ibb.co/prRXnWpC/hot.png"}/>
          <TopUpCard  msg={" Stay hydrated with "}  addon={"Standard"} price={50} Refill={80} userId = {userId} url={"https://i.ibb.co/8LgPc9nR/water-tap.png"}/>
          <TopUpCard  msg={"Let the celebration flow: "} addon={"Party"} price={100} Refill={200} userId = {userId} url={"https://i.ibb.co/YFbyKhh2/party.png"} />
          <TopUpCard  msg={" Enjoy the joy of festivals with "}  addon={"Festive"} price={150} Refill={300} userId = {userId}  url={"https://i.ibb.co/7dpYPvkp/festival.png"}/>
        </div>
      </motion.div>


    </>
  );
};

export default Subscription;