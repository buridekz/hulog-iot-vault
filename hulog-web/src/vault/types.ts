export type PageId = "home" | "how" | "try" | "cost" | "wiring" | "team";

export type PassStatus = "ACTIVE" | "COMPLETED";
export type LogType = "success" | "warn" | "info";
export type OledMode = "idle" | "entry" | "granted" | "denied";
export type CourierStep = "auth" | "unlocked" | "done";

export interface DeliveryPass {
  id: string;
  pin: string;
  qrPayload: string;
  recipient: string;
  courier: string;
  trackingNo: string;
  expiresIn: string;
  status: PassStatus;
  dropTime?: string;
  irVerified?: boolean;
}

export interface UartLog {
  id: string;
  time: string;
  text: string;
  type: LogType;
}

export function buildQrPayload(pass: Pick<DeliveryPass, "pin" | "trackingNo" | "courier">): string {
  return `HULOG|${pass.pin}|${pass.trackingNo}|${pass.courier}`;
}

export const PAGES: Array<{ id: PageId; label: string }> = [
  { id: "home", label: "Home" },
  { id: "how", label: "How it works" },
  { id: "try", label: "Your code" },
  { id: "cost", label: "Cost" },
  { id: "wiring", label: "Wiring" },
  { id: "team", label: "Team" },
];

const LEGACY: Record<string, PageId> = {
  overview: "home",
  portal: "try",
  simulator: "try",
  architecture: "how",
  bom: "cost",
  pinout: "wiring",
  economics: "cost",
};

export function resolvePage(raw: string): PageId {
  if (PAGES.some((p) => p.id === raw)) return raw as PageId;
  return LEGACY[raw] ?? "home";
}
