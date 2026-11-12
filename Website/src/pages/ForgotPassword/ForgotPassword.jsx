import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Button from "@cloudscape-design/components/button";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Alert from "@cloudscape-design/components/alert";
import Link from "@cloudscape-design/components/link";
import { forgotPassword, confirmForgotPassword } from "../../services/authSevice";
import "../../styles/App.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault(); setError(null); setLoading(true);
    try { await forgotPassword(email); setMessage("Verification code sent to your email."); setStep(2); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      await confirmForgotPassword(email, code, newPassword);
      setMessage("Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div style={{ width: "100%", maxWidth: 380 }}>
        <form onSubmit={step === 1 ? handleRequestCode : handleResetPassword}>
          <Form
            header={<Header variant="h1">Password assistance</Header>}
            actions={
              <Button variant="primary" formAction="submit" loading={loading} fullWidth>
                {step === 1 ? "Continue" : "Save changes"}
              </Button>
            }
            secondaryActions={<Link href="/login">← Back to Sign in</Link>}
          >
            <Container>
              <SpaceBetween direction="vertical" size="m">
                {error && <Alert type="error">{error}</Alert>}
                {message && <Alert type="success">{message}</Alert>}

                {step === 1 ? (
                  <FormField
                    label="Email"
                    description="Enter the email address associated with your account."
                  >
                    <Input
                      type="email"
                      value={email}
                      onChange={({ detail }) => setEmail(detail.value)}
                      autoFocus
                    />
                  </FormField>
                ) : (
                  <>
                    <FormField label="Verification Code">
                      <Input
                        value={code}
                        onChange={({ detail }) => setCode(detail.value)}
                        autoFocus
                      />
                    </FormField>
                    <FormField label="New Password">
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={({ detail }) => setNewPassword(detail.value)}
                      />
                    </FormField>
                  </>
                )}
              </SpaceBetween>
            </Container>
          </Form>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
