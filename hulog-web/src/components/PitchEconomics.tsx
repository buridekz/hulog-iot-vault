import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export const PitchEconomics: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What if the delivery is Cash on Delivery (COD)?",
      a: "Hulog targets the 65%+ of e-commerce orders pre-paid via GCash, Maya, ShopeePay, or Credit Card where no one is home. For COD orders, the recipient sends the PIN and transfers the cash to the courier via GCash before unlocking."
    },
    {
      q: "What if the rider opens the box but doesn't actually drop the parcel?",
      a: "1) Hardware Proof: The internal optical IR sensor detects physical mass on the floor. Closing an empty box triggers an instant 'No Item Detected' anomaly alert. 2) Platform Policy: Riders must upload a Proof of Delivery (POD) photo resting in the box. Timestamped logs provide irrefutable evidence for an immediate refund."
    },
    {
      q: "Does the courier need to install a special app?",
      a: "Zero app downloads required. The rider simply punches the 6-digit PIN on the keypad in 2 seconds, or scans the OLED dynamic QR with any standard camera app."
    },
    {
      q: "What happens during brownouts or Wi-Fi outages?",
      a: "The 12V solenoid is fail-secure (stays locked without power). An internal 12V backup battery powers the lock, and valid PIN hashes cached in local flash continue to authenticate offline."
    },
    {
      q: "What if the courier leaves the vault door open?",
      a: "If the limit switch detects the door ajar for >60 seconds, an onboard 85dB acoustic buzzer sounds locally and dispatches a priority 'DOOR AJAR' alert to the homeowner's phone."
    }
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-head">
        <div>
          <h2 className="page-title">Unit Economics & Panel Defense</h2>
          <p className="lead-text">
            High-margin hardware economics paired with concise panel objection handling.
          </p>
        </div>
        <span className="eyebrow">07. COMMERCIAL FEASIBILITY</span>
      </div>

      {/* 3 Main Economic Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
        
        <div className="clean-card">
          <span className="font-mono" style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase" }}>UNIT COGS (BOM)</span>
          <div style={{ fontSize: "2.2rem", fontWeight: 900, fontFamily: "var(--font-mono)", marginTop: "0.2rem" }}>
            ₱820.00
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Core electronics manufacturing cost at student prototyping volume.
          </p>
        </div>

        <div className="clean-card" style={{ border: "1px solid var(--border)" }}>
          <span className="font-mono" style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase" }}>RETAIL PRICE</span>
          <div style={{ fontSize: "2.2rem", fontWeight: 900, fontFamily: "var(--font-mono)", marginTop: "0.2rem" }}>
            ₱3,499.00
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Installed turnkey unit in reinforced weatherproof ABS enclosure.
          </p>
        </div>

        <div className="clean-card">
          <span className="font-mono" style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase" }}>GROSS MARGIN</span>
          <div style={{ fontSize: "2.2rem", fontWeight: 900, fontFamily: "var(--font-mono)", marginTop: "0.2rem" }}>
            76.5%
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
            Gross profit margin per unit sold (₱2,679 net margin per device).
          </p>
        </div>

      </div>

      {/* Pitch Hook Callout */}
      <div style={{ padding: "1.25rem 1.5rem", border: "1px solid var(--border)", background: "var(--surface)", marginBottom: "2.5rem" }}>
        <div className="font-mono" style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.25rem" }}>
          THE PITCH HOOK
        </div>
        <div style={{ fontSize: "1.15rem", fontWeight: 800 }}>
          "One stolen smartphone or parcel costs more than the entire vault."
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.35rem" }}>
          Average parcel value for sneakers or electronics ranges from ₱3,000 to ₱15,000. Preventing just 1 stolen parcel fully repays the vault.
        </p>
      </div>

      {/* Target Market Sectors */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1rem" }}>Target Beneficiaries</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          <div className="clean-card" style={{ padding: "1.25rem" }}>
            <div style={{ fontWeight: 800, fontSize: "0.9rem", marginBottom: "0.25rem" }}>1. Residential Townhouses</div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
              Working households absent during daytime courier delivery windows.
            </p>
          </div>

          <div className="clean-card" style={{ padding: "1.25rem" }}>
            <div style={{ fontWeight: 800, fontSize: "0.9rem", marginBottom: "0.25rem" }}>2. Boarding Houses & Dorms</div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
              Multi-tenant bedspaces near universities receiving 10+ daily parcels in communal gates.
            </p>
          </div>

          <div className="clean-card" style={{ padding: "1.25rem" }}>
            <div style={{ fontWeight: 800, fontSize: "0.9rem", marginBottom: "0.25rem" }}>3. Sari-Sari Hubs</div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
              Neighborhood stores acting as paid secure holding lockers for surrounding residents.
            </p>
          </div>
        </div>
      </div>

      {/* Anticipated Q&A Accordion */}
      <div>
        <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1rem" }}>Panel Defense Q&A</h3>
        <div style={{ border: "1px solid var(--border-light)" }}>
          {faqs.map((f, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={f.q} style={{ borderBottom: idx === faqs.length - 1 ? "none" : "1px solid var(--border-light)" }}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem 1.25rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{f.q}</span>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {isOpen && (
                  <div style={{ padding: "0 1.25rem 1rem 1.25rem", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
