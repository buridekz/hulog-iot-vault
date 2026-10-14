import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Nav } from "./components/Nav";
import { InkDefs } from "./components/InkMarks";
import { Home } from "./components/Home";
import { HowItWorks } from "./components/HowItWorks";
import { TryIt } from "./components/TryIt";
import { Cost } from "./components/Cost";
import { Wiring } from "./components/Wiring";
import { Team } from "./components/Team";
import { Footer } from "./components/Footer";
import { VaultProvider } from "./vault/VaultContext";
import { ThemeProvider } from "./theme";
import { resolvePage, type PageId } from "./vault/types";

function pageFromHash(): PageId {
  const raw = window.location.hash.replace(/^#\/?/, "");
  return resolvePage(raw);
}

export function App() {
  const [activePage, setActivePage] = useState<PageId>(pageFromHash);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onHash = () => setActivePage(pageFromHash());
    window.addEventListener("hashchange", onHash);
    if (!window.location.hash) window.location.hash = "#/home";
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [activePage, reduce]);

  const go = (page: PageId) => {
    window.location.hash = `#/${page}`;
    setActivePage(page);
  };

  return (
    <ThemeProvider>
      <VaultProvider>
        <InkDefs />
        <div className="grain" aria-hidden="true" />
        <div className="shell">
          <Nav active={activePage} onGo={go} />
          <div className="main-content">
            <AnimatePresence mode="wait">
              <motion.main
                key={activePage}
                initial={reduce ? false : { opacity: 0, transform: "translateY(8px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                exit={reduce ? { opacity: 1 } : { opacity: 0, transform: "translateY(-6px)" }}
                transition={{ duration: reduce ? 0.01 : 0.28, ease: [0.23, 1, 0.32, 1] }}
              >
                {activePage === "home" && <Home onGo={go} />}
                {activePage === "how" && <HowItWorks />}
                {activePage === "try" && <TryIt />}
                {activePage === "cost" && <Cost />}
                {activePage === "wiring" && <Wiring />}
                {activePage === "team" && <Team />}
              </motion.main>
            </AnimatePresence>
            <Footer />
          </div>
        </div>
      </VaultProvider>
    </ThemeProvider>
  );
}

export default App;
