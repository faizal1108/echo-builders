import { formatAccuracy, formatCoord, formatNumber, formatTime } from "../utils/formatters";

export function buildReportHtml({ t, field, crop, landType, yearPlan, planningDate, gps, bhuvan, soil, weather, risks, plan, sources }) {
  const soilRows = soil
    ? `pH ${formatNumber(soil.ph, 2)} · Clay ${formatNumber(soil.clay, 1, "%")} · Sand ${formatNumber(
        soil.sand,
        1,
        "%"
      )} · Silt ${formatNumber(soil.silt, 1, "%")} · OC ${formatNumber(soil.organicCarbon, 1)} · N ${formatNumber(
        soil.nitrogen,
        2
      )} · CEC ${formatNumber(soil.cec, 1)}`
    : "Soil data unavailable.";

  const yearMonths = (yearPlan?.months || [])
    .map(
      (m, i) =>
        `<h3>${i + 1}. ${esc(m.month)} ${esc(m.tamil)}</h3><p><b>Stage:</b> ${esc(m.stage)}</p><p>${esc(
          (m.activities || []).join("; ")
        )}</p><p><b>Irrigation:</b> ${esc(m.irrigation)}</p>`
    )
    .join("");

  const months = (plan?.four_month_plan || [])
    .map(
      (m, i) =>
        `<h3>Month ${i + 1}: ${esc(m.month)}</h3><p><b>Stage:</b> ${esc(m.stage)}</p><p>${esc(
          (m.activities || []).join("; ")
        )}</p><p><b>Irrigation:</b> ${esc(m.irrigation)}</p><p><b>Fertility:</b> ${esc(m.fertility)}</p>`
    )
    .join("");
  const pests = (plan?.pest_risks || []).map((p) => `<li>${esc(p.pest)} (${esc(p.risk)}) — ${esc(p.reason)}</li>`).join("");
  const diseases = (plan?.disease_risks || [])
    .map((p) => `<li>${esc(p.disease)} (${esc(p.risk)}) — ${esc(p.reason)}</li>`)
    .join("");
  const actions = (plan?.farmer_actions || []).map((a) => `<li>${esc(a)}</li>`).join("");

  return `<!doctype html><html><head><meta charset="utf-8"/><title>ECHO Field Report</title>
  <style>
    body{font-family:Georgia,serif;max-width:800px;margin:40px auto;color:#10261d;line-height:1.45}
    h1{margin:0} .sub{color:#245a43} .card{border:1px solid #dcece1;border-radius:12px;padding:16px;margin:16px 0}
    .muted{color:#54986f;font-size:13px}
  </style></head><body>
  <h1>ECHO</h1>
  <p class="sub">Smart Crop Intelligence for Indian Farmers</p>
  <div class="card">
    <h2>Field location</h2>
    <p>${esc(field)}</p>
    <p>Latitude ${formatCoord(gps.latitude)} · Longitude ${formatCoord(gps.longitude)} · Accuracy ${formatAccuracy(
      gps.accuracy
    )}</p>
    <p>Date ${esc(planningDate)} · Crop ${esc(crop)} · Land ${esc(landType || "—")} · Captured ${formatTime(gps.timestamp)}</p>
  </div>
  <div class="card"><h2>12-month Coimbatore calendar</h2><p>${esc(yearPlan?.cultureNote || "")}</p>${yearMonths || "<p>Unavailable.</p>"}</div>
  <div class="card"><h2>Bhuvan / NRSC</h2><p>Status: ${esc(sources.bhuvan?.status)} · ${esc(
    sources.bhuvan?.message
  )}</p><p>${esc(bhuvan?.landUse || "Unavailable")} / ${esc(bhuvan?.landCover || "")}</p></div>
  <div class="card"><h2>Soil (SoilGrids)</h2><p>${esc(soilRows)}</p></div>
  <div class="card"><h2>Weather (Open-Meteo)</h2><p>${esc(
    weather?.current
      ? `${weather.current.condition}, ${formatNumber(weather.current.temperature, 1, "°C")}`
      : "Weather unavailable"
  )}</p></div>
  <div class="card"><h2>Risk indicators</h2><p>Water stress ${esc(risks?.waterStress?.level)} · Disease ${esc(
    risks?.diseaseFavorability?.level
  )} · Pest ${esc(risks?.pestFavorability?.level)}</p><p class="muted">${esc(risks?.disclaimer || "")}</p></div>
  <div class="card"><h2>4-month crop plan</h2>${months || "<p>AI plan unavailable.</p>"}</div>
  <div class="card"><h2>Pest monitoring</h2><ul>${pests || "<li>See crop profile.</li>"}</ul></div>
  <div class="card"><h2>Disease monitoring</h2><ul>${diseases || "<li>See crop profile.</li>"}</ul></div>
  <div class="card"><h2>Farmer actions</h2><ul>${actions || "<li>Verify recommendations with local officers.</li>"}</ul></div>
  <div class="card"><h2>Data sources</h2>
    <p>Bhuvan NRSC/ISRO · SoilGrids ISRIC · Weather Open-Meteo · AI Google Gemini</p>
  </div>
  <p class="muted">${esc(t.disclaimer)}</p>
  <p class="muted">${esc(t.aiDisclaimer)}</p>
  </body></html>`;
}

export default function FieldReport({ t, onDownload, onPrint }) {
  return (
    <section id="report" className="echo-card p-5">
      <p className="echo-label">Farmer report</p>
      <p className="mt-2 text-sm text-forest-700">Export a printable HTML report for SIH / field discussion.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={onDownload} className="rounded-full bg-forest-700 px-4 py-2 text-sm font-semibold text-white">
          {t.downloadReport}
        </button>
        <button type="button" onClick={onPrint} className="rounded-full border border-forest-200 px-4 py-2 text-sm font-semibold text-forest-800">
          {t.printPdf}
        </button>
      </div>
    </section>
  );
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
