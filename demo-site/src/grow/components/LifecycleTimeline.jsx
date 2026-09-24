export default function LifecycleTimeline({ stages, stageIndex, onSelect }) {
  return (
    <ol className="flex gap-2 overflow-x-auto pb-2 pt-1">
      {stages.map((stage, i) => {
        const active = i === stageIndex;
        const done = i < stageIndex;
        return (
          <li key={stage.id} className="flex min-w-[7.5rem] items-center">
            <button
              type="button"
              onClick={() => onSelect(i)}
              className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
                active
                  ? "border-forest-700 bg-forest-700 text-white shadow-card"
                  : done
                    ? "border-forest-200 bg-forest-50 text-forest-800"
                    : "border-forest-100 bg-white text-forest-700 hover:border-forest-300"
              }`}
            >
              <p className="text-lg leading-none">{stage.emoji}</p>
              <p className="mt-1 text-xs font-semibold">{stage.name}</p>
              <p className={`text-[10px] ${active ? "text-wheat-100" : "text-forest-500"}`}>Day {stage.ageDays}</p>
            </button>
            {i < stages.length - 1 && <span className="mx-1 hidden text-forest-300 sm:inline">→</span>}
          </li>
        );
      })}
    </ol>
  );
}
