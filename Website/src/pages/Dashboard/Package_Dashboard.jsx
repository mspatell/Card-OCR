const PACKAGE_API_URL = 'https://yjqxv4hlx3.execute-api.us-east-1.amazonaws.com/api';

const handlePackageScan = async (file) => {
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const response = await fetch(`${PACKAGE_API_URL}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_data: base64, filename: file.name }),
  });

  return response.json();
};

export default handlePackageScan;
