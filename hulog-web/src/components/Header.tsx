import React, { useState } from "react";
import { Copy, Check, FileDown } from "lucide-react";

export const Header: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const summary = `HULOG: IoT-Enabled Dynamic QR Parcel Drop Vault\nCore Parts: ESP32, 12V Solenoid Latch, 0.96" OLED, 4x4 Keypad, MC-38 Reed Switch, 5V Relay, 12V 2A Adapter.\nTotal BOM: ~₱820 PHP | Target Retail: ₱3,499 PHP.`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="tech-header">
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px" }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a href="#overview" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontWeight: 900, fontSize: "1.2rem", letterSpacing: "0.08em" }}>HULOG</span>
            <span className="tag tag-black" style={{ fontSize: "0.65rem", padding: "0.15rem 0.4rem" }}>v1.0</span>
          </a>
          <span style={{ color: "var(--border-subtle)", fontSize: "0.85rem" }}>/</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
            <span className="status-dot status-dot-green"></span>
            <span>SYSTEM_ONLINE</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "1.2rem" }} className="hidden-mobile">
          <a href="#overview" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.78rem", fontFamily: "var(--font-mono)", fontWeight: 500 }}>
            01.OVERVIEW
          </a>
          <a href="#system-portal" style={{ color: "var(--fg)", textDecoration: "none", fontSize: "0.78rem", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
            02.PORTAL_SYSTEM
          </a>
          <a href="#architecture" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.78rem", fontFamily: "var(--font-mono)", fontWeight: 500 }}>
            03.ARCHITECTURE
          </a>
          <a href="#bom" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.78rem", fontFamily: "var(--font-mono)", fontWeight: 500 }}>
            04.SHOPPING_LIST
          </a>
          <a href="#simulator" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.78rem", fontFamily: "var(--font-mono)", fontWeight: 500 }}>
            05.HARDWARE_SIM
          </a>
          <a href="#pinout" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.78rem", fontFamily: "var(--font-mono)", fontWeight: 500 }}>
            06.PINOUT
          </a>
          <a href="#economics" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.78rem", fontFamily: "var(--font-mono)", fontWeight: 500 }}>
            07.PITCH
          </a>
        </nav>

        {/* Quick Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button 
            type="button" 
            className="btn btn-sm"
            onClick={handleCopySummary}
            title="Copy project summary to clipboard"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? "COPIED" : "COPY BRIEF"}</span>
          </button>
          
          <a 
            href="/Hulog_One_Page_Proposal.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-sm btn-black"
            title="View official one-page proposal PDF"
          >
            <FileDown size={14} />
            <span>PDF PROPOSAL</span>
          </a>
        </div>
      </div>
    </header>
  );
};
