#ifndef HULOG_CONFIG_H
#define HULOG_CONFIG_H

#include <Arduino.h>

// ==========================================
// PIN ALLOCATIONS (ESP32 DevKit V1 30-Pin)
// ==========================================

// Relay & Actuation
#define PIN_RELAY_SOLENOID    23   // Active LOW trigger via PC817 Optocoupler

// Sensors & Inputs
#define PIN_REED_SWITCH       19   // MC-38 NC reed (INPUT_PULLUP: HIGH = magnet present, door closed)
#define PIN_IR_SENSOR         18   // Optical IR Sensor (LOW = Object Detected)

// Audio Feedback
#define PIN_BUZZER            5    // 5V Active Buzzer (HIGH = On)

// I2C OLED Display (SSD1306 128x64)
// Feed OLED VCC from the ESP32 3.3V pin only. Do not power the OLED from 5V.
// Do not power the ESP32 from USB and the buck 5V pin at the same time.
#define PIN_OLED_SDA          21   // Hardware I2C SDA
#define PIN_OLED_SCL          22   // Hardware I2C SCL
#define OLED_SCREEN_WIDTH     128
#define OLED_SCREEN_HEIGHT    64
#define OLED_RESET_PIN        -1
#define OLED_I2C_ADDR         0x3C

// 4x4 Membrane Keypad Matrix
#define KEYPAD_ROWS           4
#define KEYPAD_COLS           4
const byte KEYPAD_ROW_PINS[KEYPAD_ROWS] = {13, 12, 14, 27};
const byte KEYPAD_COL_PINS[KEYPAD_COLS] = {26, 25, 33, 32};

// ==========================================
// TIMING CONSTANTS (Milliseconds)
// ==========================================
#define SOLENOID_PULSE_DURATION_MS   3000   // Max pulse time to prevent coil overheating
#define DOOR_OPEN_TIMEOUT_MS        30000   // 30 seconds to open door before re-locking
#define DEBOUNCE_DELAY_MS              50   // Mechanical contact debounce window
#define LOCKOUT_DURATION_MS        300000   // 5 minutes lockout after 3 failed PIN attempts

// ==========================================
// VAULT STATE DEFINITIONS
// ==========================================
enum VaultState {
    VAULT_IDLE,
    VAULT_AUTHENTICATING,
    VAULT_UNLATCHING,
    VAULT_DOOR_AJAR,
    VAULT_PARCEL_DETECTED,
    VAULT_RE_LATCHING,
    VAULT_DELIVERY_CONFIRMED,
    VAULT_ERROR_LOCKOUT
};

#endif // HULOG_CONFIG_H
