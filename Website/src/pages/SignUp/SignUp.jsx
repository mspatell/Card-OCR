import React, { useState } from "react";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Button from "@cloudscape-design/components/button";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Alert from "@cloudscape-design/components/alert";
import Link from "@cloudscape-design/components/link";
import UserPool from "../../services/userPool";
import VerifyCode from "../../components/VerifyCode/VerifyCode";
import "../../styles/App.css";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    UserPool.signUp(email, password, [], null, (err) => {
      setLoading(false);
      if (err) { setError(err.message); }
      else { setShowVerification(true); }
    });
  };

  return (
    <div className="auth-page">
      <div style={{ width: "100%", maxWidth: 380 }}>
        {!showVerification ? (
          <form onSubmit={onSubmit}>
            <Form
              header={<Header variant="h1">Create account</Header>}
              actions={
                <Button variant="primary" formAction="submit" loading={loading} fullWidth>
                  Create your account
                </Button>
              }
              secondaryActions={
                <span style={{ fontSize: 13 }}>
                  Already have an account? <Link href="/login">Sign in</Link>
                </span>
              }
            >
              <Container>
                <SpaceBetween direction="vertical" size="m">
                  {error && <Alert type="error">{error}</Alert>}
                  <FormField label="Email">
                    <Input
                      type="email"
                      value={email}
                      onChange={({ detail }) => setEmail(detail.value)}
                      autoFocus
                    />
                  </FormField>
                  <FormField label="Password" constraintText="At least 8 characters">
                    <Input
                      type="password"
                      value={password}
                      onChange={({ detail }) => setPassword(detail.value)}
                    />
                  </FormField>
                </SpaceBetween>
              </Container>
            </Form>
          </form>
        ) : (
          <Container header={<Header variant="h2">Verify your email</Header>}>
            <VerifyCode email={email} />
          </Container>
        )}
      </div>
    </div>
  );
}

export default SignUp;
