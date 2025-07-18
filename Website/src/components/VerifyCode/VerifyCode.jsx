import React, { useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import UserPool from "../../services/userPool"; 
import styles from "./VerifyCode.styles"; 

function VerifyCode({ email }) {
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const onSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);

        const user = new CognitoUser({
            Username: email,
            Pool: UserPool
        });

        user.confirmRegistration(verificationCode, true, (err, result) => {
            setIsLoading(false);
            if (err) {
                console.error(err);
                setMessage({ text: err.message, type: "error" });
            } else {
                setMessage({ text: "Verification successful. You can now log in.", type: "success" });
                console.log(result);
                // Optionally, you can redirect to the login page here
                setTimeout(() => window.location = "/login", 3000);
            }
        });
    };

    const resendVerificationCode = () => {
        setIsLoading(true);
        const user = new CognitoUser({
            Username: email,
            Pool: UserPool
        });

        user.resendConfirmationCode((err, result) => {
            setIsLoading(false);
            if (err) {
                console.error(err);
                setMessage({ text: err.message, type: "error" });
            } else {
                setMessage({ text: "A new verification code has been sent to your email.", type: "info" });
            }
        });
    };

    return (
        <div style={styles.container}>
            <form onSubmit={onSubmit}>
                <div style={styles.inputContainer}>
                    <label htmlFor="verificationCode" style={styles.label}>Verification Code</label>
                    <input
                        id="verificationCode"
                        type="text"
                        onChange={(event) => setVerificationCode(event.target.value)}
                        value={verificationCode}
                        placeholder="Enter verification code"
                        style={styles.input}
                    />
                </div>
                <button
                    type="submit"
                    style={styles.button}
                    disabled={isLoading}
                >
                    {isLoading ? 'Verifying...' : 'Verify'}
                </button>
            </form>
            <button
                onClick={resendVerificationCode}
                style={styles.resendButton}
                disabled={isLoading}
            >
                Resend Code
            </button>
            {message && (
                <div style={{
                    ...styles.messageContainer,
                    backgroundColor: message.type === 'error' ? '#ffdddd' : message.type === 'success' ? '#ddffdd' : '#e6f3ff',
                    color: message.type === 'error' ? '#d8000c' : message.type === 'success' ? '#4F8A10' : '#31708f'
                }}>
                    {message.text}
                </div>
            )}
        </div>
    );
}

export default VerifyCode;
