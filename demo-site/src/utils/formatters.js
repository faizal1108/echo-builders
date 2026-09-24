import { formatIndiaDateTime } from "./indiaTime";

export function formatCoord(value, digits = 5) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(digits);
}

export function formatAccuracy(meters) {
  if (!Number.isFinite(Number(meters))) return "—";
  return `${Math.round(Number(meters))} m`;
}

export function formatTime(iso) {
  return formatIndiaDateTime(iso);
}

export function formatNumber(value, digits = 1, suffix = "") {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  return `${Number(value).toFixed(digits)}${suffix}`;
}

export function monthLabel(date, offset) {
  const base =
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? new Date(`${date}T12:00:00+05:30`)
      : date
        ? new Date(date)
        : new Date();
  if (Number.isNaN(base.getTime())) {
    return new Date().toLocaleString("en-IN", { month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
  }
  const d = new Date(base);
  d.setMonth(d.getMonth() + offset);
  return d.toLocaleString("en-IN", { month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function riskTone(level) {
  const v = String(level || "").toUpperCase();
  if (v === "HIGH") return "bg-rose-50 text-rose-800 border-rose-200";
  if (v === "MEDIUM") return "bg-amber-50 text-amber-900 border-amber-200";
  if (v === "LOW") return "bg-emerald-50 text-emerald-800 border-emerald-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export function suitabilityTone(status) {
  const v = String(status || "").toLowerCase();
  if (v.includes("need")) return "bg-amber-50 text-amber-950 border-amber-200";
  if (v.includes("moderate")) return "bg-sky-50 text-sky-900 border-sky-200";
  if (v.includes("suit")) return "bg-emerald-50 text-emerald-900 border-emerald-200";
  return "bg-slate-50 text-slate-800 border-slate-200";
}
