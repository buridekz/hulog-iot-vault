/**
 * @file main.cpp
 * @brief HULOG gate box. One live code, then it dies.
 *
 * The phone writes the code. This board reads it over the house Wi-Fi.
 * The rider types it on the keypad and presses #.
 * The code is marked used only after the door opens, the parcel is seen,
 * and the door shuts. Coming home is a separate one-time open with no PIN.
 *
 * OLED VCC uses the ESP32 3.3V pin. Do not power the OLED from 5V.
 * Do not power the ESP32 from USB and the buck 5V pin at the same time.
 */

#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Keypad.h>
#include "config.h"
#include "secrets.h"

Adafruit_SSD1306 display(OLED_SCREEN_WIDTH, OLED_SCREEN_HEIGHT, &Wire, OLED_RESET_PIN);

char keypadKeys[KEYPAD_ROWS][KEYPAD_COLS] = {
    {'1', '2', '3', 'A'},
    {'4', '5', '6', 'B'},
    {'7', '8', '9', 'C'},
    {'*', '0', '#', 'D'}
};

byte rowPins[KEYPAD_ROWS] = {13, 12, 14, 27};
byte colPins[KEYPAD_COLS] = {26, 25, 33, 32};
Keypad keypad = Keypad(makeKeymap(keypadKeys), rowPins, colPins, KEYPAD_ROWS, KEYPAD_COLS);

enum UnlockKind : uint8_t {
    UNLOCK_NONE,
    UNLOCK_DROP,
    UNLOCK_OWNER
};

enum DoorPrompt : uint8_t {
    PROMPT_NONE,
    PROMPT_OPEN,
    PROMPT_PUT,
    PROMPT_SEEN,
    PROMPT_SHUT,
    PROMPT_TAKE
};

VaultState currentState = VAULT_IDLE;
UnlockKind unlockKind = UNLOCK_NONE;
DoorPrompt doorPrompt = PROMPT_NONE;
String enteredPin = "";
String livePin = "";
String pinToClear = "";
unsigned long stateTimer = 0;
unsigned long lastCloudPoll = 0;
unsigned long lastKeyMs = 0;
unsigned long lastWifiTry = 0;
unsigned long doorClosedAt = 0;
unsigned long reedChangeAt = 0;
bool reedRawClosed = false;
bool reedStableClosed = false;
bool parcelDetectedInCycle = false;
bool doorWasOpened = false;
bool dropClearPending = false;
bool codeWasUsed = false;
bool pinActive = false;
bool wifiReady = false;
bool cloudConfigured = false;
int failedAttemptCount = 0;
int wifiTrySlot = 0;

struct WifiChoice {
    const char *ssid;
    const char *password;
};

const WifiChoice wifiChoices[] = {
    {WIFI_SSID, WIFI_PASSWORD},
    {WIFI_SSID_2, WIFI_PASSWORD_2},
};
const int wifiChoiceCount = sizeof(wifiChoices) / sizeof(wifiChoices[0]);

bool anyWifiSet() {
    for (int i = 0; i < wifiChoiceCount; i++) {
        if (strlen(wifiChoices[i].ssid) > 0) return true;
    }
    return false;
}

int nextWifiSlot(int start) {
    for (int n = 0; n < wifiChoiceCount; n++) {
        int i = (start + n) % wifiChoiceCount;
        if (strlen(wifiChoices[i].ssid) > 0) return i;
    }
    return -1;
}

WiFiClientSecure secureClient;

const unsigned long CLOUD_POLL_MS = 4000;

void updateDisplay(const String &title, const String &line1, const String &line2);
void connectWifi();
void maintainWifi();
bool pinAccepted(const String &pin);
void beep(int count, int durationMs);
void triggerUnlock(UnlockKind kind);
void handleKeypadInput(char key);
void runStateMachine();
void serviceCloud();
bool httpsGet(const String &path, String &response);
bool httpsPatch(const String &path, const String &payload, String &response);
bool patchClearPin();
bool doorIsClosed();
void sampleReed();
void showMagnetOnIdle();
bool parcelIsSeen();
void noteDoorCycle();
bool doorSettledShut();
void finishDropCycle();
void confirmDelivery();
void showPrompt(DoorPrompt prompt);

void setup() {
    Serial.begin(115200);
    delay(500);
    Serial.println(F("\nHULOG vault starting"));

    pinMode(PIN_RELAY_SOLENOID, OUTPUT);
    digitalWrite(PIN_RELAY_SOLENOID, HIGH);

    pinMode(PIN_BUZZER, OUTPUT);
    digitalWrite(PIN_BUZZER, LOW);

    pinMode(PIN_REED_SWITCH, INPUT_PULLUP);
    pinMode(PIN_IR_SENSOR, INPUT);
    reedRawClosed = digitalRead(PIN_REED_SWITCH) == HIGH;
    reedStableClosed = reedRawClosed;
    reedChangeAt = millis();
    Serial.print(F("[DOOR] GPIO19 is "));
    Serial.println(reedRawClosed
        ? F("HIGH. Magnet is on the switch.")
        : F("LOW. Magnet is away."));

    Wire.begin(PIN_OLED_SDA, PIN_OLED_SCL);
    if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_I2C_ADDR)) {
        Serial.println(F("[ERROR] OLED did not start. VCC must be 3.3V."));
    } else {
        updateDisplay("HULOG VAULT", "Starting", "");
    }

    secureClient.setInsecure();
    cloudConfigured = strlen(SUPABASE_URL) > 0 && strlen(SUPABASE_ANON_KEY) > 0;
    connectWifi();
    beep(2, 80);
}

void loop() {
    sampleReed();
    maintainWifi();

    char key = keypad.getKey();
    if (key) handleKeypadInput(key);

    runStateMachine();
    serviceCloud();
    delay(20);
}

void handleKeypadInput(char key) {
    lastKeyMs = millis();
    if (currentState != VAULT_IDLE) {
        if (currentState == VAULT_ERROR_LOCKOUT) beep(1, 400);
        return;
    }

    beep(1, 50);

    if (key == '#') {
        if (enteredPin.length() != 6) {
            updateDisplay("TYPE THE CODE", "Need 6 digits", "# to open");
        } else if (pinAccepted(enteredPin)) {
            failedAttemptCount = 0;
            Serial.println(F("[AUTH] Code matched."));
            triggerUnlock(UNLOCK_DROP);
        } else {
            failedAttemptCount++;
            beep(3, 150);
            updateDisplay("WRONG CODE", "Try again", "");
            delay(1200);
            if (failedAttemptCount >= 3) {
                currentState = VAULT_ERROR_LOCKOUT;
                stateTimer = millis();
                beep(1, 1000);
                Serial.println(F("[SECURITY] Keypad locked for 5 minutes."));
            } else {
                currentState = VAULT_IDLE;
                stateTimer = millis();
            }
        }
        enteredPin = "";
    } else if (key == '*') {
        enteredPin = "";
        beep(2, 60);
        updateDisplay(
            "HULOG VAULT",
            pinActive ? "Code ready" : (codeWasUsed ? "Code is used" : "No code yet"),
            pinActive ? "Type it, then #" : (codeWasUsed ? "It will not work again" : "")
        );
    } else if (enteredPin.length() < 6 && key >= '0' && key <= '9') {
        enteredPin += key;
        String masked = "";
        for (size_t i = 0; i < enteredPin.length(); i++) masked += "*";
        updateDisplay("TYPE THE CODE", masked, "# to open");
    }
}

bool pinAccepted(const String &pin) {
    if (pin.length() != 6 || !pinActive || livePin.length() != 6) return false;
    if (dropClearPending && pin == pinToClear) return false;
    if (codeWasUsed && pin == pinToClear) return false;
    return pin == livePin;
}

void showPrompt(DoorPrompt prompt) {
    if (doorPrompt == prompt) return;
    doorPrompt = prompt;
    if (prompt == PROMPT_OPEN) updateDisplay("DOOR OPEN", "Open the door", "Then put it in");
    else if (prompt == PROMPT_PUT) updateDisplay("DOOR OPEN", "Put the parcel in", "Then shut the door");
    else if (prompt == PROMPT_SEEN) updateDisplay("PARCEL SEEN", "Shut the door", "");
    else if (prompt == PROMPT_SHUT) updateDisplay("DOOR SHUT", "Checking the parcel", "Hold it closed");
    else if (prompt == PROMPT_TAKE) updateDisplay("DOOR OPEN", "Take the parcel", "Then shut the door");
}

void showMagnetOnIdle() {
    if (currentState != VAULT_IDLE || enteredPin.length() != 0) return;
    const char *magnet = reedStableClosed ? "Magnet seen" : "No magnet";
    if (!wifiReady) updateDisplay("HULOG VAULT", anyWifiSet() ? "No Wi-Fi" : "No Wi-Fi set", magnet);
    else if (!cloudConfigured) updateDisplay("HULOG VAULT", "Cloud is not set", magnet);
    else if (pinActive) updateDisplay("HULOG VAULT", "Code ready", magnet);
    else if (codeWasUsed) updateDisplay("HULOG VAULT", "Code is used", magnet);
    else updateDisplay("HULOG VAULT", "No code yet", magnet);
    stateTimer = millis();
}

void sampleReed() {
    bool raw = digitalRead(PIN_REED_SWITCH) == HIGH;
    unsigned long now = millis();
    if (raw != reedRawClosed) {
        reedRawClosed = raw;
        reedChangeAt = now;
        Serial.print(F("[DOOR] GPIO19 "));
        Serial.println(raw ? F("LOW") : F("HIGH"));
    }
    if (raw) {
        if (!reedStableClosed && now - reedChangeAt >= 30) {
            reedStableClosed = true;
            Serial.println(F("[DOOR] Magnet is closing the switch."));
            showMagnetOnIdle();
        }
    } else if (reedStableClosed && now - reedChangeAt >= 150) {
        reedStableClosed = false;
        Serial.println(F("[DOOR] Magnet let go."));
        showMagnetOnIdle();
    }
}

bool doorIsClosed() {
    return reedStableClosed;
}

bool parcelIsSeen() {
    return digitalRead(PIN_IR_SENSOR) == LOW;
}

void noteDoorCycle() {
    bool closed = doorIsClosed();
    bool parcel = parcelIsSeen();
    if (!closed) {
        doorClosedAt = 0;
        doorWasOpened = true;
        if (parcel) parcelDetectedInCycle = true;
        if (unlockKind == UNLOCK_OWNER) showPrompt(PROMPT_TAKE);
        else showPrompt(parcelDetectedInCycle ? PROMPT_SEEN : PROMPT_PUT);
    } else if (doorWasOpened) {
        if (doorClosedAt == 0) doorClosedAt = millis();
        if (unlockKind == UNLOCK_DROP) showPrompt(PROMPT_SHUT);
    } else if (unlockKind == UNLOCK_DROP) {
        showPrompt(PROMPT_OPEN);
    }
}

bool doorSettledShut() {
    return doorWasOpened && doorClosedAt != 0 && (millis() - doorClosedAt > 400);
}

void triggerUnlock(UnlockKind kind) {
    unlockKind = kind;
    doorWasOpened = false;
    doorClosedAt = 0;
    parcelDetectedInCycle = false;
    doorPrompt = PROMPT_NONE;
    currentState = VAULT_UNLATCHING;
    stateTimer = millis();
    enteredPin = "";

    digitalWrite(PIN_RELAY_SOLENOID, LOW);
    beep(1, 200);
    if (kind == UNLOCK_OWNER) {
        showPrompt(PROMPT_TAKE);
        Serial.println(F("[ACTUATOR] Owner open. Request cleared."));
    } else {
        if (livePin.length() == 6) pinToClear = livePin;
        showPrompt(PROMPT_OPEN);
        Serial.println(F("[ACTUATOR] Drop open."));
    }
}

void finishIdle(const String &line1, const String &line2) {
    digitalWrite(PIN_RELAY_SOLENOID, HIGH);
    currentState = VAULT_IDLE;
    unlockKind = UNLOCK_NONE;
    doorPrompt = PROMPT_NONE;
    stateTimer = millis();
    updateDisplay("HULOG VAULT", line1, line2);
}

void confirmDelivery() {
    if (livePin.length() == 6) pinToClear = livePin;
    livePin = "";
    pinActive = false;
    codeWasUsed = pinToClear.length() == 6;
    dropClearPending = codeWasUsed;
    unlockKind = UNLOCK_NONE;
    doorPrompt = PROMPT_NONE;
    digitalWrite(PIN_RELAY_SOLENOID, HIGH);
    updateDisplay("PARCEL IS IN", "Code is used", "It will not work again");
    beep(3, 100);
    Serial.println(F("[CYCLE] Door shut with a parcel."));
    if (dropClearPending && patchClearPin()) dropClearPending = false;
    currentState = VAULT_IDLE;
    stateTimer = millis();
}

void finishDropCycle() {
    digitalWrite(PIN_RELAY_SOLENOID, HIGH);
    bool parcel = parcelDetectedInCycle || parcelIsSeen();
    if (unlockKind == UNLOCK_OWNER) {
        finishIdle("Door shut", "Open is finished");
        Serial.println(F("[CYCLE] Owner open finished."));
        return;
    }
    if (unlockKind == UNLOCK_DROP && doorWasOpened && parcel) {
        confirmDelivery();
        return;
    }
    finishIdle(pinActive ? "Code ready" : "Door shut", pinActive ? "Type it, then #" : "No parcel seen");
    Serial.println(F("[CYCLE] Door shut with no parcel. Code still live."));
}

void runStateMachine() {
    switch (currentState) {
        case VAULT_IDLE:
            if (enteredPin.length() == 0 && millis() - stateTimer > 5000) {
                if (!wifiReady) {
                    updateDisplay("HULOG VAULT", anyWifiSet() ? "No Wi-Fi" : "No Wi-Fi set", reedStableClosed ? "Magnet seen" : "No magnet");
                } else if (!cloudConfigured) {
                    updateDisplay("HULOG VAULT", "Cloud is not set", reedStableClosed ? "Magnet seen" : "No magnet");
                } else if (pinActive) {
                    updateDisplay("HULOG VAULT", "Code ready", reedStableClosed ? "Magnet seen" : "No magnet");
                } else if (codeWasUsed) {
                    updateDisplay("HULOG VAULT", "Code is used", reedStableClosed ? "Magnet seen" : "No magnet");
                } else {
                    updateDisplay("HULOG VAULT", "No code yet", reedStableClosed ? "Magnet seen" : "No magnet");
                }
                stateTimer = millis();
            }
            break;

        case VAULT_UNLATCHING:
            noteDoorCycle();
            if (doorSettledShut()) {
                finishDropCycle();
                break;
            }
            if (millis() - stateTimer >= SOLENOID_PULSE_DURATION_MS) {
                digitalWrite(PIN_RELAY_SOLENOID, HIGH);
                currentState = VAULT_DOOR_AJAR;
                Serial.println(F("[ACTUATOR] Bolt released. Waiting for the door."));
            }
            break;

        case VAULT_DOOR_AJAR:
            noteDoorCycle();
            if (doorSettledShut()) {
                finishDropCycle();
                break;
            }
            if (millis() - stateTimer > DOOR_OPEN_TIMEOUT_MS) {
                beep(2, 200);
                finishIdle(pinActive ? "Code ready" : "Timed out", pinActive ? "Type it, then #" : "Door stayed shut");
                Serial.println(F("[TIMEOUT] Door cycle ended. Code still live."));
            }
            break;

        case VAULT_ERROR_LOCKOUT:
            updateDisplay("KEYPAD LOCKED", "Wait 5 minutes", "");
            if (millis() - stateTimer > LOCKOUT_DURATION_MS) {
                failedAttemptCount = 0;
                currentState = VAULT_IDLE;
                stateTimer = millis();
                beep(2, 100);
                Serial.println(F("[SECURITY] Keypad restored."));
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
    display.setCursor(0, 0);
    display.println(title);
    display.drawLine(0, 11, 128, 11, SSD1306_WHITE);
    display.setCursor(0, 20);
    display.println(line1);
    display.setCursor(0, 40);
    display.println(line2);
    display.display();
}

bool httpsSend(const char *method, const String &path, const String &payload, String &response) {
    if (WiFi.status() != WL_CONNECTED) return false;
    HTTPClient http;
    http.setTimeout(6000);
    http.setConnectTimeout(5000);
    secureClient.stop();
    if (!http.begin(secureClient, String(SUPABASE_URL) + path)) return false;
    http.addHeader("apikey", SUPABASE_ANON_KEY);
    http.addHeader("Authorization", String("Bearer ") + SUPABASE_ANON_KEY);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Prefer", "return=representation");
    int status = http.sendRequest(method, payload);
    response = http.getString();
    http.end();
    Serial.print(F("[CLOUD] "));
    Serial.print(method);
    Serial.print(' ');
    Serial.println(status);
    return status >= 200 && status < 300;
}

bool httpsGet(const String &path, String &response) {
    if (WiFi.status() != WL_CONNECTED) return false;
    HTTPClient http;
    http.setTimeout(6000);
    http.setConnectTimeout(5000);
    secureClient.stop();
    if (!http.begin(secureClient, String(SUPABASE_URL) + path)) return false;
    http.addHeader("apikey", SUPABASE_ANON_KEY);
    http.addHeader("Authorization", String("Bearer ") + SUPABASE_ANON_KEY);
    http.addHeader("Accept", "application/json");
    int status = http.GET();
    response = http.getString();
    http.end();
    Serial.print(F("[CLOUD] GET "));
    Serial.println(status);
    return status >= 200 && status < 300;
}

bool httpsPatch(const String &path, const String &payload, String &response) {
    return httpsSend("PATCH", path, payload, response);
}

bool clearLanded(const String &response) {
    return response.indexOf("\"active\":false") >= 0 || response.indexOf("\"active\": false") >= 0;
}

bool patchClearPin() {
    if (pinToClear.length() != 6) return false;
    String response;
    String path = "/rest/v1/live_code?id=eq.1&pin=eq." + pinToClear + "&active=eq.true";
    if (!httpsPatch(path, "{\"active\":false,\"pin\":\"\"}", response)) return false;
    if (!clearLanded(response)) {
        Serial.println(F("[CLOUD] Clear did not land. Will retry."));
        return false;
    }
    Serial.println(F("[CLOUD] Code marked used."));
    return true;
}

void serviceCloud() {
    if (!cloudConfigured || !wifiReady || WiFi.status() != WL_CONNECTED) return;
    if (currentState != VAULT_IDLE) return;
    if (enteredPin.length() > 0 && millis() - lastKeyMs < 8000) return;
    if (millis() - lastCloudPoll < CLOUD_POLL_MS) return;
    lastCloudPoll = millis();

    if (dropClearPending && patchClearPin()) dropClearPending = false;

    String body;
    if (!httpsGet("/rest/v1/live_code?id=eq.1&select=pin,active,open_once", body)) return;

    StaticJsonDocument<320> doc;
    if (deserializeJson(doc, body)) return;
    JsonObject row = doc[0];
    if (row.isNull()) return;

    bool openOnce = row["open_once"] | false;
    bool active = row["active"] | false;
    String pin = row["pin"] | "";

    if (openOnce) {
        String cleared;
        if (httpsPatch("/rest/v1/live_code?id=eq.1&open_once=eq.true", "{\"open_once\":false}", cleared)
            && cleared.indexOf('{') >= 0) {
            triggerUnlock(UNLOCK_OWNER);
            return;
        }
    }

    bool sameUsedPin = pinToClear.length() == 6 && active && pin == pinToClear && (dropClearPending || codeWasUsed);
    if (sameUsedPin) {
        dropClearPending = true;
        pinActive = false;
        livePin = "";
        Serial.println(F("[CLOUD] Used code is still in the list. Keypad will refuse it."));
        return;
    }

    if (pinToClear.length() == 6 && (!active || pin != pinToClear)) {
        dropClearPending = false;
        pinToClear = "";
    }

    if (active && pin.length() == 6) {
        bool changed = !pinActive || livePin != pin;
        livePin = pin;
        pinActive = true;
        codeWasUsed = false;
        if (changed && enteredPin.length() == 0) {
            updateDisplay("HULOG VAULT", "Code ready", "Type it, then #");
            stateTimer = millis();
            Serial.println(F("[CLOUD] Code is ready. Digits stay off the screen."));
        }
    } else if (pinActive || codeWasUsed) {
        pinActive = false;
        livePin = "";
        if (enteredPin.length() == 0) {
            if (codeWasUsed) updateDisplay("HULOG VAULT", "Code is used", "It will not work again");
            else updateDisplay("HULOG VAULT", "No code yet", "");
            stateTimer = millis();
        }
    }
}

bool beginWifiSlot(int slot) {
    if (slot < 0 || strlen(wifiChoices[slot].ssid) == 0) return false;
    wifiTrySlot = slot;
    WiFi.mode(WIFI_STA);
    WiFi.disconnect();
    delay(100);
    WiFi.begin(wifiChoices[slot].ssid, wifiChoices[slot].password);
    Serial.print(F("[WIFI] Trying network "));
    Serial.println(slot + 1);
    return true;
}

void connectWifi() {
    int slot = nextWifiSlot(0);
    if (slot < 0) {
        Serial.println(F("[WIFI] secrets.h has no Wi-Fi."));
        updateDisplay("HULOG VAULT", "No Wi-Fi set", "");
        return;
    }

    updateDisplay("HULOG VAULT", "Joining Wi-Fi", "");
    bool tried[8] = {false};
    for (int n = 0; n < wifiChoiceCount; n++) {
        int trySlot = nextWifiSlot(slot + n);
        if (trySlot < 0 || tried[trySlot] || !beginWifiSlot(trySlot)) continue;
        tried[trySlot] = true;
        unsigned long start = millis();
        while (WiFi.status() != WL_CONNECTED && millis() - start < 12000) {
            delay(250);
            Serial.print('.');
        }
        Serial.println();
        if (WiFi.status() == WL_CONNECTED) {
            wifiReady = true;
            lastWifiTry = millis();
            Serial.print(F("[WIFI] Joined network "));
            Serial.print(trySlot + 1);
            Serial.print(F(". Heap "));
            Serial.println(ESP.getFreeHeap());
            updateDisplay("HULOG VAULT", cloudConfigured ? "No code yet" : "Cloud is not set", "");
            return;
        }
    }

    Serial.println(F("[WIFI] Not joined."));
    updateDisplay("HULOG VAULT", "No Wi-Fi", "");
}

void maintainWifi() {
    if (!anyWifiSet()) return;
    if (WiFi.status() == WL_CONNECTED) {
        wifiReady = true;
        return;
    }
    wifiReady = false;
    if (millis() - lastWifiTry < 15000) return;
    lastWifiTry = millis();
    int slot = nextWifiSlot(wifiTrySlot + 1);
    beginWifiSlot(slot);
}

void beep(int count, int durationMs) {
    for (int i = 0; i < count; i++) {
        digitalWrite(PIN_BUZZER, HIGH);
        delay(durationMs);
        digitalWrite(PIN_BUZZER, LOW);
        if (i < count - 1) delay(durationMs / 2);
    }
}
