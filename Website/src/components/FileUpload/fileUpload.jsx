import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import InfoCard from "../InfoCard/infoCard";
import "./fileUpload.css";

const serverUrl = process.env.REACT_APP_SERVER_URL;

function FileUpload() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    website: "",
    image_url: "",
  });

  // Create object URL when image changes
  useEffect(() => {
    if (image) {
      setImageUrl(URL.createObjectURL(image));
    }
  }, [image]);

  // Authentication check
  useEffect(() => {
    const jwtAccessToken = localStorage.getItem("jwt_access_token");
    if (!jwtAccessToken || !localStorage.getItem("user_sub")) {
      window.location = "/login";
    }
  }, []);

  const handleChangeInput = (event, key) => {
    setCardDetails({ ...cardDetails, [key]: event.target.value });
  };

  // API calls
  const uploadImage = async (file) => {
    const base64 = await convertToBase64(file);
    const encodedString = base64.replace(/^data:(.*,)?/, "");

    const response = await fetch(`${serverUrl}/images`, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filename: file.name, filebytes: encodedString }),
    });

    return await response.json();
  };

  const recognizeEntities = async (fileId) => {
    const response = await fetch(
      `${serverUrl}/images/${fileId}/recognize_entities`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${await response.text()}`);
    }

    return await response.json();
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const handleOnImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setIsLoading(true);

    try {
      // Upload image
      const { fileId, fileUrl } = await uploadImage(file);

      // Recognize entities
      const recognitionResult = await recognizeEntities(fileId);

      if (recognitionResult.error) {
        throw new Error(`Processing error: ${recognitionResult.error}`);
      }

      // Update card details
      setCardDetails({
        name: recognitionResult.name?.[0] || "",
        address: recognitionResult.address?.[0] || "",
        phone: recognitionResult.phone?.[0] || "",
        website: recognitionResult.url?.[0] || "",
        email: recognitionResult.email?.[0] || "",
        image_url: fileUrl,
      });
    } catch (error) {
      console.error("Error during image processing:", error);
      alert(`Error processing image: ${error.message}`);

      // Reset card details but keep the image
      setCardDetails({
        name: "",
        address: "",
        phone: "",
        website: "",
        email: "",
        image_url: imageUrl || "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <h1>🎯 Business Card Scanner</h1>
      <div className="upload-controls">
        <input
          id="file"
          name="file"
          className="inputfile"
          type="file"
          accept="image/*"
          onChange={handleOnImageChange}
        />
        <label htmlFor="file" className="upload-button">
          📁 Upload & Scan
        </label>

        <input
          id="capture"
          name="capture"
          className="inputfile"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleOnImageChange}
        />
        <label htmlFor="capture" className="upload-button">
          📷 Capture & Scan
        </label>
      </div>

      {isLoading && (
        <div className="loading-container">
          <CircularProgress size={60} sx={{ color: 'white' }} />
          <div className="loading-text">Processing your business card...</div>
        </div>
      )}

      <div className="results-container">
        {imageUrl && (
          <div className="image-preview">
            <img
              src={imageUrl}
              alt="Uploaded preview"
              className="responsive-image"
            />
          </div>
        )}
        {imageUrl && (
          <div className="infoContainer">
            <InfoCard
              cardDetails={cardDetails}
              handleChangeInput={handleChangeInput}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
