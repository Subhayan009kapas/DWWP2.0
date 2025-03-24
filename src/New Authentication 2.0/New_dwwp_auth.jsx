import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { writeBatch } from "firebase/firestore";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaGoogle } from "react-icons/fa";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./New_dwwp_auth.css";

const New_dwwp_auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("user");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phoneNumber: "",
    aadharNumber: "",
    address: ""
  });
const gobackToLand=()=>{
  navigate("/");
}
  const images = [
    "https://media.istockphoto.com/id/1214284146/photo/drought-and-water-scarcity.jpg?s=612x612&w=0&k=20&c=b9dbt8NTr9W8otrqnPynmpcBZAZaQ1XAYImcKbeY-yI=",
    "https://www.bepure.store/cdn/shop/articles/Bepure-Blog-Water-Crisis-In-India.jpg?v=1639574124",
    "https://bsmedia.business-standard.com/_media/bs/img/article/2016-05/03/full/1462263544-0813.jpg?im=FeatureCrop,size=(826,465)",
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Start loader and set minimum display time
    setLoading(true);
    const minLoaderTime = 5000; // 4 seconds
    
    try {
      const authPromise = isLogin ? handleLogin() : handleRegister();
      
      // Wait for either authentication or minimum loader time
      await Promise.all([
        authPromise,
        new Promise(resolve => setTimeout(resolve, minLoaderTime))
      ]);
      
    } catch (error) {
      // Error handling remains the same
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    // setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const userEmail = auth.currentUser?.email;
      
      if (!userEmail) throw new Error('Authentication failed');
      
      const adminDoc = await getDoc(doc(db, 'admin', '01ListOfAdmin'));
      if (adminDoc.exists()) {
        const isAdmin = adminDoc.data().admins.includes(userEmail);
        navigate(isAdmin ? '/newadmin/admin_Dashboard' : '/test/dashboard');
      } else {
        navigate('/test/dashboard');
      }
    } catch (error) {
      showPopup(`Login Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    // setLoading(true);
    try {
      // 1. Create Firebase Authentication user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const userEmail = userCredential.user.email;
  
      // 2. Check if user document already exists in Firestore
      const userDocRef = doc(db, 'users', userEmail);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        throw new Error('User document already exists in Firestore');
      }
  
      // 3. Handle admin role assignment
      if (role === "authority") {
        const adminDocRef = doc(db, 'admin', '01ListOfAdmin');
        const adminDoc = await getDoc(adminDocRef);
        
        const admins = adminDoc.exists() ? adminDoc.data().admins : [];
        if (admins.includes(userEmail)) {
          throw new Error('User is already registered as admin');
        }
        
        await setDoc(adminDocRef, { 
          admins: [...admins, userEmail] 
        }, { merge: true });
      }
  
      // 4. Create user document
      await setDoc(userDocRef, {
        userDetails: [
          formData.name,
          formData.phoneNumber,
          formData.aadharNumber,
          formData.address
        ],
        role: role,
        createdAt: new Date()
      });
  
      // 5. Create subcollections
      const collections = ['currentMonth', 'jan24', 'feb24', 'mar24', 'apr24', 
        'may24', 'jun24', 'jul24', 'aug24', 'sep24', 'oct24', 'nov24', 'dec24'];
      
      const batch = writeBatch(db);
      
      for (const collection of collections) {
        const monthRef = doc(db, 'users', userEmail, collection, 'default');
        batch.set(monthRef, {
          servoControl: { servoState: false },
          waterflowSensor: { totalusages: 0 },
          paidStatus: { 
            paid: false, 
            paid_date: '', 
            razorpay_payment_id: '' 
          }
        });
      }
      
      await batch.commit();
  
      showPopup('Registration successful!');
      navigate(role === "authority" ? "/newadmin/admin_Dashboard" : "/test/dashboard");
    } catch (error) {
      console.error('Registration Error:', error);
      
      // Handle specific error cases
      let message = error.message;
      if (error.code === 'auth/email-already-in-use') {
        message = 'Email is already registered!';
      } else if (error.message.includes('already registered as admin')) {
        message = 'User is already an admin!';
      }
      
      showPopup(`Registration Error: ${message}`);
      
      // Delete Firebase user if Firestore operations failed
      if (auth.currentUser) {
        await auth.currentUser.delete();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email;

      const userDocRef = doc(db, 'users', email);
      if (!(await getDoc(userDocRef)).exists()) {
        await setDoc(userDocRef, {
          userDetails: [user.displayName, '', '', '']
        });

        const collections = ['currentMonth', 'jan24', 'feb24', 'mar24', 'apr24', 
          'may24', 'jun24', 'jul24', 'aug24', 'sep24', 'oct24', 'nov24', 'dec24'];
        
        for (const collection of collections) {
          const userColRef = doc(db, 'users', email, collection);
          await setDoc(userColRef, { 
            servoControl: { servoState: false },
            waterflowSensor: { totalusages: 0 },
            paidStatus: { paid: false }
          });
        }
      }

      const adminDoc = await getDoc(doc(db, 'admin', '01ListOfAdmin'));
      if (adminDoc.exists()) {
        const isAdmin = adminDoc.data().admins.includes(email);
        if ((role === "user" && isAdmin) || (role === "authority" && !isAdmin)) {
          throw new Error('Role mismatch detected');
        }
        navigate(isAdmin ? '/newadmin/admin_Dashboard' : '/test/dashboard');
      } else {
        navigate('/test/dashboard');
      }
    } catch (error) {
      showPopup(`Google Login Error: ${error.message}`);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="new_dwwp_auth-container">
       

       {/* Add loader overlay */}
       {loading && (
        <div className="loader-overlay">
          <div className="loading-wave">
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
          </div>
        </div>
      )}
      <div className="new_dwwp_auth-sub-con">
      <button className="back_to_land" onClick={gobackToLand}><IoMdArrowRoundBack size={"20px"} style={{position:"relative", "top":"0.5vh"}} /> Back</button>
        
        {/* Image Slider Section */}
        <div className="new_dwwp_auth-slider">
       
         
          <AnimatePresence mode="wait">
        
            <motion.img
              key={currentSlide}
              src={images[currentSlide]}
              alt="slider"
              className="new_dwwp_auth-slide-image"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>

          <div className="new_dwwp_auth-dots">
            {images.map((_, index) => (
              <span
                key={index}
                className={`dot ${currentSlide === index ? "active" : ""}`}
              ></span>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <motion.div
          className="new_dwwp_auth-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="new_dwwp_auth-role-buttons">
            <button
              className={`new_dwwp_auth-btn ${role === "user" ? "active" : ""}`}
              onClick={() => setRole("user")}
            >
              User
            </button>
            <button
              className={`new_dwwp_auth-btn ${role === "authority" ? "active" : ""}`}
              onClick={() => setRole("authority")}
            >
              Authority
            </button>
          </div>

          <h2>{isLogin ? "Log In" : "Create an Account"}</h2>
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="new_dwwp_auth-link"
            >
              {isLogin ? " Register" : " Log in"}
            </span>
          </p>

          <form className="new_dwwp_auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="aadharNumber"
                  placeholder="Aadhar Number"
                  value={formData.aadharNumber}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <br></br>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <br></br>
            <br></br>

            <button type="submit" className="new_dwwp_auth-submit-btn">
              {loading ? (
                <div className="new_dwwp_auth-loader"></div>
              ) : isLogin ? (
                "Log In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <br></br>

          <div className="new_dwwp_auth-divider">or continue with</div>
          <br></br>
          <button 
            className="new_dwwp_auth-social-btn google"
            onClick={handleGoogleLogin}
          >
            <FaGoogle size={20} />
            <span>Continue with Google</span>
          </button>

          {popupMessage && (
            <div className="new_dwwp_auth-popup">
              {popupMessage}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default New_dwwp_auth;