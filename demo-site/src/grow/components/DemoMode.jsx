export default function DemoMode({ running, onStart, onReplay }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onStart}
        disabled={running}
        className="rounded-full bg-forest-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {running ? "Playing demo…" : "Demo Mode"}
      </button>
      <button type="button" onClick={onReplay} className="rounded-full border border-forest-200 bg-white px-4 py-2 text-sm font-semibold text-forest-800">
        Replay Journey
      </button>
    </div>
  );
}
