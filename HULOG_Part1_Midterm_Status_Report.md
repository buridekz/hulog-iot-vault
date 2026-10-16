# UNIVERSITY OF MAKATI
## COLLEGE OF COMPUTER SCIENCE
### Department of Information Technology

**TECHNOPRENEURSHIP & REAL-TIME SYSTEMS (RTS)**  
Academic Year 2026-2027  

**Course Professor:** Engr. Bhai Nhuraisha I. Deplomo, PECE, MSEcE, MSCIT  

---

# HULOG: IoT-ENABLED DYNAMIC QR PARCEL DROP VAULT FOR RESIDENTIAL GATES AND BOARDING HOUSES

### PART 1: MIDTERM STATUS REPORT (CHAPTERS 1 TO 3)

**Project Proponents:**  
Camarador, Jhorenz S.  
Corpuz, Lance Josh M.  
Goze, AJ M.  
Luzano, Justin Mark D.  

---

## EXECUTIVE SUMMARY

This submission constitutes the formal Part 1 Midterm Status Report for the technopreneurship project titled "HULOG: IoT-Enabled Dynamic QR Parcel Drop Vault." The project addresses the physical security and operational vulnerabilities associated with unattended last-meter parcel deliveries in Philippine residential communities. By replacing conventional static padlocks and easily duplicated QR stickers with an autonomous ESP32 microcontroller, dynamic single-use access tokens, and a closed-loop sensor interlock, HULOG guarantees that deliveries are physically secured upon receipt without requiring physical human handover.

This report documents the research and engineering framework across Chapters 1, 2, and 3, including the problem context, academic literature review, itemized bill of materials, system block diagrams, circuit wiring schematics, operational state machine, and the current prototype bench testing status.

---

## CHAPTER 1: INTRODUCTION AND PROBLEM CONTEXT

### 1.1 Problem Background

The rapid growth of the Philippine digital economy has established e-commerce platforms, notably Shopee, Lazada, and TikTok Shop, as essential utilities in everyday commerce. According to reports from the Department of Trade and Industry (DTI), parcel delivery volumes across Metro Manila and surrounding suburban provinces continue to increase significantly each year. However, this volume has exposed a severe vulnerability at the final stage of the logistics chain, commonly known as the last-meter delivery problem.

In typical Philippine residential settings, including townhouse developments, perimeter-gated detached homes, and multi-tenant student boarding houses, recipients are routinely away at work or school during standard courier operating hours. Delivery personnel operating under strict delivery quotas (including fleets from J&T Express, Flash Express, SPX, and on-demand services such as Grab and Lalamove) cannot afford prolonged waiting times at residential gates. Consequently, couriers regularly leave packages resting on fence ledges, toss them over perimeter gates onto exposed driveways, or transfer custody to unverified neighbors.

This operational pattern results in three major points of failure:

1. **Parcel Theft and Pilferage:** Packages left unattended on street-facing ledges or gate openings invite opportunistic theft. When a courier uploads a delivery proof photograph showing a parcel resting on an open gate, disputes frequently occur between buyers, merchants, and logistics hubs regarding liability for missing items.
2. **Environmental and Weather Exposure:** The tropical climate of the Philippines alternates between torrential rain and extreme heat. Cardboard and plastic satchels left outdoors suffer moisture damage, leading to ruined electronics, documents, and apparel.
3. **Inadequacy of Existing Countermeasures:** Homeowners frequently attempt to address this issue by installing standard mechanical padlocks or affixing printed static QR code stickers to plastic bins. Mechanical keys cannot be transferred securely to constantly rotating delivery riders. Conversely, static QR stickers pasted on exterior gates are inherently insecure, as any individual can capture a photograph of the barcode and scan it days later to gain unauthorized access.

These factors demonstrate the necessity of an autonomous, tamper-resistant parcel reception vault that operates on dynamic, single-use access credentials while maintaining an accessible production cost suitable for local residential deployment.

### 1.2 General and Specific Objectives

#### General Objective
The primary objective of this project is to design, develop, and evaluate HULOG, an autonomous IoT-enabled parcel drop vault utilizing dynamic, single-use QR and PIN credentials to provide secure, contact-free package reception at residential perimeters.

#### Specific Objectives
1. **Actuation and Hardware Security:** To construct a robust physical locking subsystem utilizing an ESP32 microcontroller, a 1-channel optocoupler relay module, and a 12V electromagnetic solenoid lock capable of exerting 1000N of mechanical holding force.
2. **Closed-Loop Sensory Verification:** To implement a sensory interlock incorporating a magnetic door contact switch (MC-38) and an active optical infrared (IR) beam sensor to confirm both parcel placement and complete door re-latching before access credentials are invalidated.
3. **Dynamic Cryptographic Authentication:** To develop an algorithm that generates time-decaying, single-use 6-digit numeric PINs and dynamic QR tokens with operational lifespans of 15 to 30 minutes, ensuring tokens are permanently invalidated immediately after a single door cycle.
4. **Dual-Portal Web Application:** To develop a responsive web management interface allowing homeowners to mint access tokens and monitor audit logs, while providing delivery riders with a zero-install mobile web scanner to trigger single-cycle unlocking.
5. **Circuit Protection and Cost Optimization:** To engineer a dual-rail power distribution circuit (12V high-current solenoid rail and 5.0V regulated logic rail via an LM2596 buck converter) maintaining an electronics bill of materials (BOM) cost below PHP 1,000.00 to facilitate domestic commercial scalability.

### 1.3 Significance of the Study

This investigation provides practical technological and economic value to three primary stakeholder groups:

- **Homeowners and Tenants:** Provides a dependable method for receiving e-commerce parcels securely without requiring physical presence at home during delivery attempts.
- **Logistics Couriers and E-Commerce Platforms:** Eliminates gate waiting delays, reduces failed delivery attempts and return-to-seller overhead, and generates verifiable, timestamped sensor records confirming package deposit.
- **Domestic IoT Hardware Development:** Demonstrates that enterprise-grade access control does not require expensive imported lockboxes, establishing a reproducible model for localized, cost-effective smart devices built with standard modular components.

### 1.4 Scope and Delimitation

#### Scope
- The physical prototype focuses on small-to-medium parcel reception matching standard e-commerce deliveries (up to 25 cm x 20 cm x 15 cm in the tabletop testbench, scalable to full exterior gate installations).
- The central controller utilizes an ESP32-WROOM-32 30-pin microcontroller board communicating over 2.4 GHz 802.11 b/g/n Wi-Fi.
- Physical interface at the vault is supported through a 4x4 matrix membrane keypad and an SSD1306 0.96-inch monochrome I2C OLED display.
- Cloud connectivity and remote token generation are handled via a responsive web application built with React, Vite, and TypeScript, with instant delivery alerts dispatched via the Telegram Bot API.

#### Delimitation
- The prototype does not include active refrigeration or climate control for perishable groceries.
- Cash-on-Delivery (COD) transactions requiring cash handling are excluded from autonomous vault cycles; the system targets prepaid orders (GCash, Maya, credit/debit card, platform-prepaid checkout).
- Cellular GSM/LTE modules are excluded from the initial prototype; the device relies on local Wi-Fi connectivity with local time-based one-time password (TOTP) fallback routines during network outages.

---

## CHAPTER 2: REVIEW OF RELATED LITERATURE AND STUDIES

### 2.1 Last-Mile Delivery Challenges in Urban Logistics

Academic literature consistently identifies the last-meter handover as the most expensive, inefficient, and vulnerable link in the global supply chain (Gevaers et al., 2014). In developing Southeast Asian logistics markets, high population density, non-standardized residential addressing systems, and high rates of unattended drops compound these inefficiencies (Allen et al., 2018).

In the Philippines, logistics operators experience high operational overhead caused by failed delivery attempts. When a recipient cannot be reached, the rider must either wait, attempt redelivery on the following day, or return the parcel to the central sorting hub. Industry analyses indicate that redelivery attempts can erode up to 30% of a courier's daily delivery margins. HULOG mitigates this problem by establishing a fixed, accessible drop endpoint at the residential boundary.

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

The research gap addressed by HULOG is the creation of a low-cost, decentralized parcel vault engineered for Philippine gate structures that operates through zero-install web interfaces, employs dynamic single-use credentials, and utilizes an accessible, locally sourced electronics payload totaling under PHP 1,000.00.

---

## CHAPTER 3: RESEARCH METHODOLOGY AND TECHNICAL DESIGN

### 3.1 Bill of Materials and Hardware Sourcing

The hardware components for the HULOG prototype were sourced through verified domestic electronics distributors in Metro Manila, specifically Makerlab Electronics and e-Gizmo. The selection criteria prioritized electrical reliability, thermal stability, standard communication protocols (I2C, GPIO), and affordability.

| Item No. | Component Description | Technical Specifications | Subsystem | Quantity | Unit Price (PHP) | Total Price (PHP) |
| :-: | :--- | :--- | :--- | :-: | :-: | :-: |
| 1 | ESP32 DevKit V1 | 30-pin, Dual-Core 240MHz, 4MB Flash, Wi-Fi + BLE | Main Controller | 1 | 240.00 | 240.00 |
| 2 | 0.96" I2C OLED Display | SSD1306 driver, 128x64 resolution, 4-pin interface | User Display | 1 | 110.00 | 110.00 |
| 3 | 4x4 Matrix Membrane Keypad | 16-key matrix (0-9, A-D, *, #), 8-pin female header | Manual Input | 1 | 65.00 | 65.00 |
| 4 | Magnetic Door Switch | MC-38 model, Normally Closed (NC), surface mount | Sensor | 1 | 55.00 | 55.00 |
| 5 | Optical IR Sensor Module | Active infrared obstacle detection, 3-pin interface | Sensor | 1 | 25.00 | 25.00 |
| 6 | 5V Active Buzzer Module | 85dB SPL acoustic sounder, continuous tone | Audio Output | 1 | 20.00 | 20.00 |
| 7 | 12V Solenoid Cabinet Lock | Electromagnetic latch, tongue-down, 12V 0.8A | Actuation | 1 | 190.00 | 190.00 |
| 8 | 1-Channel Relay Module | 5V trigger, PC817 optocoupler isolation, 10A contacts | Power Switching | 1 | 45.00 | 45.00 |
| 9 | 12V 2A DC Power Adapter | Regulated switching adapter, 220V AC input, 5.5mm jack | Power Supply | 1 | 115.00 | 115.00 |
| 10 | DC Barrel Jack Adapters | 5.5x2.1mm female to screw terminal block | Power Interface | 2 | 20.00 | 40.00 |
| 11 | LM2596 Buck Converter | DC-DC step-down, 12V input to 5.0V output, 3A max | Power Regulation | 1 | 55.00 | 55.00 |
| 12 | Dupont Jumper Wires | 40-pin female-to-female 20cm jumper ribbon cable | Interconnect | 1 | 50.00 | 50.00 |
| 13 | Prototype Enclosure Box | Wood/acrylic tabletop hinged storage box (25x20x15cm) | Physical Housing | 1 | 180.00 | 180.00 |
| 14 | Mini Cabinet Butt Hinges | 1.5-inch metal hinges with mounting wood screws | Hardware | 1 | 35.00 | 35.00 |
| **Total** | **Complete Prototype Implementation Cost** | | | | | **PHP 1,185.00** |

*Note: The pure electronics payload (Items 1 through 12, excluding the craft enclosure box and hinges) totals PHP 1,010.00, with raw active silicon and sensors totaling PHP 820.00.*

### 3.2 System Hardware and Network Architecture Diagram

The system operates across three interconnected layers: the Cloud and Management Layer, the Embedded ESP32 Microcontroller Layer, and the Physical Hardware Bus.

```
===================================================================================
                           CLOUD & MANAGEMENT LAYER
===================================================================================

  +-------------------------------+         +----------------------------------+
  |    HOMEOWNER WEB DASHBOARD    |         |    COURIER MOBILE WEB SCANNER    |
  |  - Generate 6-digit OTP / QR  |         |  - Zero-install mobile scanner   |
  |  - Set token validity period  |         |  - Trigger single-cycle unlatch  |
  +---------------+---------------+         +-----------------+----------------+
                  |                                           |
                  | HTTPS (REST API)                          | HTTPS (REST API)
                  v                                           v
  +----------------------------------------------------------------------------+
  |                        CLOUD BROKER & API GATEWAY                          |
  |  - Ephemeral token storage and single-use validation table                 |
  |  - Bidirectional TLS-encrypted MQTT communications broker                  |
  |  - Automated webhook integration for Telegram Bot delivery notifications   |
  +-------------------------------------+--------------------------------------+
                                        |
                                        | MQTT over TLS (Port 8883)
                                        v
===================================================================================
                       EMBEDDED CONTROLLER LAYER (ESP32)
===================================================================================

  +----------------------------------------------------------------------------+
  |                     ESP32-WROOM-32 DUAL-CORE PROCESSOR                     |
  |                                                                            |
  |   +------------------------------------+-------------------------------+   |
  |   | CORE 0: NETWORK & SECURITY TASKS   | CORE 1: REAL-TIME I/O TASKS    |   |
  |   | - 802.11 b/g/n Wi-Fi Manager       | - 4x4 Keypad matrix scanner    |   |
  |   | - Dynamic token validation engine  | - Solenoid relay pulse timer   |   |
  |   | - SPIFFS non-volatile log storage  | - MC-38 Reed switch ISR        |   |
  |   | - MQTT telemetry publisher         | - Optical IR presence sensor   |   |
  |   +------------------------------------+-------------------------------+   |
  +-------------------------------------+--------------------------------------+
                                        |
                     +------------------+------------------+
                     |                                     |
                     v                                     v
===================================================================================
                       PHYSICAL SENSING & ACTUATION BUS
===================================================================================

  +-----------------------------------+     +----------------------------------+
  |       SENSING & INPUT BUS         |     |       ACTUATION & POWER BUS      |
  |                                   |     |                                  |
  |  - MC-38 Reed Switch (GPIO 19)    |     |  - 1-Ch Relay Module (GPIO 23)   |
  |  - Active IR Sensor (GPIO 18)     |     |  - 12V 0.8A Solenoid Cabinet Lock|
  |  - 4x4 Membrane Keypad (8 GPIOs)  |     |  - 1N4007 Diode (Back-EMF clamp) |
  |  - SSD1306 OLED Display (I2C)     |     |  - 5V Active Buzzer (GPIO 5)     |
  |    SDA: GPIO 21 | SCL: GPIO 22    |     |  - LM2596 Buck Converter (12V->5V|
  +-----------------------------------+     +----------------------------------+
```

### 3.3 Power Distribution and Circuit Interconnect Schematic

The system uses a dual-rail power topology driven by a single 12V 2A DC regulated wall adapter, ensuring the high-current solenoid lock does not cause voltage drops on the microcontroller logic rail.

```
 12V 2A DC WALL ADAPTER
  (+) Positive 12V Rail ───┬───────────────────────────────────> Relay COM Terminal
                           │
                           ├───> [LM2596 BUCK IN+]
                           │     [LM2596 BUCK IN-] ──┐
  (-) Ground Return (GND) ─┼─────────────────────────┼─────────> SYSTEM COMMON GROUND (GND)
                           │                         │
                           │     [LM2596 BUCK OUT+] ─┴─────────> +5.00V DC REGULATED LOGIC BUS
                           │                                     (ESP32 VIN, Relay VCC,
                           │                                      IR Sensor VCC, Buzzer VCC)
                           │
                           │     [LM2596 BUCK OUT-] ───────────> SYSTEM COMMON GROUND (GND)
                           │
                           │
  RELAY ACTUATION CIRCUIT: │
                           │
     ESP32 GPIO 23 ────────┴─> [Relay IN (Active LOW)]
     Relay NO Contact ────────┬────────────────────────────────> Solenoid Red Wire (+)
                              │
                            ┌─┴─┐
                            ▲   │ 1N4007 Flyback Diode
                            │   │ (Cathode band facing +12V NO contact)
                            └─┬─┘
                              │
     Common Ground (GND) ─────┴────────────────────────────────> Solenoid Black Wire (-)
```

### 3.4 Hardware Wiring and Pinout Configuration

All pin mappings on the ESP32 30-pin development board are assigned to avoid strapping pins (GPIO 0, GPIO 2, GPIO 15) and input-only pins (GPIO 34 through 39):

| Subsystem | Peripheral Device | Assigned ESP32 Pin | Logic Level | Circuit Configuration / Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Actuator** | 1-Channel Relay Module | **GPIO 23** | 3.3V Logic | Active LOW trigger. Connects to relay signal input (IN). |
| **Display** | 0.96" SSD1306 OLED | **GPIO 22** | 3.3V / 5V | Hardware I2C Clock (SCL). |
| **Display** | 0.96" SSD1306 OLED | **GPIO 21** | 3.3V / 5V | Hardware I2C Data (SDA). |
| **Sensor** | Magnetic Door Switch | **GPIO 19** | 3.3V | Configured as `INPUT_PULLUP`. Reads LOW when door is closed. |
| **Sensor** | Active Optical IR Sensor| **GPIO 18** | 3.3V / 5V | Digital Input. Reads LOW when package breaks infrared beam. |
| **Acoustic** | 5V Active Buzzer | **GPIO 5** | 3.3V | Digital Output. Emits chimes for keypresses and alarms. |
| **Keypad** | 4x4 Membrane Rows | **GPIO 13, 12, 14, 27**| 3.3V | Keypad Matrix Row Scan Lines (R1, R2, R3, R4). |
| **Keypad** | 4x4 Membrane Cols | **GPIO 26, 25, 33, 32**| 3.3V | Keypad Matrix Column Input Lines (C1, C2, C3, C4) with internal pull-ups. |
| **Power** | LM2596 Step-Down Buck | **VIN and GND** | 5.0V DC | Steps 12V adapter down to 5.00V DC for ESP32 and logic rail. |

#### Inductive Spike Protection
A **1N4007 rectifier diode** is placed in reverse bias directly across the 12V solenoid lock terminals (cathode with the silver stripe connected to the positive 12V relay NO terminal; anode connected to ground). When the relay contact opens, the high-voltage inductive back-EMF spike produced by the collapsing magnetic field is safely dissipated through the diode, preventing microcontroller lockups and contact arcing.

### 3.5 Closed-Loop Operational State Machine

The vault firmware executes a deterministic, closed-loop state machine structured as follows:

```
  +----------------------------------------------------------------------------+
  |                             STATE 0: IDLE                                  |
  |  - Vault door is mechanically latched.                                     |
  |  - OLED display: "HULOG VAULT - Scan QR or Enter PIN".                     |
  |  - Keypad scanner and network listeners are active.                        |
  +-------------------------------------+--------------------------------------+
                                        |
                                        v (Courier enters 6-digit PIN on keypad
                                           or scans QR token via mobile scanner)
  +-------------------------------------+--------------------------------------+
  |                       STATE 1: TOKEN AUTHENTICATION                        |
  |  - Token is matched against local flash cache / pre-shared hash table.     |
  |  - If Invalid: Buzzer sounds 3 error chirps; failure counter increments.   |
  |                (3 failed attempts trigger 5-minute lockout).               |
  |  - If Valid: Solenoid relay energizes; transition to STATE 2.              |
  +-------------------------------------+--------------------------------------+
                                        |
                                        v
  +-------------------------------------+--------------------------------------+
  |                          STATE 2: UNLATCHING                               |
  |  - GPIO 23 pulled LOW for exactly 3,000 milliseconds.                      |
  |  - 12V solenoid retracts its spring-loaded plunger.                        |
  |  - OLED display: "ACCESS GRANTED - OPEN DOOR".                             |
  |  - 30-second watchdog timer starts.                                        |
  +-------------------------------------+--------------------------------------+
                                        |
                                        v
  +-------------------------------------+--------------------------------------+
  |                 STATE 3: DOOR AJAR & PARCEL DEPOSIT                        |
  |  - MC-38 Reed Switch opens (GPIO 19 transitions to HIGH).                  |
  |  - Courier pulls door open and deposits package.                           |
  |  - Active IR sensor inside tray detects object (GPIO 18 goes LOW).         |
  |  - OLED display: "DOOR OPEN - DEPOSIT PARCEL".                             |
  +-------------------------------------+--------------------------------------+
                                        |
                                        v
  +-------------------------------------+--------------------------------------+
  |             STATE 4: RE-LATCHING & TOKEN CONSUMPTION                       |
  |  - Courier closes the vault door.                                          |
  |  - MC-38 Reed Switch closes (GPIO 19 goes LOW).                            |
  |  - Mechanical angled tongue snaps into strike plate.                       |
  |  - Access token is permanently flagged as CONSUMED in flash memory.        |
  +-------------------------------------+--------------------------------------+
                                        |
                                        v
  +-------------------------------------+--------------------------------------+
  |               STATE 5: TELEMETRY & CONFIRMATION DISPATCH                   |
  |  - Buzzer emits a 3-tone success chime.                                    |
  |  - OLED display: "DELIVERY DONE! - PACKAGE SECURED".                       |
  |  - ESP32 dispatches encrypted MQTT payload to cloud broker.                |
  |  - Telegram Bot alerts homeowner with timestamped proof of deposit.        |
  |  - Vault returns to STATE 0 (IDLE).                                        |
  +----------------------------------------------------------------------------+
```

### 3.6 Software and Web Management System

The software architecture combines an embedded C++ firmware layer with a modern web visual hub:

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

## CURRENT PROTOTYPE IMPLEMENTATION STATUS

As of October 16, 2026, the project has achieved the following technical milestones:

| Project Subsystem | Target Milestone | Current Operational Status | Verification Method |
| :--- | :--- | :--- | :--- |
| **Component Procurement** | 14-item BOM acquisition | **100% Completed** | All electronic modules (ESP32, OLED, Keypad, Relay, Solenoid, Sensors, Buck Converter) physically acquired and cataloged. |
| **Repository & Documentation** | Git repository and specifications | **100% Completed** | Published to public GitHub repository (`buridekz/hulog-iot-vault`) with architecture, wiring, and API docs. |
| **Web Portal & Simulator** | Interactive dual-portal web app | **100% Completed** | Built and validated in `hulog-web/`. Production bundle passes with zero TypeScript or asset compilation errors. |
| **Firmware Scaffolding** | Embedded C++ PlatformIO core | **100% Completed** | Pinout mapping (`config.h`), library dependencies, and core state machine (`main.cpp`) scaffolded and ready for flashing. |
| **Hardware Bench Integration**| Breadboard wiring and bench test | **In Progress (Active Phase)**| PlatformIO toolchain installed; initial ESP32 flashing, OLED I2C testing, and relay switching underway on developer bench. |
| **Enclosure Assembly** | Tabletop demonstration vault mounting | **Scheduled (Post-Midterm)**| Mounting of solenoid, limit switch, and keypad into the physical hinged tabletop container. |

---

## NEXT STEPS FOR PART 2 FINALIZATION

Following the submission of this Part 1 Midterm Status Report, the engineering team will proceed with:
1. Conducting physical bench testing of the closed-loop sensor interlock, measuring actual solenoid retraction speeds and relay debounce timings.
2. Interfacing the ESP32 firmware with the cloud MQTT broker and Telegram Bot notification webhook.
3. Assembling the physical tabletop enclosure with installed acrylic viewing panels for academic defense demonstration.
4. Expanding Chapter 4 (Results, Discussion, Unit Economics, and Market Feasibility) to complete the full Part 2 Technopreneurship Book dossier.
