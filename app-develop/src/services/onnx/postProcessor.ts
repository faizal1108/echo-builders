import { CLASS_NAMES, CONFIDENCE_THRESHOLD, IOU_THRESHOLD } from "../../config/modelConfig";
import { DetectionResult } from "../../types/detection";

export interface LetterboxMeta {
  origWidth: number;
  origHeight: number;
  scale: number;
  padX: number;
  padY: number;
}

function iou(a: DetectionResult, b: DetectionResult): number {
  const A = a.boundingBox;
  const B = b.boundingBox;
  if (!A || !B) return 0;
  const x1 = Math.max(A.x, B.x);
  const y1 = Math.max(A.y, B.y);
  const x2 = Math.min(A.x + A.width, B.x + B.width);
  const y2 = Math.min(A.y + A.height, B.y + B.height);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const union = A.width * A.height + B.width * B.height - inter;
  return union <= 0 ? 0 : inter / union;
}

function nms(boxes: DetectionResult[], threshold: number): DetectionResult[] {
  const sorted = [...boxes].sort((a, b) => b.confidence - a.confidence);
  const keep: DetectionResult[] = [];
  for (const candidate of sorted) {
    if (keep.every((k) => iou(candidate, k) < threshold)) {
      keep.push(candidate);
    }
  }
  return keep;
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

function toDet(
  classId: number,
  confidence: number,
  cx: number,
  cy: number,
  w: number,
  h: number,
  meta: LetterboxMeta
): DetectionResult {
  const x1 = (cx - w / 2 - meta.padX) / meta.scale;
  const y1 = (cy - h / 2 - meta.padY) / meta.scale;
  const x2 = (cx + w / 2 - meta.padX) / meta.scale;
  const y2 = (cy + h / 2 - meta.padY) / meta.scale;
  return {
    classId,
    className: CLASS_NAMES[classId] ?? `Class ${classId}`,
    confidence,
    boundingBox: {
      x: clamp01(x1 / meta.origWidth),
      y: clamp01(y1 / meta.origHeight),
      width: clamp01((x2 - x1) / meta.origWidth),
      height: clamp01((y2 - y1) / meta.origHeight),
    },
  };
}

/**
 * YOLO11s ONNX from Ultralytics: [1, 4+nc, 8400] = [1, 106, 8400]
 * channels 0-3 = cx, cy, w, h in 640-pixel space; 4-105 = 102 class scores.
 */
export function parseYoloOutput(
  data: Float32Array | number[],
  dims: readonly number[],
  meta: LetterboxMeta
): DetectionResult[] {
  const values = data instanceof Float32Array ? data : Float32Array.from(data);
  const detections: DetectionResult[] = [];
  const d1 = dims[1] ?? 0;
  const d2 = dims[2] ?? 0;
  const yolo11Layout = d1 === 4 + CLASS_NAMES.length || (d1 < d2 && d1 >= 4);

  if (yolo11Layout) {
    const channels = d1;
    const num = d2;
    const nc = Math.min(CLASS_NAMES.length, channels - 4);
    for (let i = 0; i < num; i += 1) {
      let best = 0;
      let bestId = 0;
      for (let c = 0; c < nc; c += 1) {
        const score = values[(4 + c) * num + i];
        if (score > best) {
          best = score;
          bestId = c;
        }
      }
      if (best < CONFIDENCE_THRESHOLD) continue;
      const cx = values[0 * num + i];
      const cy = values[1 * num + i];
      const w = values[2 * num + i];
      const h = values[3 * num + i];
      detections.push(toDet(bestId, best, cx, cy, w, h, meta));
    }
  } else {
    const num = d1;
    const stride = d2;
    for (let i = 0; i < num; i += 1) {
      const off = i * stride;
      let best = 0;
      let bestId = 0;
      for (let c = 0; c < CLASS_NAMES.length && 4 + c < stride; c += 1) {
        const score = values[off + 4 + c];
        if (score > best) {
          best = score;
          bestId = c;
        }
      }
      if (best < CONFIDENCE_THRESHOLD) continue;
      detections.push(toDet(bestId, best, values[off], values[off + 1], values[off + 2], values[off + 3], meta));
    }
  }

  const kept = nms(detections, IOU_THRESHOLD);
  console.log("[POSTPROCESS] Detections:", kept.length, kept[0]?.className, kept[0]?.confidence);
  return kept;
}
