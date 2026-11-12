import React, { useEffect, useState } from "react";
import AppLayout from "@cloudscape-design/components/app-layout";
import ContentLayout from "@cloudscape-design/components/content-layout";
import Header from "@cloudscape-design/components/header";
import Container from "@cloudscape-design/components/container";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Spinner from "@cloudscape-design/components/spinner";
import Grid from "@cloudscape-design/components/grid";
import Box from "@cloudscape-design/components/box";
import Alert from "@cloudscape-design/components/alert";
import handlePackageScan from "./Package_Dashboard";
import InfoCard from "../../components/InfoCard/infoCard";

const serverUrl = process.env.REACT_APP_SERVER_URL;

function Dashboard() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scanMode, setScanMode] = useState("card");
  const [cardDetails, setCardDetails] = useState({ name: "", phone: "", email: "", address: "", website: "", image_url: "" });
  const [packageDetails, setPackageDetails] = useState({ first_name: "", last_name: "", unit_number: "" });

  const handleChangeInput = (event, key) => setCardDetails({ ...cardDetails, [key]: event.target.value });

  useEffect(() => { if (image) setImageUrl(URL.createObjectURL(image)); }, [image]);
  useEffect(() => {
    if (!localStorage.getItem("jwt_access_token") || !localStorage.getItem("user_sub")) {
      window.location = "/login";
    }
  }, []);

  const convertToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  const handleOnPackageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file); setScanMode("package"); setLoading(true); setError(null);
    try {
      const result = await handlePackageScan(file);
      setPackageDetails({
        first_name: result.entities?.first_name || "",
        last_name: result.entities?.last_name || "",
        unit_number: result.entities?.unit_number || "",
      });
      
    } catch (err) { setError("Failed to process package label."); }
    finally { setLoading(false); }
  };

  const handleOnImageChange = async (e) => {
    setScanMode("card");
    const file = e.target.files[0];
    if (!file) return;
    setImage(file); setLoading(true); setError(null);
    try {
      const base64 = await convertToBase64(file);
      const encodedString = base64.replace(/^data:(.*,)?/, "");
      const res = await fetch(`${serverUrl}/images`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, filebytes: encodedString }),
      });
      const { fileId, fileUrl } = await res.json();
      const recRes = await fetch(`${serverUrl}/images/${fileId}/recognize_entities`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const r = await recRes.json();
      setCardDetails({
        name: r.name?.[0] || "", address: r.address?.[0] || "",
        phone: r.phone?.[0] || "", website: r.url?.[0] || "",
        email: r.email?.[0] || "", image_url: fileUrl,
      });
    } catch (err) { setError("Failed to process image. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <AppLayout
      navigationHide
      toolsHide
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              description="Upload or capture a business card to extract contact information automatically"
            >
              Business Card Scanner
            </Header>
          }
        >
          <SpaceBetween size="l">
            {error && <Alert type="error" dismissible onDismiss={() => setError(null)}>{error}</Alert>}

            {/* Upload Actions */}
            <Container header={<Header variant="h2">Choose a scan option</Header>}>
              <SpaceBetween direction="horizontal" size="xs">
                <ScanButton id="cs-file" label="Upload & Scan" icon="upload" onChange={handleOnImageChange} />
                <ScanButton id="cs-capture" label="Capture & Scan" icon="video-on" onChange={handleOnImageChange} capture="environment" />
                <ScanButton id="cs-package" label="Package Label" icon="search" onChange={handleOnPackageChange} />
              </SpaceBetween>
            </Container>

            {/* Results */}
            {imageUrl && (
              <Grid gridDefinition={[{ colspan: { default: 12, m: 6 } }, { colspan: { default: 12, m: 6 } }]}>
                <Container header={<Header variant="h2">Uploaded Image</Header>}>
                  <div style={{ position: "relative", textAlign: "center" }}>
                    <img src={imageUrl} alt="Uploaded preview"
                      style={{ width: "100%", height: "auto", borderRadius: 4, opacity: loading ? 0.4 : 1 }} />
                    {loading && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Spinner size="large" />
                      </div>
                    )}
                  </div>
                </Container>

                <Container header={<Header variant="h2">{scanMode === "card" ? "Extracted Details" : "Package Details"}</Header>}>
                  {scanMode === "card" ? (
                    <InfoCard cardDetails={cardDetails} handleChangeInput={handleChangeInput} />
                  ) : (
                    <SpaceBetween size="s">
                      <KeyValue label="First Name" value={packageDetails.first_name} />
                      <KeyValue label="Last Name" value={packageDetails.last_name} />
                      <KeyValue label="Unit Number" value={packageDetails.unit_number} />
                    </SpaceBetween>
                  )}
                </Container>
              </Grid>
            )}
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}

const ScanButton = ({ id, label, icon, onChange, capture }) => (
  <>
    <input id={id} type="file" accept="image/*" capture={capture} onChange={onChange} style={{ display: "none" }} />
    <label htmlFor={id}>
      <Button iconName={icon} onClick={() => document.getElementById(id).click()}>
        {label}
      </Button>
    </label>
  </>
);

const KeyValue = ({ label, value }) => (
  <div>
    <Box variant="awsui-key-label">{label}</Box>
    <Box>{value || "—"}</Box>
  </div>
);

export default Dashboard;
