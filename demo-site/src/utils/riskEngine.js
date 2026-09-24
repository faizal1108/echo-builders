/**
 * Deterministic, simplified field-risk heuristics.
 * These are NOT scientifically definitive and are labelled as preliminary.
 */

function avg(values) {
  const nums = values.filter((v) => Number.isFinite(v));
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function levelFromScore(score) {
  if (score == null) return { level: "UNAVAILABLE", score: null };
  if (score >= 0.66) return { level: "HIGH", score };
  if (score >= 0.33) return { level: "MEDIUM", score };
  return { level: "LOW", score };
}

export function calculateRiskIndicators({ weather, soil, landType } = {}) {
  const daily = weather?.daily || [];
  const humidity = avg(daily.map((d) => d.humidityMax));
  const rain = avg(daily.map((d) => d.precipitation));
  const tmax = avg(daily.map((d) => d.tempMax));
  const tmin = avg(daily.map((d) => d.tempMin));
  const temp = tmax != null && tmin != null ? (tmax + tmin) / 2 : weather?.current?.temperature ?? null;

  const hasWeather = humidity != null || rain != null || temp != null;

  // High humidity + rainfall → fungal disease favourability
  let diseaseScore = null;
  if (humidity != null || rain != null) {
    const h = humidity != null ? clamp01((humidity - 55) / 40) : 0.3;
    const r = rain != null ? clamp01(rain / 12) : 0.3;
    diseaseScore = 0.6 * h + 0.4 * r;
  }

  // High temperature + low rainfall → water stress
  let waterScore = null;
  if (temp != null || rain != null) {
    const heat = temp != null ? clamp01((temp - 28) / 12) : 0.3;
    const dry = rain != null ? clamp01(1 - rain / 8) : 0.3;
    waterScore = 0.55 * heat + 0.45 * dry;
  }

  // Warm + humid → insect/pest favourability
  let pestScore = null;
  if (humidity != null || temp != null) {
    const h = humidity != null ? clamp01((humidity - 50) / 40) : 0.3;
    const warmth = temp != null ? clamp01((temp - 22) / 14) : 0.3;
    pestScore = 0.5 * h + 0.5 * warmth;
  }

  const notes = [];
  if (landType === "punjai") {
    waterScore = waterScore == null ? 0.55 : Math.min(1, waterScore + 0.15);
    notes.push("Punjai (dry land) depends on rain. Water-stress risk is treated as higher than on nanjai.");
  }
  if (landType === "nanjai") {
    notes.push("Nanjai (wet land): watch drainage in the North-East monsoon as well as irrigation turns.");
  }

  const overallWeather = hasWeather
    ? levelFromScore(avg([diseaseScore, waterScore, pestScore].filter((s) => s != null)))
    : { level: "UNAVAILABLE", score: null };

  if (humidity != null && rain != null && humidity >= 75 && rain >= 6) {
    notes.push("High humidity with rainfall can favour fungal diseases.");
  }
  if (temp != null && rain != null && temp >= 32 && rain < 3) {
    notes.push("Warm and relatively dry conditions can increase water stress.");
  }
  if (humidity != null && temp != null && humidity >= 70 && temp >= 26) {
    notes.push("Warm humid weather can increase insect activity.");
  }
  if (soil?.ph != null && (soil.ph < 5.5 || soil.ph > 8.2)) {
    notes.push("Soil pH is outside a common comfortable range for many field crops.");
  }

  return {
    weatherRisk: overallWeather,
    waterStress: levelFromScore(waterScore),
    diseaseFavorability: levelFromScore(diseaseScore),
    pestFavorability: levelFromScore(pestScore),
    notes,
    disclaimer:
      "Preliminary risk indicator based on simple humidity, rainfall and temperature rules. Not a scientific diagnosis.",
  };
}

function clamp01(n) {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}
