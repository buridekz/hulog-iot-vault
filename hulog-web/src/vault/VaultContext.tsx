import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  buildQrPayload,
  type CourierStep,
  type DeliveryPass,
  type OledMode,
  type UartLog,
} from "./types";

const SAMPLE_PASSES: DeliveryPass[] = [
  {
    id: "pass-live",
    pin: "849201",
    qrPayload: buildQrPayload({ pin: "849201", trackingNo: "SPX-PH-884920", courier: "Shopee Express (SPX)" }),
    recipient: "Lance Corpuz (Unit 01)",
    courier: "Shopee Express (SPX)",
    trackingNo: "SPX-PH-884920",
    expiresIn: "4 hours",
    status: "ACTIVE",
  },
  {
    id: "pass-1",
    pin: "849201",
    qrPayload: buildQrPayload({ pin: "849201", trackingNo: "JNT-9920148", courier: "J&T Express" }),
    recipient: "Lance Corpuz (Unit 01)",
    courier: "J&T Express",
    trackingNo: "JNT-9920148",
    expiresIn: "Used",
    status: "COMPLETED",
    dropTime: "02:31 PM",
    irVerified: true,
  },
  {
    id: "pass-2",
    pin: "419082",
    qrPayload: buildQrPayload({ pin: "419082", trackingNo: "SPX-PH-10928", courier: "Shopee Express" }),
    recipient: "Justin Luzano (Unit 02)",
    courier: "Shopee Express",
    trackingNo: "SPX-PH-10928",
    expiresIn: "Expired",
    status: "COMPLETED",
    dropTime: "Yesterday",
    irVerified: true,
  },
];

interface VaultContextValue {
  pingMs: number;
  locked: boolean;
  doorOpen: boolean;
  hasPackage: boolean;
  parcelCount: number;
  inputDigits: string;
  oledMode: OledMode;
  activePass: DeliveryPass | null;
  passes: DeliveryPass[];
  createdPass: DeliveryPass | null;
  telegramAlert: string | null;
  logs: UartLog[];
  courierStep: CourierStep;
  courierPin: string;
  courierError: string | null;
  masterPending: boolean;
  masterUnlocked: boolean;
  copiedNote: boolean;
  simulating: boolean;
  boardHost: string;
  boardNote: string;
  setBoardHost: (v: string) => void;
  setCourierPin: (v: string) => void;
  setInputDigits: (v: string) => void;
  handleKey: (key: string) => void;
  generatePass: (input: { recipient: string; courier: string; trackingNo: string }) => DeliveryPass;
  copyRiderNote: () => void;
  tryCourierPin: () => void;
  tryCourierScan: () => void;
  confirmDeposit: () => void;
  resetCourier: () => void;
  requestMasterUnlock: () => void;
  cancelMasterUnlock: () => void;
  confirmMasterUnlock: () => void;
  simulateDrop: () => void;
  generateNewPin: () => void;
}

const VaultContext = createContext<VaultContextValue | null>(null);

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function randomPin() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function VaultProvider({ children }: { children: ReactNode }) {
  const seq = useRef(10);
  const [pingMs, setPingMs] = useState(38);
  const [locked, setLocked] = useState(true);
  const [doorOpen, setDoorOpen] = useState(false);
  const [hasPackage, setHasPackage] = useState(false);
  const [parcelCount, setParcelCount] = useState(0);
  const [inputDigits, setInputDigits] = useState("");
  const [oledMode, setOledMode] = useState<OledMode>("idle");
  const [passes, setPasses] = useState<DeliveryPass[]>(SAMPLE_PASSES);
  const [createdPass, setCreatedPass] = useState<DeliveryPass | null>(null);
  const [telegramAlert, setTelegramAlert] = useState<string | null>(null);
  const [logs, setLogs] = useState<UartLog[]>([
    { id: "boot", time: "09:00 AM", text: "Hulog Node armed. Core 1 ISR online.", type: "info" },
  ]);
  const [courierStep, setCourierStep] = useState<CourierStep>("auth");
  const [courierPin, setCourierPin] = useState("");
  const [courierError, setCourierError] = useState<string | null>(null);
  const [masterPending, setMasterPending] = useState(false);
  const [masterUnlocked, setMasterUnlocked] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [boardHost, setBoardHostState] = useState(() => localStorage.getItem("hulog-board") ?? "");
  const [boardNote, setBoardNote] = useState("");

  const activePass = useMemo(
    () => passes.find((p) => p.status === "ACTIVE") ?? createdPass,
    [passes, createdPass],
  );

  useEffect(() => {
    const t = window.setInterval(() => {
      setPingMs(28 + Math.floor(Math.random() * 18));
    }, 2200);
    return () => window.clearInterval(t);
  }, []);

  const setBoardHost = useCallback((value: string) => {
    setBoardHostState(value);
    localStorage.setItem("hulog-board", value.trim());
  }, []);

  const boardUrl = useCallback(() => {
    const host = boardHost.trim().replace(/\/$/, "");
    if (!host) return "";
    return host.startsWith("http") ? host : `http://${host}`;
  }, [boardHost]);

  const addLog = useCallback((text: string, type: UartLog["type"]) => {
    seq.current += 1;
    const id = `log-${seq.current}-${Date.now()}`;
    setLogs((prev) => [{ id, time: nowTime(), text, type }, ...prev].slice(0, 8));
  }, []);

  const grantAccess = useCallback(() => {
    setLocked(false);
    setOledMode("granted");
    addLog(`PIN verified. Solenoid relay activated!`, "success");
    window.setTimeout(() => {
      setDoorOpen(true);
      addLog("Door opened by courier.", "info");
    }, 450);
  }, [addLog]);

  const denyAccess = useCallback((attempt: string) => {
    setOledMode("denied");
    addLog(`DENIED: Invalid PIN [${attempt || "empty"}]. Buzzer chirped.`, "warn");
    window.setTimeout(() => {
      setInputDigits("");
      setOledMode("idle");
    }, 1400);
  }, [addLog]);

  const completeDrop = useCallback(
    (pinUsed: string) => {
      const timeStr = nowTime();
      setDoorOpen(false);
      setLocked(true);
      setHasPackage(true);
      setParcelCount((n) => n + 1);
      setOledMode("idle");
      setInputDigits("");
      setCourierStep("done");
      addLog("IR Sensor: Mass verified on floor. Door latched shut.", "success");
      addLog(`Token [${pinUsed}] self-destructed.`, "success");
      setTelegramAlert(
        `📦 HULOG ALERT: Parcel safely dropped & verified via IR sensor at ${timeStr}! Door latched. Token #${pinUsed} burned.`,
      );
      setPasses((prev) =>
        prev.map((p) =>
          p.pin === pinUsed && p.status === "ACTIVE"
            ? { ...p, status: "COMPLETED", dropTime: timeStr, irVerified: true, expiresIn: "Used" }
            : p,
        ),
      );
      setCreatedPass((curr) =>
        curr && curr.pin === pinUsed
          ? { ...curr, status: "COMPLETED", dropTime: timeStr, irVerified: true, expiresIn: "Used" }
          : curr,
      );
    },
    [addLog],
  );

  const handleKey = useCallback(
    (key: string) => {
      if (simulating) return;
      if (key === "*") {
        setInputDigits("");
        setOledMode("idle");
        return;
      }
      if (key === "#") {
        const pin = activePass?.pin;
        if (pin && inputDigits === pin && activePass.status === "ACTIVE") {
          grantAccess();
          setCourierStep("unlocked");
        } else {
          denyAccess(inputDigits);
        }
        return;
      }
      if ("ABCD".includes(key)) return;
      if (inputDigits.length < 6) {
        setInputDigits((d) => d + key);
        setOledMode("entry");
      }
    },
    [activePass, denyAccess, grantAccess, inputDigits, simulating],
  );

  const generatePass = useCallback(
    (input: { recipient: string; courier: string; trackingNo: string }) => {
      const pin = randomPin();
      const pass: DeliveryPass = {
        id: `pass-${Date.now()}`,
        pin,
        qrPayload: buildQrPayload({ pin, trackingNo: input.trackingNo, courier: input.courier }),
        recipient: input.recipient,
        courier: input.courier,
        trackingNo: input.trackingNo,
        expiresIn: "4 hours",
        status: "ACTIVE",
      };
      setCreatedPass(pass);
      setPasses((prev) => [pass, ...prev.filter((p) => p.status !== "ACTIVE")]);
      setInputDigits("");
      setOledMode("idle");
      setCourierStep("auth");
      setCourierPin("");
      setCourierError(null);
      setLocked(true);
      setDoorOpen(false);
      addLog(`New token generated: PIN [${pin}].`, "info");
      const url = boardUrl();
      if (url) {
        void fetch(`${url}/pin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin }),
        })
          .then((res) => {
            if (!res.ok) throw new Error("rejected");
            setBoardNote("Code sent to the board.");
            addLog(`Code [${pin}] sent to the board.`, "success");
          })
          .catch(() => {
            setBoardNote("Board did not answer. Same Wi-Fi, and the address from the screen.");
            addLog("Board did not answer.", "warn");
          });
      }
      return pass;
    },
    [addLog, boardUrl],
  );

  useEffect(() => {
    const url = boardUrl();
    if (!url) return;
    const timer = window.setInterval(() => {
      void fetch(`${url}/pin`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { pin?: string; active?: boolean } | null) => {
          if (!data || data.active !== false || !data.pin) return;
          setCreatedPass((curr) => {
            if (!curr || curr.pin !== data.pin || curr.status !== "ACTIVE") return curr;
            return { ...curr, status: "COMPLETED", expiresIn: "Used", irVerified: true, dropTime: nowTime() };
          });
          setPasses((prev) =>
            prev.map((p) =>
              p.pin === data.pin && p.status === "ACTIVE"
                ? { ...p, status: "COMPLETED", expiresIn: "Used", irVerified: true, dropTime: nowTime() }
                : p,
            ),
          );
        })
        .catch(() => undefined);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [boardUrl]);

  const copyRiderNote = useCallback(() => {
    const pass = createdPass ?? activePass;
    if (!pass || pass.status !== "ACTIVE") return;
    const text = `Kuya Rider (${pass.courier} - ${pass.trackingNo}): Wala po tao sa gate. Paki-hulog po sa HULOG vault gamit ang PIN: ${pass.pin}. Salamat po!`;
    void navigator.clipboard.writeText(text);
    setCopiedNote(true);
    window.setTimeout(() => setCopiedNote(false), 2000);
  }, [activePass, createdPass]);

  const tryCourierPin = useCallback(() => {
    setCourierError(null);
    if (!activePass || activePass.status !== "ACTIVE") {
      setCourierError("No live drop token. Generate a 4-hour pass first.");
      return;
    }
    if (courierPin !== activePass.pin) {
      setCourierError("Invalid PIN. Check the rider note.");
      denyAccess(courierPin);
      return;
    }
    setInputDigits(activePass.pin);
    grantAccess();
    setCourierStep("unlocked");
  }, [activePass, courierPin, denyAccess, grantAccess]);

  const tryCourierScan = useCallback(() => {
    setCourierError(null);
    if (!activePass || activePass.status !== "ACTIVE") {
      setCourierError("Nothing to scan. Generate a pass so the OLED QR is live.");
      return;
    }
    setInputDigits(activePass.pin);
    grantAccess();
    setCourierStep("unlocked");
    addLog("OLED QR decoded. Access granted.", "success");
  }, [activePass, addLog, grantAccess]);

  const confirmDeposit = useCallback(() => {
    if (!doorOpen && locked) return;
    const pin = activePass?.pin ?? createdPass?.pin;
    if (!pin) return;
    completeDrop(pin);
  }, [activePass, completeDrop, createdPass, doorOpen, locked]);

  const resetCourier = useCallback(() => {
    setCourierStep("auth");
    setCourierPin("");
    setCourierError(null);
  }, []);

  const requestMasterUnlock = useCallback(() => setMasterPending(true), []);
  const cancelMasterUnlock = useCallback(() => setMasterPending(false), []);

  const confirmMasterUnlock = useCallback(() => {
    setMasterPending(false);
    setMasterUnlocked(true);
    setLocked(false);
    addLog("MASTER UNLOCK pulse 5.0s (owner retrieval).", "warn");
    window.setTimeout(() => {
      setMasterUnlocked(false);
      setLocked(true);
      setDoorOpen(false);
      addLog("Master pulse ended. Fail-secure re-latch.", "info");
    }, 5000);
  }, [addLog]);

  const generateNewPin = useCallback(() => {
    generatePass({
      recipient: activePass?.recipient ?? "Lance Corpuz (Unit 01)",
      courier: activePass?.courier ?? "Shopee Express (SPX)",
      trackingNo: activePass?.trackingNo ?? `SPX-PH-${Math.floor(10000 + Math.random() * 89999)}`,
    });
    setTelegramAlert(null);
  }, [activePass, generatePass]);

  const simulateDrop = useCallback(() => {
    if (simulating) return;
    setSimulating(true);
    const pin = activePass?.status === "ACTIVE" ? activePass.pin : generatePass({
      recipient: "Lance Corpuz (Unit 01)",
      courier: "Shopee Express (SPX)",
      trackingNo: "SPX-PH-884920",
    }).pin;

    setInputDigits("");
    setOledMode("entry");
    let i = 0;
    const typer = window.setInterval(() => {
      i += 1;
      setInputDigits(pin.slice(0, i));
      if (i >= 6) {
        window.clearInterval(typer);
        window.setTimeout(() => {
          grantAccess();
          setCourierStep("unlocked");
          window.setTimeout(() => {
            completeDrop(pin);
            setSimulating(false);
          }, 1600);
        }, 280);
      }
    }, 160);
  }, [activePass, completeDrop, generatePass, grantAccess, simulating]);

  const value: VaultContextValue = {
    pingMs,
    locked,
    doorOpen,
    hasPackage,
    parcelCount,
    inputDigits,
    oledMode,
    activePass: activePass && activePass.status === "ACTIVE" ? activePass : createdPass?.status === "ACTIVE" ? createdPass : null,
    passes,
    createdPass,
    telegramAlert,
    logs,
    courierStep,
    courierPin,
    courierError,
    masterPending,
    masterUnlocked,
    copiedNote,
    simulating,
    boardHost,
    boardNote,
    setBoardHost,
    setCourierPin,
    setInputDigits,
    handleKey,
    generatePass,
    copyRiderNote,
    tryCourierPin,
    tryCourierScan,
    confirmDeposit,
    resetCourier,
    requestMasterUnlock,
    cancelMasterUnlock,
    confirmMasterUnlock,
    simulateDrop,
    generateNewPin,
  };

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export function useVault() {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error("useVault must be inside VaultProvider");
  return ctx;
}
