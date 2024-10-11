import React, { useState, useEffect, useCallback } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"; // Icons for navigation
import ImageZoom from "react-image-zoom";

import { Html5QrcodeScanner } from "html5-qrcode";

import image1 from "../../../images/1.jpg";
import image2 from "../../../images/2.jpg";
import image3 from "../../../images/3.jpg";
import image4 from "../../../images/4.jpg";
import image5 from "../../../images/5.jpg";
import image6 from "../../../images/6.jpg";

import "./TestScreen.css";

//MAXESEVE15S105R00202407000001

// Home component with both QR code scanner and manual input
function Home() {
  const [showScanner, setShowScanner] = useState(false);
  const [manualSN, setManualSN] = useState("");
  const navigate = useNavigate();

  // Memoize handleScan with useCallback to avoid re-creation on every render
  const handleScan = useCallback(
    (data) => {
      if (data) {
        let temp = data.split("/").pop();
        console.log({ temp });

        const serialNumber = temp; // QR scanned data
        navigate(`/sn/${serialNumber}`); // Redirect with SN
      }
    },
    [navigate]
  ); // Only recreate if `navigate` changes

  const handleManualSubmit = () => {
    if (manualSN) {
      navigate(`/sn/${manualSN}`); // Redirect with manually entered SN
    }
  };

  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

      // Use the memoized handleScan
      scanner.render(
        (decodedText) => handleScan(decodedText),
        (error) => console.log(error)
      );

      return () => {
        scanner.clear();
      };
    }
  }, [showScanner, handleScan]); // Include handleScan in the dependencies array

  return (
    <div style={styles.container}>
      <h1>Battery Info Lookup</h1>

      <button
        onClick={() => setShowScanner(!showScanner)}
        style={styles.button}
      >
        {showScanner ? "Enter SN Manually" : "Scan QR Code"}
      </button>

      {showScanner ? (
        <div style={{ marginTop: "20px" }}>
          <div id="reader" style={{ width: "300px" }}></div>
        </div>
      ) : (
        <div style={styles.manualInput}>
          <input
            type="text"
            placeholder="Enter Serial Number"
            value={manualSN}
            onChange={(e) => setManualSN(e.target.value)}
            style={styles.inputField}
          />
          <br />
          <button onClick={handleManualSubmit} style={styles.button}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

// Battery Details Component
function BatteryDetails() {
  const { serialNumber } = useParams();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sample images of the battery (you can replace them with your actual images)
  const batteryImages = [image1, image2, image3, image4, image5, image6];

  const parseSerialNumber = (sn) => {
    return {
      manufacturer: sn.slice(0, 5),
      cellManufacturer: sn.slice(5, 8),
      numberOfCells: sn.slice(8, 11),
      capacity: sn.slice(11, 14),
      firmwareVersion: sn.slice(14, 17),
      yearOfManufacture: sn.slice(17, 21),
      monthOfManufacture: sn.slice(21, 23),
      sequenceNumber: sn.slice(23),
    };
  };

  const batteryDetails = parseSerialNumber(serialNumber);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % batteryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + batteryImages.length) % batteryImages.length
    );
  };

  // Image Zoom Settings
  const zoomProps = {
    width: 400,
    height: 300,
    zoomWidth: 500,
    img: batteryImages[currentImageIndex],
  };

  return (
    <div style={styles.detailsContainer}>
      <h2>Battery Details</h2>

      <div style={styles.containerx}>
        <div style={styles.leftColumn}>
          <p>
            <strong>Serial Number:</strong> {serialNumber}
          </p>
          <p>
            <strong>Manufacturer:</strong> {batteryDetails.manufacturer}
          </p>
          <p>
            <strong>Cell Manufacturer:</strong>{" "}
            {batteryDetails.cellManufacturer}
          </p>
          <p>
            <strong>Number of Cells:</strong> {batteryDetails.numberOfCells}
          </p>
        </div>
        <div style={styles.rightColumn}>
          <p>
            <strong>Capacity:</strong> {batteryDetails.capacity}
          </p>
          <p>
            <strong>Firmware Version:</strong> {batteryDetails.firmwareVersion}
          </p>
          <p>
            <strong>Year of Manufacture:</strong>{" "}
            {batteryDetails.yearOfManufacture}
          </p>
          <p>
            <strong>Month of Manufacture:</strong>{" "}
            {batteryDetails.monthOfManufacture}
          </p>
          <p>
            <strong>Sequence Number:</strong> {batteryDetails.sequenceNumber}
          </p>
        </div>
      </div>

      {/* Image Carousel */}
      <div style={styles.imageContainer}>
        <button onClick={prevImage} style={styles.iconButton}>
          <FaArrowLeft />
        </button>
        <div style={styles.zoomContainer}>
          <ImageZoom {...zoomProps} />
        </div>
        <button onClick={nextImage} style={styles.iconButton}>
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  button: {
    backgroundColor: "#f08a24",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "10px",
  },
  manualInput: {
    marginTop: "20px",
  },
  inputField: {
    padding: "10px",
    width: "350px",
    fontSize: "16px",
  },
  detailsContainer: {
    padding: "5px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "20px",
  },
  zoomContainer: {
    width: "400px",
    height: "300px",
    border: "1px solid #ddd",
    margin: "0 10px",
  },
  iconButton: {
    backgroundColor: "#f08a24",
    color: "white",
    border: "none",
    borderRadius: "50%",
    padding: "10px",
    cursor: "pointer",
  },
  topLeftButton: {
    display: "flex",
    top: "10px",
    left: "10px",
    padding: "5px 10px",
    backgroundColor: "#f08a24", // You can change to your desired color
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  containerx: {
    display: "flex",
    gridTemplateColumns: "1fr 1fr", // Two equal-width columns
    gap: "20px", // Space between the columns
    justifyContent: "center", // Center horizontally
    // alignItems: "center", // Center vertically (for grid items)
    // height: "100vh", // Full viewport height to help vertical centering
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start", // Align items to the left
    textAlign: "left", // Text aligned left
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start", // Align items to the left
    textAlign: "left", // Text aligned left
  },
};

const TestScreen = () => {
  const { serialNumber } = useParams();

  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">MAXES SMART ENERGY</header>
      <div className="App-body">
        {/* <nav className="App-nav">
          <ul>
            <li
              className={tab === "current" ? "active" : ""}
              onClick={() => handleTabChange("current")}
            >
              Dummy 1
            </li>
            <li
              className={tab === "history" ? "active" : ""}
              onClick={() => handleTabChange("history")}
            >
              Dummy 2
            </li>
            <li
              className={tab === "vehicles" ? "active" : ""}
              onClick={() => handleTabChange("vehicles")}
            >
              Dummy 3
            </li>
          </ul>
        </nav> */}
        <main className="App-main">
          {!serialNumber ? (
            <>{<Home />}</>
          ) : (
            <>
              <button
                onClick={() => navigate("/")}
                style={styles.topLeftButton}
              >
                Home
              </button>
              {<BatteryDetails />}
            </>
          )}
        </main>
      </div>
      <footer className="App-footer">Footer</footer>
    </div>
  );
};

export default TestScreen;

/*

      {!serialNumber ? (
            <div className="shimmer-wrapper">
              <div className="shimmer"></div>
            </div>
          ) : (
            <>{<Home />}</>
          )}

*/
