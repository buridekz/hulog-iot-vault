import React, { useState } from "react";
import {
  Smartphone,
  Laptop,
  Plus,
  Check,
  Copy,
  Lock,
  Unlock,
  CheckCircle2,
  Package,
  ArrowRight,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useVault } from "../vault/VaultContext";

export const DashboardSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"homeowner" | "courier">("homeowner");
  const [courierInput, setCourierInput] = useState("Shopee Express (SPX)");
  const [trackingInput, setTrackingInput] = useState("SPX-PH-884920");
  const [recipientInput, setRecipientInput] = useState("Lance Corpuz (Unit 01)");

  const vault = useVault();

  const handleCreatePass = (e: React.FormEvent) => {
    e.preventDefault();
    vault.generatePass({
      recipient: recipientInput,
      courier: courierInput,
      trackingNo: trackingInput,
    });
  };

  const live = vault.activePass;
  const boltOpen = vault.masterUnlocked || !vault.locked;

  return (
    <div className="page-container">
      <div className="page-head">
        <div>
          <h2 className="page-title">Dual-Portal Cloud Platform</h2>
          <p className="lead-text">Real-time interface connecting recipient to the gate vault.</p>
        </div>
        <span className="eyebrow">02. SOFTWARE SYSTEM</span>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", border: "1px solid var(--border)", background: "var(--bg)" }}>
          <button
            type="button"
            onClick={() => setActiveTab("homeowner")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.55rem 1rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              background: activeTab === "homeowner" ? "var(--fg)" : "transparent",
              color: activeTab === "homeowner" ? "var(--ink-invert)" : "var(--fg)",
            }}
          >
            <Laptop size={14} />
            <span>HOMEOWNER CONSOLE</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("courier")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.55rem 1rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              background: activeTab === "courier" ? "var(--fg)" : "transparent",
              color: activeTab === "courier" ? "var(--ink-invert)" : "var(--fg)",
            }}
          >
            <Smartphone size={14} />
            <span>COURIER SCAN PORTAL</span>
          </button>
        </div>
      </div>

      {activeTab === "homeowner" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div className="clean-card" style={{ padding: "1.25rem 1.5rem" }}>
              <span className="font-mono" style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase" }}>VAULT NODE 01</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.25rem", fontWeight: 800, fontSize: "1rem" }}>
                <span className="status-dot status-dot-green" />
                <span>ONLINE ({vault.pingMs}ms)</span>
              </div>
            </div>
            <div className="clean-card" style={{ padding: "1.25rem 1.5rem" }}>
              <span className="font-mono" style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase" }}>12V DEADBOLT</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.25rem", fontWeight: 800, fontSize: "1rem" }}>
                {boltOpen ? <Unlock size={15} color="var(--success)" /> : <Lock size={15} />}
                <span style={{ color: boltOpen ? "var(--success)" : "inherit" }}>
                  {vault.masterUnlocked ? "UNLATCHED (5s)" : boltOpen ? "UNLATCHED (5s)" : "SECURED / LOCKED"}
                </span>
              </div>
            </div>
            <div className="clean-card" style={{ padding: "1.25rem 1.5rem" }}>
              <span className="font-mono" style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase" }}>IR SENSOR</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.25rem", fontWeight: 800, fontSize: "1rem" }}>
                <Package size={15} />
                <span>{vault.hasPackage ? "1 ITEM VERIFIED" : "EMPTY"}</span>
              </div>
            </div>
            <div className="clean-card" style={{ padding: "1.25rem 1.5rem" }}>
              <span className="font-mono" style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase" }}>RETRIEVAL</span>
              {!vault.masterPending ? (
                <button type="button" className="btn btn-sm" onClick={vault.requestMasterUnlock} style={{ width: "100%", marginTop: "0.25rem" }}>
                  <Unlock size={12} />
                  <span>{vault.masterUnlocked ? "UNLATCHING..." : "MASTER UNLOCK"}</span>
                </button>
              ) : (
                <div className="confirm-row">
                  <button type="button" className="btn btn-sm btn-black" onClick={vault.confirmMasterUnlock}>CONFIRM</button>
                  <button type="button" className="btn btn-sm" onClick={vault.cancelMasterUnlock}>CANCEL</button>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
            <div className="clean-card">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
                <Plus size={16} />
                <span className="font-mono" style={{ fontWeight: 800, fontSize: "0.82rem", textTransform: "uppercase" }}>
                  GENERATE DELIVERY PASS
                </span>
              </div>
              <form onSubmit={handleCreatePass} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <label htmlFor="recipient" style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.3rem", fontFamily: "var(--font-mono)" }}>
                    RECIPIENT / UNIT:
                  </label>
                  <input id="recipient" className="field" type="text" value={recipientInput} onChange={(e) => setRecipientInput(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="courier" style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.3rem", fontFamily: "var(--font-mono)" }}>
                    COURIER:
                  </label>
                  <select id="courier" className="field" value={courierInput} onChange={(e) => setCourierInput(e.target.value)}>
                    <option value="Shopee Express (SPX)">Shopee Express (SPX)</option>
                    <option value="J&T Express">J&T Express</option>
                    <option value="Lazada Logistics">Lazada Logistics</option>
                    <option value="Flash Express">Flash Express</option>
                    <option value="Grab / Lalamove">Grab / Lalamove</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="tracking" style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.3rem", fontFamily: "var(--font-mono)" }}>
                    TRACKING NUMBER:
                  </label>
                  <input id="tracking" className="field" type="text" value={trackingInput} onChange={(e) => setTrackingInput(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-black" style={{ marginTop: "0.5rem" }}>
                  <span>GENERATE 4-HOUR PASS</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>

            <div className="clean-card" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <span className="font-mono" style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)" }}>
                COURIER DISPATCH CARD
              </span>
              {live ? (
                <div style={{ marginTop: "1rem" }}>
                  <div style={{ padding: "1.1rem", background: "var(--surface)", border: "1px solid var(--border-light)", textAlign: "center", marginBottom: "1rem" }}>
                    <div className="font-mono" style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>SINGLE-USE 6-DIGIT PIN</div>
                    <div style={{ fontSize: "2.3rem", fontWeight: 700, letterSpacing: "0.14em", fontFamily: "var(--font-mono)", color: "var(--fg)", margin: "0.25rem 0" }}>
                      {live.pin}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.85rem" }}>
                      {live.courier} · {live.trackingNo}
                    </div>
                    <QRCodeSVG value={live.qrPayload} size={132} bgColor="#ffffff" fgColor="#161615" level="M" title="Courier scan QR" />
                  </div>
                  <button type="button" className="btn btn-black" onClick={vault.copyRiderNote} style={{ width: "100%" }}>
                    {vault.copiedNote ? <Check size={14} /> : <Copy size={14} />}
                    <span>{vault.copiedNote ? "COPIED TO CLIPBOARD" : "COPY CHAT NOTE FOR RIDER"}</span>
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
                  <p style={{ fontSize: "0.85rem" }}>Fill in the details on the left to generate an active drop token.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Delivery Audit Log</h3>
              <span className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>REAL-TIME SYNC · SYNTHETIC DEMO</span>
            </div>
            <div style={{ overflowX: "auto", border: "1px solid var(--border-light)" }}>
              <table className="bom-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>PIN</th>
                    <th>Courier</th>
                    <th>Recipient</th>
                    <th>IR Mass Proof</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {vault.passes.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <span className={`tag ${p.status === "ACTIVE" ? "tag-black" : "tag-outline"}`} style={{ fontSize: "0.65rem" }}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <code className="font-mono" style={{ fontWeight: 800, fontSize: "0.9rem" }}>{p.pin}</code>
                      </td>
                      <td style={{ fontSize: "0.85rem", fontWeight: 600 }}>{p.courier}</td>
                      <td style={{ fontSize: "0.82rem" }}>{p.recipient}</td>
                      <td>
                        {p.irVerified ? (
                          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--success)", fontSize: "0.8rem", fontWeight: 600 }}>
                            <CheckCircle2 size={14} />
                            <span>VERIFIED</span>
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>Pending</span>
                        )}
                      </td>
                      <td className="font-mono" style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        {p.dropTime || p.expiresIn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "courier" && (
        <div style={{ display: "flex", justifyContent: "center", padding: "1.5rem 0" }}>
          <div className="phone-shell">
            <div className="phone-notch" />
            <div style={{ textAlign: "center", borderBottom: "1px solid var(--border-light)", paddingBottom: "1rem", marginBottom: "1.25rem" }}>
              <span className="tag tag-black" style={{ fontSize: "0.62rem", marginBottom: "0.4rem" }}>HULOG QUICK-DROP</span>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginTop: "0.45rem" }}>Gate Vault #01</h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Lance Corpuz · Unit 01</p>
            </div>

            {vault.courierStep === "auth" && (
              <div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1rem", textAlign: "center" }}>
                  Tap below to pop open the 12V solenoid latch.
                </p>
                {live ? (
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                    <QRCodeSVG value={live.qrPayload} size={148} bgColor="#ffffff" fgColor="#161615" level="M" title="Live vault QR" />
                  </div>
                ) : (
                  <p className="err" style={{ textAlign: "center", marginBottom: "0.8rem" }}>No live drop token. Generate a pass on the homeowner console first.</p>
                )}
                <label htmlFor="courier-pin" className="font-mono" style={{ fontSize: "0.68rem", display: "block", marginBottom: "0.3rem" }}>
                  6-DIGIT PIN
                </label>
                <input
                  id="courier-pin"
                  className="field"
                  inputMode="numeric"
                  maxLength={6}
                  value={vault.courierPin}
                  onChange={(e) => vault.setCourierPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="••••••"
                />
                {vault.courierError && <p className="err">{vault.courierError}</p>}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.9rem" }}>
                  <button type="button" className="btn btn-black" onClick={vault.tryCourierPin} style={{ width: "100%" }}>
                    <Unlock size={16} />
                    <span>UNLOCK WITH PIN</span>
                  </button>
                  <button type="button" className="btn" onClick={vault.tryCourierScan} style={{ width: "100%" }} disabled={!live}>
                    <span>SCAN OLED QR</span>
                  </button>
                </div>
              </div>
            )}

            {vault.courierStep === "unlocked" && (
              <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--success)" }}>VAULT UNLATCHED</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
                  Deposit package & push door shut.
                </p>
                <div style={{ marginTop: "0.75rem", fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  AUTO-LOCKING (5s)...
                </div>
                <button type="button" className="btn btn-black" onClick={vault.confirmDeposit} style={{ width: "100%", marginTop: "1rem" }}>
                  CONFIRM DEPOSIT & CLOSE
                </button>
              </div>
            )}

            {vault.courierStep === "done" && (
              <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 800 }}>DROP CONFIRMED</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.4rem" }}>
                  Door latched. Recipient notified. Thank you!
                </p>
                <button type="button" className="btn btn-sm" onClick={vault.resetCourier} style={{ width: "100%", marginTop: "1.25rem" }}>
                  RESET
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
