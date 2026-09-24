import { OFFLINE_STEPS } from "../data/growDemo";

export default function OfflineMode() {
  return (
    <section className="echo-card grid gap-6 p-6 md:grid-cols-[160px_1fr]">
      <div className="flex flex-col items-center justify-center">
        <div className="relative h-40 w-24 rounded-[1.6rem] border-4 border-forest-800 bg-gradient-to-b from-forest-50 to-white shadow-card">
          <div className="absolute left-1/2 top-2 h-1 w-8 -translate-x-1/2 rounded-full bg-forest-800" />
          <div className="mt-8 px-2 text-center text-[9px] font-semibold text-forest-800">
            Offline
            <br />
            scan
          </div>
          <div className="absolute bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full border border-forest-300" />
        </div>
        <span className="mt-3 rounded-full bg-forest-700 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          Offline AI Ready
        </span>
      </div>
      <div>
        <p className="echo-label">Connectivity</p>
        <h2 className="font-display text-2xl">Works Even Without Internet</h2>
        <p className="mt-1 text-sm text-forest-600">Farmers in low-connectivity areas can still scan crops after a one-time model download. This is a product story for the demo, not a live on-device model in this browser.</p>
        <ol className="mt-4 space-y-2">
          {OFFLINE_STEPS.map((step, i) => (
            <li key={step} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-100 text-[11px] font-bold text-forest-800">
                {i + 1}
              </span>
              <span>
                {step}
                {i < OFFLINE_STEPS.length - 1 ? <span className="block text-forest-400">↓</span> : null}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
