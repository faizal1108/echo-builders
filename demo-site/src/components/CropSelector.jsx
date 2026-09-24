import { CROP_LABELS, CROP_OPTIONS } from "../data/cropProfiles";
import { LAND_TYPES } from "../data/landTypes";

export default function CropSelector({ t, crop, onCrop, date, onDate, landType, onLandType, tamilSummary, onTamilSummary }) {
  return (
    <section id="crop" className="echo-card p-5">
      <p className="echo-label">{t.crop}</p>
      <p className="mt-1 text-xs text-forest-600">{t.coimbatoreHint}</p>

      <div className="mt-4">
        <p className="text-xs font-semibold text-forest-700">{t.landType}</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {LAND_TYPES.map((item) => {
            const active = landType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onLandType(item.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-forest-600 bg-forest-50 shadow-card"
                    : "border-forest-100 bg-wheat-50 hover:border-forest-300"
                }`}
              >
                <p className="font-display text-lg text-forest-900">{item.nameEn}</p>
                <p className="text-sm text-forest-700">{item.nameTa}</p>
                <p className="mt-2 text-xs leading-relaxed text-forest-600">{item.summary}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-forest-700">
          {t.crop}
          <select
            value={crop}
            onChange={(e) => onCrop(e.target.value)}
            className="mt-1 w-full rounded-xl border border-forest-100 bg-wheat-50 px-3 py-2.5 text-sm outline-none focus:border-forest-400"
          >
            {CROP_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {CROP_LABELS[c] || c}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold text-forest-700">
          {t.planningDate}
          <input
            type="date"
            value={date}
            onChange={(e) => onDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-forest-100 bg-wheat-50 px-3 py-2.5 text-sm outline-none focus:border-forest-400"
          />
        </label>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-forest-100 bg-wheat-50 p-4">
        <input
          type="checkbox"
          className="mt-1"
          checked={tamilSummary}
          onChange={(e) => onTamilSummary(e.target.checked)}
        />
        <span>
          <span className="block text-sm font-semibold text-forest-900">{t.tamilAi}</span>
          <span className="mt-1 block text-xs text-forest-600">{t.tamilAiHint}</span>
        </span>
      </label>
    </section>
  );
}
