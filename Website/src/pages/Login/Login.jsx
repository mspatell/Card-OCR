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
import { loginUser } from "../../services/authSevice";
import "../../styles/App.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginUser(email, password);
      window.location = "/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div style={{ width: "100%", maxWidth: 380 }}>
        <form onSubmit={onSubmit}>
          <Form
            header={<Header variant="h1">Sign in</Header>}
            actions={
              <SpaceBetween direction="vertical" size="xs">
                <Button variant="primary" formAction="submit" loading={loading} fullWidth>
                  Sign in
                </Button>
                <Button variant="normal" onClick={() => navigate("/signup")} fullWidth>
                  Create your account
                </Button>
              </SpaceBetween>
            }
            secondaryActions={
              <Link href="/forgot-password" fontSize="body-s">Forgot your password?</Link>
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
                <FormField label="Password">
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
      </div>
    </div>
  );
}

export default Login;
