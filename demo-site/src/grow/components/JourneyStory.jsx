import { STORY_STEPS } from "../data/growDemo";

export default function JourneyStory() {
  return (
    <section className="rounded-[28px] border border-forest-100 bg-forest-800 px-6 py-10 text-wheat-50 shadow-card md:px-10">
      <h2 className="font-display text-3xl md:text-4xl">From Seed to Harvest, We Stay With Your Crop.</h2>
      <ol className="mt-8 flex flex-wrap gap-3">
        {STORY_STEPS.map((s, i) => (
          <li key={s.k} className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
              <p className="text-xl">{s.icon}</p>
              <p className="mt-1 text-[11px] font-semibold tracking-wide">{s.k}</p>
            </div>
            {i < STORY_STEPS.length - 1 && <span className="hidden text-wheat-200 sm:inline">↓</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}
