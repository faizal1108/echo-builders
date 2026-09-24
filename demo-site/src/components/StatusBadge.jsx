export default function StatusBadge({ status }) {
  const map = {
    live: { label: "LIVE", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    connected: { label: "LIVE", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    demo: { label: "DEMO DATA", className: "bg-amber-100 text-amber-900 border-amber-200" },
    error: { label: "ERROR", className: "bg-rose-100 text-rose-800 border-rose-200" },
    unavailable: { label: "UNAVAILABLE", className: "bg-slate-100 text-slate-700 border-slate-200" },
    not_configured: { label: "NOT CONFIGURED", className: "bg-slate-100 text-slate-700 border-slate-200" },
    idle: { label: "IDLE", className: "bg-forest-50 text-forest-700 border-forest-100" },
    loading: { label: "LOADING", className: "bg-sky-100 text-sky-800 border-sky-200" },
  };
  const item = map[status] || map.idle;
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide ${item.className}`}>
      {item.label}
    </span>
  );
}
