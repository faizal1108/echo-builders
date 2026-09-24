import { DEMO_METRICS } from "../data/growDemo";

export default function AccuracySection() {
  const items = [
    ["Precision", `${DEMO_METRICS.precision}%`],
    ["Recall", `${DEMO_METRICS.recall}%`],
    ["F1 Score", `${DEMO_METRICS.f1}%`],
    ["mAP50", `${DEMO_METRICS.map50}%`],
  ];
  return (
    <section className="echo-card p-6">
      <p className="echo-label">Model</p>
      <h2 className="font-display text-2xl">Built for Measurable Detection</h2>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-forest-100 bg-forest-50 p-4 text-center">
            <p className="text-[11px] uppercase tracking-wide text-forest-500">{k}</p>
            <p className="font-display text-3xl text-forest-900">{v}</p>
            <p className="text-[10px] font-bold text-amber-800">DEMO</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-forest-700">{DEMO_METRICS.note}</p>
      <p className="mt-2 text-sm text-forest-600">Model performance is evaluated using a dedicated validation dataset.</p>
    </section>
  );
}
