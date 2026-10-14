import React, { useState } from "react";
import { FileDown, Copy, Check, Menu, PanelLeftClose, X } from "lucide-react";
import { PAGES, type PageId } from "../vault/types";

export type { PageId };

interface SidebarProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onSelectPage, open, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const summary = `HULOG: Dynamic QR Parcel Drop Vault for Residential Gates.\nCore Parts: ESP32, 12V Solenoid, MC-38 Reed Switch, IR Presence Sensor, 0.96" OLED, 4x4 Keypad.\nBOM: ~₱820 PHP | Retail: ₱3,499 PHP | UMak CCIS 2026.`;
    void navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div
        className={`nav-backdrop ${open ? "open" : ""}`}
        onClick={onClose}
        hidden={!open}
      />
      <aside className="sidebar" aria-label="Site navigation" aria-hidden={!open} inert={!open}>
        <div className="sidebar-brand">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.55rem" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.25rem", letterSpacing: "0.04em" }}>
                HULOG
              </span>
              <span className="tag tag-black">v1.0</span>
            </div>
            <button type="button" className="btn btn-sm sidebar-close" onClick={onClose} aria-label="Close menu">
              <X size={14} />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.74rem", color: "var(--text-secondary)" }}>
            <span>IoT Parcel Drop Vault</span>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.68rem", fontFamily: "var(--font-mono)" }}>
              <span className="status-dot status-dot-green" />
              <span>ONLINE</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          {PAGES.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => onSelectPage(item.id)}
              >
                <span>{item.label}</span>
                <span className="font-mono" style={{ fontSize: "0.68rem", opacity: isActive ? 1 : 0.45 }}>
                  {item.id}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <a href="/Hulog_One_Page_Proposal.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-black" style={{ width: "100%" }}>
            <FileDown size={14} />
            <span>VIEW PROPOSAL PDF</span>
          </a>
          <button type="button" className="btn btn-sm" onClick={handleCopySummary} style={{ width: "100%" }}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? "COPIED TO CLIPBOARD" : "COPY BRIEF"}</span>
          </button>
          <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "0.65rem" }}>
            <div className="font-mono" style={{ fontSize: "0.62rem", color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: "0.35rem" }}>
              PROPONENTS
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.45rem" }}>
              {["Lance", "Jhorenz", "AJ", "Justin"].map((name) => (
                <span key={name} className="tag">
                  {name}
                </span>
              ))}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.35 }}>
              <strong>Adviser:</strong> Engr. Bhai Nhuraisha Deplomo
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export function MenuToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className="btn btn-sm menu-btn"
      onClick={onClick}
      aria-label={open ? "Collapse sidebar" : "Open sidebar"}
      aria-expanded={open}
    >
      {open ? <PanelLeftClose size={16} /> : <Menu size={16} />}
      <span>{open ? "HIDE" : "MENU"}</span>
    </button>
  );
}
