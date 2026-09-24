import { DEMO_DETECTION, FOLLOWUP_DETECTION } from "../data/growDemo";
import { detectPestDemo } from "../../community/services/communityService";

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Optional live detector. Set VITE_PEST_DETECT_URL to a POST endpoint that accepts FormData `image`.
 * Existing YOLO Python script is unchanged; this website never calls it directly.
 */
export async function analyzeCropImage(file, { followUp = false } = {}) {
  const endpoint = (import.meta.env.VITE_PEST_DETECT_URL || "").trim();
  if (endpoint && file) {
    try {
      const body = new FormData();
      body.append("image", file);
      const response = await fetch(endpoint, { method: "POST", body });
      if (response.ok) {
        const json = await response.json();
        return {
          source: "api",
          detected: json.detected || json.label || json.name,
          scientific: json.scientific || json.commonName || "",
          confidence: Number(json.confidence ?? json.score ?? 0),
          status: json.status || "Attention Required",
          note: json.note || "Possible detection. Not a confirmed diagnosis.",
          box: json.box || DEMO_DETECTION.box,
        };
      }
    } catch {
      /* fall through to structured demo result */
    }
  }

  if (file) {
    const demo = await detectPestDemo(file);
    const chilli = /chilli|chili|thrip/i.test(file.name || "");
    if (chilli) {
      return {
        source: "demo-placeholder",
        detected: demo.commonName,
        scientific: demo.label,
        confidence: demo.confidence,
        status: "Attention Required",
        note: demo.note,
        box: DEMO_DETECTION.box,
      };
    }
  }

  await delay(followUp ? 400 : 200);
  const pack = followUp ? FOLLOWUP_DETECTION : DEMO_DETECTION;
  return { source: "demo-mock", ...pack };
}

export const SCAN_STEPS = ["Analyzing crop...", "Identifying symptoms...", "Checking pest patterns..."];
