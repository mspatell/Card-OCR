import React, { useState } from 'react';

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const API_URL = 'https://yjqxv4hlx3.execute-api.us-east-1.amazonaws.com/api';

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const scanShipmentLabel = async () => {
    if (!selectedFile) {
      alert('Please select an image file');
      return;
    }

    setLoading(true);
    try {
      // Convert file to base64
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(selectedFile);
      });

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_data: base64,
          filename: selectedFile.name,
          user_id: 'user123',
          comment: 'Scanned from dashboard'
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error scanning label');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Shipment Tracker Dashboard</h1>
      
      <div>
        <input type="file" accept="image/*" onChange={handleFileSelect} />
        <button onClick={scanShipmentLabel} disabled={loading}>
          {loading ? 'Scanning...' : 'Scan Shipment Label'}
        </button>
      </div>

      {result && (
        <div>
          <h3>Scan Results:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Dashboard;