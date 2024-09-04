import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "../userPool";

function Login(props) {
    const navigate = useNavigate();

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
                setMessage(err.message);
            },
            newPasswordRequired: (data) => {
                console.log("newPasswordRequired: ", data);
            },
        });
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <div style={styles.titleContainer}>
                    <h2 style={styles.title}>Login</h2>
                </div>
                <form onSubmit={onSubmit}>
                    <div style={styles.inputContainer}>
                        <label htmlFor="email" style={styles.label}>Email</label>
                        <input
                            id="email"
                            type="email"
                            onChange={(event) => setEmail(event.target.value)}
                            value={email}
                            placeholder="Enter your email"
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.inputContainer}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            onChange={(event) => setPassword(event.target.value)}
                            value={password}
                            style={styles.input}
                        />
                    </div>
                    <button
                        type="submit"
                        style={styles.button}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2e8b57'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3CB371'}
                    >
                        Login
                    </button>
                    
                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                        Or
                    </div>

                    <button
                        type="button"
                        style={styles.button}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2e8b57'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3CB371'}
                        onClick={() => navigate('/signup')}
                    >
                        Sign Up
                    </button>
                </form>
                {message && (
                    <div style={styles.messageContainer}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
        padding: '20px',
    },
    formContainer: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    titleContainer: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    title: {
        margin: 0,
        color: '#333',
    },
    inputContainer: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#333',
        fontSize: '16px',
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '16px',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#3CB371',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    messageContainer: {
        marginTop: '20px',
        backgroundColor: '#ffdddd',
        padding: '15px',
        borderRadius: '5px',
        color: '#d8000c',
        textAlign: 'center',
    },
};

export default Login;