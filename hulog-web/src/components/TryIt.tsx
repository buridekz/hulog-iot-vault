import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { useVault } from "../vault/VaultContext";
import { VaultFace } from "./VaultFace";

export function TryIt() {
  const vault = useVault();
  const reduce = useReducedMotion();
  const [courier, setCourier] = useState("Shopee Express (SPX)");
  const [tracking, setTracking] = useState("SPX-PH-884920");
  const [recipient, setRecipient] = useState("Lance Corpuz (Unit 01)");
  const stamped = vault.createdPass;
  const lifted = stamped?.status === "COMPLETED";

  const mint = (e: React.FormEvent) => {
    e.preventDefault();
    vault.generatePass({ recipient, courier, trackingNo: tracking });
  };

  return (
    <div className="page">
      <h2>Try a drop</h2>
      <p className="lead">This is a practice vault in the browser. Same PIN on the keypad, the rider note, and the QR.</p>

      <div className="try-grid">
        <form className="notice-block" onSubmit={mint}>
          <h3>You</h3>
          <label htmlFor="recipient">Who is this for?</label>
          <input id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} autoComplete="name" />
          <label htmlFor="courier">Which rider?</label>
          <input id="courier" value={courier} onChange={(e) => setCourier(e.target.value)} />
          <label htmlFor="tracking">Tracking number</label>
          <input id="tracking" value={tracking} onChange={(e) => setTracking(e.target.value)} />
          <button type="submit" className="stamp-cta stamp-cta-compact" aria-label="Stamp a new PIN">
            <img src="/notice/cta-stamp-pin.png" alt="" width={720} height={239} />
          </button>

          <AnimatePresence mode="wait">
            {stamped && (
              <motion.div
                key={stamped.id}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                style={{ marginTop: "1.1rem" }}
              >
                <div className="pin-sheet">
                  <span className={`pin-ghost${lifted ? " is-visible" : ""}`} aria-hidden="true">
                    {stamped.pin}
                  </span>
                  <motion.div
                    className="pin-press"
                    initial={reduce ? false : { y: -26, rotate: -9, opacity: 0 }}
                    animate={
                      lifted
                        ? { y: -38, rotate: -18, opacity: 0 }
                        : { y: [3, 0], rotate: [-1, -2.4], opacity: 1 }
                    }
                    transition={{ duration: reduce ? 0.01 : lifted ? 0.55 : 0.42, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {stamped.pin}
                  </motion.div>
                </div>
                <div style={{ margin: "0.75rem 0" }}>
                  <QRCodeSVG value={stamped.qrPayload} size={112} bgColor="transparent" fgColor="#c45c4a" level="M" title="Hulog drop QR" />
                </div>
                <button type="button" className="btn" onClick={vault.copyRiderNote} disabled={lifted}>
                  {vault.copiedNote ? "Copied the rider note" : "Copy note for Kuya Rider"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="notice-block">
          <h3>Rider</h3>
          <label htmlFor="pin">PIN from the chat</label>
          <input
            id="pin"
            inputMode="numeric"
            value={vault.courierPin}
            onChange={(e) => vault.setCourierPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="6 digits"
          />
          {vault.courierError && <p className="field-error">{vault.courierError}</p>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
            <button type="button" className="stamp-cta stamp-cta-compact" onClick={vault.tryCourierPin} aria-label="Unlock with PIN">
              <img src="/notice/cta-unlock.png" alt="" width={720} height={247} />
            </button>
            <button type="button" className="btn" onClick={vault.tryCourierScan}>
              Scan the QR
            </button>
          </div>

          <div className="check">
            <span className="mark">{!vault.locked ? "x" : "o"}</span>
            Bolt {vault.locked ? "locked" : "open"}
          </div>
          <div className="check">
            <span className="mark">{vault.doorOpen ? "x" : "o"}</span>
            Door {vault.doorOpen ? "open" : "closed"}
          </div>
          <div className="check">
            <span className="mark">{vault.hasPackage ? "x" : "o"}</span>
            Parcel {vault.hasPackage ? "inside" : "not yet"}
          </div>

          {vault.courierStep === "unlocked" && (
            <button type="button" className="btn btn-stamp" style={{ marginTop: "0.8rem" }} onClick={vault.confirmDeposit}>
              I dropped it. Shut the door.
            </button>
          )}
          {vault.telegramAlert && <div className="alert">{vault.telegramAlert.replace("📦 ", "")}</div>}

          {vault.masterPending ? (
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="button" className="btn btn-stamp" onClick={vault.confirmMasterUnlock}>
                Yes, open for me
              </button>
              <button type="button" className="btn" onClick={vault.cancelMasterUnlock}>
                Never mind
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn-ghost" style={{ marginTop: "1rem" }} onClick={vault.requestMasterUnlock}>
              I am home. Open it.
            </button>
          )}
        </div>
      </div>

      <div className="exhibit" style={{ marginTop: "1.5rem", maxWidth: 420 }}>
        <img className="exhibit-stamp" src="/notice/stamp-exhibit.png" alt="" width={840} height={840} />
        <img className="exhibit-date" src="/notice/stamp-date.png" alt="" width={560} height={280} />
        <div className="exhibit-well">
          <VaultFace />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.85rem", flexWrap: "wrap" }}>
          <button type="button" className="btn" onClick={vault.simulateDrop} disabled={vault.simulating}>
            {vault.simulating ? "Dropping..." : "Play a full drop"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={vault.generateNewPin}>
            New PIN
          </button>
        </div>
      </div>
    </div>
  );
}
