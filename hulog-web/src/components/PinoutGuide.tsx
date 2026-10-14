import React from "react";
import { Cpu, Zap } from "lucide-react";

export const PinoutGuide: React.FC = () => {
  const pinouts = [
    { espPin: "GPIO 18", component: "5V Relay Module (IN)", type: "Output", notes: "Triggers 5s pulse to energize 12V Solenoid latch." },
    { espPin: "GPIO 19", component: "MC-38 Door Switch", type: "Input (Pullup)", notes: "Monitors door state (LOW = Closed, HIGH = Open)." },
    { espPin: "GPIO 5", component: "IR Optical Presence Sensor", type: "Input", notes: "Verifies parcel mass on floor (LOW = Parcel, HIGH = Empty)." },
    { espPin: "GPIO 21", component: "0.96\" OLED (SDA)", type: "I2C Data", notes: "Serial data for dynamic QR rendering." },
    { espPin: "GPIO 22", component: "0.96\" OLED (SCL)", type: "I2C Clock", notes: "400kHz hardware clock line." },
    { espPin: "GPIO 4", component: "5V Active Buzzer (+)", type: "Output", notes: "Audible unlock chimes & door-ajar alarm." },
    { espPin: "GPIO 13, 12, 14, 27", component: "Keypad Rows (R1-R4)", type: "Matrix Scan", notes: "Row scanning strobe lines." },
    { espPin: "GPIO 26, 25, 33, 32", component: "Keypad Cols (C1-C4)", type: "Matrix Read", notes: "Column read with internal pullups." },
    { espPin: "VIN (5V)", component: "LM2596 Output / USB 5V", type: "Power In", notes: "Powers ESP32, Relay coil, and Buzzer." },
    { espPin: "GND", component: "Common System Ground", type: "Ground", notes: "Common ground tied across 12V & 5V rails." },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-head">
        <div>
          <h2 className="page-title">ESP32 GPIO Pinout Reference</h2>
          <p className="lead-text">
            Direct jumper wiring cheat-sheet for assembling the breadboard prototype.
          </p>
        </div>
        <span className="eyebrow">06. HARDWARE SCHEMATICS</span>
      </div>

      {/* Dual Power Rails (2 Clean Cards) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
        <div className="clean-card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
            <Zap size={16} />
            <span className="font-mono" style={{ fontWeight: 800, fontSize: "0.78rem", textTransform: "uppercase" }}>
              12V ACTUATION RAIL (SOLENOID)
            </span>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
            High-current circuit dedicated to the electromagnetic lock:
          </p>
          <div className="font-mono" style={{ fontSize: "0.76rem", background: "var(--surface)", border: "1px solid var(--border-light)", padding: "0.75rem", lineHeight: 1.6 }}>
            12V (+) ──► Relay [COM]<br />
            Relay [NO] ──► Solenoid (+)<br />
            Solenoid (-) ──► 12V Supply GND
          </div>
        </div>

        <div className="clean-card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
            <Cpu size={16} />
            <span className="font-mono" style={{ fontWeight: 800, fontSize: "0.78rem", textTransform: "uppercase" }}>
              5V REGULATED LOGIC RAIL (BRAIN)
            </span>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
            Clean DC stepped down via LM2596 buck converter:
          </p>
          <div className="font-mono" style={{ fontSize: "0.76rem", background: "var(--surface)", border: "1px solid var(--border-light)", padding: "0.75rem", lineHeight: 1.6 }}>
            5V (+) ──► ESP32 [VIN] & Relay [VCC]<br />
            ESP32 [3V3] ──► OLED [VCC]<br />
            GND ──► COMMON GROUND for all
          </div>
        </div>
      </div>

      {/* Pinout Table */}
      <div style={{ overflowX: "auto", border: "1px solid var(--border-light)", marginBottom: "2rem" }}>
        <table className="bom-table">
          <thead>
            <tr>
              <th>ESP32 Pin</th>
              <th>Target Component</th>
              <th>Signal Type</th>
              <th>Role & Firmware Notes</th>
            </tr>
          </thead>
          <tbody>
            {pinouts.map((p) => (
              <tr key={p.espPin}>
                <td>
                  <span className="font-mono" style={{ fontWeight: 800, fontSize: "0.85rem" }}>
                    {p.espPin}
                  </span>
                </td>
                <td style={{ fontWeight: 600, fontSize: "0.84rem" }}>{p.component}</td>
                <td>
                  <span className="tag tag-outline" style={{ fontSize: "0.62rem" }}>{p.type}</span>
                </td>
                <td style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {p.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Safety Rules */}
      <div style={{ padding: "1rem 1.25rem", border: "1px solid var(--border-light)", background: "var(--surface)", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
        <strong>Bench Assembly Rules:</strong> 1) Always tie 12V GND and ESP32 GND together. 2) Never connect the 12V solenoid directly to an ESP32 GPIO pin (always use the optical relay). 3) Maintain a 5-second max relay energize time to prevent coil heating.
      </div>
    </div>
  );
};
