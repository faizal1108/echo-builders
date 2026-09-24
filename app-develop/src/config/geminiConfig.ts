export const GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-flash-latest",
  "gemini-3.5-flash",
  "gemini-2.0-flash",
];

export const GEMINI_API_KEY = (process.env.EXPO_PUBLIC_GEMINI_API_KEY || "").trim();

export function geminiUrl(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}
