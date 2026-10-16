# HULOG: IoT-Enabled Dynamic QR Parcel Drop Vault for Residential Gates and Boarding Houses

**Course:** Technopreneurship & Real-Time Systems (RTS)  
**Academic Year:** 2026-2027  
**Department:** College of Computer Science (CCIS), University of Makati  
**Course Professor:** Engr. Bhai Nhuraisha I. Deplomo, PECE, MSEcE, MSCIT  

**Project Proponents:**  
- Camarador, Jhorenz S.  
- Corpuz, Lance Josh M.  
- Goze, AJ M.  
- Luzano, Justin Mark D.  

---

## Part 1: Status of Technopreneurship Project

### Executive Summary

This submission serves as the formal Part 1 Midterm Status Report for the technopreneurship project titled "HULOG: IoT-Enabled Dynamic QR Parcel Drop Vault." The project addresses the critical security and operational failures associated with unattended last-meter e-commerce deliveries in the Philippines. By replacing static mechanical padlocks and easily photocopied QR stickers with an autonomous ESP32 microcontroller, dynamic single-use access tokens, and a closed-loop sensor interlock, HULOG guarantees that deliveries are physically secured upon receipt without requiring direct human interaction.

This document outlines the foundational research framework across Chapters 1, 2, and 3, detailing the problem background, existing academic and industrial literature, technical bill of materials, system block diagrams, software architecture, and the current hardware bench testing status.

---

## Chapter 1: Introduction and Problem Context

### 1.1 Problem Background

The rapid expansion of the Philippine digital economy has established e-commerce platforms, such as Shopee, Lazada, and TikTok Shop, as central utilities in everyday urban commerce. According to the Department of Trade and Industry (DTI), parcel delivery volumes across Metro Manila and surrounding provinces have grown exponentially. However, this growth has intensified a chronic logistical vulnerability known as the last-meter delivery problem.

In typical Philippine residential settings, such as townhouse compounds, gated single-family homes, and multi-tenant student boarding houses, recipients are frequently away at work or school when logistics couriers arrive. Couriers operating under rigid daily quota systems (including J&T Express, Flash Express, SPX, and on-demand fleets like Grab and Lalamove) cannot afford prolonged waiting periods at delivery gates. Consequently, couriers routinely resort to leaving parcels balanced on perimeter fence ledges, dropped over gates onto outdoor driveways, or handed to unverified neighbors.

This practice leads to three major issues:

1. **Parcel Theft and Pilferage:** Exposed packages attract opportunistic theft from passersby. Once a parcel is marked "Delivered" with a photo of a gate ledge, disputes arise between the buyer, seller, and logistics hub over financial liability.
2. **Environmental and Weather Exposure:** Philippine tropical weather alternates between heavy torrential rains and intense midday heat. Paper-packaged and electronic goods left in open outdoor areas suffer water saturation and physical degradation.
3. **Flaws in Existing Manual Solutions:** Homeowners frequently attempt to address this by installing conventional mechanical padlocks or taping printed static QR codes to plastic storage bins. Mechanical keys cannot be securely transferred to constantly changing delivery riders. Meanwhile, static QR stickers pasted on gates are fundamentally insecure; anyone can photograph the code and scan it at a later date to open the container.

There is a clear requirement for an autonomous, tamper-resistant parcel reception vault that operates on dynamic, single-use access credentials while maintaining an accessible hardware cost suitable for local residential deployment.

### 1.2 General and Specific Objectives

#### General Objective
The primary objective of this project is to design, develop, and validate HULOG, an autonomous IoT-enabled parcel drop vault that utilizes dynamic, single-use QR and PIN tokens to ensure secure, contact-free package reception at residential perimeters.

#### Specific Objectives
1. **Actuation and Hardware Security:** To construct a robust physical locking subsystem using an ESP32 microcontroller, a 1-channel optocoupler relay module, and a 12V electromagnetic solenoid lock capable of delivering 1000N of holding force.
2. **Closed-Loop Verification:** To implement a sensor verification interlock incorporating a magnetic reed door switch (MC-38) and an internal optical infrared (IR) beam sensor to confirm both physical parcel placement and complete door re-latching before invalidating access credentials.
3. **Dynamic Cryptographic Authentication:** To develop an algorithm that generates time-decaying, single-use 6-digit numeric PINs and dynamic QR tokens with validity windows of 15 to 30 minutes, ensuring tokens become permanently unusable immediately following a single door cycle.
4. **Dual-Portal Web Application:** To build a lightweight, responsive web management interface providing homeowners with token generation and audit logging, while offering delivery riders a zero-install mobile web scanner to trigger single-cycle unlocking.
5. **Fail-Safe Circuitry and Cost Optimization:** To engineer a dual-rail power distribution circuit (12V high-current solenoid rail and 5V regulated logic rail via LM2596 step-down conversion) maintaining an electronic bill of materials (BOM) cost below PHP 1,000.00 to support scalable commercialization.

### 1.3 Significance of the Study

This study provides tangible technological and commercial benefits to three key stakeholder groups:

- **Homeowners and Boarding House Tenants:** Provides peace of mind and eliminates the risk of lost deliveries, stolen packages, and damaged goods without requiring physical presence at home during delivery hours.
- **Logistics Couriers and E-Commerce Platforms:** Reduces delivery friction, eliminates the time penalty of calling recipients repeatedly, decreases failed delivery return-to-seller rates, and provides indisputable, timestamped sensor proof of delivery.
- **Philippine Hardware Technopreneurship:** Demonstrates that enterprise-grade IoT access control does not require expensive imported proprietary lockboxes. Using widely available microcontrollers and modular sensors, localized hardware can be manufactured and distributed profitably within Southeast Asian developing markets.

### 1.4 Scope and Delimitation

#### Scope
- The system focuses on small-to-medium parcel reception matching standard e-commerce parcel dimensions (up to 25 cm x 20 cm x 15 cm in the tabletop prototype stage, scalable to full perimeter enclosures).
- The microcontroller subsystem utilizes the ESP32-WROOM-32 30-pin development board operating on 2.4 GHz 802.11 b/g/n Wi-Fi.
- User input at the physical vault is supported via a 4x4 matrix membrane keypad and a 0.96-inch I2C OLED display (SSD1306).
- Remote access token generation is managed through a browser-based responsive web application built with React, Vite, and TypeScript.
- Notifications are formatted for instantaneous dispatch via Telegram Bot API and local OLED status prompts.

#### Delimitation
- The prototype does not include active refrigeration or climate-controlled chambers for perishable groceries.
- Cash-on-Delivery (COD) transactions requiring cash collection are excluded from autonomous vault drop cycles; the system targets prepaid orders (GCash, Maya, credit/debit card, platform-prepaid checkout).
- Cellular GSM/LTE fallbacks are not implemented in the initial prototype; the unit relies on home Wi-Fi connectivity with local time-based one-time password (TOTP) fallback routines during network dropouts.

---

## Chapter 2: Review of Related Literature and Studies

### 2.1 Last-Mile Delivery Challenges in E-Commerce Logistics

Academic literature consistently identifies the last-meter handover as the most expensive, inefficient, and vulnerable link in the global supply chain (Gevaers et al., 2014). In developing Asian logistics markets, high population density, non-standardized residential addressing systems, and high rates of unattended drops compound these inefficiencies (Allen et al., 2018).

In the Philippines, logistics operators experience high operational overhead caused by failed delivery attempts. When a recipient cannot be reached, the rider must either wait, attempt redelivery on the following day, or return the parcel to the central sorting hub. According to industry analyses by logistics consultancies, redelivery attempts can erode up to 30% of a courier's daily delivery margins. HULOG mitigates this problem by establishing a fixed, accessible drop endpoint at the residential boundary.

### 2.2 Evolution of Automated Parcel Lockers (APL)

Automated Parcel Lockers (APLs) have gained widespread adoption in European and East Asian markets, popularized by services like InPost, DHL Packstation, and Cainiao smart lockers (Morganti et al., 2014). These systems traditionally consist of centralized multi-door metal locker banks deployed in high-density public areas such as transit stations and convenience stores.

While centralized APLs provide high security, their implementation in Philippine residential neighborhoods faces severe constraints:
1. **High Capital Expenditure:** Industrial locker banks cost hundreds of thousands of pesos to construct, power, and maintain.
2. **Commuter Inconvenience:** Centralized lockers still require the recipient to travel to a designated hub, failing to solve the doorstep convenience expected from e-commerce delivery.
3. **Space Constraints:** Densely populated residential barangays lack public sidewalks or communal rights-of-way suitable for massive multi-compartment lockers.

Recent academic investigations (e.g., Wang et al., 2020) emphasize the necessity of decentralized, single-household smart drop boxes. HULOG applies this decentralized model by scaling down the electronics and housing them directly within individual residential perimeter gates.

### 2.3 Access Control Protocols: Static vs. Dynamic Credentials

Conventional electronic drop boxes predominantly rely on static access credentials, such as fixed numeric passcodes, physical RFID cards, or printed static QR code stickers. Studies by Kumar and Lee (2019) on physical access vulnerabilities highlight that static credentials suffer from credential leakage:
- Once a delivery rider memorizes or records a static gate PIN, that credential remains active indefinitely unless manually reset by the homeowner.
- Static QR stickers pasted on the exterior of a locker can be inconspicuously photographed using a smartphone camera. An attacker can duplicate the barcode and scan it days later to unlock the vault.

To solve this vulnerability, modern cryptographic literature advocates for dynamic, ephemeral tokens based on the Time-Based One-Time Password algorithm (TOTP, RFC 6238) and single-cycle state invalidation (M'Raihi et al., 2011). HULOG incorporates this protocol: the generated QR code or 6-digit PIN possesses a strictly constrained operational lifespan (15 to 30 minutes) and is immediately purged from the active authorization table the moment the door sensor confirms physical closure.

### 2.4 Sensor Verification and Closed-Loop Interlocks

Electronic locking mechanisms that rely solely on timers (e.g., unlocking for five seconds and then re-locking without sensing door status) present significant operational flaws. If a courier opens the door and takes longer than five seconds to arrange the parcel, the lock bolt can extend while the door is still open, jamming against the frame when slammed shut. Furthermore, open-loop systems cannot confirm whether a parcel was actually placed inside or whether the door remained ajar after the courier departed.

Research in real-time embedded systems demonstrates that closed-loop sensory interlocks are mandatory for automated storage (Purnomo et al., 2021). By pairing a magnetic reed switch (MC-38) with an active optical infrared obstacle sensor, the microcontroller confirms three discrete physical conditions:
1. The door was successfully opened.
2. An object crossed the threshold and broke the optical infrared beam inside the receiving tray.
3. The door was fully re-aligned with the frame, allowing the solenoid to seat properly.

### 2.5 Synthesis and Research Gap

While commercial smart delivery boxes exist in Western markets (e.g., BoxLock, Yale Smart Delivery Box), their retail pricing (typically exceeding USD 250.00 to USD 400.00) makes them inaccessible to the average Filipino household. Furthermore, existing systems frequently require couriers to download dedicated third-party mobile applications or connect via Bluetooth, introducing friction that fast-moving local delivery riders actively resist.

The research gap addressed by HULOG is the creation of a low-cost, decentralized parcel vault engineered for Philippine gate structures that:
- Operates through zero-install web interfaces (no app installation required for the rider).
- Employs dynamic, single-use, time-decaying credentials.
- Utilizes an accessible, locally sourced electronics payload totaling under PHP 1,000.00.

---

## Chapter 3: Research Methodology and Technical Design

### 3.1 Bill of Materials and Hardware Sourcing

The hardware components for the HULOG prototype were sourced through verified domestic electronics distributors in Metro Manila, specifically Makerlab Electronics and e-Gizmo. The selection criteria prioritized electrical reliability, thermal stability, standard communication protocols (I2C, GPIO), and affordability.

| Item No. | Component Description | Technical Specifications | Subsystem | Quantity | Unit Price (PHP) | Total Price (PHP) |
| :-: | :--- | :--- | :--- | :-: | :-: | :-: |
| 1 | ESP32 DevKit V1 | 30-pin, Dual-Core 240MHz, 4MB Flash, 802.11 b/g/n Wi-Fi + BLE | Main Controller | 1 | 240.00 | 240.00 |
| 2 | 0.96" I2C OLED Display | SSD1306 driver, 128x64 resolution, 4-pin interface | User Display | 1 | 110.00 | 110.00 |
| 3 | 4x4 Matrix Membrane Keypad | 16-key matrix (0-9, A-D, *, #), 8-pin female header | Manual Input | 1 | 65.00 | 65.00 |
| 4 | Magnetic Door Switch | MC-38 model, Normally Closed (NC), surface mount | Sensor | 1 | 55.00 | 55.00 |
| 5 | Optical IR Sensor Module | Active infrared obstacle detection, 3-pin interface | Sensor | 1 | 25.00 | 25.00 |
| 6 | 5V Active Buzzer Module | 85dB SPL acoustic sounder, continuous tone | Audio Output | 1 | 20.00 | 20.00 |
| 7 | 12V Solenoid Cabinet Lock | Electromagnetic latch, tongue-down, 12V 0.8A | Actuation | 1 | 190.00 | 190.00 |
| 8 | 1-Channel Relay Module | 5V trigger, PC817 optocoupler isolation, 10A 250VAC contacts | Power Switching | 1 | 45.00 | 45.00 |
| 9 | 12V 2A DC Power Adapter | Regulated switching adapter, 220V AC input, 5.5x2.1mm jack | Power Supply | 1 | 115.00 | 115.00 |
| 10 | DC Barrel Jack Adapters | 5.5x2.1mm female to screw terminal block | Power Interface | 2 | 20.00 | 40.00 |
| 11 | LM2596 Buck Converter | DC-DC step-down, 12V input to 5.0V output, 3A max | Power Regulation | 1 | 55.00 | 55.00 |
| 12 | Dupont Jumper Ribbon Wires | 40-pin female-to-female 20cm jumper cables | Interconnect | 1 | 50.00 | 50.00 |
| 13 | Prototype Enclosure Box | Wood/acrylic tabletop hinged storage box (25x20x15cm) | Physical Housing | 1 | 180.00 | 180.00 |
| 14 | Mini Cabinet Butt Hinges | 1.5-inch metal hinges with mounting wood screws | Hardware | 1 | 35.00 | 35.00 |
| **Total** | **Complete Prototype Build** | **Fully functional tabletop testbench** | **All Modules** | **—** | **—** | **PHP 1,185.00** |

*Note: The pure electronics payload (Items 1 through 12, excluding the craft enclosure box and hinges) totals PHP 1,010.00, with raw active silicon and sensors totaling PHP 820.00.*

### 3.2 System Architecture and Block Diagram

The system operates across three interconnected layers: the Physical Hardware Layer at the gate, the Embedded Firmware Control Layer on the ESP32, and the Cloud/Web Management Layer accessible via smartphone browsers.

```
+-------------------------------------------------------------------------+
|                        CLOUD & WEB PORTAL LAYER                         |
|                                                                         |
|   [ Homeowner Web Portal ]                [ Courier Mobile Scanner ]     |
|   (Generate PIN / QR Token)               (Zero-Install Web Unlocker)   |
|               |                                       |                 |
|               +-------------------+-------------------+                 |
|                                   |                                     |
|                                   v                                     |
|                       [ Cloud Broker / REST API ]                       |
|                       - Token Table Management                          |
|                       - Real-Time MQTT Dispatch                         |
|                       - Telegram Bot Notification Service               |
+-----------------------------------+-------------------------------------+
                                    | (TLS Encrypted Wi-Fi / MQTT)
                                    v
+-------------------------------------------------------------------------+
|                        ESP32 EMBEDDED CONTROLLER                        |
|                                                                         |
|      +---------------------------------+-------------------------+      |
|      | Core 0: Network & Security      | Core 1: Real-Time ISR   |      |
|      | - Wi-Fi Manager (802.11 b/g/n)  | - Keypad Matrix Polling |      |
|      | - Token Authenticator           | - Solenoid Pulse Control|      |
|      | - SPIFFS Local Flash Log Cache  | - Reed Switch Interrupt |      |
|      | - Telemetry Dispatcher          | - IR Beam Comparator    |      |
|      +---------------------------------+-------------------------+      |
+-----------------------------------+-------------------------------------+
                                    |
            +-----------------------+-----------------------+
            |                                               |
            v                                               v
+---------------------------+               +-----------------------------+
|   HARDWARE SENSING BUS    |               |    HARDWARE ACTUATION BUS   |
| - MC-38 Reed Switch (D19) |               | - 5V Optocoupler Relay (D23)|
| - Active IR Sensor (D18)  |               | - 12V Solenoid Latch (NO)   |
| - 4x4 Matrix Keypad       |               | - 1N4007 Diode (Flyback)    |
| - SSD1306 OLED (I2C D21/22|               | - 5V Active Buzzer (D5)     |
+---------------------------+               +-----------------------------+
```

### 3.3 Hardware Wiring and Pinout Configuration

All pin mappings on the ESP32 30-pin board are selected to avoid strapping pins (GPIO 0, GPIO 2, GPIO 15) and input-only pins (GPIO 34 through 39):

| Subsystem | Peripheral Device | Assigned ESP32 Pin | Logic Level | Circuit Configuration / Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Actuator** | 1-Channel Relay Module | **GPIO 23** | 3.3V Logic | Active LOW trigger. Connects to relay signal input (IN). |
| **Display** | 0.96" SSD1306 OLED | **GPIO 22** | 3.3V / 5V | Hardware I2C Clock (SCL). |
| **Display** | 0.96" SSD1306 OLED | **GPIO 21** | 3.3V / 5V | Hardware I2C Data (SDA). |
| **Sensor** | Magnetic Door Switch | **GPIO 19** | 3.3V | Configured as `INPUT_PULLUP`. Reads LOW when door is closed. |
| **Sensor** | Active Optical IR Sensor| **GPIO 18** | 3.3V / 5V | Digital Input. Reads LOW when package breaks infrared beam. |
| **Acoustic** | 5V Active Buzzer | **GPIO 5** | 3.3V | Digital Output. Emits chimes for keypresses and alarms. |
| **Keypad** | 4x4 Membrane Rows | **GPIO 13, 12, 14, 27**| 3.3V | Keypad Matrix Row Scan Lines (R1, R2, R3, R4). |
| **Keypad** | 4x4 Membrane Cols | **GPIO 26, 25, 33, 32**| 3.3V | Keypad Matrix Column Input Lines (C1, C2, C3, C4) with pull-ups. |
| **Power** | LM2596 Step-Down Buck | **VIN and GND** | 5.0V DC | Steps 12V adapter down to 5.00V DC for ESP32 and logic rail. |

#### Inductive Spike Protection
A **1N4007 rectifier diode** is placed in reverse bias across the 12V solenoid lock terminals (cathode with the silver stripe connected to the positive 12V relay NO terminal; anode connected to ground). When the relay contact opens, the high-voltage inductive back-EMF spike produced by the collapsing magnetic field is safely dissipated through the diode, preventing microcontroller lockups and contact arcing.

### 3.4 Operational State Machine and Procedures

The vault firmware executes a deterministic, closed-loop state machine structured as follows:

```
[ STATE 0: IDLE ]
  - Vault door is mechanically latched.
  - OLED displays: "HULOG VAULT - Scan QR or Enter PIN".
  - Keypad scanner and network listeners are active.
         |
         v (Courier enters 6-digit PIN on keypad or scans QR code)
[ STATE 1: AUTHENTICATION ]
  - Token is matched against local memory cache.
  - Invalid Token -> Buzzer sounds 3 error chirps; failure count increments.
  - Valid Token   -> Solenoid energizes; transitions to STATE 2.
         |
         v
[ STATE 2: UNLATCHING ]
  - GPIO 23 is pulled LOW for exactly 3,000 milliseconds.
  - 12V solenoid retracts its spring-loaded plunger.
  - OLED displays: "ACCESS GRANTED - OPEN DOOR".
  - 30-second watchdog timer starts.
         |
         v
[ STATE 3: DOOR AJAR & PARCEL DEPOSIT ]
  - MC-38 Reed Switch opens (GPIO 19 transitions to HIGH).
  - Courier pulls door open and deposits package.
  - Active IR sensor inside tray detects object (GPIO 18 goes LOW).
  - OLED displays: "DOOR OPEN - DEPOSIT PARCEL".
         |
         v
[ STATE 4: RE-LATCHING & TOKEN CONSUMPTION ]
  - Courier closes the vault door.
  - MC-38 Reed Switch closes (GPIO 19 goes LOW).
  - Mechanical angled tongue snaps into strike plate.
  - Access token is permanently flagged as CONSUMED in flash memory.
         |
         v
[ STATE 5: TELEMETRY & CONFIRMATION DISPATCH ]
  - Buzzer emits a 3-tone success chime.
  - OLED displays: "DELIVERY DONE! - PACKAGE SECURED".
  - ESP32 dispatches encrypted MQTT payload to cloud broker.
  - Telegram Bot alerts the homeowner with timestamped proof of deposit.
  - Vault returns to STATE 0 (IDLE).
```

### 3.5 Software and Web Management System

The software subsystem consists of two operational applications:

1. **Embedded C++ Firmware (`firmware/`):**
   - Developed using the Arduino Core framework under the PlatformIO IDE ecosystem.
   - Utilizes `Adafruit_SSD1306` and `Adafruit_GFX` for hardware I2C display rendering.
   - Uses `Keypad.h` for debounced non-blocking matrix scanning.
   - Manages non-volatile flash logging through the ESP32 SPIFFS filesystem to ensure transaction persistence across power interruptions.

2. **Web Application Visual Hub (`hulog-web/`):**
   - Built with **React 18**, **Vite**, and **TypeScript**, with styling rendered via Vanilla CSS design tokens.
   - **Recipient Management Portal:** Allows the homeowner to mint dynamic delivery passes with selectable validity durations (15, 30, or 60 minutes), generate single-use QR tokens, and review historical delivery logs.
   - **Courier Web Interface:** A zero-install mobile web page reachable via link or QR scan that authenticates the rider's physical presence and transmits an authorized unlock trigger to the vault.
   - **Interactive Hardware Simulator:** An integrated virtual testbench replicating the ESP32 dual-core state machine, OLED display state transitions, and door opening animations for demonstration and defense presentation.

---

## Current Prototype Implementation Status

As of October 16, 2026, the project has achieved the following technical milestones:

| Project Subsystem | Target Milestone | Current Operational Status | Verification Method |
| :--- | :--- | :--- | :--- |
| **Component Procurement** | 14-item BOM acquisition | **100% Completed** | All electronic modules (ESP32, OLED, Keypad, Relay, Solenoid, Sensors, Buck Converter) physically acquired and cataloged. |
| **Repository & Documentation** | Git repository and specifications | **100% Completed** | Published to public GitHub repository (`buridekz/hulog-iot-vault`) with architecture, wiring, and API docs. |
| **Web Portal & Simulator** | Interactive dual-portal web app | **100% Completed** | Built and validated in `hulog-web/`. Production build passes with zero TypeScript or asset compilation errors. |
| **Firmware Scaffolding** | Embedded C++ PlatformIO core | **100% Completed** | Pinout mapping (`config.h`), library dependencies, and core state machine (`main.cpp`) scaffolded and ready for flashing. |
| **Hardware Bench Integration**| Breadboard wiring and bench test | **In Progress (Active Phase)**| PlatformIO toolchain installed; initial ESP32 flashing, OLED I2C testing, and relay switching underway on developer bench. |
| **Enclosure Assembly** | Tabletop demonstration vault mounting | **Scheduled (Post-Midterm)**| Mounting of solenoid, limit switch, and keypad into the physical hinged tabletop container. |

---

## Next Steps for Part 2 Finalization

Following the submission of this Part 1 Midterm Status Report, the engineering team will proceed with:
1. Conducting physical bench testing of the closed-loop sensor interlock, measuring actual solenoid retraction speeds and relay debounce timings.
2. Interfacing the ESP32 firmware with the cloud MQTT broker and Telegram Bot notification webhook.
3. Assembling the physical tabletop enclosure with installed acrylic viewing panels for academic defense demonstration.
4. Expanding Chapter 4 (Results, Discussion, Unit Economics, and Market Feasibility) to complete the full Part 2 Technopreneurship Book dossier.
