export default function CropHealthCard({ score, stage, pestActive }) {
  const display = pestActive ? Math.max(58, score - 18) : score;
  const label = pestActive ? "Attention" : stage.health;
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (display / 100) * c;
  const mark = (ok, warn) => (warn ? "⚠" : ok ? "✓" : "•");

  return (
    <article className="echo-card p-5">
      <p className="echo-label">Crop Health</p>
      <div className="mt-3 flex items-center gap-5">
        <svg width="112" height="112" viewBox="0 0 112 112" aria-hidden>
          <circle cx="56" cy="56" r={r} fill="none" stroke="#dcece1" strokeWidth="10" />
          <circle
            cx="56"
            cy="56"
            r={r}
            fill="none"
            stroke={pestActive ? "#b45309" : "#2d6a4f"}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            transform="rotate(-90 56 56)"
          />
          <text x="56" y="52" textAnchor="middle" className="fill-forest-900" fontSize="22" fontWeight="700">
            {display}%
          </text>
          <text x="56" y="70" textAnchor="middle" className="fill-forest-600" fontSize="10">
            {label}
          </text>
        </svg>
        <ul className="space-y-2 text-sm">
          <li>Growth {mark(stage.growthOk, false)}</li>
          <li>Pest Risk {mark(stage.pestRisk === "low", pestActive || stage.pestRisk === "moderate")}</li>
          <li>Disease Risk {mark(stage.diseaseRisk === "low", stage.diseaseRisk === "moderate")}</li>
          <li>Weather {mark(stage.weatherOk, false)}</li>
        </ul>
      </div>
    </article>
  );
}
