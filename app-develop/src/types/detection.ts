export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetectionResult {
  classId: number;
  className: string;
  confidence: number;
  boundingBox?: BoundingBox;
}

export interface GeminiSummary {
  summary: string;
  symptoms: string[];
  immediate_action: string[];
  prevention: string[];
  expert_advice: string;
}

export interface AnalyzeOutcome {
  detections: DetectionResult[];
  top?: DetectionResult;
  noDetection: boolean;
}
