export default function PestReportCard({ detection, c, onAsk, onConfirm, onIncorrect }) {
  if (!detection) return null;
  return (
    <div className="echo-card border-amber-200 p-5">
      <p className="echo-label">🐛 {c.possible}</p>
      <p className="mt-2 font-display text-2xl text-forest-900">{detection.label}</p>
      <p className="text-sm text-forest-700">{detection.commonName}</p>
      <p className="mt-2 text-sm">Confidence: {Math.round(detection.confidence * 100)}%</p>
      <p className="text-sm">Crop: {detection.cropGuess}</p>
      <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-950">{detection.note}</p>
      <p className="mt-3 text-sm font-medium">{c.observed}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {["Yes", "No", "Not sure"].map((opt) => (
          <button key={opt} type="button" onClick={() => onConfirm?.(opt)} className="rounded-full border border-forest-200 px-3 py-1 text-xs font-semibold">
            {opt}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={onAsk} className="rounded-full bg-forest-700 px-4 py-2 text-sm font-semibold text-white">
          {c.ask}
        </button>
        <button type="button" onClick={onIncorrect} className="rounded-full border border-forest-200 px-4 py-2 text-sm font-semibold">
          {c.incorrect}
        </button>
      </div>
    </div>
  );
}
