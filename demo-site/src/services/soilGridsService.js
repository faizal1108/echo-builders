import { DEMO_SOIL } from "../data/demoData";
import { fetchWithTimeout, httpErrorMessage } from "../utils/apiClient";
import { isValidCoordinate } from "../utils/geoUtils";

const PROPERTIES = ["phh2o", "clay", "sand", "silt", "soc", "nitrogen", "cec"];
const DEPTHS = ["0-5cm", "5-15cm"];

function soilgridsUrl() {
  if (import.meta.env.DEV) return "/api/soilgrids";
  return "https://rest.isric.org/soilgrids/v2.0/properties/query";
}

export async function getSoilData(latitude, longitude, { allowDemoFallback = false } = {}) {
  const fetchedAt = new Date().toISOString();

  if (!isValidCoordinate(latitude, longitude)) {
    return {
      status: "error",
      mode: "error",
      message: "Unable to retrieve soil information. Coordinates are invalid.",
      data: null,
      fetchedAt,
    };
  }

  const candidates = nearbyPoints(Number(latitude), Number(longitude));
  let lastError = "Unable to retrieve soil information. Please try again later.";
  let lastStatus;

  for (const point of candidates) {
    try {
      const result = await fetchSoilAt(point.lat, point.lon);
      if (result.ok && hasSoilValues(result.data)) {
        const shifted = point.lat !== Number(latitude) || point.lon !== Number(longitude);
        return {
          status: "live",
          mode: "live",
          message: shifted
            ? "Live SoilGrids estimate received from a nearby mapped point (this exact coordinate had no soil pixel)."
            : "Live SoilGrids estimate received.",
          httpStatus: 200,
          data: result.data,
          fetchedAt,
        };
      }
      lastError =
        "SoilGrids has no modelled values at this exact point (often urban, water or rock). Try a nearby agricultural field.";
      lastStatus = 200;
    } catch (error) {
      lastError =
        error?.code === "TIMEOUT"
          ? "Unable to retrieve soil information. The request timed out."
          : error?.message || lastError;
      lastStatus = error?.httpStatus;
      if (error?.httpStatus && error.httpStatus !== 429 && error.httpStatus < 500) {
        break;
      }
    }
  }

  return fallbackOrError(allowDemoFallback, lastError, fetchedAt, lastStatus);
}

async function fetchSoilAt(latitude, longitude) {
  const params = new URLSearchParams();
  params.set("lat", String(latitude));
  params.set("lon", String(longitude));
  PROPERTIES.forEach((p) => params.append("property", p));
  DEPTHS.forEach((d) => params.append("depth", d));
  params.append("value", "mean");
  params.append("value", "Q0.5");

  const response = await fetchWithTimeout(`${soilgridsUrl()}?${params.toString()}`, {}, 45000);

  if (!response.ok) {
    const err = new Error(httpErrorMessage(response.status));
    err.httpStatus = response.status;
    err.code = response.status === 429 ? "RATE_LIMIT" : "HTTP";
    throw err;
  }

  const raw = await response.json();
  return { ok: true, data: parseSoilGridsResponse(raw) };
}

function nearbyPoints(lat, lon) {
  const offsets = [
    [0, 0],
    [0.03, 0],
    [-0.03, 0],
    [0, 0.03],
    [0, -0.03],
    [0.03, -0.03],
    [-0.03, -0.03],
    [0.03, 0.03],
    [-0.03, 0.03],
  ];
  return offsets.map(([dLat, dLon]) => ({ lat: lat + dLat, lon: lon + dLon }));
}

function hasSoilValues(data) {
  if (!data) return false;
  return ["ph", "clay", "sand", "silt", "organicCarbon", "nitrogen", "cec"].some((key) =>
    Number.isFinite(data[key])
  );
}

function fallbackOrError(allowDemoFallback, message, fetchedAt, httpStatus) {
  if (allowDemoFallback) {
    return {
      status: "demo",
      mode: "demo",
      message: `${message} Showing labelled demo soil values.`,
      httpStatus,
      data: { ...DEMO_SOIL },
      fetchedAt,
    };
  }
  return {
    status: "unavailable",
    mode: "unavailable",
    message,
    httpStatus,
    data: null,
    fetchedAt,
  };
}

/**
 * SoilGrids v2 returns layers with unit conversion factors (d_factor).
 * Prefer mean; fall back to Q0.5 when mean is null (urban/no-data pixels).
 */
export function parseSoilGridsResponse(raw) {
  const layers = raw?.properties?.layers || raw?.layers || [];
  const pick = (name) => {
    const layer = layers.find((l) => String(l.name).toLowerCase() === name);
    if (!layer) return null;
    const factor = Number(layer.unit_measure?.d_factor) || 1;
    const depths = layer.depths || [];
    const nums = depths
      .filter((d) => !d.label || DEPTHS.includes(d.label) || DEPTHS.includes(d.name))
      .map((d) => firstNumeric(d.values))
      .filter((v) => v !== null)
      .map((v) => v / factor);
    if (!nums.length) return null;
    return average(nums);
  };

  return {
    ph: pick("phh2o"),
    clay: pick("clay"),
    sand: pick("sand"),
    silt: pick("silt"),
    organicCarbon: pick("soc"),
    nitrogen: pick("nitrogen"),
    cec: pick("cec"),
    depths: "0–5 cm and 5–15 cm mean",
  };
}

function firstNumeric(values) {
  if (!values || typeof values !== "object") return null;
  for (const key of ["mean", "Q0.5", "Q0.05", "Q0.95"]) {
    const n = Number(values[key]);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function average(values) {
  return values.reduce((a, b) => a + b, 0) / values.length;
}
