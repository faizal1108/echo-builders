import { Link } from "react-router-dom";

export default function FarmerCropCard({ crop, active, onTrack, onScan }) {
  return (
    <article className={`echo-card p-4 ${active ? "ring-2 ring-forest-700" : ""}`}>
      <p className="text-lg">🌾 {crop.name}</p>
      <p className="text-sm text-forest-600">{crop.stage}</p>
      <p className="mt-2 text-sm">
        Health: <strong>{crop.health}%</strong>
      </p>
      <p className="text-xs text-forest-500">Last Scan: {crop.lastScan}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => onTrack(crop)} className="rounded-full bg-forest-700 px-3 py-1.5 text-xs font-semibold text-white">
          Track Crop
        </button>
        <button type="button" onClick={onScan} className="rounded-full border border-forest-200 px-3 py-1.5 text-xs font-semibold">
          Scan
        </button>
        <Link to="/community/report" className="rounded-full border border-forest-200 px-3 py-1.5 text-xs font-semibold">
          Open detector
        </Link>
      </div>
    </article>
  );
}
