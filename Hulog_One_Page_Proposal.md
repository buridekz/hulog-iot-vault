# Hulog: IoT-Enabled Dynamic QR Parcel Drop Vault for Residential Gates and Boarding Houses

**Course:** Technopreneurship | Real-Time Systems (RTS) Course Requirement | AY 2026–2027  
**Institution:** University of Makati — College of Computer Science (CCIS)  
**Adviser / Course Professor:** Engr. Bhai Nhuraisha I. Deplomo, PECE, MSEcE, MSCIT *(Founder & CEO, Erovoutika)*  

---

### Proponents
- **CAMARADOR, Jhorenz S.**
- **CORPUZ, Lance Josh M.**
- **GOZE, AJ M.**
- **LUZANO, Justin Mark D.**

---

## 1. Project Abstract
The rapid growth of e-commerce delivery in the Philippines has made unattended parcel drops a widespread point of vulnerability. Couriers frequently leave packages exposed on gate thresholds, building lobbies, or front porches when recipients are unavailable, leading to frequent theft, weather damage, and lost shipments. Traditional padlocks require physical keys, while static printed QR stickers on drop boxes can be easily photocopied and compromised by unauthorized individuals. 

**Hulog** is an autonomous, smart parcel drop vault equipped with an ESP32 microcontroller, a heavy-duty 12V electromagnetic solenoid latch, a door state limit switch, and an integrated OLED screen. When a delivery is scheduled, the owner generates a time-bound, single-use QR access token via their smartphone and forwards it to the courier. The courier scans the dynamic code, triggering a single-cycle unlock. The system verifies door closure, immediately re-latches the vault, and transmits an instant delivery confirmation to the recipient, ensuring secure, contact-free parcel reception.

---

## 2. Problem Statement
- **Unattended Drop Vulnerability:** E-commerce parcels from Shopee, Lazada, TikTok Shop, and logistics couriers (J&T, Flash, SPX, Lalamove) are left exposed on perimeter fences, apartment gates, or unmonitored building hallways when recipients are at work or school.
- **Flaws in Traditional Padlocks & Static QR Stickers:** Physical keys cannot be shared remotely with couriers, while static QR stickers pasted on boxes can be photographed, duplicated, or scanned days later by unauthorized parties.
- **High Friction & Redelivery Costs:** Rescheduling deliveries leads to failed attempts, return-to-seller penalties, and friction between riders and busy recipients.

---

## 3. Solution & Key Innovations
**Hulog** provides a tamper-resistant, weatherproof drop vault mounted at perimeter gates, townhouses, and dormitories. Access is controlled through dynamic, time-decaying OTP/QR tokens that invalidate immediately after a single deposit cycle.

### Key System Features
1. **Dynamic Single-Use QR & PIN Tokens:** Generates time-limited rolling QR tokens and 6-digit numeric PINs via the web portal. Each token expires automatically within 15–30 minutes or immediately after a single door cycle.
2. **Physical Latch & Optical IR Presence Verification:** Integrates a mechanical door limit switch and optical infrared beam sensor to verify package deposit and door closure before re-locking the 12V solenoid.
3. **Instant Cloud Telemetry & Notification:** Dispatches instant Telegram and web alerts to the recipient upon successful delivery with timestamped access logging.
4. **Failsafe Power & Offline Storage:** 12V rechargeable battery backup maintains latch security during brownouts; local SPIFFS non-volatile memory caches transaction logs offline until Wi-Fi reconnection.

---

## 4. Hardware & Firmware Architecture
- **Microcontroller:** ESP32 DevKit V1 (Dual-Core 240MHz, 2.4GHz Wi-Fi + Bluetooth BLE)
- **Actuation:** 12V 1.1A Heavy-Duty Electromagnetic Solenoid Lock (1000N holding force)
- **Power Relay Isolation:** 1-Channel Optocoupler Relay Module (5V trigger, Active LOW)
- **Sensing:** Micro Limit Switch with Roller Lever (Door State), Sharp GP2Y0A21YK0F Optical IR Beam Sensor (Internal Parcel Detection)
- **Local Display & Interface:** 0.96-inch I2C OLED Display (128x64 SSD1306) & 4x4 Matrix Membrane Keypad (Emergency/Manual PIN entry)
- **Power Architecture:** 12V 2A DC Switching Adapter + 12V to 5V DC-DC Step-Down Buck Converter (LM2596) + 12V Sealed Lead-Acid / Li-Ion Battery Backup
- **Firmware:** FreeRTOS Dual-Core Task Scheduling (Core 1: Hardware interrupts & solenoid pulse control; Core 0: Token verification & cloud messaging).

---

## 5. Target Beneficiaries & Unit Economics
- **Target Beneficiaries:** Residential homeowners, multi-tenant boarding houses, student dormitories, condominium units, and neighborhood sari-sari stores acting as community parcel drop hubs.
- **Hardware Electronics BOM Cost:** **₱820.00**
- **Commercial Retail Price:** **₱3,499.00 – ₱4,999.00** (Full weatherproof powder-coated metal enclosure installed).
- **Optional SaaS Subscription:** **₱199.00 / month** (Multi-tenant boarding house code generation & automated SMS/Telegram dispatch).
- **Value Proposition:** Preventing the loss or theft of a single mid-range gadget (₱10,000+) or critical academic parcel immediately justifies the lifetime unit cost of the vault.
