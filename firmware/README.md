# HULOG ESP32 Firmware Development Guide

This folder contains the embedded C++ source code, pin configurations, and PlatformIO environment for the **HULOG IoT-Enabled Dynamic QR Parcel Drop Vault**.

---

## 🛠️ Toolchain Prerequisites

We recommend using **PlatformIO** (either via VS Code extension or the PlatformIO Core CLI).

1. Install [VS Code](https://code.visualstudio.com/)
2. Install the **PlatformIO IDE** extension from the VS Code Extensions Marketplace (`platformio.platformio-ide`).
3. Connect your **ESP32 DevKit V1** board to your PC via a micro-USB cable with data lines.

---

## 🚀 Building & Flashing

### Using PlatformIO CLI
```bash
# Navigate to the firmware directory
cd firmware

# Build the project (downloads libraries automatically)
pio run

# Flash firmware to the connected ESP32
pio run --target upload

# Open the serial monitor at 115200 baud
pio run --target monitor
```

### Using PlatformIO in VS Code
1. Open the `firmware/` directory or the repository root in VS Code.
2. Click the **PlatformIO Alien Icon** on the sidebar.
3. Under **Project Tasks**, click **Build** (`✓`), then **Upload** (`→`).
4. Click **Serial Monitor** (`🔌`) to view real-time debug telemetry at 115200 baud.

---

## 🧪 Bench Testing Without Full Enclosure

Power the OLED from the ESP32 3.3V pin. Do not power it from 5V. Do not power the ESP32 from the USB cable and the buck 5V pin at the same time.

1. Copy `include/secrets.example.h` to `include/secrets.h`. Put the house Wi-Fi in the first pair and the iPhone hotspot in the second pair, plus the Supabase URL and publishable key. `secrets.h` stays off git. The board tries the house network first, then the hotspot. Both must be 2.4 GHz WPA2. On the iPhone, turn on Maximize Compatibility.
2. Connect the 0.96" OLED (`SDA -> GPIO 21`, `SCL -> GPIO 22`, `VCC -> 3.3V`).
3. Connect the 4x4 keypad to the pins in `config.h`.
4. Stamp a code on the owner page. The screen should say `Code ready` and must not show the digits.
5. Type that code and `#`. There is no standing bench code. `1234` and `482915` do not open the box.
6. The code is marked used only after the door has opened, the parcel sensor sees the parcel, and the door shuts again.
