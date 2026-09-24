import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PestReportCard from "../components/PestReportCard";
import { ct } from "../data/communityI18n";
import { detectPestDemo } from "../services/communityService";
import { formatIndiaDate } from "../../utils/indiaTime";

export default function ReportPage({ language }) {
  const c = ct(language);
  const nav = useNavigate();
  const [preview, setPreview] = useState(null);
  const [detection, setDetection] = useState(null);
  const [observed, setObserved] = useState("");

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">{c.report}</h1>
      <p className="text-sm text-forest-600">Frontend demo: YOLO runs in your local Python project. Here we use a detection placeholder until a backend is connected.</p>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => setPreview(reader.result);
          reader.readAsDataURL(file);
          setDetection(await detectPestDemo(file));
        }}
      />
      {preview && <img src={preview} alt="upload" className="max-h-56 rounded-2xl object-contain" />}
      {detection && (
        <PestReportCard
          detection={{ ...detection, date: formatIndiaDate(new Date()) }}
          c={c}
          onConfirm={setObserved}
          onIncorrect={() => setDetection({ ...detection, note: "Marked incorrect by the farmer. Community can still discuss symptoms." })}
          onAsk={() =>
            nav("/community/ask", {
              state: {
                title: `Has anyone seen ${detection.label} on ${detection.cropGuess}?`,
                content: `Possible detection: ${detection.label} (${Math.round(detection.confidence * 100)}% demo confidence). Observed in field: ${observed || "not answered"}. ${c.verify}`,
                crop: detection.cropGuess,
                tags: [detection.cropGuess, "Pest", "PossibleDetection"],
                images: preview ? [preview] : [],
                aiDetection: detection,
                problem: "Pest",
                village: "Pollachi",
              },
            })
          }
        />
      )}
      {observed && <p className="text-sm">Field observation: {observed}</p>}
    </div>
  );
}
