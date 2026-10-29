#pragma once

// Copy this file to secrets.h. secrets.h is not committed.
// Both networks must be 2.4 GHz and WPA2. The ESP32 cannot join 5 GHz or WPA3-only.
// On the iPhone hotspot, turn on Maximize Compatibility so the hotspot stays on 2.4 GHz.
// The board tries the house Wi-Fi first, then the hotspot. Leave a pair blank to skip it.
// Do not paste the Wi-Fi passwords into chat or git.
// SUPABASE_ANON_KEY is the publishable key, not the secret key.

#define WIFI_SSID ""
#define WIFI_PASSWORD ""

#define WIFI_SSID_2 ""
#define WIFI_PASSWORD_2 ""

#define SUPABASE_URL ""
#define SUPABASE_ANON_KEY ""
