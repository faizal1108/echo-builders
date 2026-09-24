import StatusBadge from "./StatusBadge";

export default function CropPlan({ t, planResult, tamilSummary, onGenerateTamil, generatingTamil }) {
  const plan = planResult?.data;
  const months = plan?.four_month_plan || [];

  return (
    <section id="plan" className="echo-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="echo-label">{t.fourMonth}</p>
          <p className="mt-1 max-w-2xl text-xs text-forest-600">
        {t.fourMonthNote} Adapted to the selected Nanjai / Punjai land type.
      </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {tamilSummary ? (
            <span className="rounded-full bg-forest-700 px-3 py-1 text-[11px] font-bold text-white">தமிழ் சுருக்கம்</span>
          ) : null}
          <StatusBadge status={planResult?.status || "idle"} />
          {onGenerateTamil && (
            <button
              type="button"
              onClick={onGenerateTamil}
              disabled={generatingTamil}
              className="rounded-full border border-forest-200 px-3 py-1 text-xs font-semibold text-forest-800 disabled:opacity-60"
            >
              {generatingTamil ? "..." : t.generateTamil}
            </button>
          )}
        </div>
      </div>
      {planResult?.message && <p className="mt-3 text-sm text-forest-700">{planResult.message}</p>}
      {plan?.crop_suitability?.status && (
        <div className="mt-4 rounded-2xl border border-forest-100 bg-forest-50/60 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-forest-500">Crop suitability</p>
          <p className="font-display text-2xl text-forest-900">{plan.crop_suitability.status}</p>
          <p className="mt-1 text-sm text-forest-800">{plan.crop_suitability.reason}</p>
        </div>
      )}
      {plan?.field_summary && <p className="mt-4 text-sm leading-relaxed text-forest-800">{plan.field_summary}</p>}
      {plan?.rawText && !months.length && (
        <pre className="mt-4 overflow-auto whitespace-pre-wrap rounded-xl bg-wheat-50 p-3 text-xs text-forest-800">
          {plan.rawText}
        </pre>
      )}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {months.map((m, idx) => (
          <article key={`${m.month}-${idx}`} className="rounded-2xl border border-forest-100 bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-soil-500">Month {idx + 1}</p>
            <h3 className="font-display text-xl text-forest-900">{m.month}</h3>
            <p className="text-sm font-medium text-forest-700">{m.stage}</p>
            <Block title="Key activities" items={m.activities} />
            <p className="mt-3 text-sm"><span className="font-semibold">Irrigation:</span> {m.irrigation}</p>
            <p className="mt-1 text-sm"><span className="font-semibold">Fertility:</span> {m.fertility}</p>
            <Block title="Pest monitoring" items={m.pest_monitoring} />
            <Block title="Disease monitoring" items={m.disease_monitoring} />
            <p className="mt-2 text-xs text-forest-600">{m.weather_consideration}</p>
          </article>
        ))}
      </div>
      {plan?.irrigation_guidance && (
        <p className="mt-4 rounded-xl bg-wheat-50 p-3 text-sm text-forest-800">{plan.irrigation_guidance}</p>
      )}
    </section>
  );
}

function Block({ title, items }) {
  const list = Array.isArray(items) ? items : items ? [items] : [];
  if (!list.length) return null;
  return (
    <div className="mt-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-forest-500">{title}</p>
      <ul className="mt-1 list-disc pl-5 text-sm text-forest-800">
        {list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
