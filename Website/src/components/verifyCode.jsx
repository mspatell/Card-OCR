import React, { useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import UserPool from "../userPool";

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

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    inputContainer: {
        marginBottom: '20px',
        width: '100%',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#333',
        fontSize: '16px',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '4px',
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
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    resendButton: {
        marginTop: '10px',
        padding: '8px 16px',
        backgroundColor: 'transparent',
        color: '#3CB371',
        border: '1px solid #3CB371',
        borderRadius: '4px',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.3s',
    },
    messageContainer: {
        marginTop: '20px',
        padding: '15px',
        borderRadius: '4px',
        textAlign: 'center',
        fontSize: '14px',
        width: '100%',
        boxSizing: 'border-box',
    },
};

export default VerifyCode;
