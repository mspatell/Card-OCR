# Card-OCR

A serverless, multi-user web app that extracts and manages contact information from business card images using AWS AI/ML services.

## Features

- Upload a business card image to automatically extract contact details (name, email, phone, address, website)
- Edit extracted information manually if needed
- Store, search, and manage contacts via full CRUD operations
- Per-user data isolation with authentication and authorization

## Tech Stack

**Frontend**
- React 18, MUI v7, React Router v6
- AWS Cognito (`amazon-cognito-identity-js`) for auth
- Deployed on Vercel

**Backend**
- Python, AWS Chalice (REST API → API Gateway + Lambda)
- AWS Textract — OCR / text extraction
- AWS Comprehend Medical — entity recognition
- AWS DynamoDB — contact storage
- AWS Cognito User Pools — authentication & authorization

## Project Structure

```
Card-OCR/
├── Capabilities/       # Chalice backend (Lambda + API Gateway)
│   ├── chalicelib/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── app.py
│   └── requirements.txt
└── Website/            # React frontend
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   ├── pages/
    │   └── services/
    └── package.json
```

## Getting Started

### Backend

```bash
cd Capabilities
pip install -r requirements.txt
chalice local          # run locally
chalice deploy         # deploy to AWS
```

### Frontend

```bash
cd Website
yarn install
cp .env.example .env   # fill in Cognito + API Gateway values
yarn start
```

### Required `.env` Variables

```
REACT_APP_USER_POOL_ID=
REACT_APP_CLIENT_ID=
REACT_APP_API_BASE_URL=
```

## AWS Services Required

| Service | Purpose |
|---|---|
| Cognito User Pool | Auth |
| API Gateway + Lambda | REST API (via Chalice) |
| Textract | Image OCR |
| Comprehend Medical | Entity extraction |
| DynamoDB | Contact storage |
| S3 (optional) | Image uploads |
