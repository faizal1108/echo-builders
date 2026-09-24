export default function PrivacyLocationSelector({ value, onChange, label }) {
  const options = [
    { id: "approximate", en: "Approximate area (default)" },
    { id: "village", en: "Village only" },
    { id: "exact", en: "Exact on device — community still sees approximate" },
    { id: "private", en: "Private (not shown on map)" },
  ];
  return (
    <div>
      <p className="text-xs font-semibold text-forest-700">{label || "Location visibility"}</p>
      <p className="mt-1 text-[11px] text-forest-500">
        Exact farm coordinates, house address, phone numbers and IDs are never shown publicly. The community map uses village or jittered points only.
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${value === o.id ? "bg-forest-700 text-white" : "border border-forest-100 bg-white text-forest-800"}`}
          >
            {o.en}
          </button>
        ))}
      </div>
    </div>
  );
}
