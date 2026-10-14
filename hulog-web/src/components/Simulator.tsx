import React from "react";
import { Bell, RefreshCw } from "lucide-react";
import { VaultFace } from "./VaultFace";
import { useVault } from "../vault/VaultContext";

export const Simulator: React.FC = () => {
  const vault = useVault();
  const pin = vault.activePass?.pin ?? "------";

  return (
    <div className="page-container">
      <div className="page-head">
        <div>
          <h2 className="page-title">Tabletop Vault Simulator</h2>
          <p className="lead-text">
            Interactive simulation of the physical keypad, OLED screen, solenoid latch, and door limit switch.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <span className="eyebrow">05. HARDWARE PROTOTYPE</span>
          <button type="button" className="btn btn-black" onClick={vault.simulateDrop} disabled={vault.simulating}>
            <span>1-CLICK SIMULATE DROP</span>
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
        <VaultFace />

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="clean-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <span className="font-mono" style={{ fontWeight: 800, fontSize: "0.8rem" }}>
                RECIPIENT TOKEN CONTROLS
              </span>
              <span className="tag tag-outline" style={{ fontSize: "0.65rem" }}>
                ITEMS IN VAULT: {vault.parcelCount}
              </span>
            </div>
            <div style={{ padding: "1rem", background: "var(--surface)", border: "1px solid var(--border-light)", marginBottom: "1rem" }}>
              <div className="font-mono" style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>ACTIVE DELIVERY PIN</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "0.2rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "0.1em", fontFamily: "var(--font-mono)", color: "var(--fg)" }}>
                  {pin}
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>EXPIRES IN 4H</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                className="btn btn-sm"
                style={{ width: "100%" }}
                onClick={() => vault.activePass && vault.setInputDigits(vault.activePass.pin)}
                disabled={!vault.activePass}
              >
                AUTOTYPE [{pin}]
              </button>
              <button type="button" className="btn btn-sm btn-black" style={{ width: "100%" }} onClick={() => vault.handleKey("#")}>
                SUBMIT [#]
              </button>
            </div>
            <button type="button" className="btn btn-sm" onClick={vault.generateNewPin} style={{ width: "100%", marginTop: "0.5rem" }}>
              <RefreshCw size={13} />
              <span>GENERATE NEW PIN</span>
            </button>
          </div>

          <div className="clean-card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <Bell size={15} />
              <span className="font-mono" style={{ fontWeight: 800, fontSize: "0.8rem" }}>
                TELEGRAM BOT PUSH ALERT
              </span>
            </div>
            {vault.telegramAlert ? (
              <div style={{ padding: "0.85rem", background: "var(--surface)", fontSize: "0.82rem", fontFamily: "var(--font-mono)", lineHeight: 1.5 }}>
                {vault.telegramAlert}
              </div>
            ) : (
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                Waiting for drop. Click "1-Click Simulate Drop" to trigger confirmation alert.
              </p>
            )}
          </div>

          <div className="uart">
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.3rem", marginBottom: "0.4rem", color: "var(--text-muted)" }}>
              <span>UART LOG (115200)</span>
              <span>FREERTOS LIVE</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", maxHeight: "140px", overflowY: "auto" }}>
              {vault.logs.map((log) => (
                <div key={log.id} style={{ display: "flex", gap: "0.4rem" }}>
                  <span style={{ color: "#8a8a84" }}>[{log.time}]</span>
                  <span style={{ color: log.type === "success" ? "var(--success)" : log.type === "warn" ? "var(--deny)" : "var(--fg)" }}>
                    {log.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
