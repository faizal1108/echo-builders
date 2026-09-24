import { Crosshair, MapPin } from "lucide-react";
import { formatAccuracy, formatCoord, formatTime } from "../utils/formatters";

export default function GpsControl({ t, gps, onUseGps, loading, lat, lon, onLat, onLon }) {
  return (
    <section id="location" className="echo-card p-5">
      <p className="echo-label">{t.gpsStatus}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onUseGps}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-800 disabled:opacity-60"
        >
          <Crosshair size={16} />
          {t.useGps}
        </button>
        <span className="rounded-full bg-forest-50 px-3 py-1 text-xs font-medium text-forest-700">
          {gps.statusLabel}
        </span>
      </div>
      {gps.error && <p className="mt-3 text-sm text-amber-800">{gps.error}</p>}
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        <Metric label={t.latitude} value={formatCoord(gps.latitude)} />
        <Metric label={t.longitude} value={formatCoord(gps.longitude)} />
        <Metric label={t.accuracy} value={formatAccuracy(gps.accuracy)} />
        <Metric label={t.capturedTime} value={formatTime(gps.timestamp)} />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="text-xs font-semibold text-forest-700">
          {t.latitude}
          <input
            className="mt-1 w-full rounded-xl border border-forest-100 bg-wheat-50 px-3 py-2 text-sm outline-none focus:border-forest-400"
            value={lat}
            onChange={(e) => onLat(e.target.value)}
            inputMode="decimal"
          />
        </label>
        <label className="text-xs font-semibold text-forest-700">
          {t.longitude}
          <input
            className="mt-1 w-full rounded-xl border border-forest-100 bg-wheat-50 px-3 py-2 text-sm outline-none focus:border-forest-400"
            value={lon}
            onChange={(e) => onLon(e.target.value)}
            inputMode="decimal"
          />
        </label>
      </div>
      <p className="mt-3 flex items-center gap-1 text-xs text-forest-600">
        <MapPin size={12} /> Click the map or enter coordinates to move the field marker.
      </p>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl bg-forest-50/70 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-forest-500">{label}</p>
      <p className="mt-0.5 font-medium text-forest-900">{value}</p>
    </div>
  );
}
