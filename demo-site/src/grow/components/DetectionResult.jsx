export default function DetectionResult({ result, imageSrc }) {
  if (!result) return null;
  const pct = Math.round((result.confidence || 0) * 100);
  const box = result.box || { x: 18, y: 16, w: 58, h: 52 };
  return (
    <article className="echo-card overflow-hidden">
      {imageSrc && (
        <div className="relative bg-forest-900/5">
          <img src={imageSrc} alt="Scan preview" className="max-h-72 w-full object-contain" />
          <div
            className="absolute rounded-md border-2 border-amber-500 shadow-[0_0_0_9999px_rgba(27,67,50,0.12)]"
            style={{ left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%` }}
          >
            <span className="absolute -top-6 left-0 rounded bg-amber-600 px-2 py-0.5 text-[10px] font-semibold text-white">
              {result.detected}
            </span>
          </div>
        </div>
      )}
      <div className="p-5">
        <p className="echo-label">AI Detection Result</p>
        <h3 className="mt-1 font-display text-xl">Detected: {result.detected}</h3>
        <p className="text-sm text-forest-600">{result.scientific}</p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <p>
            <span className="text-forest-500">Confidence</span>
            <br />
            <strong>{pct}%</strong>
          </p>
          <p>
            <span className="text-forest-500">Status</span>
            <br />
            <strong>{result.status}</strong>
          </p>
        </div>
        <p className="mt-3 rounded-xl bg-wheat-50 px-3 py-2 text-xs text-forest-700">{result.note}</p>
        {result.source === "demo-mock" || result.source === "demo-placeholder" ? (
          <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-amber-800">Demo detection · not a live model result</p>
        ) : null}
      </div>
    </article>
  );
}
