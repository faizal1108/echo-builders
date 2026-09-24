import { useRef, useState } from "react";
import DetectionResult from "./DetectionResult";
import { SCAN_STEPS, analyzeCropImage } from "../services/growDetectionService";

export default function PestDetection({ onDetected }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [preview, setPreview] = useState(null);
  const [step, setStep] = useState(-1);
  const [result, setResult] = useState(null);

  async function run(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    setResult(null);
    for (let i = 0; i < SCAN_STEPS.length; i += 1) {
      setStep(i);
      await new Promise((r) => setTimeout(r, 700));
    }
    const next = await analyzeCropImage(file);
    setResult(next);
    setStep(-1);
    onDetected?.(next);
  }

  return (
    <section id="scan" className="space-y-4">
      <div>
        <p className="echo-label">Scan Your Crop</p>
        <h2 className="font-display text-3xl text-forest-900">See possible pests early</h2>
        <p className="mt-1 text-sm text-forest-600">Upload a leaf or canopy photo. Results are possible detections, not confirmed diagnoses.</p>
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          run(e.dataTransfer.files?.[0]);
        }}
        className={`flex min-h-[200px] w-full flex-col items-center justify-center rounded-[28px] border-2 border-dashed bg-white p-8 text-center shadow-card transition ${
          drag ? "border-forest-700 bg-forest-50" : "border-forest-200"
        }`}
      >
        <span className="text-4xl">📷</span>
        <p className="mt-3 font-semibold text-forest-900">Upload Crop Image</p>
        <p className="text-sm text-forest-600">Drag & Drop / Browse</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => run(e.target.files?.[0])}
        />
      </button>
      {step >= 0 && (
        <p className="rounded-2xl bg-forest-800 px-4 py-3 text-sm font-medium text-wheat-50">
          {SCAN_STEPS[step]}
        </p>
      )}
      <DetectionResult result={result} imageSrc={preview} />
    </section>
  );
}
