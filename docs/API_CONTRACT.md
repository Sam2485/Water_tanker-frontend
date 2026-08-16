# AquaEquity — Backend API Contract & Specification
**Problem Statement PS-B20**: Equitable Water-Tanker Allocation During Urban Shortages  
**Team ID**: 141167 | **Team Name**: Victus  
**Backend Framework**: FastAPI + PostgreSQL / PostGIS + Redis + Google OR-Tools

---

## 1. Overview & Base Configuration
- **Base URL**: `http://localhost:8000/api`
- **Environment Toggle**: `VITE_USE_MOCK_API=false` in `.env` connects this React frontend directly to the FastAPI server.
- **Authentication**: Bearer Token in `Authorization: Bearer <token>` header.

---

## 2. Authentication Endpoints

### `POST /auth/send-otp`
Sends a 6-digit SMS OTP to the user's mobile number.
- **Request Body**:
```json
{
  "phone": "+919876543210"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### `POST /auth/verify-otp`
Verifies OTP and returns user profile and JWT token.
- **Request Body**:
```json
{
  "phone": "+919876543210",
  "otp": "123456",
  "role": "CITIZEN"
}
```
- **Response `200 OK`**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr-cit-101",
    "name": "Ramesh Jadhav",
    "phone": "+919876543210",
    "role": "CITIZEN",
    "ward": "Ward 14 - Kothrud North",
    "address": "Plot 42, Mayur Colony, Kothrud, Pune"
  }
}
```

---

## 3. Water Requests Endpoints

### `POST /requests`
Submits a new citizen or facility water request.
- **Request Body**:
```json
{
  "citizenId": "usr-cit-101",
  "citizenName": "Ramesh Jadhav",
  "citizenPhone": "+919876543210",
  "address": "Plot 42, Mayur Colony, Kothrud, Pune",
  "latitude": 18.5074,
  "longitude": 73.8077,
  "quantityLiters": 6000,
  "peopleAffected": 45,
  "daysWithoutWater": 4,
  "facilityType": "HOUSEHOLD",
  "hasInfantsOrElderly": true,
  "notes": "Ground sump completely dry. 8 senior citizens in building."
}
```
- **Response `201 Created`**:
```json
{
  "id": "REQ-1031",
  "citizenId": "usr-cit-101",
  "citizenName": "Ramesh Jadhav",
  "priorityScore": 8.7,
  "priorityLevel": "CRITICAL",
  "priorityFactors": {
    "vulnerability": 8.5,
    "daysWithoutWater": 4,
    "complaintDensity": 8.8,
    "facilityCriticality": 8.0,
    "compositeScore": 8.7
  },
  "status": "PRIORITY_CALCULATED",
  "createdAt": "2026-08-16T10:30:00Z"
}
```

### `GET /requests`
Returns all requests with optional query params `?status=IN_TRANSIT&priority=CRITICAL`.

### `GET /requests/{id}`
Returns details for a single request.

---

## 4. Fleet & Tanker Management

### `GET /tankers`
Returns the list of municipal fleet tankers with live telemetry.
- **Response `200 OK`**:
```json
[
  {
    "id": "tnk-101",
    "registrationNumber": "MH-12-AB-1234",
    "driver": {
      "id": "drv-1",
      "name": "Rahul Patil",
      "phone": "+919822144551",
      "rating": 4.8,
      "photoUrl": "https://...",
      "totalDeliveries": 412,
      "licenseNumber": "MH-12-2016-0044812"
    },
    "capacityLiters": 10000,
    "currentLiters": 10000,
    "status": "IN_TRANSIT",
    "latitude": 18.5124,
    "longitude": 73.8389,
    "heading": 45,
    "speedKmH": 28,
    "batteryLevel": 92,
    "lastPing": "2026-08-16T10:32:00Z"
  }
]
```

---

## 5. Dispatch & Assignments

### `POST /assignments`
AI OR-Tools / manual assignment of a tanker to a pending request.
- **Request Body**:
```json
{
  "requestId": "REQ-1024",
  "tankerId": "tnk-101"
}
```
- **Response `201 Created`**:
```json
{
  "id": "asg-demo-1",
  "requestId": "REQ-1024",
  "tankerId": "tnk-101",
  "driverId": "drv-1",
  "status": "IN_TRANSIT",
  "routeCoordinates": [
    [18.5304, 73.8474],
    [18.5244, 73.8424],
    [18.5074, 73.8077]
  ],
  "distanceKm": 2.3,
  "etaMinutes": 14,
  "otpCode": "849201",
  "isGeofenceValid": false,
  "geofenceStatus": "APPROACHING"
}
```

---

## 6. Live Tracking & Geofencing

### `GET /tracking/{tankerId}`
Returns real-time GPS telemetry, remaining distance, speed, and geofence state.
- **Response `200 OK`**:
```json
{
  "tankerId": "tnk-101",
  "latitude": 18.5124,
  "longitude": 73.8389,
  "speedKmH": 28,
  "heading": 45,
  "distanceKm": 2.3,
  "etaMinutes": 14,
  "geofenceStatus": "APPROACHING",
  "lastPing": "2026-08-16T10:34:10Z"
}
```

---

## 7. Emergency Override & Interception

### `POST /emergency/override`
Triggers AI Emergency Override: intercepts nearest active tanker, redirects to hospital, and dispatches a standby replacement tanker to the displaced citizen.
- **Request Body**:
```json
{
  "emergencyId": "EMG-901"
}
```
- **Response `200 OK`**:
```json
{
  "emergency": { "id": "EMG-901", "status": "RESPONDING" },
  "interceptedTanker": { "id": "tnk-101", "registrationNumber": "MH-12-AB-1234" },
  "displacedRequest": { "id": "REQ-1024", "status": "REASSIGNED" },
  "replacementTanker": { "id": "tnk-102", "registrationNumber": "MH-12-CD-5678" }
}
```

---

## 8. Delivery Verification & Cryptographic Handshake

### `POST /delivery/verify`
Validates citizen 6-digit OTP code and PostGIS geofence perimeter (< 50m).
- **Request Body**:
```json
{
  "assignmentId": "asg-demo-1",
  "otpCode": "849201"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Delivery Verified and Completed successfully.",
  "completedAt": "2026-08-16T10:45:00Z",
  "volumeDispensed": 6000,
  "waterQualityTds": 142
}
```

---

## 9. Analytics & Audit

- `GET /admin/analytics/summary`
- `GET /admin/analytics/priorities`
- `GET /admin/analytics/daily`
- `GET /admin/analytics/wards`
- `GET /admin/audit`
