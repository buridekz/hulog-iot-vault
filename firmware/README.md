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

You can bench-test the entire state machine on your desk with the bare modules:
1. Connect the 0.96" OLED (`SDA -> GPIO 21`, `SCL -> GPIO 22`).
2. Connect the 4x4 Keypad to the designated GPIO pins in `config.h`.
3. Type test PIN `482915` (or `1234`) followed by `#`.
4. Observe the relay click, OLED state transition, and serial debug output!
