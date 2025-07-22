import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';
import InfoCard from '../InfoCard/infoCard';
import './fileUpload.css';


FileUpload.propTypes = {};

const serverUrl = process.env.REACT_APP_SERVER_URL;

// const modalStyle = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: '80%',
//     maxWidth: 400,
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,
// };

function FileUpload(props) {
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [startLoading, setStartLoading] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        website: '',
        image_url: '',
    });

    const handleChangeInput = (event, key) => {
        setCardDetails({ ...cardDetails, [key]: event.target.value });
    };

    useEffect(() => {
        if (image) {
            setImageUrl(URL.createObjectURL(image));
        }
    }, [image]);

    useEffect(() => {
        let jwtAccessToken = localStorage.getItem('jwt_access_token');
        if (!jwtAccessToken || !localStorage.getItem('user_sub')) {
            window.location = '/login';
        }
    }, []);

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleOnImageChange = async (e) => {
        const file = e.target.files[0];
        setImage(file);

        if (!file) return;

        setStartLoading(true);

        try {
            const base64 = await convertToBase64(file);
            const encodedString = base64.replace(/^data:(.*,)?/, '');

            const response = await fetch(`${serverUrl}/images`, {
                method: "POST",
                mode: "cors",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ filename: file.name, filebytes: encodedString })
            });

            const result = await response.json();
            const { fileId, fileUrl } = result;

            console.log(`Recognizing entities for file: ${fileId}`);
            const recognitionResponse = await fetch(`${serverUrl}/images/${fileId}/recognize_entities`, {
                method: "POST",
                mode: "cors",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!recognitionResponse.ok) {
                throw new Error(`API error: ${recognitionResponse.status} ${await recognitionResponse.text()}`);
            }
            
            const recognitionResult = await recognitionResponse.json();
            console.log('Recognition result:', recognitionResult);
            
            if (recognitionResult.error) {
                throw new Error(`Processing error: ${recognitionResult.error}`);
            }
            
            setCardDetails({
                name: recognitionResult.name && recognitionResult.name[0],
                address: recognitionResult.address && recognitionResult.address[0],
                phone: recognitionResult.phone && recognitionResult.phone[0],
                website: recognitionResult.url && recognitionResult.url[0],
                email: recognitionResult.email && recognitionResult.email[0],
                image_url: fileUrl
            });

            setStartLoading(false);
        } catch (error) {
            console.error("Error during image processing:", error);
            setStartLoading(false);
            alert(`Error processing image: ${error.message}`);
            
            // Still set the image URL so user can see the uploaded image
            setCardDetails({
                name: '',
                address: '',
                phone: '',
                website: '',
                email: '',
                image_url: imageUrl || ''
            });
        }
    };

    return (
        <div className="file-upload-container">
            {/* <h1>Business Card Details</h1> */}
            <div className="upload-controls">
                <input
                    id="file"
                    name="file"
                    className="inputfile"
                    type="file"
                    accept="image/*"
                    onChange={handleOnImageChange}
                />
                <label htmlFor="file" className="upload-button">Upload & Scan</label>

                <input
                    id="capture"
                    name="capture"
                    className="inputfile"
                    type="file"
                    accept="image/*"
                    capture="environment"
                />
                <label htmlFor="capture" className="upload-button">Capture & Scan</label>
            </div>

            {startLoading && (
                <Box sx={{ textAlign: 'center', marginTop: '40px' }}>
                    <CircularProgress size={60} disabled={startLoading} />
                </Box>
            )}

            <div className="results-container">
                {imageUrl && (
                    <div className="image-preview">
                        <img src={imageUrl} alt="Uploaded preview" className="responsive-image" />
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
