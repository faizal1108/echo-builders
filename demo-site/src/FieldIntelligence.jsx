import { useMemo, useState } from "react";
import Header from "./components/Header";
import Landing from "./components/Landing";
import GpsControl from "./components/GpsControl";
import FieldMap from "./components/FieldMap";
import CropSelector from "./components/CropSelector";
import SoilCard from "./components/SoilCard";
import WeatherCard from "./components/WeatherCard";
import RiskCard from "./components/RiskCard";
import CropPlan from "./components/CropPlan";
import MonthPlan from "./components/MonthPlan";
import PestRisk from "./components/PestRisk";
import DiseaseRisk from "./components/DiseaseRisk";
import DataSources from "./components/DataSources";
import ApiSettings from "./components/ApiSettings";
import LoadingSteps from "./components/LoadingSteps";
import FieldReport, { buildReportHtml } from "./components/FieldReport";
import { translations } from "./data/i18n";
import { DEMO_FIELD } from "./data/demoData";
import { cropProfiles } from "./data/cropProfiles";
import { buildCoimbatoreYearPlan, fourMonthsFrom } from "./data/cropCalendar";
import { getLandType } from "./data/landTypes";
import { getBhuvanData } from "./services/bhuvanService";
import { getSoilData } from "./services/soilGridsService";
import { getWeatherData } from "./services/weatherService";
import { generateCropPlan } from "./services/geminiService";
import { calculateRiskIndicators } from "./utils/riskEngine";
import { isValidCoordinate, reverseGeocodeLabel } from "./utils/geoUtils";
import { formatCoord } from "./utils/formatters";
import { formatIndiaDate, indiaDateISO } from "./utils/indiaTime";
import { CheckSquare, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const STORAGE = {
  gemini: "echo.geminiKey",
  bhuvanUrl: "echo.bhuvanUrl",
  bhuvanToken: "echo.bhuvanToken",
  demo: "echo.demoMode",
  lang: "echo.language",
};

function todayIso() {
  return indiaDateISO();
}

function loadSettings() {
  const envDemo = String(import.meta.env.VITE_BHUVAN_DEMO_MODE ?? "true").toLowerCase() === "true";
  return {
    geminiKey: (localStorage.getItem(STORAGE.gemini) || "").trim() || import.meta.env.VITE_GEMINI_API_KEY || "",
    bhuvanUrl: (localStorage.getItem(STORAGE.bhuvanUrl) || "").trim() || import.meta.env.VITE_BHUVAN_API_URL || "",
    bhuvanToken: (localStorage.getItem(STORAGE.bhuvanToken) || "").trim() || import.meta.env.VITE_BHUVAN_API_TOKEN || "",
    demoMode: localStorage.getItem(STORAGE.demo) != null ? localStorage.getItem(STORAGE.demo) === "true" : envDemo,
  };
}

export default function FieldIntelligence() {
  const [language, setLanguage] = useState(localStorage.getItem(STORAGE.lang) || "en");
  const t = translations[language] || translations.en;
  const [settings, setSettings] = useState(loadSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [view, setView] = useState("landing");

  const [latInput, setLatInput] = useState("");
  const [lonInput, setLonInput] = useState("");
  const [gps, setGps] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
    statusLabel: "Idle",
    error: null,
  });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [placeLabel, setPlaceLabel] = useState("");
  const [crop, setCrop] = useState("Chilli");
  const [landType, setLandType] = useState("punjai");
  const [tamilSummary, setTamilSummary] = useState(() => (localStorage.getItem(STORAGE.lang) || "en") === "ta");
  const [fieldContext, setFieldContext] = useState(null);
  const [generatingTamil, setGeneratingTamil] = useState(false);
  const [planningDate, setPlanningDate] = useState(todayIso());

  const [analyzing, setAnalyzing] = useState(false);
  const [step, setStep] = useState(-1);
  const [doneSteps, setDoneSteps] = useState([]);
  const [bhuvan, setBhuvan] = useState(null);
  const [soil, setSoil] = useState(null);
  const [weather, setWeather] = useState(null);
  const [risks, setRisks] = useState(null);
  const [plan, setPlan] = useState(null);
  const [reportReady, setReportReady] = useState(false);

  const lat = gps.latitude;
  const lon = gps.longitude;
  const profile = cropProfiles[crop] || cropProfiles.Other;
  const yearPlan = useMemo(() => buildCoimbatoreYearPlan(crop, landType), [crop, landType]);
  const landMeta = getLandType(landType);

  const sourceStatuses = useMemo(
    () => ({
      bhuvan: bhuvan?.status || "idle",
      soil: soil?.status || "idle",
      weather: weather?.status || "idle",
    }),
    [bhuvan, soil, weather]
  );

  function persistSettings(next) {
    setSettings(next);
    localStorage.setItem(STORAGE.gemini, next.geminiKey || "");
    localStorage.setItem(STORAGE.bhuvanUrl, next.bhuvanUrl || "");
    localStorage.setItem(STORAGE.bhuvanToken, next.bhuvanToken || "");
    localStorage.setItem(STORAGE.demo, String(next.demoMode));
  }

  function applyPoint(latitude, longitude, extra = {}) {
    const next = {
      latitude: Number(latitude),
      longitude: Number(longitude),
      accuracy: extra.accuracy ?? gps.accuracy,
      timestamp: extra.timestamp || new Date().toISOString(),
      statusLabel: extra.statusLabel || "Manual / map",
      error: extra.error ?? null,
    };
    setGps(next);
    setLatInput(String(next.latitude));
    setLonInput(String(next.longitude));
    reverseGeocodeLabel(next.latitude, next.longitude).then((label) => {
      if (label) setPlaceLabel(label);
    });
  }

  function requestGps() {
    setView("workspace");
    if (!navigator.geolocation) {
      setGps((g) => ({ ...g, statusLabel: "Unavailable", error: t.gpsDenied }));
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyPoint(pos.coords.latitude, pos.coords.longitude, {
          accuracy: pos.coords.accuracy,
          timestamp: new Date(pos.timestamp).toISOString(),
          statusLabel: "Captured",
          error: null,
        });
        setGpsLoading(false);
      },
      () => {
        setGps((g) => ({
          ...g,
          statusLabel: "Denied",
          error: t.gpsDenied,
        }));
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }

  function applyManualCoords() {
    if (!isValidCoordinate(latInput, lonInput)) return;
    applyPoint(latInput, lonInput, { statusLabel: "Manual entry", accuracy: gps.accuracy });
  }

  async function loadDemoField(andAnalyze = true) {
    setView("workspace");
    persistSettings({ ...settings, demoMode: true });
    setCrop(DEMO_FIELD.crop);
    setLandType("punjai");
    applyPoint(DEMO_FIELD.latitude, DEMO_FIELD.longitude, {
      accuracy: DEMO_FIELD.accuracy,
      timestamp: new Date().toISOString(),
      statusLabel: "Demo field",
      error: null,
    });
    setPlaceLabel(DEMO_FIELD.name);
    if (andAnalyze) {
      setTimeout(() => analyzeField(DEMO_FIELD.latitude, DEMO_FIELD.longitude, DEMO_FIELD.crop, true), 50);
    }
  }

  async function analyzeField(overrideLat, overrideLon, overrideCrop, forceDemo) {
    const useLat = overrideLat ?? Number(latInput || lat);
    const useLon = overrideLon ?? Number(lonInput || lon);
    const useCrop = overrideCrop || crop;
    const demo = forceDemo || settings.demoMode;

    if (!isValidCoordinate(useLat, useLon)) {
      setGps((g) => ({ ...g, error: "Enter a valid latitude and longitude, use GPS, or click the map." }));
      return;
    }

    applyPoint(useLat, useLon, { statusLabel: gps.statusLabel || "Selected", accuracy: gps.accuracy });
    setAnalyzing(true);
    setReportReady(false);
    setDoneSteps([0]);
    setStep(1);
    setBhuvan(null);
    setSoil(null);
    setWeather(null);
    setRisks(null);
    setPlan(null);

    const location = {
      latitude: Number(useLat),
      longitude: Number(useLon),
      accuracy: gps.accuracy,
      timestamp: gps.timestamp || new Date().toISOString(),
      label: placeLabel,
    };

    setStep(1);
    const bhuvanResult = await getBhuvanData(useLat, useLon, {
      apiUrl: settings.bhuvanUrl,
      token: settings.bhuvanToken,
      demoMode: demo,
    });
    setBhuvan(bhuvanResult);
    setDoneSteps((s) => [...s, 1]);

    setStep(2);
    const soilResult = await getSoilData(useLat, useLon, { allowDemoFallback: demo });
    setSoil(soilResult);
    setDoneSteps((s) => [...s, 2]);

    setStep(3);
    const weatherResult = await getWeatherData(useLat, useLon);
    setWeather(weatherResult);
    setDoneSteps((s) => [...s, 3]);

    setStep(4);
    const riskResult = calculateRiskIndicators({
      weather: weatherResult.data,
      soil: soilResult.data,
      landType,
    });
    setRisks(riskResult);
    setDoneSteps((s) => [...s, 4]);

    const ctx = {
      location,
      crop: useCrop,
      landType: {
        id: landType,
        name: landMeta.nameEn,
        nameTa: landMeta.nameTa,
        summary: landMeta.summary,
      },
      calendarPreview: fourMonthsFrom(buildCoimbatoreYearPlan(useCrop, landType), planningDate).map((m) => ({
        month: m.month,
        tamil: m.tamil,
        stage: m.stage,
        activities: m.activities,
      })),
      planningDate,
      soil: soilResult.data || "unavailable",
      weather: weatherResult.data || "unavailable",
      bhuvan: bhuvanResult.data || "unavailable",
      risks: riskResult,
    };
    setFieldContext(ctx);

    setStep(5);
    const geminiResult = await generateCropPlan(ctx, {
      apiKey: settings.geminiKey || import.meta.env.VITE_GEMINI_API_KEY,
      languageName: tamilSummary || language === "ta" ? "Tamil" : t.geminiLanguage,
    });
    const usedTamil = tamilSummary || language === "ta";
    setPlan({ ...geminiResult, advisoryLanguage: usedTamil ? "ta" : language });
    setPlan(geminiResult);
    setDoneSteps((s) => [...s, 5, 6]);
    setStep(6);
    setReportReady(true);
    setAnalyzing(false);
  }

  async function generateTamilSummary() {
    if (!fieldContext) {
      setTamilSummary(true);
      await analyzeField();
      return;
    }
    setTamilSummary(true);
    setGeneratingTamil(true);
    const geminiResult = await generateCropPlan(fieldContext, {
      apiKey: settings.geminiKey || import.meta.env.VITE_GEMINI_API_KEY,
      languageName: "Tamil",
    });
    setPlan({ ...geminiResult, advisoryLanguage: "ta" });
    setGeneratingTamil(false);
  }

  function openReport(printAfter) {
    const html = buildReportHtml({
      t,
      field: placeLabel || `${formatCoord(lat)}, ${formatCoord(lon)}`,
      crop,
      landType: landMeta.nameEn,
      yearPlan,
      planningDate,
      gps,
      bhuvan: bhuvan?.data,
      soil: soil?.data,
      weather: weather?.data,
      risks,
      plan: plan?.data,
      sources: { bhuvan, soil, weather, gemini: plan },
    });
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    if (printAfter) {
      const win = window.open(url, "_blank");
      if (win) win.addEventListener("load", () => win.print());
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = `ECHO-field-report-${planningDate}.html`;
    a.click();
  }

  const farmerActions = plan?.data?.farmer_actions?.length
    ? plan.data.farmer_actions
    : [
        "Walk the field twice a week and note pests on young leaves.",
        "Confirm soil pH and nutrients with a local soil test before major fertilizer changes.",
        "Consult the local agriculture officer / KVK before pesticide use; follow the product label.",
      ];

  return (
    <div className="min-h-screen">
      <Header
        t={t}
        language={language}
        onLanguage={(code) => {
          setLanguage(code);
          localStorage.setItem(STORAGE.lang, code);
          if (code === "ta") setTamilSummary(true);
        }}
        onOpenSettings={() => setSettingsOpen(true)}
        demoMode={settings.demoMode}
        onToggleDemo={(value) => persistSettings({ ...settings, demoMode: value })}
      />

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1 rounded-2xl border border-forest-100 bg-white/80 p-3 text-sm">
            {Object.entries(t.nav).map(([id, label]) => (
              <a key={id} href={`#${id === "location" ? "location" : id}`} className="block rounded-xl px-3 py-2 text-forest-800 hover:bg-forest-50">
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-6">
          {view === "landing" && (
            <>
              <Landing t={t} onGps={requestGps} onDemo={() => loadDemoField(false)} />
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/community" className="rounded-full bg-forest-700 px-4 py-2 text-sm font-semibold text-white">
                  Open ECHO Community
                </Link>
              </div>
            </>
          )}

          {view === "workspace" && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-3xl text-forest-900">Field workspace</h2>
                  <p className="text-sm text-forest-600">{placeLabel || "Select a field to begin"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => loadDemoField(true)}
                    className="inline-flex items-center gap-1 rounded-full border border-forest-200 bg-white px-4 py-2 text-sm font-semibold text-forest-800"
                  >
                    <Sparkles size={14} />
                    {t.loadDemoField}
                  </button>
                  <button
                    type="button"
                    onClick={() => analyzeField()}
                    disabled={analyzing}
                    className="rounded-full bg-forest-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {t.analyze}
                  </button>
                  <Link to="/community" className="rounded-full border border-forest-200 bg-white px-4 py-2 text-sm font-semibold text-forest-800">
                    Community
                  </Link>
                  <Link
                    to="/community/ask"
                    state={{ crop, village: placeLabel || "Coimbatore", title: `${crop} field question`, tags: [crop] }}
                    className="rounded-full border border-forest-200 bg-white px-4 py-2 text-sm font-semibold text-forest-800"
                  >
                    Ask Community
                  </Link>
                </div>
              </div>

              <GpsControl
                t={t}
                gps={gps}
                loading={gpsLoading}
                onUseGps={requestGps}
                lat={latInput}
                lon={lonInput}
                onLat={setLatInput}
                onLon={(v) => {
                  setLonInput(v);
                }}
              />
              <div className="flex justify-end">
                <button type="button" onClick={applyManualCoords} className="text-xs font-semibold text-forest-700 underline">
                  Apply typed coordinates
                </button>
              </div>

              <FieldMap
                t={t}
                lat={lat}
                lon={lon}
                accuracy={gps.accuracy}
                onSelect={(a, b) => applyPoint(a, b, { statusLabel: "Map click" })}
                sources={sourceStatuses}
              />

              <CropSelector
                t={t}
                crop={crop}
                onCrop={setCrop}
                date={planningDate}
                onDate={setPlanningDate}
                landType={landType}
                onLandType={setLandType}
                tamilSummary={tamilSummary}
                onTamilSummary={setTamilSummary}
              />

              <MonthPlan t={t} yearPlan={yearPlan} />

              {analyzing && <LoadingSteps active={step} done={doneSteps} />}

              {(bhuvan || soil || weather) && (
                <section id="overview" className="echo-card p-5">
                  <p className="echo-label">{t.fieldOverview}</p>
                  <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                    <p>Location: {placeLabel || "Selected field"}</p>
                    <p>
                      {t.latitude}: {formatCoord(lat)} · {t.longitude}: {formatCoord(lon)}
                    </p>
                    <p>Crop: {crop}</p>
                    <p>
                      {t.landType}: {landMeta.nameEn} ({landMeta.nameTa})
                    </p>
                    <p>Date (IST): {formatIndiaDate(planningDate)}</p>
                    <p>Bhuvan land-use: {bhuvan?.data?.landUse || bhuvan?.message || "—"}</p>
                    <p>GPS accuracy: {gps.accuracy != null ? `${Math.round(gps.accuracy)} m` : "—"}</p>
                  </div>
                </section>
              )}

              <SoilCard t={t} soilResult={soil} />
              <WeatherCard t={t} weatherResult={weather} />
              <RiskCard t={t} risks={risks} />
              <div id="plan">
              <CropPlan
                t={t}
                planResult={plan}
                tamilSummary={tamilSummary || plan?.advisoryLanguage === "ta"}
                onGenerateTamil={generateTamilSummary}
                generatingTamil={generatingTamil || analyzing}
              />
              </div>

              <div id="pests" className="grid gap-6 lg:grid-cols-2">
                <PestRisk t={t} crop={crop} items={plan?.data?.pest_risks} />
                <DiseaseRisk t={t} crop={crop} items={plan?.data?.disease_risks} />
              </div>
              <div className="echo-card p-4 text-sm">
                <p className="font-semibold text-forest-900">Share this field with ECHO Community</p>
                <p className="mt-1 text-forest-700">Possible pest notes from planning are not a confirmed diagnosis.</p>
                <Link
                  to="/community/report"
                  className="mt-3 inline-block rounded-full bg-forest-700 px-4 py-2 text-xs font-semibold text-white"
                >
                  Pest Detection → Ask Community
                </Link>
              </div>

              {reportReady && (
                <section className="echo-card p-5">
                  <p className="echo-label">{t.farmerActions}</p>
                  <ul className="mt-3 space-y-2 text-sm text-forest-800">
                    {farmerActions.map((action) => (
                      <li key={action} className="flex gap-2">
                        <CheckSquare size={16} className="mt-0.5 shrink-0 text-forest-600" />
                        {action}
                      </li>
                    ))}
                  </ul>
                  {plan?.data?.warnings?.length > 0 && (
                    <ul className="mt-4 list-disc pl-5 text-sm text-amber-900">
                      {plan.data.warnings.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  )}
                </section>
              )}

              <DataSources
                t={t}
                sources={{
                  bhuvan: bhuvan || { status: "idle", message: "Not fetched yet" },
                  soil: soil || { status: "idle", message: "Not fetched yet" },
                  weather: weather || { status: "idle", message: "Not fetched yet" },
                  gemini: plan || { status: "idle", message: "Not fetched yet" },
                }}
              />

              <FieldReport t={t} onDownload={() => openReport(false)} onPrint={() => openReport(true)} />

              <div className="rounded-2xl border border-wheat-200 bg-wheat-100/70 p-4 text-sm text-forest-800">
                <p>{t.disclaimer}</p>
                <p className="mt-2">{t.aiDisclaimer}</p>
                <p className="mt-2 text-xs">
                  Crop notes for {profile.name}: preferred pH {profile.soil.ph}. Irrigation: {profile.irrigation}
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      <ApiSettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSave={persistSettings}
      />
    </div>
  );
}
