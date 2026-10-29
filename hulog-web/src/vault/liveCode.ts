export type LiveCodeRow = {
  pin: string;
  active: boolean;
  open_once: boolean;
};

function settings() {
  const url = (import.meta.env.VITE_SUPABASE_URL ?? "").replace(/\/$/, "");
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";
  return { url, key, ready: url.length > 0 && key.length > 0 };
}

export function supabaseReady() {
  return settings().ready;
}

function headers(key: string): HeadersInit {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

export async function readLiveCode(): Promise<LiveCodeRow | null> {
  const { url, key, ready } = settings();
  if (!ready) throw new Error("missing");
  const res = await fetch(`${url}/rest/v1/live_code?id=eq.1&select=pin,active,open_once`, {
    headers: headers(key),
  });
  if (!res.ok) throw new Error("read");
  const rows = (await res.json()) as LiveCodeRow[];
  return rows[0] ?? null;
}

export async function stampLiveCode(pin: string): Promise<void> {
  const { url, key, ready } = settings();
  if (!ready) throw new Error("missing");
  const res = await fetch(`${url}/rest/v1/live_code?id=eq.1`, {
    method: "PATCH",
    headers: headers(key),
    body: JSON.stringify({ pin, active: true, open_once: false }),
  });
  if (!res.ok) throw new Error("stamp");
  const rows = (await res.json()) as LiveCodeRow[];
  if (!rows[0] || rows[0].pin !== pin || rows[0].active !== true) throw new Error("stamp");
}

export async function askOpenOnce(): Promise<void> {
  const { url, key, ready } = settings();
  if (!ready) throw new Error("missing");
  const res = await fetch(`${url}/rest/v1/live_code?id=eq.1`, {
    method: "PATCH",
    headers: headers(key),
    body: JSON.stringify({ open_once: true }),
  });
  if (!res.ok) throw new Error("open");
  const rows = (await res.json()) as LiveCodeRow[];
  if (!rows[0] || rows[0].open_once !== true) throw new Error("open");
}
