import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useVault } from "../vault/VaultContext";

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
      <h2>Your code</h2>
      <p className="lead">Stamp a code while you still have a signal. Copy the note into the rider’s chat. They type it on the box at the gate.</p>

      <div className="try-grid">
        <form className="notice-block" onSubmit={mint}>
          <h3>Send a code</h3>
          <label htmlFor="recipient">Who is this for?</label>
          <input id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} autoComplete="name" />
          <label htmlFor="courier">Which rider?</label>
          <input id="courier" value={courier} onChange={(e) => setCourier(e.target.value)} />
          <label htmlFor="tracking">Tracking number</label>
          <input id="tracking" value={tracking} onChange={(e) => setTracking(e.target.value)} />
          <button type="submit" className="stamp-cta stamp-cta-compact" aria-label="Stamp a new PIN" disabled={vault.stampBusy}>
            <img src="/notice/cta-stamp-pin.png" alt="" width={720} height={239} />
          </button>
          {vault.stampNote && (
            <p className={vault.stampNote.includes("did not") || vault.stampNote.includes("not set") ? "field-error" : "field-hint"}>
              {vault.stampNote}
            </p>
          )}

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
                <p className="field-hint">Copy the note into the rider’s chat. They type the number on the box.</p>
                <button type="button" className="btn" onClick={vault.copyRiderNote} disabled={lifted}>
                  {vault.copiedNote ? "Copied the chat note" : "Copy note for the chat"}
                </button>
                {lifted && <p className="field-hint">This code was used. It will not open the box again.</p>}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="field-hint" style={{ marginTop: "1rem" }}>
            This asks the box to open once. It does not leave a code you can type again.
          </p>
          {vault.masterPending ? (
            <div style={{ marginTop: "0.6rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="button" className="btn btn-stamp" onClick={vault.confirmMasterUnlock} disabled={vault.homeBusy}>
                Yes, open for me
              </button>
              <button type="button" className="btn" onClick={vault.cancelMasterUnlock} disabled={vault.homeBusy}>
                Never mind
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn-ghost" onClick={vault.requestMasterUnlock} disabled={vault.homeBusy}>
              I am home. Open it.
            </button>
          )}
          {vault.homeNote && <p className={vault.homeNote.includes("did not") || vault.homeNote.includes("not set") ? "field-error" : "field-hint"}>{vault.homeNote}</p>}
        </form>
      </div>
    </div>
  );
}
