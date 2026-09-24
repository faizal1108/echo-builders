import { Sprout, CloudSun, Brain, ShieldAlert } from "lucide-react";

const ICONS = [Sprout, CloudSun, Brain, ShieldAlert];

export default function Landing({ t, onGps, onDemo }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-forest-100 bg-gradient-to-br from-forest-800 via-forest-700 to-soil-600 p-8 text-wheat-50 shadow-card md:p-12">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-wheat-200">ECHO</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight md:text-6xl">{t.hero}</h1>
      <p className="mt-4 max-w-2xl text-base text-wheat-100/90 md:text-lg">{t.heroBody}</p>
      <p className="mt-2 text-sm text-wheat-200">Smart Crop Intelligence</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onGps}
          className="rounded-full bg-wheat-50 px-5 py-2.5 text-sm font-semibold text-forest-800 hover:bg-white"
        >
          {t.useGps}
        </button>
        <button
          type="button"
          onClick={onDemo}
          className="rounded-full border border-wheat-200/60 px-5 py-2.5 text-sm font-semibold text-wheat-50 hover:bg-white/10"
        >
          {t.exploreDemo}
        </button>
      </div>
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {t.stats.map((stat, i) => {
          const Icon = ICONS[i];
          return (
            <div key={stat.k} className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <Icon size={18} className="mb-2 text-wheat-200" />
              <p className="text-[11px] uppercase tracking-wider text-wheat-200">{stat.k}</p>
              <p className="mt-1 text-sm font-medium">{stat.v}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
