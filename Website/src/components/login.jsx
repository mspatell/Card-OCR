import React, { useState } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "../userPool";
import "../styles/infoCard.css"


function Login(props) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [password, setPassword] = useState("");

    const onSubmit = (event) => {
        event.preventDefault();

        const user = new CognitoUser({
            Username: email,
            Pool: UserPool,
        });

        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password,
        });

        user.authenticateUser(authDetails, {
            onSuccess: (data) => {
                console.log("onSuccess: ", data);
                localStorage.setItem('jwt_access_token', data.accessToken.jwtToken);
                localStorage.setItem('user_sub', data.accessToken.payload.sub);
                window.location = '/dashboard';
            },
            onFailure: (err) => {
            console.error("onFailure: ", err.message);
            setMessage(err.message)
            },
            newPasswordRequired: (data) => {
            console.log("newPasswordRequired: ", data);
            },
        });
    };
    return (
        <div style={{textAlign: "center", position: 'relative', left: '35%', marginTop: '45px'}}>
            <div className="form" style={{height: "450px"}}>
            <div className="title">Login</div>
            <div className="input-container ic1">
                <input id="email" className="input" type="email" onChange={(event) => setEmail(event.target.value)} value={email} placeholder=" " />
                <label htmlFor="email" className="placeholder">Email</label>
            </div>
            <div className="input-container ic2">
                <input id="password" className="input" type="password" placeholder=" " onChange={(event) => setPassword(event.target.value)} value={password} />
                <label htmlFor="password" className="placeholder">Password</label>
            </div>
            <button type="text" className="submit" onClick={(e)=>onSubmit(e)}>Login</button>
            {
                message &&
                <h4 style={{backgroundColor: '#f88379', padding:"20px", borderRadius: "10px"}}>{message}</h4>
            }
        </div>

        </div>

    );
}

export default Login;