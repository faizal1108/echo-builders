import { generateCropPlan, parseGeminiJson } from "../../services/geminiService";

export async function askCommunityAi({ question, crop, location, weather, soil, imageNote, languageName, apiKey }) {
  const fallback = {
    possible_causes: [
      "Young-leaf curling with tiny insects underneath can include thrips on chilli, but this is only a possibility.",
      "Nutrient stress, drought or herbicide drift can look similar without insects.",
    ],
    inspect: [
      "Look at the underside of the newest leaves with good light.",
      "Note how many plants in a row are affected.",
      "Check weather of the last week (humidity, rain) without treating it as a 4-month forecast.",
    ],
    questions: ["When did symptoms start?", "Is the crop irrigated (nanjai) or rainfed (punjai)?"],
    monitoring: ["Scout twice a week and keep a photo log."],
    consult: "Consult a local agricultural officer or KVK before chemical control. Follow the product label. This is not a diagnosis.",
  };

  if (!apiKey) {
    return { status: "demo", data: fallback, message: "Demo AI reply. Add a Gemini key in Settings for a live advisory." };
  }

  const promptContext = {
    location: { label: location || "Coimbatore region (approximate)" },
    crop: crop || "Other",
    planningDate: new Date().toISOString().slice(0, 10),
    soil: soil || "unavailable",
    weather: weather || "unavailable",
    bhuvan: "unavailable",
    risks: null,
  };

  const result = await generateCropPlan(
    {
      ...promptContext,
      cropProfileExtra: question,
    },
    { apiKey, languageName }
  );

  if (result.data?.field_summary) {
    return {
      status: result.status,
      data: {
        possible_causes: [result.data.field_summary],
        inspect: result.data.farmer_actions?.slice(0, 4) || fallback.inspect,
        questions: fallback.questions,
        monitoring: (result.data.pest_risks || []).map((p) => p.monitoring_action).filter(Boolean).slice(0, 3),
        consult: fallback.consult,
        warnings: result.data.warnings || [],
      },
    };
  }

  return { status: "demo", data: fallback, raw: result };
}

export { parseGeminiJson };
