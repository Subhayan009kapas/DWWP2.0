import React, { useEffect, useState } from "react";
import "./New_Dwwp2_0_landing.css";
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
const New_Dwwp2_0_landing = () => {
  const cities = [
    {
      name: "Chennai, India",
      description:
        "Chennai experienced a water shortage in 2019 due to failed monsoons, depleting major reservoirs and causing severe scarcity.",
      image:
        "https://i.ibb.co/mVsq4vhM/DALL-E-2025-02-25-02-28-24-A-realistic-depiction-of-a-severe-water-crisis-in-Chennai-India-featuring.webp",
    },
    {
      name: "Bengaluru, India",
      description:
        "Bengaluru faces a looming water crisis due to rapid urbanization, groundwater depletion, and pollution of major lakes.",
      image:
        "https://i.ibb.co/fVVX47Rh/DALL-E-2025-02-25-02-28-28-A-realistic-depiction-of-a-severe-water-crisis-in-Bengaluru-India-featuri.webp",
    },
    {
      name: "Delhi, India",
      description:
        "Delhi struggles with water shortages caused by over-extraction of groundwater, pollution of the Yamuna River, and an increasing population.",
      image:
        "https://i.ibb.co/tp4mbrbh/DALL-E-2025-02-25-02-28-31-A-realistic-depiction-of-a-severe-water-crisis-in-Delhi-India-featuring-t.webp",
    },
    {
      name: "Mumbai, India",
      description:
        "Mumbai frequently experiences water cuts due to uneven rainfall, high demand, and water loss in aging pipelines.",
      image:
        "https://i.ibb.co/RpkhGrw2/DALL-E-2025-02-25-02-28-34-A-realistic-depiction-of-a-severe-water-crisis-in-Mumbai-India-featuring.webp",
    },
    {
      name: "Hyderabad, India",
      description:
        "Hyderabad faces recurring water shortages due to insufficient rainfall, declining groundwater levels, and high water demand from industries.",
      image:
        "https://i.ibb.co/svnmD2Z9/DALL-E-2025-02-25-02-28-37-A-realistic-depiction-of-a-severe-water-crisis-in-Hyderabad-India-featuri.webp",
    },
    {
      name: "Jaipur, India",
      description:
        "Jaipur's water crisis stems from over-reliance on groundwater, irregular monsoons, and depleting water sources like the Ramgarh Lake.",
      image:
        "https://i.ibb.co/RkLvncbG/DALL-E-2025-02-25-02-43-01-A-realistic-depiction-of-a-severe-water-crisis-in-Mumbai-India-The-image.webp",
    },
  ];

  const [bubbles, setBubbles] = useState([]);
  const navigate = useNavigate();
  const handaleNavigate = () => {
    navigate("/newAuth");
  };

  useEffect(() => {
    const createBubble = () => ({
      id: Math.random(),
      left: `${Math.random() * 100}vw`, // Random horizontal position
      size: `${Math.random() * 50 + 30}px`, // Random size between 30px and 80px
      duration: `${Math.random() * 5 + 5}s`, // Animation duration between 5s and 10s
    });

    function refreshPage() {
      window.location.reload();
    }

    // Generate initial bubbles
    setBubbles(Array.from({ length: 10 }, createBubble));

    // Keep generating new bubbles at intervals
    const interval = setInterval(() => {
      setBubbles((prevBubbles) => [
        ...prevBubbles.filter((b) => parseFloat(b.duration) > 0), // Keep ongoing bubbles
        createBubble(), // Add a new bubble
      ]);
    }, 2000); // Generate a new bubble every 2 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="new_dwwp2_0_landing-container">
      {/* Water Bubbles Animation */}
      <div className="bubbles-container">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="water-bubble"
            style={{
              left: bubble.left,
              width: bubble.size,
              height: bubble.size,
              animationDuration: bubble.duration,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="new_dwwp2_0_landing-navbar">
        <div className="new_dwwp2_0_landing-logo">
          <img
            src="https://i.ibb.co/svjnrFyr/Domestic-removebg-preview.png"
            alt="Logo"
          />
        </div>
        <ul className="new_dwwp2_0_landing-nav-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#vision">Vision</a>
          </li>
          <li>
            <a href="#city">Citys</a>
          </li>
        </ul>
        <button className="new_dwwp2_0_landing-login" onClick={handaleNavigate}>
          Login
        </button>
      </nav>

      {/* Main Landing Section */}
      <section className="new-hero-section" id="home">
        <div className="new_dwwp2_0_landing-content">
          <span
            className="new_dwwp2_0_landing-badge"
            onClick={() => window.location.reload()}
          >
            🚀 Introducing DWWP 2.0
          </span>
          <br></br>
          <br></br>
          <h1 className="new_dwwp2_0_landing-title">
            Revolutionizing Water Management
          </h1>
          <br></br>

          <p className="new_dwwp2_0_landing-description">
            "Smart Solutions for Water Conservation"
          </p>
          <div className="new_dwwp2_0_landing-buttons">
            <button
              className="new_dwwp2_0_landing-start"
              onClick={handaleNavigate}
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="about-content">
          <h2 className="about-title">About DWWP 2.0</h2>
          <p className="about-description">
            DWWP 2.0 is a cutting-edge **domestic water wastage prevention
            system** designed to minimize water wastage in households. Our
            system intelligently monitors water consumption, sets limits, and
            ensures optimal usage through **real-time tracking and automated
            controls**. Experience the future of smart water management today!
          </p>
          <button className="about-learn-more">Learn More</button>
        </div>
        <div className="about-image">
          <img src="https://i.ibb.co/0jcNzKmm/DALL-E-2025-02-25-02-11-15-A-futuristic-representation-of-global-water-conservation-The-image-featur.webp" />
        </div>
      </section>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      {/* Our Vision Section */}
      <section className="vision-section" id="vision">
        <div className="vision-image">
          <img src="https://i.ibb.co/p7Rr8JX/DALL-E-2025-02-25-02-14-45-A-realistic-vision-of-a-sustainable-world-with-advanced-water-conservatio.webp" />
        </div>
        <div className="vision-content">
          <h2 className="vision-title">Our Vision</h2>
          <p className="vision-description">
            Our vision is to **create a world where water is used efficiently
            and responsibly**. Through innovation and smart technology, we aim
            to reduce water wastage, ensure sustainable water management, and
            empower households to take control of their water consumption.
            **Every drop counts, and together we can make a difference.**
          </p>
          <button className="vision-learn-more">Join Our Mission</button>
        </div>
      </section>

      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <section className="water-shortage-cities" id="city">
        <h2 className="section-title">Water Shortage in Cities</h2>
        <div className="city-grid">
          {cities.map((city, index) => (
            <div className="city-card" key={index}>
              <img src={city.image} alt={city.name} className="city-image" />
              <div className="city-info">
                <h3 className="city-name">{city.name}</h3>
                <p className="city-description">{city.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <br></br>
      <br></br>

      <footer className="footer">
        <div className="footer-container">
          {/* About Section */}
          <div className="footer-section">
            <img
              src="https://i.ibb.co/svjnrFyr/Domestic-removebg-preview.png"
              alt="Logo"
            />
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
            
              <a
                href="#home"
                style={{ color: "white" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00bcd4")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
              >
                Home
              </a>
              <br></br>
              <br></br>
              <a
                href="#about"
                style={{ color: "white" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00bcd4")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
               
              >
                About
              </a>
              <br></br>
              <br></br>
              <a
                href="#vision"
                style={{ color: "white" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00bcd4")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
               
              >
                Our Vision
              </a>
              <br></br>
              <br></br>
              <a
                href="#contact"
                style={{ color: "white" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00bcd4")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
               
              >
                Contact
              </a>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3>Contact Us</h3>

            <p>Email: contact@waterconservation.org</p>

            <p>Phone: +91 98765 43210</p>

            <p>Address: Jaipur, Rajasthan, India</p>
          </div>

          {/* Social Media Links */}
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="footer-bottom">
          <p>&copy; 2025 Dwwp 2.0 | All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default New_Dwwp2_0_landing;
