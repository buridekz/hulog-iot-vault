import { QRCodeSVG } from "qrcode.react";
import { Lock, LockOpen } from "@phosphor-icons/react";
import { SevenSeg } from "./SevenSeg";
import { useVault } from "../vault/VaultContext";

const KEYS = ["1", "2", "3", "A", "4", "5", "6", "B", "7", "8", "9", "C", "*", "0", "#", "D"];

export function VaultFace({ showKeypad = true }: { showKeypad?: boolean }) {
  const { locked, inputDigits, oledMode, activePass, handleKey, masterUnlocked } = useVault();

  const granted = oledMode === "granted" || !locked;
  const denied = oledMode === "denied";
  const open = granted || masterUnlocked;

  let oledTitle = "ENTER DELIVERY PIN:";
  if (denied) oledTitle = "ACCESS DENIED";
  else if (granted) oledTitle = "OPEN THE DOOR";

  return (
    <div className="vault-face">
      <img className="vault-housing" src="/notice/vault-plate.png" alt="" width={864} height={1152} />
      <div className="vault-live">
        <div className={`oled-preview ${denied ? "oled-denied" : ""} ${granted ? "oled-ok" : ""}`}>
          <div className="oled-chrome">
            <span>HULOG</span>
            <span>WIFI OK</span>
          </div>
          <div className="oled-body">
            <div className="oled-caption">{oledTitle}</div>
            <SevenSeg value={denied ? "------" : inputDigits} size="lg" />
            <div className="oled-hint">{granted ? "BOLT OPEN" : denied ? "TRY AGAIN" : "# UNLOCK  * CLEAR"}</div>
          </div>
          {activePass && activePass.status === "ACTIVE" && (
            <div className="oled-qr">
              <QRCodeSVG value={activePass.qrPayload} size={64} bgColor="#111111" fgColor="#f3f3f0" level="M" title="Hulog dynamic drop QR" />
            </div>
          )}
        </div>

        {showKeypad && (
          <div className="keypad-grid">
            {KEYS.map((k) => (
              <button key={k} type="button" onClick={() => handleKey(k)}>
                {k}
              </button>
            ))}
          </div>
        )}

        <div className={`lock-slab${open ? " is-open" : ""}`}>
          {open ? <LockOpen size={16} weight="bold" /> : <Lock size={16} weight="bold" />}
          <span>{open ? "OPEN" : "LOCKED"}</span>
        </div>
      </div>
    </div>
  );
}
