import { cropProfiles } from "../data/cropProfiles";
import { fetchWithTimeout, httpErrorMessage } from "../utils/apiClient";
import { monthLabel } from "../utils/formatters";

const GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
];

function geminiEndpoint(model) {
  const path = `/v1beta/models/${model}:generateContent`;
  if (import.meta.env.DEV) return `/api/gemini${path}`;
  return `https://generativelanguage.googleapis.com${path}`;
}

export async function generateCropPlan(context, { apiKey, languageName = "English" } = {}) {
  const fetchedAt = new Date().toISOString();
  const key = String(apiKey || import.meta.env.VITE_GEMINI_API_KEY || "").trim();

  if (!key) {
    return {
      status: "not_configured",
      mode: "not_configured",
      message: "AI advisory unavailable. Add a Gemini API key in Settings. Field data was still collected.",
      data: null,
      fetchedAt,
    };
  }

  const payload = buildPrompt(context, languageName);
  let lastError = "AI advisory unavailable.";

  for (const model of GEMINI_MODELS) {
    const attempt = await callGemini(model, key, payload);
    if (attempt.ok) {
      const parsed = parseGeminiJson(attempt.text);
      if (parsed.ok) {
        return {
          status: "live",
          mode: "live",
          message: `Gemini advisory generated (${model}).`,
          data: parsed.value,
          fetchedAt,
          model,
          httpStatus: 200,
        };
      }
      return {
        status: "partial",
        mode: "live",
        message: "Gemini returned unstructured text. Showing extracted advisory.",
        data: { rawText: parsed.text, ...emptyPlan() },
        fetchedAt,
        model,
        httpStatus: 200,
      };
    }
    lastError = attempt.message;
    if (attempt.httpStatus === 401 || attempt.httpStatus === 403) {
      return {
        status: "error",
        mode: "error",
        message: lastError,
        data: null,
        fetchedAt,
        httpStatus: attempt.httpStatus,
      };
    }
  }

  return { status: "error", mode: "error", message: lastError, data: null, fetchedAt };
}

async function callGemini(model, key, payload) {
  const url = geminiEndpoint(model);
  const makeBody = (withMime) => ({
    contents: [{ role: "user", parts: [{ text: payload }] }],
    generationConfig: withMime
      ? { temperature: 0.4, responseMimeType: "application/json" }
      : { temperature: 0.4 },
  });

  for (const withMime of [true, false]) {
    try {
      let response = await fetchWithTimeout(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": key,
          },
          body: JSON.stringify(makeBody(withMime)),
        },
        60000
      );

      if (response.status === 503) {
        await wait(1200);
        response = await fetchWithTimeout(
          url,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": key,
            },
            body: JSON.stringify(makeBody(withMime)),
          },
          60000
        );
      }

      if (response.ok) {
        const raw = await response.json();
        const text = extractText(raw);
        if (text) return { ok: true, text, httpStatus: 200 };
        return { ok: false, httpStatus: 200, message: "AI advisory unavailable. Gemini returned an empty response." };
      }

      const detail = await readGeminiError(response);
      if (response.status === 400 && withMime) continue;
      if (response.status === 404) {
        return { ok: false, httpStatus: 404, message: detail };
      }
      return {
        ok: false,
        httpStatus: response.status,
        message: `AI advisory unavailable. ${detail} Field data was still collected successfully.`,
      };
    } catch (error) {
      return {
        ok: false,
        message:
          error?.code === "TIMEOUT"
            ? "AI advisory unavailable. The request timed out. Field data was still collected successfully."
            : "AI advisory unavailable. The field data was still collected successfully.",
      };
    }
  }
  return { ok: false, message: "AI advisory unavailable." };
}

async function readGeminiError(response) {
  try {
    const body = await response.json();
    const msg = body?.error?.message;
    if (msg) return msg;
  } catch {
    /* ignore */
  }
  return httpErrorMessage(response.status);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function languageBlock(languageName) {
  const isTamil = String(languageName).toLowerCase().includes("tamil") || languageName === "ta";
  if (isTamil) {
    return `OUTPUT LANGUAGE — MANDATORY:
The farmer selected Tamil. Write ALL farmer-facing JSON string values in Tamil script (தமிழ்).
Do not write the summary, reasons, activities, irrigation, fertility, pest/disease notes, farmer_actions or warnings in English.
JSON keys stay in English.
Keep numbers, units (°C, mm, %, pH), coordinates and variety codes unchanged.
Use நஞ்சை for wet land and புஞ்சை for dry land.
Month labels like: "ஜூலை (ஆடி)".
crop_suitability.status use Tamil: "ஏற்றது" or "ஓரளவு ஏற்றது" or "கவனம் தேவை".
field_summary must be 4–8 sentences of spoken Kongu / simple Tamil that a farmer can understand.

Example field_summary style (do not copy facts):
"இந்தப் புஞ்சை நிலத்தில் மிளகாய் பயிருக்கு மண் pH ஏற்ற அளவில் உள்ளது. அடுத்த 16 நாள் மழையை வைத்து நீர் மேலாண்மை செய்யவும்."`;
  }
  return `Generate the farmer advisory in ${languageName}. Keep numeric measurements, units, coordinates and proper nouns unchanged.`;
}

function buildPrompt(context, languageName) {
  const crop = cropProfiles[context.crop] || cropProfiles.Other;
  const compact = {
    location: {
      latitude: context.location?.latitude,
      longitude: context.location?.longitude,
      label: context.location?.label || null,
    },
    crop: context.crop,
    landType: context.landType || null,
    region: "Coimbatore / Kongu Nadu",
    konguCalendarPreview: context.calendarPreview || null,
    cropProfile: {
      pests: crop.pests,
      diseases: crop.diseases,
      stages: crop.growthStages,
      soilPreference: crop.soil,
    },
    planningDate: context.planningDate,
    soil: context.soil || "unavailable",
    weather: summarizeWeather(context.weather),
    bhuvan: context.bhuvan || "unavailable",
    preliminaryRisks: context.risks || null,
    forecastHorizonDays: context.weather?.forecastHorizonDays || 0,
  };

  return `You are an agricultural decision-support assistant for Indian farmers.

Use the supplied location, soil, land-use and weather information.

Do not invent measurements.

If information is unavailable, explicitly state that it is unavailable.

Separate measured/API-derived facts from recommendations.

Provide practical, conservative agricultural guidance.

Do not provide unsafe pesticide dosage instructions.

For pesticide or chemical control, recommend consulting local agricultural officers and following the product label.

Generate a crop planning outlook for the next four months.

The weather forecast should only be used for the available forecast period. All weather dates and observation times are Indian Standard Time (Asia/Kolkata, UTC+05:30). Do not shift them to UTC or US dates.

For months beyond the forecast horizon, use seasonal/agronomic reasoning rather than pretending that exact weather is known.

The farm is in the Coimbatore / Kongu Nadu context.

Honour the farmer's land type:
- Nanjai = wet / irrigated land
- Punjai = dry / rainfed land

Do not recommend paddy or sugarcane on punjai unless the farmer has assured irrigation.
Do not recommend leaving nanjai undrained during the Aippasi–Karthigai North-East monsoon.

Use Tamil month names together with English months in four_month_plan.month (example: "July (Aadi / ஆடி)").

Align activities with the supplied Kongu calendar preview, then adapt using soil and weather facts.

${languageBlock(languageName)}

Return STRICT JSON only, matching this schema:
{
  "field_summary": "...",
  "crop_suitability": { "status": "Suitable | Moderately Suitable | Needs Attention", "reason": "..." },
  "soil_assessment": { "pH": "...", "organic_carbon": "...", "nitrogen": "...", "texture": "...", "summary": "..." },
  "weather_assessment": { "temperature": "...", "rainfall": "...", "humidity": "...", "risk_summary": "..." },
  "four_month_plan": [
    {
      "month": "...",
      "stage": "...",
      "activities": [],
      "irrigation": "...",
      "fertility": "...",
      "pest_monitoring": [],
      "disease_monitoring": [],
      "weather_consideration": "..."
    }
  ],
  "pest_risks": [
    { "pest": "...", "risk": "Low | Medium | High", "reason": "...", "monitoring_action": "..." }
  ],
  "disease_risks": [
    { "disease": "...", "risk": "Low | Medium | High", "reason": "...", "monitoring_action": "..." }
  ],
  "irrigation_guidance": "...",
  "farmer_actions": [],
  "warnings": []
}

four_month_plan must contain exactly four objects. Suggested month labels if needed: ${[0, 1, 2, 3]
    .map((i) => monthLabel(context.planningDate || new Date(), i))
    .join(", ")}.

Field context JSON:
${JSON.stringify(compact)}`;
}

function summarizeWeather(weather) {
  if (!weather) return "unavailable";
  return {
    timezone: weather.timezone || "Asia/Kolkata",
    clock: "Indian Standard Time (IST, UTC+05:30)",
    current: {
      timeIST: weather.current?.timeLabel || weather.current?.time,
      temperature: weather.current?.temperature,
      humidity: weather.current?.humidity,
      rain: weather.current?.rain ?? weather.current?.precipitation,
      wind: weather.current?.wind,
      condition: weather.current?.condition,
    },
    next7days: (weather.daily || []).slice(0, 7).map((d) => ({
      date: d.date,
      dateIST: d.dateLabel || d.date,
      tempMax: d.tempMax,
      tempMin: d.tempMin,
      rain: d.precipitation,
      humidityMax: d.humidityMax,
    })),
    forecastHorizonDays: weather.forecastHorizonDays,
    note: weather.note,
  };
}

function extractText(raw) {
  const parts = raw?.candidates?.[0]?.content?.parts || [];
  return parts.map((p) => p.text || "").join("\n").trim();
}

export function parseGeminiJson(text) {
  if (!text) return { ok: false, text: "", value: emptyPlan() };

  const attempts = [];
  attempts.push(text);
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) attempts.push(fence[1]);
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first >= 0 && last > first) attempts.push(text.slice(first, last + 1));

  for (const candidate of attempts) {
    try {
      const value = JSON.parse(candidate);
      if (value && typeof value === "object") return { ok: true, value, text };
    } catch {
      /* try next */
    }
  }
  return { ok: false, text, value: { ...emptyPlan(), rawText: text } };
}

function emptyPlan() {
  return {
    field_summary: "",
    crop_suitability: { status: "", reason: "" },
    soil_assessment: {},
    weather_assessment: {},
    four_month_plan: [],
    pest_risks: [],
    disease_risks: [],
    irrigation_guidance: "",
    farmer_actions: [],
    warnings: [],
  };
}
