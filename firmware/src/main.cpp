/**
 * @file main.cpp
 * @brief HULOG - IoT-Enabled Dynamic QR Parcel Drop Vault Firmware
 * @author Lance Josh M. Corpuz, Jhorenz S. Camarador, AJ M. Goze, Justin Mark D. Luzano
 * @version 1.0.0
 * 
 * Hardware: ESP32 DevKit V1 (30-Pin)
 * Framework: Arduino / FreeRTOS
 */

#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Keypad.h>
#include "config.h"

// OLED Display Instance
Adafruit_SSD1306 display(OLED_SCREEN_WIDTH, OLED_SCREEN_HEIGHT, &Wire, OLED_RESET_PIN);

// Keypad Configuration
char keypadKeys[KEYPAD_ROWS][KEYPAD_COLS] = {
    {'1', '2', '3', 'A'},
    {'4', '5', '6', 'B'},
    {'7', '8', '9', 'C'},
    {'*', '0', '#', 'D'}
};

byte rowPins[KEYPAD_ROWS] = {13, 12, 14, 27};
byte colPins[KEYPAD_COLS] = {26, 25, 33, 32};
Keypad keypad = Keypad(makeKeymap(keypadKeys), rowPins, colPins, KEYPAD_ROWS, KEYPAD_COLS);

// System State Variables
VaultState currentState = VAULT_IDLE;
String enteredPin = "";
unsigned long stateTimer = 0;
bool parcelDetectedInCycle = false;
int failedAttemptCount = 0;

// Forward Declarations
void updateDisplay(const String &title, const String &line1, const String &line2);
void beep(int count, int durationMs);
void triggerUnlock();
void handleKeypadInput(char key);
void runStateMachine();

void setup() {
    Serial.begin(115200);
    delay(500);
    Serial.println("\n==========================================");
    Serial.println("  HULOG IoT Drop Vault - Starting Up...");
    Serial.println("==========================================");

    // Initialize Actuators
    pinMode(PIN_RELAY_SOLENOID, OUTPUT);
    digitalWrite(PIN_RELAY_SOLENOID, HIGH); // Relay active LOW -> HIGH is OFF/LOCKED

    pinMode(PIN_BUZZER, OUTPUT);
    digitalWrite(PIN_BUZZER, LOW);

    // Initialize Sensors
    pinMode(PIN_REED_SWITCH, INPUT_PULLUP); // LOW = Door Closed, HIGH = Door Open
    pinMode(PIN_IR_SENSOR, INPUT);           // LOW = Object Present

    // Initialize I2C and OLED
    Wire.begin(PIN_OLED_SDA, PIN_OLED_SCL);
    if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_I2C_ADDR)) {
        Serial.println(F("[ERROR] SSD1306 OLED initialization failed. Check wiring!"));
    } else {
        Serial.println(F("[OK] SSD1306 OLED initialized successfully."));
        display.clearDisplay();
        updateDisplay("HULOG VAULT", "System Online", "Ready for Drop");
    }

    beep(2, 80);
    Serial.println(F("[OK] Hardware Initialization Completed. Entering VAULT_IDLE."));
}

void loop() {
    // 1. Scan Keypad Matrix
    char key = keypad.getKey();
    if (key) {
        handleKeypadInput(key);
    }

    // 2. Advance State Machine
    runStateMachine();

    delay(20); // FreeRTOS / loop yield
}

void handleKeypadInput(char key) {
    if (currentState == VAULT_ERROR_LOCKOUT) {
        beep(1, 400);
        return;
    }

    beep(1, 50); // Feedback chirp
    Serial.print(F("[KEYPAD] Pressed: "));
    Serial.println(key);

    if (key == '#') {
        // Submit PIN for authentication
        if (enteredPin.length() >= 4) {
            Serial.print(F("[AUTH] Validating PIN: "));
            Serial.println(enteredPin);
            
            // DEMO / TEST PIN: 482915 (or '1234' for quick bench testing)
            if (enteredPin == "482915" || enteredPin == "1234") {
                Serial.println(F("[AUTH] Success! Access Granted."));
                failedAttemptCount = 0;
                triggerUnlock();
            } else {
                Serial.println(F("[AUTH] Failed! Incorrect PIN."));
                failedAttemptCount++;
                beep(3, 150);
                updateDisplay("ACCESS DENIED", "Incorrect PIN", "Try Again");
                delay(1500);
                
                if (failedAttemptCount >= 3) {
                    currentState = VAULT_ERROR_LOCKOUT;
                    stateTimer = millis();
                    beep(1, 1000);
                    Serial.println(F("[SECURITY] 3 Failed attempts! Locked for 5 minutes."));
                } else {
                    currentState = VAULT_IDLE;
                }
            }
        }
        enteredPin = "";
    } else if (key == '*') {
        // Clear input buffer
        enteredPin = "";
        beep(2, 60);
        updateDisplay("HULOG VAULT", "Buffer Cleared", "Enter PIN:");
    } else {
        // Append numeric key
        if (enteredPin.length() < 8) {
            enteredPin += key;
            String maskedPin = "";
            for (size_t i = 0; i < enteredPin.length(); i++) maskedPin += "*";
            updateDisplay("ENTER PIN", maskedPin, "# to Submit");
        }
    }
}

void triggerUnlock() {
    currentState = VAULT_UNLATCHING;
    stateTimer = millis();
    parcelDetectedInCycle = false;

    // Energize Relay (Active LOW)
    digitalWrite(PIN_RELAY_SOLENOID, LOW);
    beep(1, 200);
    updateDisplay("UNLOCKED", "Open Door Now", "30s Remaining");
    Serial.println(F("[ACTUATOR] Solenoid energized. Door unlatched."));
}

void runStateMachine() {
    bool isDoorClosed = (digitalRead(PIN_REED_SWITCH) == LOW);
    bool isParcelDetected = (digitalRead(PIN_IR_SENSOR) == LOW);

    switch (currentState) {
        case VAULT_IDLE:
            // Display default screen if enteredPin is empty
            if (enteredPin.length() == 0 && millis() - stateTimer > 5000) {
                updateDisplay("HULOG VAULT", "Scan QR Code", "or Enter PIN #");
                stateTimer = millis();
            }
            break;

        case VAULT_UNLATCHING:
            // Turn off solenoid pulse after 3 seconds to protect coil
            if (millis() - stateTimer >= SOLENOID_PULSE_DURATION_MS) {
                digitalWrite(PIN_RELAY_SOLENOID, HIGH); // De-energize
                currentState = VAULT_DOOR_AJAR;
                stateTimer = millis();
                Serial.println(F("[ACTUATOR] Solenoid de-energized. Waiting for door open..."));
            }
            break;

        case VAULT_DOOR_AJAR:
            if (!isDoorClosed) {
                // Door has been pulled open by the courier
                updateDisplay("DOOR OPEN", "Deposit Parcel", "Close Door Firmly");
                if (isParcelDetected) {
                    parcelDetectedInCycle = true;
                }
            } else {
                // Door has been re-closed!
                if (millis() - stateTimer > 1000) {
                    if (parcelDetectedInCycle || isParcelDetected) {
                        currentState = VAULT_DELIVERY_CONFIRMED;
                        Serial.println(F("[CYCLE] Parcel deposit confirmed & door closed!"));
                    } else {
                        currentState = VAULT_IDLE;
                        Serial.println(F("[CYCLE] Door re-latched without parcel."));
                    }
                    stateTimer = millis();
                }
            }

            // Timeout check: If door not touched for 30s
            if (millis() - stateTimer > DOOR_OPEN_TIMEOUT_MS) {
                digitalWrite(PIN_RELAY_SOLENOID, HIGH);
                currentState = VAULT_IDLE;
                beep(2, 200);
                Serial.println(F("[TIMEOUT] Door cycle timed out. Re-arming vault."));
            }
            break;

        case VAULT_DELIVERY_CONFIRMED:
            updateDisplay("DELIVERY DONE!", "Package Secured", "Door cycle done");
            beep(3, 100);
            delay(3000);
            currentState = VAULT_IDLE;
            break;

        case VAULT_ERROR_LOCKOUT:
            updateDisplay("SECURITY LOCK", "Keypad Disabled", "Wait 5 Minutes");
            if (millis() - stateTimer > LOCKOUT_DURATION_MS) {
                failedAttemptCount = 0;
                currentState = VAULT_IDLE;
                beep(2, 100);
                Serial.println(F("[SECURITY] Lockout timer elapsed. Keypad restored."));
            }
            break;

        default:
            currentState = VAULT_IDLE;
            break;
    }
}

void updateDisplay(const String &title, const String &line1, const String &line2) {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);

    // Title Bar
    display.setCursor(0, 0);
    display.println(title);
    display.drawLine(0, 11, 128, 11, SSD1306_WHITE);

    // Body Lines
    display.setCursor(0, 20);
    display.println(line1);

    display.setCursor(0, 40);
    display.println(line2);

    display.display();
}

void beep(int count, int durationMs) {
    for (int i = 0; i < count; i++) {
        digitalWrite(PIN_BUZZER, HIGH);
        delay(durationMs);
        digitalWrite(PIN_BUZZER, LOW);
        if (i < count - 1) delay(durationMs / 2);
    }
}
