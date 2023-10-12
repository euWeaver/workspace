import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "@fontsource/amatic-sc/700.css";
import logo from "./logo3.png";
import ClipLoader from "react-spinners/ClipLoader";

const SecondPage = ({ history }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const checkPredictionStatus = async (predictionId) => {
    try {
      const response = await axios.get(
        `https://pifpaff-35fb713c3e3c.herokuapp.com/prediction-status/${predictionId}`,
      );
      if (response.data.videoUrl) {
        setLoading(false);
        history.push({
          pathname: "/third",
          state: { videoUrl: response.data.videoUrl },
        });
      } else {
        setTimeout(() => checkPredictionStatus(predictionId), 5000); // Poll every 5 seconds
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };
  const confirmImage = async () => {
    setLoading(true);

    // Convert the data URI to blob to send to the backend
    const byteString = window.atob(image.split(",")[1]);
    const mimeString = image.split(",")[0].split(":")[1].split(";")[0];

    const encoder = new TextEncoder(); // TextEncoder will give you a Uint8Array directly
    const ia = encoder.encode(byteString);

    const blob = new Blob([ia], { type: mimeString });
    const formData = new FormData();
    formData.append("source", blob);

    try {
      const response = await axios.post(
        "https://pifpaff-35fb713c3e3c.herokuapp.com/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Start polling for prediction status
      checkPredictionStatus(response.data.predictionId);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <img src={logo} alt="Logo" style={styles.topLogo} />
      <h2 style={styles.title}>Пожалуйста используйте качественное фото</h2>
      {loading ? (
        <ClipLoader color={"#123abc"} loading={true} size={50} />
      ) : (
        <div style={styles.uploadBox}>
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
              <div style={{ margin: "25px 0" }}></div>
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
    width: "320px",
    height: "320px",
    margin: "20px auto",
    position: "relative",
    overflow: "hidden",
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
    color: "#402750",
    borderRadius: "20px",
    padding: "10px 20px",
    margin: "5px",
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
    color: "#402750",
    borderRadius: "20px",
    border: "none",
    padding: "10px 20px",
    cursor: "pointer",
  },
  topLogo: {
    position: "absolute",
    top: "10px",
    left: "10px",
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
    width: "50px", // or whatever size you want
  },
};

export default SecondPage;
