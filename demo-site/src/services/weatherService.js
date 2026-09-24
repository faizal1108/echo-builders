import { fetchWithTimeout, httpErrorMessage } from "../utils/apiClient";
import { isValidCoordinate } from "../utils/geoUtils";
import { formatIndiaDate, formatIndiaDateTime, indiaDateISO } from "../utils/indiaTime";

const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

const WMO = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Slight snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
};

export async function getWeatherData(latitude, longitude) {
  const fetchedAt = new Date().toISOString();

  if (!isValidCoordinate(latitude, longitude)) {
    return {
      status: "error",
      mode: "error",
      message: "Weather service unavailable. Coordinates are invalid.",
      data: null,
      fetchedAt,
    };
  }

  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m",
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,relative_humidity_2m_max,wind_speed_10m_max",
    forecast_days: "16",
    timezone: "Asia/Kolkata",
    timeformat: "iso8601",
  });

  try {
    const response = await fetchWithTimeout(`${WEATHER_URL}?${params.toString()}`, {}, 20000);
    if (!response.ok) {
      return {
        status: "unavailable",
        mode: "unavailable",
        httpStatus: response.status,
        message: `Weather service unavailable. ${httpErrorMessage(response.status)}`,
        data: null,
        fetchedAt,
      };
    }
    const raw = await response.json();
    return {
      status: "live",
      mode: "live",
      httpStatus: response.status,
      message: "Live Open-Meteo forecast received (~16 days).",
      data: normalizeWeather(raw),
      fetchedAt,
    };
  } catch (error) {
    return {
      status: "unavailable",
      mode: "unavailable",
      message:
        error?.code === "TIMEOUT"
          ? "Weather service unavailable. The request timed out."
          : "Weather service unavailable.",
      data: null,
      fetchedAt,
    };
  }
}

export function normalizeWeather(raw) {
  const current = raw?.current || {};
  const dailyRaw = raw?.daily || {};
  const times = dailyRaw.time || [];
  const daily = times.map((date, i) => ({
    date,
    dateLabel: formatIndiaDate(date),
    tempMax: dailyRaw.temperature_2m_max?.[i] ?? null,
    tempMin: dailyRaw.temperature_2m_min?.[i] ?? null,
    precipitation: dailyRaw.precipitation_sum?.[i] ?? null,
    rain: dailyRaw.rain_sum?.[i] ?? null,
    humidityMax: dailyRaw.relative_humidity_2m_max?.[i] ?? null,
    windMax: dailyRaw.wind_speed_10m_max?.[i] ?? null,
  }));

  const observed = current.time || null;

  return {
    timezone: raw?.timezone || "Asia/Kolkata",
    utcOffsetSeconds: raw?.utc_offset_seconds ?? 19800,
    current: {
      temperature: current.temperature_2m ?? null,
      humidity: current.relative_humidity_2m ?? null,
      precipitation: current.precipitation ?? null,
      rain: current.rain ?? null,
      wind: current.wind_speed_10m ?? null,
      weatherCode: current.weather_code ?? null,
      condition: WMO[current.weather_code] || "Observed conditions",
      time: observed,
      timeLabel: observed ? formatIndiaDateTime(observed) : formatIndiaDateTime(new Date()),
    },
    daily,
    forecastHorizonDays: daily.length,
    today: indiaDateISO(),
    note: "Open-Meteo daily values use Indian Standard Time (Asia/Kolkata, UTC+05:30). This is a short-range forecast, not a 3–4 month prediction.",
  };
}
