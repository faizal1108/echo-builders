import { useState } from "react";
import { looksUnsafeAdvice } from "../services/communityService";
import PrivacyLocationSelector from "./PrivacyLocationSelector";
import LocationPickerMap from "./LocationPickerMap";
import { CROP_OPTIONS } from "../../data/cropProfiles";

const PROBLEMS = ["Pest", "Disease", "Weather", "Soil", "Irrigation", "Nutrient", "Other"];

export default function PostComposer({ c, initial, onSubmit, submitLabel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");
  const [crop, setCrop] = useState(initial?.crop || "Chilli");
  const [problem, setProblem] = useState(initial?.problem || "Pest");
  const [tags, setTags] = useState((initial?.tags || []).join(", "));
  const [village, setVillage] = useState(initial?.village || "Pollachi");
  const [district, setDistrict] = useState("Coimbatore");
  const [stateName, setStateName] = useState("Tamil Nadu");
  const [visibility, setVisibility] = useState("approximate");
  const [images, setImages] = useState(initial?.images || []);
  const [lat, setLat] = useState(initial?.lat || 10.66);
  const [lon, setLon] = useState(initial?.lon || 77.01);
  const unsafe = looksUnsafeAdvice(`${title} ${content}`);

  function onFiles(e) {
    const files = [...(e.target.files || [])];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setImages((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  }

  function useGps() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setLat(pos.coords.latitude);
      setLon(pos.coords.longitude);
    });
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          title,
          content,
          crop,
          category: problem === "Pest" ? "pests" : problem === "Disease" ? "diseases" : problem.toLowerCase(),
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          images,
          visibility,
          location: { village, district, state: stateName, lat: Number(lat), lon: Number(lon) },
          aiDetection: initial?.aiDetection || null,
          type: initial?.type || "question",
        });
      }}
    >
      <label className="block text-xs font-semibold">
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 w-full rounded-xl border border-forest-100 px-3 py-2 text-sm" />
      </label>
      <label className="block text-xs font-semibold">
        Description
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={5} className="mt-1 w-full rounded-xl border border-forest-100 px-3 py-2 text-sm" />
      </label>
      {unsafe && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-950">{c.unsafe}</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-semibold">
          Crop
          <select value={crop} onChange={(e) => setCrop(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2">
            {CROP_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold">
          Problem type
          <select value={problem} onChange={(e) => setProblem(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2">
            {PROBLEMS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-xs font-semibold">
        Upload images
        <input type="file" accept="image/*" multiple onChange={onFiles} className="mt-1 block" />
      </label>
      <div className="flex flex-wrap gap-2">
        {images.map((src) => (
          <img key={src.slice(0, 40)} src={src} alt="" className="h-20 rounded-xl object-cover" />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <input value={village} onChange={(e) => setVillage(e.target.value)} placeholder="Village" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="District" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="State" className="rounded-xl border px-3 py-2 text-sm" />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={useGps} className="rounded-full border px-3 py-1 text-xs font-semibold">
          Use GPS
        </button>
        <span className="text-xs text-forest-600">Tap the map to set a point. Public map always uses approximate / village-level location.</span>
      </div>
      <LocationPickerMap lat={lat} lon={lon} onPick={(nextLat, nextLon) => { setLat(nextLat); setLon(nextLon); }} />
      <PrivacyLocationSelector value={visibility} onChange={setVisibility} label={c.privacy} />
      <label className="block text-xs font-semibold">
        Tags
        <input value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
      </label>
      <button type="submit" className="rounded-full bg-forest-700 px-5 py-2.5 text-sm font-semibold text-white">
        {submitLabel || c.postQuestion}
      </button>
    </form>
  );
}
