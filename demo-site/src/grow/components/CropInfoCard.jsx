export default function CropInfoCard({ crop, stage }) {
  return (
    <article className="echo-card p-5">
      <p className="echo-label">My crop</p>
      <h3 className="mt-1 font-display text-2xl text-forest-900">{crop.name}</h3>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Item k="Crop" v={crop.crop} />
        <Item k="Location" v={crop.location} />
        <Item k="Sowing Date" v={crop.sowingLabel} />
        <Item k="Current Stage" v={stage.name} />
        <Item k="Crop Age" v={`${stage.ageDays} Days`} />
        <Item k="Expected Harvest" v={crop.harvestLabel} />
        <Item k="Health" v={stage.health} />
      </dl>
      <p className="mt-4 text-sm leading-relaxed text-forest-700">{stage.summary}</p>
      <ul className="mt-3 space-y-1 text-xs text-forest-600">
        {stage.risks.map((r) => (
          <li key={r}>• {r}</li>
        ))}
      </ul>
    </article>
  );
}

function Item({ k, v }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wide text-forest-500">{k}</dt>
      <dd className="font-semibold text-forest-900">{v}</dd>
    </div>
  );
}
