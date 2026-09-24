export default function GrowHero({ onStart, onExplore }) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-forest-100 bg-[linear-gradient(180deg,#f4faf5_0%,#fbf7ef_55%,#f3ead6_100%)] px-6 py-12 shadow-card md:px-12 md:py-16">
      <div className="pointer-events-none absolute -left-8 top-6 h-40 w-40 rounded-full bg-forest-200/40 blur-2xl" />
      <div className="pointer-events-none absolute right-10 top-10 text-6xl opacity-20">🌿</div>
      <div className="pointer-events-none absolute bottom-6 right-16 text-4xl opacity-25">🍃</div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-forest-500">ECHO · Smart Crop Intelligence</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-forest-900 md:text-6xl">Grow Smarter. Detect Earlier.</h1>
      <p className="mt-4 max-w-2xl text-base text-forest-700 md:text-lg">
        Track your crop from seed to harvest with AI-powered pest and disease detection.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={onStart} className="rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white shadow-card hover:bg-forest-800">
          Start Growing
        </button>
        <button type="button" onClick={onExplore} className="rounded-full border border-forest-200 bg-white px-6 py-3 text-sm font-semibold text-forest-800">
          Explore Crop Journey
        </button>
      </div>
    </section>
  );
}
