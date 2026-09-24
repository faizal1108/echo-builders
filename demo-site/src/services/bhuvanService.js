import { DEMO_BHUVAN } from "../data/demoData";
import { fetchWithTimeout, httpErrorMessage } from "../utils/apiClient";
import { isValidCoordinate, pointToWktPolygon } from "../utils/geoUtils";

/**
 * Bhuvan / NRSC adapter.
 *
 * Official catalog: https://bhuvan-app1.nrsc.gov.in/api/
 * Documented themes include LULC 50K / 250K statistics (token required).
 *
 * This file does NOT invent an undocumented public endpoint.
 * If VITE_BHUVAN_API_URL (or Settings URL) is empty, status is NOT CONFIGURED.
 * Demo Mode returns labelled sample values and never claims they came from live Bhuvan.
 */

export function getBhuvanConfig(overrides = {}) {
  return {
    apiUrl: overrides.apiUrl ?? import.meta.env.VITE_BHUVAN_API_URL ?? "",
    token: overrides.token ?? import.meta.env.VITE_BHUVAN_API_TOKEN ?? "",
    demoMode:
      overrides.demoMode ??
      String(import.meta.env.VITE_BHUVAN_DEMO_MODE ?? "true").toLowerCase() === "true",
  };
}

export async function getBhuvanLandUse(latitude, longitude, options = {}) {
  return getBhuvanData(latitude, longitude, options);
}

export async function getBhuvanData(latitude, longitude, options = {}) {
  const fetchedAt = new Date().toISOString();
  const config = getBhuvanConfig(options);

  if (!isValidCoordinate(latitude, longitude)) {
    return {
      status: "error",
      mode: "error",
      message: "Invalid coordinates for Bhuvan lookup.",
      data: null,
      fetchedAt,
      officialCatalog: "https://bhuvan-app1.nrsc.gov.in/api/",
    };
  }

  const url = String(config.apiUrl || "").trim();
  const token = String(config.token || "").trim();

  if (!url || !token || isCatalogOnlyUrl(url)) {
    if (config.demoMode) {
      return {
        status: "demo",
        mode: "demo",
        message: "Bhuvan connection requires API configuration. Showing labelled demo land-use values.",
        data: { ...DEMO_BHUVAN },
        fetchedAt,
        officialCatalog: "https://bhuvan-app1.nrsc.gov.in/api/",
      };
    }
    return {
      status: "not_configured",
      mode: "not_configured",
      message: "Bhuvan API endpoint not configured. Enter the official URL and token in Settings.",
      data: null,
      fetchedAt,
      officialCatalog: "https://bhuvan-app1.nrsc.gov.in/api/",
    };
  }

  try {
    const polygon = pointToWktPolygon(Number(latitude), Number(longitude));
    const payload = {
      latitude: Number(latitude),
      longitude: Number(longitude),
      lat: Number(latitude),
      lon: Number(longitude),
      polygon,
      token,
      option: "json",
    };

    const response = await fetchWithTimeout(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
      20000
    );

    if (!response.ok) {
      const msg = httpErrorMessage(response.status);
      if (config.demoMode) {
        return {
          status: "demo",
          mode: "demo",
          message: `Bhuvan request failed (${msg}). Demo land-use shown instead.`,
          httpStatus: response.status,
          data: { ...DEMO_BHUVAN },
          fetchedAt,
          officialCatalog: "https://bhuvan-app1.nrsc.gov.in/api/",
        };
      }
      return {
        status: "error",
        mode: "error",
        message: `Bhuvan endpoint is not configured or the request failed (${msg}).`,
        httpStatus: response.status,
        data: null,
        fetchedAt,
        officialCatalog: "https://bhuvan-app1.nrsc.gov.in/api/",
      };
    }

    const raw = await response.json().catch(() => null);
    const parsed = parseBhuvanResponse(raw);
    return {
      status: "live",
      mode: "live",
      message: "Live Bhuvan response received.",
      httpStatus: response.status,
      data: parsed,
      rawHint: typeof raw === "object" ? Object.keys(raw || {}).slice(0, 8) : [],
      fetchedAt,
      officialCatalog: "https://bhuvan-app1.nrsc.gov.in/api/",
    };
  } catch (error) {
    const corsOrNetwork =
      error?.code === "TIMEOUT"
        ? "Bhuvan request timed out."
        : "Bhuvan request failed (network, CORS, or authentication). Browser apps often cannot call Bhuvan directly.";

    if (config.demoMode) {
      return {
        status: "demo",
        mode: "demo",
        message: `${corsOrNetwork} Showing labelled demo land-use values.`,
        data: { ...DEMO_BHUVAN },
        fetchedAt,
        officialCatalog: "https://bhuvan-app1.nrsc.gov.in/api/",
      };
    }
    return {
      status: "error",
      mode: "error",
      message: corsOrNetwork,
      data: null,
      fetchedAt,
      officialCatalog: "https://bhuvan-app1.nrsc.gov.in/api/",
    };
  }
}

export function parseBhuvanResponse(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      landUse: "Unavailable",
      landCover: "Unavailable",
      area: "Selected field",
      source: "Bhuvan / NRSC",
    };
  }
  const landUse =
    raw.landUse ||
    raw.land_use ||
    raw.lulc ||
    raw.class_name ||
    raw.LU_CODE ||
    firstClassName(raw) ||
    "See raw LULC statistics";
  const landCover = raw.landCover || raw.land_cover || raw.cover || landUse;
  return {
    landUse: String(landUse),
    landCover: String(landCover),
    area: raw.area || "Selected field",
    source: "Bhuvan / NRSC",
    attributes: summarizeObject(raw),
  };
}

function firstClassName(raw) {
  const stats = raw.statistics || raw.data || raw.result || raw.lulc_stats;
  if (Array.isArray(stats) && stats[0]) {
    return stats[0].class || stats[0].name || stats[0].lulc;
  }
  return null;
}

function summarizeObject(raw) {
  try {
    return JSON.stringify(raw).slice(0, 280);
  } catch {
    return "";
  }
}

/** The public catalog page is not a callable LULC endpoint. */
function isCatalogOnlyUrl(url) {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/\/$/, "").toLowerCase();
    if (parsed.hostname.includes("bhuvan") && (path === "/api" || path === "/api/index.php" || path === "")) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}
