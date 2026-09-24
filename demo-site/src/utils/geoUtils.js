export function isValidLatitude(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= -90 && n <= 90;
}

export function isValidLongitude(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= -180 && n <= 180;
}

export function isValidCoordinate(lat, lon) {
  return isValidLatitude(lat) && isValidLongitude(lon);
}

export function toNumber(value, fallback = null) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Small WKT polygon around a point for AOI-style APIs (degrees). */
export function pointToWktPolygon(lat, lon, delta = 0.002) {
  const minLon = lon - delta;
  const maxLon = lon + delta;
  const minLat = lat - delta;
  const maxLat = lat + delta;
  return `POLYGON((${minLon} ${minLat},${maxLon} ${minLat},${maxLon} ${maxLat},${minLon} ${maxLat},${minLon} ${minLat}))`;
}

export async function reverseGeocodeLabel(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lon)}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.display_name || null;
  } catch {
    return null;
  }
}
