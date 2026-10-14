# HULOG — IoT-Enabled Dynamic QR Parcel Drop Vault

<p align="center">
  <img src="https://img.shields.io/badge/Hardware-ESP32%20DevKit%20V1-blue?style=for-the-badge&logo=espressif" alt="ESP32" />
  <img src="https://img.shields.io/badge/RTOS-FreeRTOS%20Dual--Core-red?style=for-the-badge" alt="FreeRTOS" />
  <img src="https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20TS-61DAFB?style=for-the-badge&logo=react" alt="React + Vite" />
  <img src="https://img.shields.io/badge/BOM%20Cost-₱820.00%20PHP-brightgreen?style=for-the-badge" alt="BOM Cost" />
  <img src="https://img.shields.io/badge/Institution-University%20of%20Makati%20(CCIS)-8A2BE2?style=for-the-badge" alt="UMak CCIS" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

> **Autonomous, tamper-resistant parcel drop vault engineered for residential gates, townhouses, and multi-tenant boarding houses.**  
> Replacing static padlocks and easily photocopied QR stickers with **dynamic, single-use, time-expiring QR/PIN tokens** and **closed-loop sensor verification**.

---

## 👥 Academic Proponents & Course Credentials

- **Course:** Technopreneurship & Real-Time Systems (RTS) | Academic Year 2026–2027  
- **Institution:** University of Makati — College of Computer Science (CCIS)  
- **Adviser / Course Professor:** **Engr. Bhai Nhuraisha I. Deplomo, PECE, MSEcE, MSCIT** *(Founder & CEO, Erovoutika)*

### 🎓 Proponents / Engineering Team
- **CORPUZ, Lance Josh M.**
- **CAMARADOR, Jhorenz S.**
- **GOZE, AJ M.**
- **LUZANO, Justin Mark D.**

---

## 📦 The Problem: The Last-Meter Delivery Dilemma

The rapid acceleration of e-commerce across the Philippines (Shopee, Lazada, TikTok Shop, J&T, Flash, SPX, Grab/Lalamove) has created a severe point of vulnerability at the residential gate:
- **Unattended Drops:** Couriers leave valuable deliveries on open gate ledges, doorsteps, or apartment hallways when recipients are at school or work, exposing items to theft, rain, and stray animals.
- **Why Padlocks Fail:** Physical padlocks require physical keys that cannot be handed to rotating couriers. Master combinations quickly leak to neighbors and third parties.
- **Why Static QR Stickers Fail:** Printed QR codes pasted on parcel boxes can be photographed, duplicated, or scanned days later by unauthorized individuals, rendering them insecure.

---

## 💡 The Solution: HULOG Dynamic Vault

**HULOG** transforms the delivery experience by providing a tamper-proof drop vault mounted directly to perimeter gates or boarding house entrances. 

```text
┌──────────────────┐       1. Mint Dynamic Token       ┌─────────────────────┐
│ Recipient Portal │ ────────────────────────────────> │ Cloud Broker / REST │
└──────────────────┘                                   └──────────┬──────────┘
         │                                                        │
         │ 2. Share OTP link / QR with Rider                      │ 3. Sync Token
         ▼                                                        ▼
┌──────────────────┐       4. Scan QR or Enter PIN     ┌─────────────────────┐
│  Courier Rider   │ ────────────────────────────────> │ HULOG Vault (ESP32) │
└──────────────────┘                                   └──────────┬──────────┘
                                                                  │
                                5. Closed-Loop Latch Cycle        │
                                   • Relay unlatches 12V Solenoid │
                                   • Courier deposits package     │
                                   • IR confirms parcel in tray   │
                                   • Reed switch detects close    │
                                   • Token permanently consumed   │
                                                                  ▼
┌──────────────────┐       6. Instant Delivery Alert   ┌─────────────────────┐
│ Telegram / Push  │ ◄──────────────────────────────── │ Delivery Confirmed! │
└──────────────────┘                                   └─────────────────────┘
```

### 🌟 Key Innovations
1. **Dynamic Single-Use Rolling Tokens:** Recipient generates a time-decaying 6-digit PIN or dynamic QR token (15–30 min lifespan). The token is permanently invalidated upon door re-latch.
2. **Closed-Loop Hardware Interlock:** The 12V electromagnetic solenoid lock activates only after token authorization. An internal **optical IR sensor** verifies parcel placement, and a **magnetic reed switch** verifies physical door closure before confirming delivery.
3. **Dual-Core Real-Time Architecture:** ESP-WROOM-32 runs FreeRTOS with strict task isolation—Core 1 handles sub-millisecond interrupts and actuator safety pulses, while Core 0 handles network synchronization and cryptographic token checks.
4. **Accessible Unit Economics:** Core electronics BOM totals just **₱820.00**, allowing a commercial retail target of **₱3,499.00 to ₱4,999.00** with over 50% gross margin.

---

## 🔌 Hardware Pinout & Wiring Quick Reference

| Peripheral | ESP32 GPIO | Operating Voltage | Pin Role & Signal |
| :--- | :--- | :--- | :--- |
| **1-Channel Relay** | **GPIO 23** | 5V VCC / 3.3V Logic | Control signal (`IN`) — Active LOW triggers 12V solenoid |
| **OLED Display** | **GPIO 22** | 3.3V / 5V | Hardware I2C Clock (`SCL`) — SSD1306 128x64 |
| **OLED Display** | **GPIO 21** | 3.3V / 5V | Hardware I2C Data (`SDA`) — SSD1306 128x64 |
| **Magnetic Reed Switch** | **GPIO 19** | 3.3V (`INPUT_PULLUP`)| Door state sensor (LOW = Closed, HIGH = Ajar) |
| **Optical IR Sensor** | **GPIO 18** | 5V / 3.3V | Parcel presence sensor (LOW = Object Detected in Tray) |
| **5V Active Buzzer** | **GPIO 5** | 3.3V Logic | Acoustic feedback for keypress, unlock chime, alarms |
| **4x4 Membrane Keypad** | **GPIO 13, 12, 14, 27** | 3.3V | Keypad Matrix Rows (R1, R2, R3, R4) |
| **4x4 Membrane Keypad** | **GPIO 26, 25, 33, 32** | 3.3V (`INPUT_PULLUP`)| Keypad Matrix Columns (C1, C2, C3, C4) |
| **LM2596 Step-Down Buck**| **VIN / GND** | 12V IN -> 5.0V OUT | Powers ESP32 logic rail from 12V 2A main adapter |

👉 **For complete schematics, optocoupler isolation, and flyback diode wiring, see [docs/HARDWARE_WIRING.md](docs/HARDWARE_WIRING.md).**

---

## 📊 Itemized Bill of Materials (BOM)

| Component | Model / Description | Qty | Unit Price (PHP) |
| :--- | :--- | :-: | :-: |
| **Microcontroller** | ESP32 DevKit V1 (30-pin, Dual-Core 240MHz, Wi-Fi + BLE) | 1 | ₱240.00 |
| **OLED Display** | 0.96" I2C Monochrome 128x64 (SSD1306) | 1 | ₱110.00 |
| **Membrane Keypad** | 4x4 Matrix 16-key keypad (8-pin header) | 1 | ₱65.00 |
| **Door Sensor** | MC-38 Magnetic Door Contact Switch (Normally Closed) | 1 | ₱55.00 |
| **Presence Sensor** | Active Optical Infrared Obstacle Sensor Module | 1 | ₱25.00 |
| **Audio Sounder** | 5V Active Piezo Buzzer Module | 1 | ₱20.00 |
| **Actuator** | 12V Electromagnetic Solenoid Cabinet Lock (Tongue-Down) | 1 | ₱190.00 |
| **Relay Module** | 1-Channel 5V Relay with Optocoupler Isolation | 1 | ₱45.00 |
| **Power Supply** | 12V 2A DC Regulated Switching Wall Adapter | 1 | ₱115.00 |
| **Power Converter** | LM2596 DC-DC Step-Down Buck Converter Module | 1 | ₱55.00 |
| **DC Adapters** | 5.5x2.1mm Female DC Barrel Jack to Screw Terminals | 2 | ₱40.00 |
| **Interconnects** | 40-pin Dupont Jumper Ribbon Wires (Female-to-Female) | 1 | ₱50.00 |
| **Core Electronics Total**| **Pure Electronics Subtotal** | — | **₱820.00 – ₱1,010.00** |

👉 **For supplier links, sourcing queries, and mass-manufacturing projections, see [docs/BILL_OF_MATERIALS.md](docs/BILL_OF_MATERIALS.md).**

---

## 🗂️ Repository Structure

```text
hulog-iot-vault/
├── docs/                                  # Engineering & Technical Specifications
│   ├── ARCHITECTURE.md                    # State machine, FreeRTOS tasks, & threat model
│   ├── HARDWARE_WIRING.md                 # Complete pinout, power rails, & flyback diode guide
│   ├── BILL_OF_MATERIALS.md               # Sourcing catalog, unit prices, & scaling economics
│   └── API_AND_PROTOCOLS.md               # REST & MQTT schemas, token auth, & Telegram alerts
│
├── firmware/                              # Embedded C++ Firmware for ESP32
│   ├── platformio.ini                     # PlatformIO build & dependency configuration
│   ├── include/
│   │   └── config.h                       # GPIO pin mappings, timing constants, & state enums
│   ├── src/
│   │   └── main.cpp                       # Closed-loop state machine & hardware loop
│   └── README.md                          # Flashing and bench testing instructions
│
├── hulog-web/                             # Interactive Web Visual Hub & Simulator (React + Vite)
│   ├── src/                               # Dual-portal app, interactive vault simulator, & BOM
│   ├── package.json
│   └── vite.config.ts
│
├── Hulog_One_Page_Proposal.pdf            # Formal Academic One-Page Submission Proposal
├── Hulog_Cost_and_Market_Feasibility.pdf  # Financial Feasibility, TAM/SAM/SOM Analysis
├── CONTRIBUTING.md                        # Development standards and commit conventions
├── LICENSE                                # MIT Open-Source License
└── README.md                              # Flagship Project Overview (This Document)
```

---

## 🚀 Getting Started

### 1. Launching the Interactive Web Hub & Simulator
The web app includes the live **Tabletop Hardware Simulator**, the **Recipient Token Minting Portal**, the **Courier Drop Scanner**, and the **Interactive Pinout Guide**.

```bash
# 1. Navigate to the web hub folder
cd hulog-web

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### 2. Flashing the ESP32 Firmware
```bash
# 1. Navigate to the firmware directory
cd firmware

# 2. Build and upload using PlatformIO
pio run --target upload

# 3. Monitor serial debug output at 115200 baud
pio run --target monitor
```

---

## 📚 Deep Dive Documentation

- 📐 **[System Architecture & Security Model](docs/ARCHITECTURE.md)** — FreeRTOS dual-core tasks, replay attack protection, and tamper alarms.
- ⚡ **[Hardware Wiring & Schematics](docs/HARDWARE_WIRING.md)** — Pin assignments, optocoupler relay isolation, and 12V/5V power distribution.
- 💰 **[Bill of Materials & Cost Feasibility](docs/BILL_OF_MATERIALS.md)** — Itemized component pricing and market economics.
- 🌐 **[API & Protocol Specifications](docs/API_AND_PROTOCOLS.md)** — REST endpoints, MQTT topics, and Telegram Bot integration.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.  
Developed by Lance Josh M. Corpuz, Jhorenz S. Camarador, AJ M. Goze, and Justin Mark D. Luzano for the University of Makati (CCIS).
