import React, { useState } from "react";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Button from "@cloudscape-design/components/button";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Flashbar from "@cloudscape-design/components/flashbar";

const serverUrl = process.env.REACT_APP_SERVER_URL;

const fields = [
  { id: "name",    label: "Full Name",     type: "text",  key: "name" },
  { id: "phone",   label: "Phone Number",  type: "tel",   key: "phone" },
  { id: "email",   label: "Email Address", type: "email", key: "email" },
  { id: "website", label: "Website",       type: "url",   key: "website" },
  { id: "address", label: "Address",       type: "text",  key: "address" },
];

function InfoCard({ cardDetails, handleChangeInput }) {
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const onSubmit = async () => {
    const user_id = localStorage.getItem("user_sub");
    if (!user_id) { alert("You must be logged in to save a card"); return; }
    setIsLoading(true);
    try {
      const res = await fetch(`${serverUrl}/cards`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          card_id: null, user_id,
          user_names: cardDetails.name || "Unknown",
          telephone_numbers: cardDetails.phone ? [cardDetails.phone] : [""],
          email_addresses: cardDetails.email ? [cardDetails.email] : [""],
          company_name: cardDetails.name || "",
          company_website: cardDetails.website || "",
          company_address: cardDetails.address || "",
          image_storage: cardDetails.image_url || "",
        }),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      await res.json();
      setSaved(true);
      setTimeout(() => { window.location.href = "/dashboard"; }, 1200);
    } catch (err) {
      alert("Error saving card: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SpaceBetween size="m">
      {saved && (
        <Flashbar items={[{
          type: "success",
          content: "Contact saved! Redirecting...",
          id: "saved",
        }]} />
      )}
      <Form
        actions={
          <Button variant="primary" onClick={onSubmit} loading={isLoading}>
            Save Contact
          </Button>
        }
      >
        <SpaceBetween size="s">
          {fields.map((f) => (
            <FormField key={f.id} label={f.label}>
              <Input
                type={f.type}
                value={cardDetails[f.key] || ""}
                onChange={({ detail }) => handleChangeInput({ target: { value: detail.value } }, f.key)}
                placeholder={`Enter ${f.label.toLowerCase()}`}
              />
            </FormField>
          ))}
        </SpaceBetween>
      </Form>
    </SpaceBetween>
  );
}

export default InfoCard;
