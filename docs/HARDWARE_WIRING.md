# HULOG Hardware Wiring & Pinout Guide

This document details the complete electrical schematic, pinout assignments, power distribution architecture, and safety interlocks for the **HULOG IoT-Enabled Dynamic QR Parcel Drop Vault**.

---

## ⚡ Power Distribution Architecture

The system operates on a dual-rail power topology driven by a single **12V 2A DC regulated switching adapter**:
1. **12V High-Current Rail (Primary):** Supplies the 12V electromagnetic solenoid lock directly through the relay contacts (NO/COM), bypassing the microcontroller logic to eliminate electrical noise and voltage sags.
2. **5.0V Low-Noise Logic Rail (Secondary):** Stepped down from 12V using an **LM2596 DC-DC Buck Converter** module. Powers the ESP-WROOM-32 microcontroller via its `VIN` pin and provides clean 5V to the sensors, relay coil, and display.

```text
 12V 2A DC Adapter 
   [ + ] ────────────────┬───────────────────────────> Relay COM Terminal
                         │
                         └─> [LM2596 IN+]
                             [LM2596 IN-] ──┐
   [ - ] ───────────────────────────────────┼────────> System Common Ground (GND)
                                            │
                             [LM2596 OUT+] ─┴────────> +5.0V DC Logic Bus
                                                       (ESP32 VIN, Relay VCC, IR Sensor, Buzzer)
                             [LM2596 OUT-] ──────────> System Common Ground (GND)
```

> [!CAUTION]
> **Voltage Calibration Step:** Before connecting the ESP32 or sensors to the LM2596 output, measure the voltage across `OUT+` and `OUT-` with a digital multimeter. Rotate the multi-turn brass potentiometer counter-clockwise until the output reads precisely **5.00V DC**.

---

## 📌 ESP32 30-Pin GPIO Allocation Table

All pin assignments have been selected to avoid ESP32 strapping pins (`GPIO 0`, `GPIO 2`, `GPIO 15`) and input-only pins (`GPIO 34-39`) that lack internal pull-up resistors.

| Subsystem / Peripheral | Pin Function | ESP32 GPIO | Operating Voltage | Logic Mode / Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Solenoid Relay** | Control Signal (`IN`) | **GPIO 23** | 3.3V / 5V | Output (Active LOW via Optocoupler) |
| **OLED Display (SSD1306)** | I2C Clock (`SCL`) | **GPIO 22** | 3.3V / 5V | Hardware I2C Clock (100kHz / 400kHz) |
| **OLED Display (SSD1306)** | I2C Data (`SDA`) | **GPIO 21** | 3.3V / 5V | Hardware I2C Data |
| **Door Magnetic Reed Switch** | Door State Sense | **GPIO 19** | 3.3V | Input (`INPUT_PULLUP`). LOW = Closed, HIGH = Open |
| **Optical IR Presence Sensor** | Parcel Detection (`OUT`)| **GPIO 18** | 3.3V / 5V | Digital Input. LOW = Parcel Present in Tray |
| **5V Active Buzzer** | Audio Feedback (+) | **GPIO 5** | 3.3V | Output. PWM / Digital Pulse for Chimes |
| **4x4 Membrane Keypad** | Row 1 (R1) | **GPIO 13** | 3.3V | Keypad Matrix Row Scan (Output) |
| **4x4 Membrane Keypad** | Row 2 (R2) | **GPIO 12** | 3.3V | Keypad Matrix Row Scan (Output) |
| **4x4 Membrane Keypad** | Row 3 (R3) | **GPIO 14** | 3.3V | Keypad Matrix Row Scan (Output) |
| **4x4 Membrane Keypad** | Row 4 (R4) | **GPIO 27** | 3.3V | Keypad Matrix Row Scan (Output) |
| **4x4 Membrane Keypad** | Column 1 (C1) | **GPIO 26** | 3.3V | Keypad Matrix Column Read (`INPUT_PULLUP`) |
| **4x4 Membrane Keypad** | Column 2 (C2) | **GPIO 25** | 3.3V | Keypad Matrix Column Read (`INPUT_PULLUP`) |
| **4x4 Membrane Keypad** | Column 3 (C3) | **GPIO 33** | 3.3V | Keypad Matrix Column Read (`INPUT_PULLUP`) |
| **4x4 Membrane Keypad** | Column 4 (C4) | **GPIO 32** | 3.3V | Keypad Matrix Column Read (`INPUT_PULLUP`) |

---

## 🔌 Detailed Subsystem Wiring Schematics

### 1. 12V Solenoid Latch & 1-Channel Relay Subsystem
The solenoid lock draws up to 1.1A upon activation. The relay module provides galvanic isolation through an onboard PC817 optocoupler.

```text
       +5V Logic ─────────────> Relay VCC
       ESP32 GPIO 23 ─────────> Relay IN (Active LOW)
       Common GND ────────────> Relay GND

       +12V Supply ───────────> Relay COM
       Relay NO ──────────────┬───────────────> Solenoid Red Wire (+)
                              │
                            ┌─┴─┐
                            ▲   │ 1N4007 Diode (Cathode / silver stripe to NO)
                            │   │ (Protects against inductive back-EMF)
                            └─┬─┘
                              │
       Common GND ────────────┴───────────────> Solenoid Black Wire (-)
```

> [!TIP]
> **Flyback Diode Protection:** Always install a **1N4007 rectifier diode** directly across the solenoid terminal connections in reverse-bias (silver band facing the positive 12V rail). When the relay opens, the collapsing magnetic field creates a high-voltage reverse spike; the diode safely circulates and dissipates this current.

---

### 2. 0.96" SSD1306 OLED Display (I2C)
Displays dynamic vault state, countdown timer for active tokens, deposit instructions, and error feedback.

```text
       ESP32 3.3V (or 5V) ────> OLED VCC
       Common GND ────────────> OLED GND
       ESP32 GPIO 22 ─────────> OLED SCL
       ESP32 GPIO 21 ─────────> OLED SDA
```

---

### 3. Door State Magnetic Reed Switch
Mounted on the door frame with the permanent magnet on the moving hatch door.

```text
       ESP32 GPIO 19 ─────────> Reed Switch Lead 1
       Common GND ────────────> Reed Switch Lead 2
       (Firmware configures GPIO 19 with internal pull-up resistor: pinMode(19, INPUT_PULLUP))
```

- **Door Closed:** Magnet aligns with switch -> Circuit CLOSED -> GPIO 19 reads `LOW` (0V).
- **Door Open / Ajar:** Magnet moves away -> Circuit OPEN -> GPIO 19 pulled `HIGH` (3.3V).

---

### 4. Active IR Parcel Presence Sensor
Positioned inside the vault deposit chamber angled across the bottom receiving tray.

```text
       +5V Logic ─────────────> IR Sensor VCC
       Common GND ────────────> IR Sensor GND
       ESP32 GPIO 18 ─────────> IR Sensor OUT (Digital Output)
```

- When an obstacle (package) interrupts the infrared beam, the comparator module triggers and pulls `OUT` to `LOW`. An onboard potentiometer calibrates the detection distance threshold (typically 5cm to 25cm).

---

### 5. 5V Active Buzzer
Provides audible cues for key presses, access granted, countdown warning, and tamper alarms.

```text
       ESP32 GPIO 5 ──────────> Buzzer Positive Lead (+)
       Common GND ────────────> Buzzer Negative Lead (-)
```

---

### 6. 4x4 Membrane Keypad Matrix
Used for emergency passcode entry, offline master pin overrides, and numeric OTP entry.

```text
       Pin 1 (Row 1)    ───> ESP32 GPIO 13
       Pin 2 (Row 2)    ───> ESP32 GPIO 12
       Pin 3 (Row 3)    ───> ESP32 GPIO 14
       Pin 4 (Row 4)    ───> ESP32 GPIO 27
       Pin 5 (Column 1) ───> ESP32 GPIO 26
       Pin 6 (Column 2) ───> ESP32 GPIO 25
       Pin 7 (Column 3) ───> ESP32 GPIO 33
       Pin 8 (Column 4) ───> ESP32 GPIO 32
```

---

## 🛠️ Assembly & Verification Checklist

1. **Verify Buck Output:** Measure LM2596 output voltage with a multimeter. Ensure it reads between 4.95V and 5.05V DC before attaching any breakout pins.
2. **Common Ground Connection:** Ensure all GND pins (12V Supply, LM2596 OUT-, ESP32 GND, Relay GND, and Sensor GND) share a single unified electrical ground plane.
3. **Verify Solenoid Pulse Duration:** In firmware, ensure the relay energizes the solenoid for **no more than 3 to 5 seconds** per cycle. Solenoid locks are intermittent-duty actuators; continuous energization causes the internal coil to overheat.
4. **Debounce Inputs:** All mechanical switches (reed switch and membrane buttons) must implement software debounce filtering (minimum 30ms window) in FreeRTOS to prevent false triggers caused by mechanical contact chatter.
