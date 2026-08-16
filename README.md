# AquaEquity — AI-Supported Geospatial Platform for Equitable Water-Tanker Allocation

**Team ID**: 141167  
**Team Name**: Victus  
**Problem Statement ID**: PS-B20  
**Problem Statement**: Equitable Water-Tanker Allocation During Urban Shortages  

---

## 🌟 Key Highlights & Core Innovation
AquaEquity is not just a tanker booking portal. It is a comprehensive **AI-Supported Civic Infrastructure System** engineered for equitable water allocation during acute urban water crises:

1. **AI Multi-Factor Priority Engine**: Calculates dynamic urgency scores based on $w_1(\text{Vulnerability}) + w_2(\text{Days Dry}) + w_3(\text{Complaint Density}) + w_4(\text{Facility Type})$.
2. **OR-Tools Geospatial Dispatching**: Optimal vehicle routing minimizing travel time and ensuring priority adherence.
3. **Emergency Medical Override & Automatic Replacement**: Critical hospital shortages automatically intercept the nearest en-route tanker, dynamically notify the displaced citizen, and dispatch a standby replacement tanker without manual disruption.
4. **PostGIS Geofenced Delivery**: Tanker position is cryptographically verified within 50m of the delivery location before dispensation.
5. **Secure OTP Handshake**: Citizen generates an OTP verified on-site by the driver.
6. **Immutable Dispatch Audit Ledger**: Full transparency and accountability for civic authorities and regulators.

---

## 💻 Tech Stack
- **Frontend Core**: React 19, JavaScript (ES6+), JSX
- **Build Tool**: Vite 8
- **Routing**: React Router v7
- **Geospatial Maps**: Leaflet, PostGIS Layer Integration, CartoDB Positron Tiles
- **Charts & Analytics**: Recharts
- **Icons**: Lucide React
- **Network / API**: Axios with mock/real backend service layer abstraction

---

## 🚀 Quick Start Guide

### 1. Installation
```bash
npm install
```

### 2. Running Locally in Development Mode
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🕹️ Interactive Hackathon Demo Scenario
A docked controller appears at the bottom of the screen to guide judges through the full end-to-end lifecycle in 1-click steps:

1. **Step 1 — Citizen Request**: Submit a high-priority water request with 4 dry days and vulnerable senior residents.
2. **Step 2 — Tanker Assignment**: AI engine assigns Tanker `MH-12-AB-1234` (Driver: Rahul Patil) and starts live transit.
3. **Step 3 — Hospital Emergency Override**: Ruby Hall Clinic triggers an emergency shortage. Tanker `MH-12-AB-1234` is intercepted, and standby Tanker `MH-12-CD-5678` is instantly assigned as replacement.
4. **Step 4 — Geofence Arrival**: Replacement tanker arrives within the 50m delivery zone.
5. **Step 5 — OTP Verification**: 6-digit OTP (`849201`) is verified, potability TDS is validated, and delivery completes!

---

## 👥 Personas & Quick Role Switcher
Use the top-right header role toggle to switch between:
- **👤 Citizen / Beneficiary**: Ramesh Jadhav (Kothrud, Ward 14)
- **🏛️ Municipal Admin**: Vijay Deshmukh (PMC Central Water Control HQ)
- **📊 State Water Authority**: Dr. Neha Kulkarni (Maharashtra Water Resources Regulatory Authority)

---

## 📄 Backend Integration
See [`docs/API_CONTRACT.md`](./docs/API_CONTRACT.md) for full FastAPI request/response schemas. Toggle `VITE_USE_MOCK_API=false` in `.env` to connect directly to the FastAPI server.
