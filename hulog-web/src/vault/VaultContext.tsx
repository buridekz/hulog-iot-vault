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
import { askOpenOnce, readLiveCode, stampLiveCode, supabaseReady } from "./liveCode";
import {
  buildQrPayload,
  type CourierStep,
  type DeliveryPass,
  type OledMode,
  type UartLog,
} from "./types";

const SAMPLE_PASSES: DeliveryPass[] = [
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
    expiresIn: "Used",
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
  stampNote: string;
  stampBusy: boolean;
  homeNote: string;
  homeBusy: boolean;
  setCourierPin: (v: string) => void;
  setInputDigits: (v: string) => void;
  handleKey: (key: string) => void;
  generatePass: (input: { recipient: string; courier: string; trackingNo: string }) => Promise<DeliveryPass | null>;
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

function usedPass(pass: DeliveryPass): DeliveryPass {
  return { ...pass, status: "COMPLETED", expiresIn: "Used", irVerified: true, dropTime: nowTime() };
}

export function VaultProvider({ children }: { children: ReactNode }) {
  const seq = useRef(10);
  const sawLivePin = useRef<string | null>(null);
  const watchGen = useRef(0);
  const homeWait = useRef(0);
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
    { id: "boot", time: "09:00 AM", text: "Hulog box is watching the house Wi-Fi.", type: "info" },
  ]);
  const [courierStep, setCourierStep] = useState<CourierStep>("auth");
  const [courierPin, setCourierPin] = useState("");
  const [courierError, setCourierError] = useState<string | null>(null);
  const [masterPending, setMasterPending] = useState(false);
  const [masterUnlocked, setMasterUnlocked] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [stampNote, setStampNote] = useState("");
  const [stampBusy, setStampBusy] = useState(false);
  const [homeNote, setHomeNote] = useState("");
  const [homeBusy, setHomeBusy] = useState(false);

  const activePass = useMemo(
    () => passes.find((p) => p.status === "ACTIVE") ?? (createdPass?.status === "ACTIVE" ? createdPass : null),
    [passes, createdPass],
  );

  useEffect(() => {
    localStorage.removeItem("hulog-board");
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => {
      setPingMs(28 + Math.floor(Math.random() * 18));
    }, 2200);
    return () => window.clearInterval(t);
  }, []);

  const addLog = useCallback((text: string, type: UartLog["type"]) => {
    seq.current += 1;
    const id = `log-${seq.current}-${Date.now()}`;
    setLogs((prev) => [{ id, time: nowTime(), text, type }, ...prev].slice(0, 8));
  }, []);

  const grantAccess = useCallback(() => {
    setLocked(false);
    setOledMode("granted");
    addLog("Code matched. Bolt is open.", "success");
    window.setTimeout(() => {
      setDoorOpen(true);
      addLog("Door opened.", "info");
    }, 450);
  }, [addLog]);

  const denyAccess = useCallback((attempt: string) => {
    setOledMode("denied");
    addLog(attempt ? "Wrong code." : "Empty code.", "warn");
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
      addLog("Parcel is in and the door is shut. That code is used.", "success");
      setTelegramAlert(null);
      setPasses((prev) => prev.map((p) => (p.pin === pinUsed && p.status === "ACTIVE" ? { ...usedPass(p), dropTime: timeStr } : p)));
      setCreatedPass((curr) => (curr && curr.pin === pinUsed ? { ...usedPass(curr), dropTime: timeStr } : curr));
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
    async (input: { recipient: string; courier: string; trackingNo: string }) => {
      if (!supabaseReady()) {
        setStampNote("The code list is not set up on this page yet.");
        return null;
      }
      const pin = randomPin();
      homeWait.current += 1;
      watchGen.current += 1;
      sawLivePin.current = null;
      setStampBusy(true);
      setStampNote("");
      setCopiedNote(false);
      try {
        await stampLiveCode(pin);
        watchGen.current += 1;
        sawLivePin.current = pin;
      } catch {
        setStampNote("The code did not save. Try the stamp again.");
        setStampBusy(false);
        return null;
      }
      const pass: DeliveryPass = {
        id: `pass-${Date.now()}`,
        pin,
        qrPayload: buildQrPayload({ pin, trackingNo: input.trackingNo, courier: input.courier }),
        recipient: input.recipient,
        courier: input.courier,
        trackingNo: input.trackingNo,
        expiresIn: "Until the drop",
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
      setMasterUnlocked(false);
      setStampNote("The box will see this on the house Wi-Fi.");
      addLog("New code saved for the box.", "info");
      setStampBusy(false);
      return pass;
    },
    [addLog],
  );

  useEffect(() => {
    if (!supabaseReady()) return;
    const timer = window.setInterval(() => {
      const gen = watchGen.current;
      void readLiveCode()
        .then((row) => {
          if (!row || gen !== watchGen.current) return;
          const apply = (curr: DeliveryPass | null) => {
            if (!curr || curr.status !== "ACTIVE") return curr;
            if (row.pin === curr.pin && row.active) {
              sawLivePin.current = curr.pin;
              return curr;
            }
            if (sawLivePin.current === curr.pin && row.active === false) return usedPass(curr);
            return curr;
          };
          setCreatedPass((curr) => apply(curr));
          setPasses((prev) => prev.map((p) => apply(p) ?? p));
        })
        .catch(() => undefined);
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

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
      setCourierError("No live code yet. Stamp one first.");
      return;
    }
    if (courierPin !== activePass.pin) {
      setCourierError("That code does not match.");
      denyAccess(courierPin);
      return;
    }
    setInputDigits(activePass.pin);
    grantAccess();
    setCourierStep("unlocked");
  }, [activePass, courierPin, denyAccess, grantAccess]);

  const tryCourierScan = useCallback(() => {
    setCourierError("The rider types the code on the keypad.");
  }, []);

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
  const cancelMasterUnlock = useCallback(() => {
    setMasterPending(false);
    setHomeNote("");
  }, []);

  const confirmMasterUnlock = useCallback(() => {
    if (!supabaseReady()) {
      setMasterPending(false);
      setHomeNote("The code list is not set up on this page yet.");
      return;
    }
    const token = homeWait.current + 1;
    homeWait.current = token;
    setMasterPending(false);
    setHomeBusy(true);
    setHomeNote("Asking the box to open once.");
    void (async () => {
      try {
        await askOpenOnce();
        const started = Date.now();
        let opened = false;
        while (Date.now() - started < 30000) {
          await new Promise((resolve) => window.setTimeout(resolve, 2000));
          if (homeWait.current !== token) return;
          const row = await readLiveCode();
          if (row && row.open_once === false) {
            opened = true;
            break;
          }
        }
        if (homeWait.current !== token) return;
        if (opened) {
          setMasterUnlocked(true);
          setLocked(false);
          setOledMode("granted");
          setHomeNote("The box opened once. That request is gone.");
          addLog("Owner open used once. The box forgot it.", "success");
          window.setTimeout(() => {
            setMasterUnlocked(false);
            setLocked(true);
            setDoorOpen(false);
            setOledMode("idle");
          }, 8000);
        } else {
          setHomeNote("The box has not opened yet. The request stays until the box sees it, then it is forgotten.");
        }
      } catch {
        if (homeWait.current !== token) return;
        setHomeNote("The box did not get the request. Try again.");
      } finally {
        if (homeWait.current === token) setHomeBusy(false);
      }
    })();
  }, [addLog]);

  const generateNewPin = useCallback(() => {
    void generatePass({
      recipient: activePass?.recipient ?? "Lance Corpuz (Unit 01)",
      courier: activePass?.courier ?? "Shopee Express (SPX)",
      trackingNo: activePass?.trackingNo ?? `SPX-PH-${Math.floor(10000 + Math.random() * 89999)}`,
    });
    setTelegramAlert(null);
  }, [activePass, generatePass]);

  const simulateDrop = useCallback(() => {
    if (simulating) return;
    setSimulating(true);
    void (async () => {
      let pin = activePass?.status === "ACTIVE" ? activePass.pin : "";
      if (!pin) {
        const pass = await generatePass({
          recipient: "Lance Corpuz (Unit 01)",
          courier: "Shopee Express (SPX)",
          trackingNo: "SPX-PH-884920",
        });
        pin = pass?.pin ?? "";
      }
      if (!pin) {
        setSimulating(false);
        return;
      }
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
    })();
  }, [activePass, completeDrop, generatePass, grantAccess, simulating]);

  const value: VaultContextValue = {
    pingMs,
    locked,
    doorOpen,
    hasPackage,
    parcelCount,
    inputDigits,
    oledMode,
    activePass,
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
    stampNote,
    stampBusy,
    homeNote,
    homeBusy,
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
