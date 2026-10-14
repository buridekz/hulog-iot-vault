import type { PageId } from "./Sidebar";
import { ArrowRight, Zap, Lock, ShieldCheck, Smartphone } from "lucide-react";
import { VaultFace } from "./VaultFace";

interface HeroProps {
  onNavigate?: (page: PageId) => void;
}

export const Hero = ({ onNavigate }: HeroProps) => {
  return (
    <div className="page-container">
      <div className="hero-stage">
        <div className="hero-copy">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span className="tag tag-black">TECHNOPRENEURSHIP 2026</span>
            <span className="tag tag-outline">UMAK CCIS</span>
          </div>

          <h1>Dynamic QR Parcel Drop Vault.</h1>

          <p className="lead-text" style={{ fontSize: "1.08rem" }}>
            Autonomous edge drop vault for residential gates and boarding houses.
            Generates a single-use PIN or dynamic QR for each delivery that invalidates the millisecond the door latches shut.
          </p>

          <div className="hero-actions">
            <button type="button" className="btn btn-black" onClick={() => onNavigate?.("try")}>
              <span>TEST SIMULATOR</span>
              <ArrowRight size={15} />
            </button>
            <button type="button" className="btn" onClick={() => onNavigate?.("cost")} style={{ background: "transparent" }}>
              <span>VIEW BOM (₱820)</span>
            </button>
            <button type="button" className="btn" onClick={() => onNavigate?.("try")} style={{ background: "transparent" }}>
              <span>CLOUD PORTAL</span>
            </button>
          </div>
        </div>

        <VaultFace />
      </div>

      <div className="metric-strip">
        <div className="metric-cell">
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)" }}>
            <Zap size={15} />
            <span className="font-mono" style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em" }}>HARDWARE BOM</span>
          </div>
          <strong>₱820</strong>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
            Direct electronics cost sourced from local Shopee/Lazada sellers.
          </p>
        </div>
        <div className="metric-cell">
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)" }}>
            <Lock size={15} />
            <span className="font-mono" style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em" }}>TOKEN SECURITY</span>
          </div>
          <strong>1-TIME</strong>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
            Single-use OTP code self-destructs immediately after parcel deposit.
          </p>
        </div>
        <div className="metric-cell">
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)" }}>
            <ShieldCheck size={15} />
            <span className="font-mono" style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em" }}>LATCH REFLEX</span>
          </div>
          <strong>&lt; 10ms</strong>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
            Limit switch detects door closure instantly and re-locks deadbolt.
          </p>
        </div>
        <div className="metric-cell">
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)" }}>
            <Smartphone size={15} />
            <span className="font-mono" style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em" }}>COURIER UX</span>
          </div>
          <strong>0 APPS</strong>
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
            Rider enters 6-digit PIN on keypad in 2 seconds. Zero app downloads.
          </p>
        </div>
      </div>
    </div>
  );
};
