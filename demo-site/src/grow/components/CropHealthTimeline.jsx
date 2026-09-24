export default function CropHealthTimeline({ events, highlightFrom }) {
  return (
    <section className="echo-card p-5">
      <p className="echo-label">Crop health over time</p>
      <p className="mt-1 text-sm text-forest-600">Don't just detect the problem once — track the crop throughout its lifecycle.</p>
      <ol className="mt-5 space-y-0">
        {events.map((ev, i) => {
          const dim = highlightFrom != null && i > highlightFrom;
          const tone =
            ev.status === "alert"
              ? "border-amber-400 bg-amber-50"
              : ev.status === "warn"
                ? "border-orange-300 bg-orange-50"
                : ev.status === "improve"
                  ? "border-sky-300 bg-sky-50"
                  : "border-forest-200 bg-forest-50";
          return (
            <li key={ev.id} className={`relative border-l-2 border-forest-100 pl-5 ${dim ? "opacity-40" : ""}`}>
              <span className="absolute -left-[9px] top-3 h-4 w-4 rounded-full bg-white text-center text-[10px] leading-4 ring-2 ring-forest-200">
                {ev.icon}
              </span>
              <div className={`mb-4 rounded-2xl border p-3 ${tone}`}>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-forest-500">{ev.date}</p>
                <p className="font-semibold text-forest-900">{ev.title}</p>
                <p className="text-sm text-forest-700">{ev.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
