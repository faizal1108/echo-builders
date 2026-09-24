import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { NEARBY_VILLAGES } from "../data/growDemo";

const icon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function NearbyCropTrends() {
  return (
    <section className="echo-card overflow-hidden">
      <div className="p-5">
        <p className="echo-label">What's Happening Around You?</p>
        <h2 className="font-display text-2xl">Nearby Crop Health</h2>
        <p className="mt-1 text-xs text-forest-500">Village-level reports only. Exact farm locations are never shown.</p>
        <ul className="mt-4 space-y-2 text-sm">
          {NEARBY_VILLAGES.map((v) => (
            <li key={v.id} className="flex justify-between rounded-xl bg-forest-50 px-3 py-2">
              <span>📍 {v.name}</span>
              <strong>{v.reports} reports</strong>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm">
          Most reported: <strong>Rice Leaf Roller</strong>
          <span className="ml-2 text-[10px] font-bold uppercase text-amber-800">Demo</span>
        </p>
      </div>
      <div className="h-52">
        <MapContainer key="nearby-grow-map" center={[11.02, 76.96]} zoom={10} className="h-full w-full" style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
          {NEARBY_VILLAGES.map((v) => (
            <Marker key={v.id} position={[v.lat, v.lon]} icon={icon}>
              <Popup>
                {v.name}: {v.reports} community reports (approximate)
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}
