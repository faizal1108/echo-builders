import { CATEGORIES } from "../data/communityDemo";

export default function CategoryFilter({ value, onChange, lang = "en" }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange("")}
        className={`rounded-full px-3 py-1 text-xs font-semibold ${!value ? "bg-forest-700 text-white" : "bg-white text-forest-800 border border-forest-100"}`}
      >
        All
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onChange(c.id)}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${value === c.id ? "bg-forest-700 text-white" : "bg-white text-forest-800 border border-forest-100"}`}
        >
          {c.emoji} {lang === "ta" ? c.ta : c.en}
        </button>
      ))}
    </div>
  );
}
