import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "@fontsource/amatic-sc/700.css";
import logo from "./logo3.png";
import ClipLoader from "react-spinners/ClipLoader";
const SecondPage = ({ history }) => {
  const [image, setImage] = useState(null);

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
  const goToThirdPage = () => {
    history.push("/third");
  };
  const [loading, setLoading] = useState(false); // Add this line for loading state // To programmatically navigate

  const confirmImage = () => {
    setLoading(true); // Start loading

    const formData = new FormData();
    formData.append("image", image);

    axios
      .post("http://127.0.0.1:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then((response) => {
        setLoading(false); // Stop loading
        console.log("Image uploaded and processed!");

        // You might want to check if response.data.videoUrl actually exists before using it:
        if (response.data && response.data.videoUrl) {
          history.push({
            pathname: "/third",
            state: { videoUrl: response.data.videoUrl }
          });
        } else {
          console.error("Unexpected response format:", response.data);
        }
      })
      .catch((error) => {
        setLoading(false); // Stop loading on error as well
        console.error("There was an error uploading the image:", error);
      });
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
          <button onClick={goToThirdPage} style={styles.button}>
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
    alignItems: "center"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px"
  },
  uploadBox: {
    border: "5px solid #402750",
    borderRadius: "15px",
    width: "320px",
    height: "320px",
    margin: "20px auto",
    position: "relative",
    overflow: "hidden"
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  uploadInstructions: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  hiddenInput: {
    display: "none"
  },
  uploadLabel: {
    cursor: "pointer",
    backgroundColor: "#4bb150",
    fontFamily: '"Amatic SC", Helvetica',
    fontWeight: 700,
    color: "#402750",
    borderRadius: "20px",
    padding: "10px 20px",
    margin: "5px"
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px"
  },
  backButtonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px"
  },
  button: {
    backgroundColor: "#4bb150",
    fontFamily: '"Amatic SC", Helvetica',
    fontWeight: 700,
    color: "#402750",
    borderRadius: "20px",
    border: "none",
    padding: "10px 20px",
    cursor: "pointer"
  },
  topLogo: {
    position: "absolute",
    top: "10px",
    left: "10px",
    width: "50px" // or whatever size you want
  },
  navbar: {
    position: "fixed",
    bottom: "0",
    width: "100%",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px"
  },
  bottomLogo: {
    width: "50px" // or whatever size you want
  }
};

export default SecondPage;
