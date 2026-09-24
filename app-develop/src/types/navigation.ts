import { DetectionResult, GeminiSummary } from "./detection";

export type RootStackParamList = {
  Scanner: undefined;
  Result: {
    imageUri: string;
    detections: DetectionResult[];
    gemini: GeminiSummary | null;
    geminiError?: string;
    noDetection: boolean;
  };
};
