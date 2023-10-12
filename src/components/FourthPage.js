import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import logo from "./logo3.png"; // Import your logo here
import "@fontsource/amatic-sc/700.css";
import emailjs from "emailjs-com";
import EmailContext from "./EmailContext";
function FourthPage() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { email, setEmail } = useContext(EmailContext);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play(); // Autoplay the video on component mount
    }

    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      localStorage.removeItem("userEmail"); // clear the email from localStorage
    }

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (email) {
      sendEmail(email);
    }
  }, [email]);

  const sendEmail = (recipientEmail) => {
    emailjs
      .send(
        "service_j0ju1hw",
        "template_w5hhr5j",
        {
          to_name: recipientEmail,
          from_name: "Your Company Name",
          message:
            "https://drive.google.com/file/d/15KZsQfmPujdw_OQYK73u3itPS5yOEDhP/view?usp=sharing",
        },
        "Mp8HeJ62FCmVVWsqZ",
      )
      .then((response) => {
        console.log("Email successfully sent!", response);
      })
      .catch((error) => {
        console.error("Email sending failed:", error);
      });
  };

  const handleVideoToggleMute = () => {
    if (videoRef.current.muted) {
      setIsMuted(false);
      videoRef.current.muted = false;
    } else {
      setIsMuted(true);
      videoRef.current.muted = true;
    }
  };

  const videoContainerStyles = {
    ...styles.videoContainer,
    width: windowWidth <= 768 ? "310px" : "500px",
    height: windowWidth <= 768 ? "310px" : "500px",
  };

  return (
    <div style={styles.container}>
      <img src={logo} alt="Logo" style={styles.topLogo} />
      <h1 style={styles.title}>Ваше видео!</h1>
      <div style={videoContainerStyles} onClick={handleVideoToggleMute}>
        <video
          id="videoElement"
          style={styles.video}
          ref={videoRef}
          muted={isMuted}
          playsInline
          autoPlay
          loop
        >
          <source src="/assets/devushka1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div>
        <a href="/assets/devushka1.mp4" download="devushka1.mp4">
          <button style={{ ...styles.button, marginRight: "20px" }}>
            Cкачать
          </button>
        </a>
        <Link to="/">
          <button style={styles.button}>Home</button>
        </Link>
      </div>
    </div>
  );
}
const styles = {
  container: {
    fontFamily: '"Amatic SC", Helvetica',
    fontWeight: 700,
    color: "#402750",
    background: "linear-gradient(15deg, #D2B8E3 50%, transparent 50%)", // Adjusted gradient
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
  },
  videoContainer: {
    border: "5px solid #402750",
    borderRadius: "15px",
    width: "500px", // Desktop size
    height: "500px", // Desktop size
    margin: "20px auto",
    cursor: "pointer",
    overflow: "hidden", // This ensures the video doesn't spill outside the container
    "@media (max-width: 768px)": {
      // Mobile size
      width: "350px",
      height: "350px",
    },
  },

  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  button: {
    backgroundColor: "#4bb150",
    fontFamily: '"Amatic SC", Helvetica',
    fontWeight: 700,
    color: "white",
    borderRadius: "20px",
    border: "none",
    padding: "20px 40px", // Double the padding
    cursor: "pointer",
    fontSize: "2em", // This will make the font size bigger if needed
  },
  topLogo: {
    position: "absolute",
    top: "20px",
    left: "20px", // Added 15px margin
    width: "50px", // or whatever size you want
  },

  navbar: {
    position: "fixed",
    bottom: "0",
    width: "100%",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
  },
  bottomLogo: {
    marginLeft: "20px", // Added 15px margin
    width: "50px", // or whatever size you want
  },
};
export default FourthPage;
