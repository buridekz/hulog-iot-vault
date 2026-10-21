import { motion, useReducedMotion } from "motion/react";
import { VaultFace } from "./VaultFace";
import { ScribbleX, ScribbleY } from "./InkMarks";
import type { PageId } from "../vault/types";

export function Home({ onGo }: { onGo: (page: PageId) => void }) {
  const reduce = useReducedMotion();
  return (
    <section className="hero">
      <div className="hero-offer">
        <h1 className="ink-bleed">Leave it at the gate. We&apos;ll lock it.</h1>
        <ScribbleX className="headline-rule" />
        <p className="lede">Send your rider a one-time PIN. After they drop the parcel, that code is gone.</p>
        <div className="hero-actions">
          <button type="button" className="stamp-cta" onClick={() => onGo("try")} aria-label="Stamp a code">
            <img src="/notice/cta-try.png" alt="" width={1120} height={320} />
          </button>
          <button type="button" className="parts-link" onClick={() => onGo("cost")}>
            See the parts (₱820)
            <ScribbleX className="parts-rule" />
          </button>
        </div>
      </div>
      <div className="hero-split" aria-hidden="true">
        <ScribbleY />
      </div>
      <motion.div
        className="exhibit"
        initial={reduce ? false : { opacity: 0, transform: "translateY(10px)" }}
        animate={{ opacity: 1, transform: "translateY(0px)" }}
        transition={{ duration: reduce ? 0.01 : 0.55, ease: [0.23, 1, 0.32, 1] }}
      >
        <img className="exhibit-stamp" src="/notice/stamp-exhibit.png" alt="" width={840} height={840} />
        <img className="exhibit-date" src="/notice/stamp-date.png" alt="" width={560} height={280} />
        <div className="exhibit-well">
          <VaultFace />
        </div>
      </motion.div>
    </section>
  );
}
