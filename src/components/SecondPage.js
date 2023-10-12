import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "@fontsource/amatic-sc/700.css";
import logo from "./logo3.png";
import ClipLoader from "react-spinners/ClipLoader";

const SecondPage = ({ history }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setImage(null);
  };

  const confirmImage = () => {
    // Since we are not sending any data or doing anything with the image now,
    // we can just use the history prop to redirect the user to the third page.
    history.push('/third');  // Change '/thirdpage' to your desired route/path
};
  // Function to convert blob to base64 (added for our modification)
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // ... rest of your component code

  const checkPredictionStatus = async (predictionId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/prediction/${predictionId}`,
      );
      if (response.data.status === "succeeded") {
        setLoading(false);
        // Handle the output here
      } else {
        setTimeout(() => checkPredictionStatus(predictionId), 5000);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  }
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const uploadBoxStyles = {
    ...styles.uploadBox,
    width: windowWidth <= 768 ? '310px' : '500px',
    height: windowWidth <= 768 ? '310px' : '500px',
  };

  return (
    <div style={styles.container}>
      <img src={logo} alt="Logo" style={styles.topLogo} />
      <h2 style={styles.title}>Пожалуйста используйте качественное фото</h2>
      {loading ? (
        <ClipLoader color={"#123abc"} loading={true} size={50} />
      ) : (
        <div style={uploadBoxStyles}>
          {image ? (
            <img
              src={image}
              alt="Uploaded Preview"
              style={styles.uploadedImage}
            />
          ) : (
            <div style={styles.uploadInstructions}>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleImageChange}
                style={styles.hiddenInput}
              />

              <label htmlFor="fileInput" style={{ ...styles.uploadLabel }}>
                Загрузить
              </label>
              <div style={{ margin: "50px 0" }}></div>
              <input
                type="file"
                id="cameraInput"
                accept="image/*"
                capture="user"
                onChange={handleImageChange}
                style={styles.hiddenInput}
              />
              <label htmlFor="cameraInput" style={styles.uploadLabel}>
                Сделать фото
              </label>
            </div>
          )}
        </div>
      )}
      {image && (
        <div style={styles.buttonGroup}>
          <button onClick={confirmImage} style={styles.button}>
            Подтвердить
          </button>

          <button onClick={handleRetake} style={styles.button}>
            Переснять
          </button>
        </div>
      )}
      <div style={styles.backButtonContainer}>
        <button onClick={() => history.push("/")} style={styles.button}>
          Назад
        </button>
      </div>
      <div style={styles.navbar}>
        <img src={logo} alt="Logo" style={styles.bottomLogo} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '"Amatic SC", Helvetica',
    fontWeight: 700,
    color: "#402750",
    background: "linear-gradient(15deg, #D2B8E3 50%, transparent 50%)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  uploadBox: {
    border: "5px solid #402750",
    borderRadius: "15px",
    width: "500px", // Desktop size
    height: "500px", // Desktop size
    margin: "20px auto",
    cursor: "pointer",
    overflow: "hidden", // This ensures the video doesn't spill outside the container
    '@media (max-width: 768px)': { // Mobile size
        width: '350px',
        height: '350px'
    }
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  uploadInstructions: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  hiddenInput: {
    display: "none",
  },
  uploadLabel: {
    cursor: "pointer",
    backgroundColor: "#4bb150",
    fontFamily: '"Amatic SC", Helvetica',
    fontWeight: 700,
    color: "white",
    borderRadius: "20px",
    padding: "20px 40px",
    margin: "5px",
    marginTop: "20px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
  },
  backButtonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
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
    fontSize: "2em" // This will make the font size bigger if needed
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


export default SecondPage;
