import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import List from './list';

import "../styles/infoCard.css"

import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

InfoCard.propTypes = {

};

const serverUrl = "http://127.0.0.1:8000";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


function InfoCard(props) {

    const [open, setOpen] = useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    const onSubmit = () => {
        console.log("props123: ", props.cardDetails);

        fetch(serverUrl + "/cards", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                card_id: null,
                user_id: localStorage.getItem('user_sub'),
                user_names: null,
                telephone_numbers: props.cardDetails.phone ? [props.cardDetails.phone] : [''],
                email_addresses: props.cardDetails.email ? [props.cardDetails.email] : [''],
                company_name: props.cardDetails.name ? props.cardDetails.name : '',
                company_website: props.cardDetails.website ? props.cardDetails.website : '',
                company_address: props.cardDetails.address ? props.cardDetails.address : '',
                image_storage: props.cardDetails.image_url
            })
        }).then(response => response.json())
        .then(res=>{
            console.log("res555", res)
            setOpen(true)
        })
        .catch((error)=>{
            console.log(error)
            setOpen(true)
        })
    }
    return (
        <div>
        <div className="form">
            <div className="title">Business Card Details</div>
            <div className="input-container ic1">
                <input id="name" className="input" type="text" onChange={(event)=>props.handleChangeInput(event,'name')} value={props.cardDetails.name ? props.cardDetails.name : ''} placeholder=" " />
                <label htmlFor="name" className="placeholder">Name</label>
            </div>
            <div className="input-container ic2">
                <input id="phone" className="input" type="text" placeholder=" " onChange={(event)=>props.handleChangeInput(event,'phone')} value={props.cardDetails.phone ? props.cardDetails.phone : ''} />
                <label htmlFor="phone" className="placeholder">Phone</label>
            </div>
            <div className="input-container ic2">
                <input id="email" className="input" type="text" placeholder=" " onChange={(event)=>props.handleChangeInput(event,'email')} value={props.cardDetails.email ? props.cardDetails.email : ''}/>
                <label htmlFor="email" className="placeholder">Email</label>
            </div>
            <div className="input-container ic2">
                <input id="website" className="input" type="text" placeholder=" " onChange={(event)=>props.handleChangeInput(event,'website')} value={props.cardDetails.website ? props.cardDetails.website : ''} />
                <label htmlFor="website" className="placeholder">Website</label>
            </div>
            <div className="input-container ic2">
                <input id="address" className="input" type="text" placeholder=" " onChange={(event)=>props.handleChangeInput(event,'address')} value={props.cardDetails.address ? props.cardDetails.address : ''} />
                <label htmlFor="address" className="placeholder">Address</label>
            </div>
            <button type="text" className="submit" onClick={()=>onSubmit()}>submit</button>
        </div>
        <div>
            <Modal
                open={open}
                onClose={()=>handleClose()}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Success
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Card Details saved successfully!!!
                </Typography>
                </Box>
            </Modal>
        </div>
        <div style={{height:"40px"}}>

        </div>
        </div>

    );
}

export default InfoCard;