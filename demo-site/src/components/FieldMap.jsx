import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import StatusBadge from "./StatusBadge";
import { formatAccuracy, formatCoord } from "../utils/formatters";

const fieldIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function toLatLng(lat, lon) {
  const latitude = Number(lat);
  const longitude = Number(lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return { lat: 11.0168, lon: 76.9558, valid: false };
  }
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return { lat: 11.0168, lon: 76.9558, valid: false };
  }
  return { lat: latitude, lon: longitude, valid: true };
}

function MapSync({ lat, lon, valid }) {
  const map = useMap();
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        map.invalidateSize();
        if (valid) {
          map.setView([lat, lon], Math.max(map.getZoom() || 5, 13), { animate: false });
        }
      } catch {
        /* map may already be removed */
      }
    }, 80);
    return () => window.clearTimeout(id);
  }, [lat, lon, valid, map]);
  return null;
}

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      if (!e?.latlng || typeof onSelect !== "function") return;
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function FieldMap({ t, lat, lon, accuracy, onSelect, sources = {} }) {
  const [mounted, setMounted] = useState(false);
  const point = useMemo(() => toLatLng(lat, lon), [lat, lon]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="map" className="echo-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3">
        <div>
          <p className="echo-label">{t.selectedField}</p>
          <p className="text-sm text-forest-700">OpenStreetMap · Leaflet</p>
        </div>
      </div>
      <div className="relative h-[320px] w-full md:h-[420px]">
        {mounted ? (
          <MapContainer
            key="echo-field-map"
            center={[point.lat, point.lon]}
            zoom={point.valid ? 14 : 7}
            className="h-full w-full"
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapSync lat={point.lat} lon={point.lon} valid={point.valid} />
            <ClickHandler onSelect={onSelect} />
            {point.valid && (
              <Marker
                position={[point.lat, point.lon]}
                icon={fieldIcon}
                draggable
                eventHandlers={{
                  dragend: (e) => {
                    try {
                      const p = e.target.getLatLng();
                      onSelect(p.lat, p.lng);
                    } catch {
                      /* ignore */
                    }
                  },
                }}
              >
                <Popup>
                  <strong>{t.selectedField}</strong>
                  <br />
                  {formatCoord(point.lat)}, {formatCoord(point.lon)}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        ) : (
          <div className="flex h-full items-center justify-center bg-forest-50 text-sm text-forest-600">Loading map…</div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 border-t border-forest-50 px-5 py-4 text-xs md:grid-cols-3 lg:grid-cols-6">
        <Info label={t.latitude} value={formatCoord(lat)} />
        <Info label={t.longitude} value={formatCoord(lon)} />
        <Info label={t.accuracy} value={formatAccuracy(accuracy)} />
        <Info label="Bhuvan" value={<StatusBadge status={sources.bhuvan} />} />
        <Info label="SoilGrids" value={<StatusBadge status={sources.soil} />} />
        <Info label="Weather" value={<StatusBadge status={sources.weather} />} />
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-forest-500">{label}</p>
      <div className="mt-1 font-medium text-forest-900">{value}</div>
    </div>
  );
}
