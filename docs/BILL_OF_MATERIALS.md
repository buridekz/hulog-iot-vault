# HULOG Bill of Materials (BOM) & Sourcing Specification

This document provides the itemized procurement breakdown, unit pricing, electrical specifications, and commercial manufacturing economics for the **HULOG IoT-Enabled Dynamic QR Parcel Drop Vault**.

---

## 📊 Prototype Bill of Materials (BOM) Breakdown

Prices are grounded in active local electronics supply catalogs (Makerlab Electronics, e-Gizmo, and verified online hobbyist distributors in Metro Manila, Philippines).

| # | Item Name | Model / Specification | Subsystem | Qty | Unit Price (PHP) | Total Price (PHP) | Priority |
| :-: | :--- | :--- | :--- | :-: | :-: | :-: | :-: |
| 1 | **ESP32 DevKit V1** | 30-pin, Dual-Core 240MHz, 4MB Flash, Wi-Fi + BLE | Brain / MCU | 1 | ₱240.00 | ₱240.00 | Essential |
| 2 | **0.96" I2C OLED Display** | SSD1306, 128x64 px, 4-pin (VCC, GND, SCL, SDA) | Interface | 1 | ₱110.00 | ₱110.00 | Essential |
| 3 | **4x4 Matrix Membrane Keypad** | 16-key matrix (0-9, A-D, *, #), 8-pin female | Interface | 1 | ₱65.00 | ₱65.00 | Essential |
| 4 | **Magnetic Door Contact Switch**| MC-38, Normally Closed (NC) with magnet pair | Sensor | 1 | ₱55.00 | ₱55.00 | Essential |
| 5 | **Active Optical IR Sensor** | 3-pin reflective obstacle sensor with comparator | Sensor | 1 | ₱25.00 | ₱25.00 | Essential |
| 6 | **5V Active Piezo Buzzer** | 85dB SPL continuous tone sounder | Audio | 1 | ₱20.00 | ₱20.00 | Essential |
| 7 | **12V Solenoid Cabinet Lock** | Tongue-down electromagnetic latch, 12V 0.8A | Actuation | 1 | ₱190.00 | ₱190.00 | Essential |
| 8 | **1-Channel 5V Relay Module** | Optocoupler isolated, 10A 250VAC / 30VDC contacts| Power/Switch| 1 | ₱45.00 | ₱45.00 | Essential |
| 9 | **12V 2A DC Power Adapter** | 220V AC input to 12V DC 2A, 5.5x2.1mm barrel jack | Power | 1 | ₱115.00 | ₱115.00 | Essential |
| 10 | **DC Barrel Jack Screw Terminals**| 5.5x2.1mm female to screw block adapter | Power | 2 | ₱20.00 | ₱40.00 | Essential |
| 11 | **LM2596 DC-DC Buck Converter** | Step-down module, 12V in to 5V 3A out (adjustable) | Power | 1 | ₱55.00 | ₱55.00 | Recommended |
| 12 | **Dupont Jumper Wires** | 40-pcs 20cm Female-to-Female ribbon cable | Wiring | 1 | ₱50.00 | ₱50.00 | Essential |
| 13 | **Tabletop Prototype Vault Box**| Wood / Acrylic craft box (~25x20x15cm) with lid | Enclosure | 1 | ₱180.00 | ₱180.00 | Essential |
| 14 | **Mini Cabinet Butt Hinges** | 1.5-inch metal hinges with mounting wood screws | Hardware | 1 | ₱35.00 | ₱35.00 | Recommended |
| **—** | **Total Prototype Cost** | **Complete Tabletop Working Hardware Setup** | **—** | **—** | **—** | **₱1,225.00** | **—** |

> [!NOTE]
> **Core Electronics BOM Subtotal:** The pure electronics payload (Items 1–12, excluding the craft enclosure box and hinges) totals **₱820.00 to ₱1,010.00**, representing an accessible entry cost for residential IoT security in Southeast Asia.

---

## 📈 Commercial Sizing & Scaling Economics

| Sizing Metric | Academic Prototype (Tabletop) | Pilot Production (100 Units) | Mass Production (1,000+ Units) |
| :--- | :--- | :--- | :--- |
| **Microcontroller / Core** | ESP32 DevKit V1 (₱240.00) | ESP32-WROOM-32 Bare Module (₱145.00) | Custom Integrated SMD PCB (₱110.00) |
| **Solenoid Latch** | 12V 0.8A Small Latch (₱190.00) | 12V 1.1A Heavy-Duty Latch (₱165.00) | Wholesale Cast Steel Latch (₱130.00) |
| **Enclosure Material** | Wood / Acrylic Tabletop (₱180.00)| 1.2mm Galvanized Steel (₱750.00) | Laser-Cut Powder-Coated Steel (₱550.00)|
| **Total Unit Production Cost** | **₱1,225.00** | **₱1,650.00** | **₱1,280.00** |
| **Target Retail Price** | **N/A (Prototype)** | **₱3,499.00** | **₱3,999.00 – ₱4,999.00** |
| **Gross Margin per Unit** | **—** | **52.8%** | **68.0%** |

---

## 🛒 Procurement Guide & Search Terms

When sourcing replacement parts or additional development units in the Philippines, use the following standardized vendor search queries:

- **ESP32:** `"ESP32 DevKit V1 30 pin CH340 / CP2102"`
- **OLED:** `"0.96 inch I2C OLED SSD1306 4 pin Blue / White"`
- **Keypad:** `"4x4 matrix membrane keypad 16 key 8 pin"`
- **Reed Switch:** `"MC-38 magnetic door contact switch normally closed"`
- **IR Sensor:** `"IR infrared obstacle avoidance sensor module 3 pin"`
- **Relay:** `"1 channel 5V relay module with optocoupler high low trigger"`
- **Solenoid:** `"12V solenoid cabinet lock tongue down"`
- **Buck Converter:** `"LM2596 DC-DC step down buck converter module 3A"`
