import { useEffect, useMemo, useRef, useState } from "react";
import GrowHero from "./components/GrowHero";
import CropPlantAnimation from "./components/CropPlantAnimation";
import LifecycleTimeline from "./components/LifecycleTimeline";
import CropInfoCard from "./components/CropInfoCard";
import CropHealthCard from "./components/CropHealthCard";
import CropHealthTimeline from "./components/CropHealthTimeline";
import PestDetection from "./components/PestDetection";
import NearbyCropTrends from "./components/NearbyCropTrends";
import GrowWeatherCard from "./components/GrowWeatherCard";
import OfflineMode from "./components/OfflineMode";
import FarmerCropCard from "./components/FarmerCropCard";
import DemoMode from "./components/DemoMode";
import AccuracySection from "./components/AccuracySection";
import JourneyStory from "./components/JourneyStory";
import DetectionResult from "./components/DetectionResult";
import {
  DEFAULT_CROP,
  DEMO_DETECTION,
  FARMER_CROPS,
  FOLLOWUP_DETECTION,
  HEALTH_EVENTS,
  LIFECYCLE_STAGES,
} from "./data/growDemo";
import { getWeatherData } from "../services/weatherService";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function CropLifecycle() {
  const [stageIndex, setStageIndex] = useState(4);
  const [crop, setCrop] = useState(DEFAULT_CROP);
  const [activeField, setActiveField] = useState("paddy-01");
  const [playing, setPlaying] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  const [pestActive, setPestActive] = useState(false);
  const [demoResult, setDemoResult] = useState(null);
  const [timelineCap, setTimelineCap] = useState(HEALTH_EVENTS.length - 1);
  const [weather, setWeather] = useState(null);
  const [reduced, setReduced] = useState(false);
  const cancelRef = useRef(false);

  const stage = LIFECYCLE_STAGES[stageIndex];

  useEffect(() => {
    setReduced(prefersReducedMotion());
    getWeatherData(11.02, 76.96).then(setWeather);
  }, []);

  useEffect(() => {
    if (!playing) return undefined;
    if (reduced) {
      setStageIndex(7);
      setPlaying(false);
      return undefined;
    }
    const id = window.setInterval(() => {
      setStageIndex((i) => {
        if (i >= 7) {
          setPlaying(false);
          return 7;
        }
        return i + 1;
      });
    }, 1900);
    return () => window.clearInterval(id);
  }, [playing, reduced]);

  const wait = (ms) =>
    new Promise((resolve) => {
      window.setTimeout(resolve, reduced ? 80 : ms);
    });

  async function runDemo() {
    cancelRef.current = false;
    setDemoRunning(true);
    setPlaying(false);
    setPestActive(false);
    setDemoResult(null);
    setCrop(DEFAULT_CROP);
    setActiveField("paddy-01");
    setTimelineCap(0);
    setStageIndex(0);
    document.getElementById("journey")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });

    for (let i = 0; i <= 4; i += 1) {
      if (cancelRef.current) break;
      setStageIndex(i);
      setTimelineCap(Math.min(2, i));
      await wait(1600);
    }
    if (!cancelRef.current) {
      setPestActive(true);
      setDemoResult(DEMO_DETECTION);
      setTimelineCap(4);
      await wait(1400);
      setTimelineCap(5);
      await wait(1600);
      setDemoResult(FOLLOWUP_DETECTION);
      setTimelineCap(6);
      setPestActive(false);
      await wait(1600);
      setStageIndex(7);
      setTimelineCap(6);
    }
    setDemoRunning(false);
  }

  function startGrowing() {
    cancelRef.current = true;
    setDemoRunning(false);
    setPestActive(false);
    setDemoResult(null);
    setTimelineCap(HEALTH_EVENTS.length - 1);
    setStageIndex(0);
    setPlaying(true);
    document.getElementById("journey")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }

  const visibleEvents = useMemo(() => HEALTH_EVENTS, []);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8">
      <GrowHero
        onStart={startGrowing}
        onExplore={() => document.getElementById("journey")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" })}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-forest-600">Watch paddy grow from seed to harvest. Click any stage, or play the product demo.</p>
        <DemoMode running={demoRunning} onStart={runDemo} onReplay={runDemo} />
      </div>

      <section id="journey" className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-3xl text-forest-900">Crop journey</h2>
            <button
              type="button"
              onClick={startGrowing}
              className="rounded-full border border-forest-200 bg-white px-4 py-2 text-sm font-semibold"
            >
              Start Crop Journey
            </button>
          </div>
          <CropPlantAnimation stageIndex={stageIndex} pestGlow={pestActive} reducedMotion={reduced} />
          <LifecycleTimeline
            stages={LIFECYCLE_STAGES}
            stageIndex={stageIndex}
            onSelect={(i) => {
              cancelRef.current = true;
              setPlaying(false);
              setDemoRunning(false);
              setStageIndex(i);
              setPestActive(i === 4);
            }}
          />
        </div>
        <div className="space-y-4">
          <CropInfoCard crop={{ ...crop, name: FARMER_CROPS.find((c) => c.id === activeField)?.name || crop.name }} stage={stage} />
          <CropHealthCard score={stage.healthScore} stage={stage} pestActive={pestActive} />
          <GrowWeatherCard weather={weather} stage={stage} pestActive={pestActive} />
        </div>
      </section>

      {demoResult && <DetectionResult result={demoResult} />}

      <PestDetection onDetected={() => setPestActive(true)} />

      <div className="grid gap-6 lg:grid-cols-2">
        <CropHealthTimeline events={visibleEvents} highlightFrom={timelineCap} />
        <NearbyCropTrends />
      </div>

      <OfflineMode />

      <section>
        <p className="echo-label">Farmer dashboard</p>
        <h2 className="font-display text-3xl">My Crops</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {FARMER_CROPS.map((field) => (
            <FarmerCropCard
              key={field.id}
              crop={field}
              active={activeField === field.id}
              onTrack={(c) => {
                setActiveField(c.id);
                setCrop({ ...DEFAULT_CROP, crop: c.crop, name: c.name });
                const idx = LIFECYCLE_STAGES.findIndex((s) => s.name.toLowerCase().includes(c.stage.split(" ")[0].toLowerCase()));
                setStageIndex(idx >= 0 ? idx : 4);
              }}
              onScan={() => document.getElementById("scan")?.scrollIntoView({ behavior: "smooth" })}
            />
          ))}
        </div>
      </section>

      <AccuracySection />
      <JourneyStory />
    </div>
  );
}
