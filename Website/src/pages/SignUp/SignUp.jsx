import React, { useState } from "react";
import UserPool from "../../services/userPool";
import VerifyCode from "../../components/VerifyCode/VerifyCode";
import styles from "./SignUp.styles";

function SignUp(props) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [password, setPassword] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();

    UserPool.signUp(email, password, [], null, (err, data) => {
      if (err) {
        console.error(err);
        setMessage(err.message);
      } else {
        console.log(data);
        // window.location = "/login";
        // setMessage({
        //   text: "Verification code has been sent to your email. Please check and enter above.",
        //   type: "success",
        // });
        setShowVerification(true);
      }
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <div style={styles.titleContainer}>
          <h2 style={styles.title}>Sign Up</h2>
        </div>
        {!showVerification ? (
          <form onSubmit={onSubmit}>
            <div style={styles.inputContainer}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
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
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
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
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#2e8b57")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#3CB371")}
            >
              Sign Up
            </button>

            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <a href="/login" style={styles.link}>
                {" "}
                Already have an account? Login
              </a>
            </div>
          </form>
        ) : (
          <VerifyCode email={email} />
        )}
        {message && <div style={styles.messageContainer}>{message}</div>}
      </div>
    </div>
  );
}

export default SignUp;