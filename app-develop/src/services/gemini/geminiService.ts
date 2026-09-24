import { GEMINI_API_KEY, GEMINI_MODELS, geminiUrl } from "../../config/geminiConfig";
import { severityFromConfidence } from "../../config/modelConfig";
import { DetectionResult, GeminiSummary } from "../../types/detection";

function buildPrompt(det: DetectionResult): string {
  const severity = severityFromConfidence(det.confidence);
  const pct = (det.confidence * 100).toFixed(1);
  return `You are an agricultural assistant helping an Indian paddy farmer.

The local AI model has already detected the following:

Crop: Paddy
Detected pest: ${det.className}
Confidence: ${pct}%
Severity: ${severity}

Do not change or reinterpret the detected pest.

Provide a concise farmer-friendly explanation containing:

1. What was detected
2. Common symptoms
3. Immediate action
4. Prevention
5. When the farmer should seek expert/agricultural officer advice

Use simple language.

Do not invent pesticide dosage or chemical recommendations.

Return the response as structured JSON with keys:
summary, symptoms (array), immediate_action (array), prevention (array), expert_advice (string).`;
}

function parseJson(text: string): GeminiSummary | null {
  const trimmed = text.replace(/```json/gi, "```").replace(/```/g, "").trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const raw = JSON.parse(trimmed.slice(start, end + 1)) as Partial<GeminiSummary>;
    if (!raw.summary) return null;
    return {
      summary: String(raw.summary),
      symptoms: Array.isArray(raw.symptoms) ? raw.symptoms.map(String) : [],
      immediate_action: Array.isArray(raw.immediate_action) ? raw.immediate_action.map(String) : [],
      prevention: Array.isArray(raw.prevention) ? raw.prevention.map(String) : [],
      expert_advice: String(raw.expert_advice || ""),
    };
  } catch {
    return null;
  }
}

export async function explainDetection(det: DetectionResult): Promise<{ summary: GeminiSummary | null; error?: string }> {
  if (!GEMINI_API_KEY) {
    return { summary: null, error: "Gemini API key is not configured. Local AI detection is still available." };
  }

  const payload = {
    crop: "Paddy",
    detected_pest: det.className,
    confidence: det.confidence,
    severity: severityFromConfidence(det.confidence),
  };

  let lastError = "Gemini explanation is currently unavailable.";

  for (const model of GEMINI_MODELS) {
    try {
      const response = await fetch(geminiUrl(model), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${buildPrompt(det)}\n\nStructured detection (do not classify an image):\n${JSON.stringify(payload)}` }],
            },
          ],
        }),
      });
      if (!response.ok) {
        lastError = `Gemini explanation is currently unavailable. (${response.status})`;
        continue;
      }
      const json = (await response.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("\n") || "";
      const parsed = parseJson(text);
      if (parsed) return { summary: parsed };
      lastError = "Gemini returned text that could not be parsed. Local AI detection is still available.";
    } catch {
      lastError = "Gemini explanation unavailable. Local AI detection is still available.";
    }
  }

  return { summary: null, error: lastError };
}
