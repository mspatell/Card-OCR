import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { forgotPassword, confirmForgotPassword } from "../../services/authSevice";
import styles from "../Login/Login.styles";

function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: request code, 2: reset password
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleRequestCode = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await forgotPassword(email);
            setMessage("A verification code has been sent to your email.");
            setStep(2);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await confirmForgotPassword(email, code, newPassword);
            setMessage("Password reset successful!");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <div style={styles.titleContainer}>
                    <h2 style={styles.title}>Forgot Password</h2>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleRequestCode}>
                        <div style={styles.inputContainer}>
                            <label htmlFor="email" style={styles.label}>Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                style={styles.input}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            style={styles.button}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2e8b57'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3CB371'}
                        >
                            Send Code
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <div style={styles.inputContainer}>
                            <label htmlFor="code" style={styles.label}>Verification Code</label>
                            <input
                                id="code"
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Enter the code"
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.inputContainer}>
                            <label htmlFor="newPassword" style={styles.label}>New Password</label>
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                style={styles.input}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            style={styles.button}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#2e8b57'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#3CB371'}
                        >
                            Reset Password
                        </button>
                    </form>
                )}

                <NavLink to="/login" style={styles.link}>
                    Back to Login
                </NavLink>

                {message && <div style={{ ...styles.messageContainer, backgroundColor: '#ddffdd', color: '#2e7d32' }}>{message}</div>}
                {error && <div style={styles.messageContainer}>{error}</div>}
            </div>
        </div>
    );
}

export default ForgotPassword;
