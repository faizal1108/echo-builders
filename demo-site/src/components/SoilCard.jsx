import { formatNumber } from "../utils/formatters";
import StatusBadge from "./StatusBadge";

export default function SoilCard({ t, soilResult }) {
  const soil = soilResult?.data;
  const bars = soil
    ? [
        { label: "Clay", value: soil.clay, max: 100, suffix: "%" },
        { label: "Sand", value: soil.sand, max: 100, suffix: "%" },
        { label: "Silt", value: soil.silt, max: 100, suffix: "%" },
        { label: "Organic Carbon", value: soil.organicCarbon, max: 40, suffix: " g/kg" },
        { label: "Nitrogen", value: soil.nitrogen, max: 5, suffix: " g/kg" },
        { label: "CEC", value: soil.cec, max: 40, suffix: "" },
      ]
    : [];

  return (
    <section id="soil" className="echo-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="echo-label">{t.soilHealth}</p>
          <p className="mt-1 text-xs text-forest-600">Source: SoilGrids</p>
        </div>
        <StatusBadge status={soilResult?.status || "idle"} />
      </div>
      {!soil && (
        <p className="mt-4 text-sm text-forest-700">
          {soilResult?.message || "Soil data unavailable."}
        </p>
      )}
      {soil && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="pH" value={formatNumber(soil.ph, 2)} />
            <Stat label="Clay" value={formatNumber(soil.clay, 1, "%")} />
            <Stat label="Sand" value={formatNumber(soil.sand, 1, "%")} />
            <Stat label="Silt" value={formatNumber(soil.silt, 1, "%")} />
            <Stat label="Organic Carbon" value={formatNumber(soil.organicCarbon, 1)} />
            <Stat label="Nitrogen" value={formatNumber(soil.nitrogen, 2)} />
            <Stat label="CEC" value={formatNumber(soil.cec, 1)} />
            <Stat label="Depth" value={soil.depths || "0–15 cm"} />
          </div>
          <div className="mt-5 space-y-3">
            {bars.map((b) => (
              <div key={b.label}>
                <div className="mb-1 flex justify-between text-xs text-forest-700">
                  <span>{b.label}</span>
                  <span>{formatNumber(b.value, 1, b.suffix)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-forest-50">
                  <div
                    className="h-full rounded-full bg-forest-500"
                    style={{ width: `${Math.min(100, ((Number(b.value) || 0) / b.max) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <p className="mt-4 text-xs leading-relaxed text-forest-600">{t.soilNote}</p>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-forest-50 bg-wheat-50 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-forest-500">{label}</p>
      <p className="text-lg font-semibold text-forest-900">{value}</p>
    </div>
  );
}
