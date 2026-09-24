import { riskTone } from "../utils/formatters";

export default function RiskCard({ t, risks }) {
  if (!risks) {
    return (
      <section id="risk" className="echo-card p-5">
        <p className="echo-label">{t.risk}</p>
        <p className="mt-3 text-sm text-forest-700">Run analysis to calculate preliminary risk indicators.</p>
      </section>
    );
  }

  const items = [
    { label: "Weather Risk", value: risks.weatherRisk?.level },
    { label: "Water Stress Risk", value: risks.waterStress?.level },
    { label: "Disease Favorability", value: risks.diseaseFavorability?.level },
    { label: "Pest Favorability", value: risks.pestFavorability?.level },
  ];

  return (
    <section id="risk" className="echo-card p-5">
      <p className="echo-label">{t.risk}</p>
      <p className="mt-1 text-xs text-forest-500">{t.preliminary}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className={`rounded-2xl border px-4 py-3 ${riskTone(item.value)}`}>
            <p className="text-xs font-medium">{item.label}</p>
            <p className="mt-1 font-display text-2xl font-semibold">{item.value || "—"}</p>
          </div>
        ))}
      </div>
      {risks.notes?.length > 0 && (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-forest-800">
          {risks.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs text-forest-600">{risks.disclaimer}</p>
    </section>
  );
}
