import React, { useState } from 'react';
import "./infoCard.css";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const serverUrl = process.env.REACT_APP_SERVER_URL;

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 400 },
    maxWidth: 400,
    bgcolor: 'background.paper',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    p: 4,
    border: 'none',
};


function InfoCard(props) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = async () => {
        const user_id = localStorage.getItem('user_sub');
        
        if (!user_id) {
            alert("You must be logged in to save a card");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(serverUrl + "/cards", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    card_id: null,
                    user_id: user_id,
                    user_names: props.cardDetails.name || 'Unknown',
                    telephone_numbers: props.cardDetails.phone ? [props.cardDetails.phone] : [''],
                    email_addresses: props.cardDetails.email ? [props.cardDetails.email] : [''],
                    company_name: props.cardDetails.name ? props.cardDetails.name : '',
                    company_website: props.cardDetails.website ? props.cardDetails.website : '',
                    company_address: props.cardDetails.address ? props.cardDetails.address : '',
                    image_storage: props.cardDetails.image_url || ''
                })
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            await response.json();
            setOpen(true);
            
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 900);
        } catch (error) {
            console.error("Error saving card:", error);
            alert("Error saving card: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };
    const inputFields = [
        { id: 'name', label: '👤 Full Name', type: 'text', key: 'name' },
        { id: 'phone', label: '📱 Phone Number', type: 'tel', key: 'phone' },
        { id: 'email', label: '📧 Email Address', type: 'email', key: 'email' },
        { id: 'website', label: '🌐 Website', type: 'url', key: 'website' },
        { id: 'address', label: '📍 Address', type: 'text', key: 'address' }
    ];

    return (
        <div className="info-card-container">
            <div className="form">
                <div className="title">
                    <span className="title-icon">💼</span>
                    Business Card Details
                </div>
                
                <div className="form-grid">
                    {inputFields.map((field) => (
                        <div key={field.id} className="input-container">
                            <input 
                                id={field.id}
                                className="input"
                                type={field.type}
                                onChange={(event) => props.handleChangeInput(event, field.key)}
                                value={props.cardDetails[field.key] || ''}
                                placeholder=" "
                                autoComplete={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'off'}
                            />
                            <label htmlFor={field.id} className="placeholder">
                                {field.label}
                            </label>
                        </div>
                    ))}
                </div>
                
                <button 
                    type="button" 
                    className={`submit ${isLoading ? 'loading' : ''}`}
                    onClick={onSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner"></span>
                            Saving...
                        </>
                    ) : (
                        <>
                            💾 Save Contact
                        </>
                    )}
                </button>
            </div>
            
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="success-modal-title"
                aria-describedby="success-modal-description"
            >
                <Box sx={modalStyle}>
                    <div className="success-modal">
                        <CheckCircleIcon sx={{ fontSize: 48, color: '#4CAF50', mb: 2 }} />
                        <Typography 
                            id="success-modal-title" 
                            variant="h5" 
                            component="h2"
                            sx={{ fontWeight: 600, color: '#333', textAlign: 'center' }}
                        >
                            Success!
                        </Typography>
                        <Typography 
                            id="success-modal-description" 
                            sx={{ mt: 2, textAlign: 'center', color: '#666' }}
                        >
                            Contact saved successfully!
                        </Typography>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default InfoCard;