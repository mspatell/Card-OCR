import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { loginUser } from "../../services/authSevice";
import styles from "./Login.styles";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            await loginUser(email, password);
            window.location = '/dashboard';
        } catch (err) {
            console.error("Login error: ", err.message);
            setMessage(err.message);
        }
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

export default Login;
