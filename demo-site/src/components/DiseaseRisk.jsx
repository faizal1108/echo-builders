import { cropProfiles } from "../data/cropProfiles";
import { riskTone } from "../utils/formatters";

export default function DiseaseRisk({ t, crop, items }) {
  const profile = cropProfiles[crop] || cropProfiles.Other;
  const list = items?.length
    ? items
    : profile.diseases.map((disease) => ({
        disease,
        risk: "Monitor",
        reason: "Crop-typical disease to watch under local weather.",
        monitoring_action: profile.monitoring,
      }));

  return (
    <section className="echo-card p-5">
      <p className="echo-label">{t.disease}</p>
      <p className="mt-1 text-xs text-forest-600">Monitoring guidance, not an automatic diagnosis.</p>
      <div className="mt-4 space-y-3">
        {list.map((item) => (
          <div key={item.disease} className="rounded-xl border border-forest-50 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-forest-900">{item.disease}</p>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${riskTone(item.risk)}`}>{item.risk}</span>
            </div>
            <p className="mt-1 text-sm text-forest-700">{item.reason}</p>
            <p className="mt-1 text-xs text-forest-600">{item.monitoring_action}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
