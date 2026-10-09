# TruthLens — Think Before You Trust

 TruthLens is an explainable scam detection and link intelligence platform built with React, Node.js, Express, and Prisma ORM.

## Features
- **URL & Domain Intelligence Scanner**: Analyzes hostnames for brand typosquatting, raw IP addresses, punycode IDN homograph encoding, and high-risk TLDs.
- **Message Scam Pattern Analyzer**: Detects OTP theft requests, bank card / account details harvesting, artificial urgency, and fake job application fees.
- **Threat Intelligence Adapters**: Integrates Google Web Risk API and VirusTotal API v3 with a transparent Heuristic-Only fallback mode.
- **Persistent Scan Audit History**: Saved scan records with search, verdict filters, pagination, and data deletion rights.
- **Cybersecurity SaaS UI**: Built with Tailwind CSS, Recharts data visualization, and Lucide React icons.

## Getting Started Locally

### 1. Install Dependencies
```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 2. Setup Database
```bash
cd server
npx prisma db push --schema=../prisma/schema.prisma
```

### 3. Run Development Servers
- Backend Server (Port 5000): `cd server && npm run dev`
- Frontend Client (Port 3000): `cd client && npm run dev`
