import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Link } from "react-router-dom";
import { formatIndiaDate } from "../../utils/indiaTime";

const icon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const KIND = {
  pest: "🐛 Pest report",
  disease: "🦠 Disease report",
  weather: "🌧 Weather issue",
  water: "💧 Water issue",
};

export default function CommunityMap({ reports }) {
  const center = [10.99, 76.96];
  return (
    <div className="h-[420px] overflow-hidden rounded-2xl border border-forest-100">
      <MapContainer center={center} zoom={9} className="h-full w-full" style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
        {reports.filter((r) => r.lat && r.lon).map((r) => (
          <Marker key={r.id} position={[r.lat, r.lon]} icon={icon}>
            <Popup>
              <p className="font-semibold">{KIND[r.kind] || r.kind}</p>
              <p>Crop: {r.crop}</p>
              <p>Problem: {r.problem}</p>
              <p>Reported: {formatIndiaDate(r.createdAt)}</p>
              <p>Location: Approximate · {r.village}</p>
              <Link to={`/community/post/${r.id}`}>Open post</Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
