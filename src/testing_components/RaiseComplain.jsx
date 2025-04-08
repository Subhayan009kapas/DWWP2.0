// import React, { useState } from "react";
// import emailjs from "@emailjs/browser";
// import "./RaiseComplaint.css";

// const RaiseComplaint = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   const [complaint, setComplaint] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   const purposeOptions = [
//     "Water Leakage",
//     "Water Quality Issue",
//     "Billing Discrepancy",
//     "Supply Interruption",
//     "Pipeline Damage",
//     "Meter Malfunction",
//     "Other",
//   ];

//   const handleCheckboxChange = (option) => {
//     setSelectedOptions((prevOptions) =>
//       prevOptions.includes(option)
//         ? prevOptions.filter((item) => item !== option)
//         : [...prevOptions, option]
//     );
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Replace these with your actual EmailJS credentials
//     const serviceId = "service_kxmtcrv";
//     const templateId = "template_m9bpt1j";
//     const publicKey = "8UVSrjrFC4Cxf_RIu";

//     const templateParams = {
//       from_name: name,
//       from_email: email,
//       complaint: [...selectedOptions, complaint].join("\n"),
//     };

//     emailjs
//       .send(serviceId, templateId, templateParams, publicKey)
//       .then((response) => {
//         console.log("Email sent successfully:", response);
//         setSubmitted(true);
//         setName("");
//         setEmail("");
//         setSelectedOptions([]);
//         setComplaint("");
//       })
//       .catch((error) => {
//         console.error("Error sending email:", error);
//       });
//   };

//   return (
//     <div className="complaint-container">
//       {!submitted ? (
//         <div className="complaint-card">
//           <h2>Raise a Complaint</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>Your Name</label>
//               <input
//                 type="text"
//                 required
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>
//             <div className="form-group">
//               <label>Your Email</label>
//               <input
//                 type="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             {/* Purpose Selection Section */}
//             <div className="form-group">
//               <label>Complaint Purpose</label>
//               <div className="checkbox-group">
//                 {purposeOptions.map((option) => (
//                   <label key={option} className="checkbox-label">
//                     <input
//                       type="checkbox"
//                       checked={selectedOptions.includes(option)}
//                       onChange={() => handleCheckboxChange(option)}
//                     />
//                     {option}
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <div className="form-group">
//               <label>Complaint Details</label>
//               <textarea
//                 rows="5"
//                 required
//                 value={[...selectedOptions, complaint].join("\n")}

//                 onChange={(e) => setComplaint(e.target.value)}
//               />
//             </div>

//             <button type="submit" className="submit-btn">
//               Submit Complaint
//             </button>
//           </form>
//         </div>
//       ) : (
//         <div className="success-card">
//           <div className="success-icon">
//             <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
//               <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
//               <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
//             </svg>
//           </div>
//           <h2>Complaint Submitted Successfully!</h2>
//           <p>Your complaint has been received. We will get back to you shortly.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RaiseComplaint;

import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "./RaiseComplaint.css";
import { motion } from "framer-motion";
const RaiseComplaint = () => {
  // ... (keep all existing state variables and logic exactly the same)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [complaint, setComplaint] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const purposeOptions = [
    "Water Leakage",
    "Water Quality Issue",
    "Billing Discrepancy",
    "Supply Interruption",
    "Pipeline Damage",
    "Meter Malfunction",
    "Other",
  ];

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.includes(option)
        ? prevOptions.filter((item) => item !== option)
        : [...prevOptions, option]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Replace these with your actual EmailJS credentials
    const serviceId = "service_kxmtcrv";
    const templateId = "template_m9bpt1j";
    const publicKey = "8UVSrjrFC4Cxf_RIu";

    const templateParams = {
      from_name: name,
      from_email: email,
      complaint: [...selectedOptions, complaint].join("\n"),
    };

    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log("Email sent successfully:", response);
        setSubmitted(true);
        setName("");
        setEmail("");
        setSelectedOptions([]);
        setComplaint("");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  return (
    <motion.div 
    
    
    className="complaint-container"
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
      {!submitted ? (
        <div className="complaint-card">
          <h2>Raise a Complaint</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label>Your Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
              />
            </div>

            <div className="form-group">
              <label>Complaint Purpose</label>
              <div className="checkbox-group">
                {purposeOptions.map((option) => (
                  <label 
                    key={option} 
                    className={`checkbox-label ${selectedOptions.includes(option) ? 'selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                    />
                    <span className="checkbox-text">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Complaint Details</label>
              <textarea
                rows="4"
                required
                value={[...selectedOptions, complaint].join("\n")}
                onChange={(e) => setComplaint(e.target.value)}
                placeholder="Describe your issue in detail..."
              />
            </div>

            <button type="submit" className="submit-btn">
              Submit Complaint
            </button>
          </form>
        </div>
      ) : (
        <div className="success-card">
                 <div className="success-icon">
                 <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                 </svg>
               </div>
                <h2>Complaint Submitted Successfully!</h2>
              <p>Your complaint has been received. We will get back to you shortly.</p>
             </div>
      )}
    </motion.div>
  );
};

export default RaiseComplaint;
