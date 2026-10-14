import { List, X } from "@phosphor-icons/react";
import { useState } from "react";
import { PAGES, type PageId } from "../vault/types";
import { useTheme } from "../theme";
import { ScribbleX } from "./InkMarks";

export function Nav({
  active,
  onGo,
}: {
  active: PageId;
  onGo: (page: PageId) => void;
}) {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const go = (page: PageId) => {
    onGo(page);
    setOpen(false);
  };

  return (
    <>
      <header className="topbar">
        <button type="button" className="wordmark" onClick={() => go("home")}>
          <img className="wordmark-bracket" src="/notice/wordmark-bracket.png" alt="" width={180} height={554} />
          <span className="ink-bleed">HULOG</span>
        </button>
        <nav className="nav-links" aria-label="Primary">
          {PAGES.map((p) => (
            <button key={p.id} type="button" className={`nav-link${active === p.id ? " active" : ""}`} onClick={() => go(p.id)}>
              {p.label}
              {active === p.id ? <ScribbleX className="nav-scribble" /> : null}
            </button>
          ))}
        </nav>
        <div className="topbar-end">
          <button
            type="button"
            className="theme-stamp"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={theme === "dark"}
          >
            <img src="/notice/toggle-pill.png" alt="" width={220} height={139} />
          </button>
          <button type="button" className="icon-btn menu-btn" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
          </button>
        </div>
        <ScribbleX className="header-rule" />
      </header>
      <nav className={`mobile-nav${open ? " open" : ""}`} aria-label="Mobile">
        {PAGES.map((p) => (
          <button key={p.id} type="button" className={`nav-link${active === p.id ? " active" : ""}`} onClick={() => go(p.id)}>
            {p.label}
            {active === p.id ? <ScribbleX className="nav-scribble" /> : null}
          </button>
        ))}
      </nav>
    </>
  );
}
