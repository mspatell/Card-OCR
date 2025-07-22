import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import InfoCard from '../../components/InfoCard/infoCard';
import './Dashboard.css';

const serverUrl = process.env.REACT_APP_SERVER_URL;

function Dashboard(props) {
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
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ filename: file.name, filebytes: encodedString })
            });

            const result = await response.json();
            const { fileId, fileUrl } = result;

            const recognitionResponse = await fetch(`${serverUrl}/images/${fileId}/recognize_entities`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            const recognitionResult = await recognitionResponse.json();

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
        }
    };

    return (
        <div className="file-upload-container">
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

export default Dashboard;