export default function MonthPlan({ t, yearPlan }) {
  if (!yearPlan) return null;

  return (
    <section id="calendar" className="echo-card p-5">
      <p className="echo-label">{t.yearPlan}</p>
      <p className="mt-1 max-w-3xl text-xs text-forest-600">{t.yearPlanNote}</p>
      <div className="mt-3 rounded-2xl bg-forest-50/80 p-4 text-sm text-forest-800">
        <p>
          <span className="font-semibold">{yearPlan.landType.nameEn}</span> · {yearPlan.landType.nameTa} · {yearPlan.crop} ·{" "}
          {yearPlan.region}
        </p>
        <p className="mt-2 text-xs leading-relaxed">{yearPlan.cultureNote}</p>
        <p className="mt-2 text-xs leading-relaxed">{yearPlan.rainfall}</p>
        {yearPlan.mismatch && <p className="mt-2 text-xs text-amber-900">{yearPlan.mismatch}</p>}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {yearPlan.months.map((m, idx) => (
          <article key={m.month} className="rounded-2xl border border-forest-100 bg-white p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-soil-500">
              Month {idx + 1} · {m.tamilName}
            </p>
            <h3 className="font-display text-xl text-forest-900">
              {m.month} <span className="text-base text-forest-600">{m.tamil}</span>
            </h3>
            <p className="text-xs text-forest-500">{m.season}</p>
            <p className="mt-2 text-sm font-semibold text-forest-800">{m.stage}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-forest-800">
              {(m.activities || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-forest-700">
              <span className="font-semibold">Irrigation:</span> {m.irrigation}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-forest-700">
              <span className="font-semibold">Fertility:</span> {m.fertility}
            </p>
            <p className="mt-1 text-xs text-forest-600">
              <span className="font-semibold">Pest:</span> {(m.pest_monitoring || []).join(", ")}
            </p>
            <p className="mt-1 text-xs text-forest-600">
              <span className="font-semibold">Disease:</span> {(m.disease_monitoring || []).join(", ")}
            </p>
            {m.konguNote ? <p className="mt-2 text-xs italic text-forest-700">{m.konguNote}</p> : null}
          </article>
        ))}
      </div>
      <p className="mt-4 text-xs text-forest-500">{yearPlan.disclaimer}</p>
    </section>
  );
}
