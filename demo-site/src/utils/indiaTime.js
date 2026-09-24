export const INDIA_TZ = "Asia/Kolkata";

export function indiaDateISO(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: INDIA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function parseIndiaDate(value) {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return new Date(`${text}T12:00:00+05:30`);
  }
  if (/^\d{4}-\d{2}-\d{2}T/.test(text) && !/[zZ]|[+-]\d{2}:\d{2}$/.test(text)) {
    return new Date(`${text}+05:30`);
  }
  return new Date(text);
}

export function formatIndiaDateTime(value) {
  if (!value) return "—";
  try {
    const d = parseIndiaDate(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return `${d.toLocaleString("en-IN", {
      timeZone: INDIA_TZ,
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })} IST`;
  } catch {
    return String(value);
  }
}

export function formatIndiaDate(value) {
  if (!value) return "—";
  try {
    const d = parseIndiaDate(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("en-IN", {
      timeZone: INDIA_TZ,
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(value);
  }
}

/** Chart tick: 22 Sep */
export function formatIndiaDayTick(ymd) {
  const d = parseIndiaDate(ymd);
  if (Number.isNaN(d.getTime())) return String(ymd || "");
  return d.toLocaleDateString("en-IN", {
    timeZone: INDIA_TZ,
    day: "2-digit",
    month: "short",
  });
}

export function indiaMonthIndex(value) {
  const d = parseIndiaDate(value);
  const month = d.toLocaleString("en-US", { timeZone: INDIA_TZ, month: "numeric" });
  return Number(month) - 1;
}

export function indiaNowISO() {
  return new Date().toISOString();
}
