import React, { useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Button from "@cloudscape-design/components/button";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Alert from "@cloudscape-design/components/alert";
import UserPool from "../../services/userPool";

function VerifyCode({ email }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const user = new CognitoUser({ Username: email, Pool: UserPool });
    user.confirmRegistration(code, true, (err) => {
      setLoading(false);
      if (err) {
        setMessage({ type: "error", text: err.message });
      } else {
        setMessage({ type: "success", text: "Verification successful. Redirecting to login..." });
        setTimeout(() => window.location = "/login", 2000);
      }
    });
  };

  const resend = () => {
    setLoading(true);
    const user = new CognitoUser({ Username: email, Pool: UserPool });
    user.resendConfirmationCode((err) => {
      setLoading(false);
      setMessage(err
        ? { type: "error", text: err.message }
        : { type: "info", text: "A new code has been sent to your email." }
      );
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <SpaceBetween size="m">
        {message && <Alert type={message.type}>{message.text}</Alert>}
        <FormField label="Verification Code" description={`Enter the code sent to ${email}`}>
          <Input value={code} onChange={({ detail }) => setCode(detail.value)} autoFocus />
        </FormField>
        <SpaceBetween direction="horizontal" size="xs">
          <Button variant="primary" formAction="submit" loading={loading}>Verify</Button>
          <Button variant="link" onClick={resend} disabled={loading}>Resend code</Button>
        </SpaceBetween>
      </SpaceBetween>
    </form>
  );
}

export default VerifyCode;
