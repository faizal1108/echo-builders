const STEPS = [
  "Getting GPS location",
  "Loading Bhuvan information",
  "Loading SoilGrids information",
  "Loading weather",
  "Calculating risk indicators",
  "Generating AI crop plan",
  "Preparing farmer report",
];

export default function LoadingSteps({ active, done }) {
  return (
    <div className="echo-card p-5">
      <p className="echo-label">Collecting field intelligence</p>
      <ul className="mt-4 space-y-3">
        {STEPS.map((label, index) => {
          const isDone = done.includes(index) || index < active;
          const isActive = index === active;
          return (
            <li key={label} className="flex items-center gap-3 text-sm">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                  isDone
                    ? "bg-forest-700 text-white"
                    : isActive
                      ? "animate-pulse bg-wheat-200 text-forest-800"
                      : "bg-forest-50 text-forest-400"
                }`}
              >
                {index + 1}
              </span>
              <span className={isActive ? "font-semibold text-forest-900" : "text-forest-700"}>{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
