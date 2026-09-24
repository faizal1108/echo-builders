import StatusBadge from "./StatusBadge";
import { formatTime } from "../utils/formatters";

export default function DataSources({ t, sources }) {
  const rows = [
    { name: "Bhuvan", org: "NRSC / ISRO", href: "https://bhuvan-app1.nrsc.gov.in/api/", ...sources.bhuvan },
    { name: "SoilGrids", org: "ISRIC", href: "https://rest.isric.org/", ...sources.soil },
    { name: "Weather", org: "Open-Meteo", href: "https://open-meteo.com/", ...sources.weather },
    { name: "AI Analysis", org: "Google Gemini", href: "https://ai.google.dev/", ...sources.gemini },
  ];

  return (
    <section className="echo-card p-5">
      <p className="echo-label">{t.dataSources}</p>
      <div className="mt-4 divide-y divide-forest-50">
        {rows.map((row) => (
          <div key={row.name} className="flex flex-wrap items-center justify-between gap-2 py-3">
            <div>
              <p className="font-semibold text-forest-900">{row.name}</p>
              <p className="text-xs text-forest-600">{row.org}</p>
              <a className="text-[11px] text-forest-500 underline" href={row.href} target="_blank" rel="noreferrer">
                Documentation
              </a>
            </div>
            <div className="text-right">
              <StatusBadge status={row.status} />
              <p className="mt-1 text-[11px] text-forest-500">{row.httpStatus ? `HTTP ${row.httpStatus}` : row.message}</p>
              <p className="text-[11px] text-forest-400">{formatTime(row.fetchedAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
