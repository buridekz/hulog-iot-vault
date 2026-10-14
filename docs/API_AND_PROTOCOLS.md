# HULOG API & Communication Protocol Specification

This document defines the data models, RESTful endpoints, MQTT publish/subscribe topics, and edge telemetry payloads governing communication between the **Recipient Web Portal**, **Courier Drop Portal**, **Cloud Broker**, and **ESP32 Edge Device**.

---

## 🌐 Architecture Overview

Communication operates across two transport layers:
1. **HTTPS / REST:** Used by the client web browsers (Recipient Dashboard, Courier Web Scanner) for authenticated user sessions, token generation, and audit querying.
2. **MQTT over TLS (Port 8883):** Used between the cloud broker and the ESP32 microcontrollers for real-time telemetry, low-latency unlock signals, and remote firmware state synchronization.

---

## 🔑 RESTful API Specifications

### 1. Generate Dynamic Delivery Token
- **Endpoint:** `POST /api/v1/tokens/create`
- **Authentication:** Bearer JWT (Vault Owner)
- **Description:** Mints a time-bound, single-use 6-digit numeric PIN and cryptographic QR token.

#### Request Body
```json
{
  "vaultId": "HLG-MNL-0042",
  "recipientName": "Lance Corpuz",
  "courierService": "Shopee Xpress",
  "trackingNumber": "SPXPH0492817294",
  "validityMinutes": 30,
  "allowMultipleCycles": false
}
```

#### Response (201 Created)
```json
{
  "status": "success",
  "tokenId": "tok_9f82a17c",
  "pinCode": "482915",
  "qrPayload": "hulog://unlock?v=HLG-MNL-0042&t=tok_9f82a17c&sig=e3b0c44298fc1c149afbf4c8996fb924",
  "expiresAt": "2026-10-14T22:15:00Z",
  "riderShareUrl": "https://hulog.ph/drop/tok_9f82a17c"
}
```

---

### 2. Courier Drop Verification & Unlock Trigger
- **Endpoint:** `POST /api/v1/vault/unlock`
- **Authentication:** Public with Valid Token
- **Description:** Submitted by the courier web app when scanning the QR code or submitting the numeric PIN.

#### Request Body
```json
{
  "vaultId": "HLG-MNL-0042",
  "token": "482915",
  "courierGeo": {
    "lat": 14.5547,
    "lng": 121.0244,
    "accuracy": 8.5
  }
}
```

#### Response (200 OK)
```json
{
  "status": "unlocked",
  "message": "Vault door unlatched. Please deposit parcel within 30 seconds.",
  "countdownSeconds": 30
}
```

#### Error Response (403 Forbidden - Expired / Invalid)
```json
{
  "status": "rejected",
  "errorCode": "TOKEN_INVALID_OR_CONSUMED",
  "message": "The provided token is invalid, expired, or has already been used."
}
```

---

## 📡 MQTT Messaging Topics & Payloads

The ESP32 communicates over standard MQTT topics partitioned by unique device ID:

### 1. Telemetry & Heartbeat
- **Topic:** `hulog/{vaultId}/telemetry`
- **QoS:** 1 (At least once)
- **Interval:** Every 60 seconds (or immediately on state transition)

```json
{
  "vaultId": "HLG-MNL-0042",
  "timestamp": 1791986400,
  "state": "IDLE",
  "doorClosed": true,
  "parcelDetected": true,
  "wifiRssi": -58,
  "batteryVoltage": 12.4,
  "firmwareVersion": "1.0.4-prod"
}
```

---

### 2. Delivery Cycle Completed Event
- **Topic:** `hulog/{vaultId}/events/drop_completed`
- **QoS:** 2 (Exactly once)
- **Trigger:** Reed switch closes AND IR sensor detects newly deposited object.

```json
{
  "eventId": "evt_77189a",
  "vaultId": "HLG-MNL-0042",
  "tokenId": "tok_9f82a17c",
  "timestamp": 1791986445,
  "durationSeconds": 14,
  "irVerified": true,
  "doorLatched": true,
  "deliveryCourier": "Shopee Xpress"
}
```

---

### 3. Tamper & Security Alarm Event
- **Topic:** `hulog/{vaultId}/events/tamper`
- **QoS:** 2 (Exactly once)
- **Trigger:** Door opened without authorization, or 3 consecutive keypad failures.

```json
{
  "eventId": "tamp_00192",
  "vaultId": "HLG-MNL-0042",
  "tamperType": "UNAUTHORIZED_DOOR_AJAR",
  "timestamp": 1791986600,
  "buzzerActive": true,
  "actionTaken": "LOCAL_ALARM_AND_PUSH_DISPATCH"
}
```

---

## 📱 Telegram Bot Notification Integration

When `events/drop_completed` is processed by the cloud broker, an automated message is pushed via Telegram Bot API (`sendMessage`):

```text
📦 HULOG DELIVERY CONFIRMED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Vault: HLG-MNL-0042 (Gate 1)
🚚 Courier: Shopee Xpress
⏱ Time: 10:14 PM (Oct 14, 2026)
🔒 Status: Door Latched & Locked
🔍 Sensor Check: Parcel Presence Verified

Your package is safely sealed inside the vault.
```
