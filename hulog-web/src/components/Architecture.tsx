import React, { useState } from "react";
import { Cpu, Wifi, AlertTriangle } from "lucide-react";

export const Architecture: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      num: "01",
      title: "Pass Generation",
      actor: "Recipient",
      desc: "Recipient generates a single-use 6-digit PIN and rolling dynamic QR via smartphone dashboard.",
      tech: "SHA-256 OTP Hash",
    },
    {
      num: "02",
      title: "Courier Authentication",
      actor: "Courier",
      desc: "Rider inputs the PIN on the keypad or scans the OLED dynamic QR with any phone camera.",
      tech: "Keypad / SSD1306 OLED",
    },
    {
      num: "03",
      title: "Solenoid Pulse",
      actor: "FreeRTOS Core 1",
      desc: "Core 1 energizes the 5V relay module for 5.0 seconds, mechanically retracting the 12V lock tongue.",
      tech: "GPIO 18 Relay Isolation",
    },
    {
      num: "04",
      title: "Parcel Deposit",
      actor: "Courier",
      desc: "Courier places the pre-paid parcel on the vault floor and pushes the door shut.",
      tech: "Weatherproof Enclosure",
    },
    {
      num: "05",
      title: "Presence & Seal",
      actor: "Sensors",
      desc: "IR sensor verifies parcel mass, limit switch confirms door closure, and token is permanently burned.",
      tech: "MC-38 + IR (GPIO 5/19)",
    },
    {
      num: "06",
      title: "Cloud Dispatch",
      actor: "FreeRTOS Core 0",
      desc: "Core 0 dispatches a timestamped drop confirmation to the homeowner's Telegram bot.",
      tech: "HTTPS Telegram API",
    },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-head">
        <div>
          <h2 className="page-title">Event Lifecycle & Dual-Core Segregation</h2>
          <p className="lead-text">
            FreeRTOS task separation guaranteeing sub-10ms hardware reaction independent of Wi-Fi latency.
          </p>
        </div>
        <span className="eyebrow">03. SYSTEM ARCHITECTURE</span>
      </div>

      {/* 6-Step Visual Stepper */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", 
          border: "1px solid var(--border-light)",
          background: "var(--border-light)",
          gap: "1px"
        }}>
          {steps.map((s, idx) => {
            const active = activeStep === idx + 1;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setActiveStep(idx + 1)}
                style={{
                  background: active ? "var(--fg)" : "var(--bg)",
                  color: active ? "var(--ink-invert)" : "var(--fg)",
                  border: "none",
                  padding: "0.9rem 1rem",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                  <span className="font-mono" style={{ fontSize: "0.72rem", fontWeight: 800 }}>STEP {s.num}</span>
                  <span style={{ fontSize: "0.62rem", padding: "0.1rem 0.3rem", border: `1px solid ${active ? "var(--ink-invert)" : "var(--border-light)"}`, fontFamily: "var(--font-mono)" }}>
                    {s.actor}
                  </span>
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>{s.title}</div>
              </button>
            );
          })}
        </div>

        {/* Active Step Card */}
        <div className="clean-card" style={{ borderTop: "none", background: "var(--surface)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>
              {steps[activeStep - 1].num}. {steps[activeStep - 1].title}
            </h3>
            <span className="font-mono tag tag-outline" style={{ fontSize: "0.7rem" }}>
              {steps[activeStep - 1].tech}
            </span>
          </div>
          <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {steps[activeStep - 1].desc}
          </p>
        </div>
      </div>

      {/* Dual Core Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
        
        {/* Core 1 */}
        <div className="clean-card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <Cpu size={18} />
            <span className="font-mono" style={{ fontWeight: 800, fontSize: "0.82rem", textTransform: "uppercase" }}>
              CORE 1 // HARDWARE REFLEX
            </span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            Hard real-time ISR loop. Never blocked by network delays or cloud disconnects.
          </p>
          <ul style={{ listStyleType: "none", fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li style={{ display: "flex", gap: "0.4rem" }}>
              <span className="font-mono">•</span>
              <span><strong>Door Switch ISR:</strong> GPIO 19 detects door closure in &lt;10ms.</span>
            </li>
            <li style={{ display: "flex", gap: "0.4rem" }}>
              <span className="font-mono">•</span>
              <span><strong>Solenoid Relay Timer:</strong> GPIO 18 pulses 12V lock for exactly 5.0 seconds.</span>
            </li>
            <li style={{ display: "flex", gap: "0.4rem" }}>
              <span className="font-mono">•</span>
              <span><strong>Keypad Scanner:</strong> Scans 4x4 matrix pins every 10ms for instant key entry.</span>
            </li>
            <li style={{ display: "flex", gap: "0.4rem" }}>
              <span className="font-mono">•</span>
              <span><strong>Optical IR Check:</strong> GPIO 5 confirms physical mass on floor before latching.</span>
            </li>
          </ul>
        </div>

        {/* Core 0 */}
        <div className="clean-card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <Wifi size={18} />
            <span className="font-mono" style={{ fontWeight: 800, fontSize: "0.82rem", textTransform: "uppercase" }}>
              CORE 0 // NETWORK & TELEMETRY
            </span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            Asynchronous background cloud sync and security token verification.
          </p>
          <ul style={{ listStyleType: "none", fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li style={{ display: "flex", gap: "0.4rem" }}>
              <span className="font-mono">•</span>
              <span><strong>Wi-Fi & Cloud Telemetry:</strong> Maintains low-latency connection with owner dashboard.</span>
            </li>
            <li style={{ display: "flex", gap: "0.4rem" }}>
              <span className="font-mono">•</span>
              <span><strong>Telegram Bot Dispatcher:</strong> Pushes confirmation alerts to owner's smartphone.</span>
            </li>
            <li style={{ display: "flex", gap: "0.4rem" }}>
              <span className="font-mono">•</span>
              <span><strong>SPIFFS Flash Queue:</strong> Caches up to 2,000 drop events if Wi-Fi disconnects.</span>
            </li>
            <li style={{ display: "flex", gap: "0.4rem" }}>
              <span className="font-mono">•</span>
              <span><strong>Dynamic QR Stream:</strong> Renders rolling OTP bitmaps to the I2C OLED display.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Failsafe Notice */}
      <div style={{ marginTop: "1.5rem", padding: "1rem 1.25rem", border: "1px solid var(--border-light)", background: "var(--surface)", display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
        <AlertTriangle size={18} style={{ flexShrink: 0 }} />
        <div>
          <strong>Fail-Secure Hardware:</strong> Lock remains deadbolted if power is cut. Internal 12V backup battery ensures rider can enter PIN even during brownouts.
        </div>
      </div>
    </div>
  );
};
