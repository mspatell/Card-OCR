import React, { useState } from 'react';
import UserPool from "../userPool";

function SignUp(props) {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [password, setPassword] = useState("");

    const onSubmit = (event) => {
        event.preventDefault();

        UserPool.signUp(email, password, [], null, (err, data) => {
            if (err) {
                console.error(err);
                setMessage(err.message);
            } else {
                console.log(data);
                window.location = "/login";
            }
        });
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <div style={styles.titleContainer}>
                    <h2 style={styles.title}>Sign Up</h2>
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

export default SignUp;