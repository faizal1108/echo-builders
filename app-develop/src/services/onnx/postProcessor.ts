import { CLASS_NAMES, CONFIDENCE_THRESHOLD, IOU_THRESHOLD } from "../../config/modelConfig";
import { DetectionResult } from "../../types/detection";

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

/**
 * Supports common YOLO ONNX layouts:
 * - YOLOv8/v11: [1, 4+nc, num]  (cx, cy, w, h, class scores)
 * - YOLOv5:     [1, num, 5+nc]  (cx, cy, w, h, obj, classes)
 */
export function parseYoloOutput(
  data: Float32Array | number[],
  dims: readonly number[],
  inputW: number,
  inputH: number
): DetectionResult[] {
  const values = data instanceof Float32Array ? data : Float32Array.from(data);
  const detections: DetectionResult[] = [];

  if (dims.length === 3 && dims[1] > dims[2]) {
    const channels = dims[1];
    const num = dims[2];
    const nc = channels - 4;
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
      const cx = values[0 * num + i] / inputW;
      const cy = values[1 * num + i] / inputH;
      const w = values[2 * num + i] / inputW;
      const h = values[3 * num + i] / inputH;
      detections.push(toDet(bestId, best, cx, cy, w, h));
    }
  } else {
    const num = dims[1] ?? 0;
    const stride = dims[2] ?? 0;
    const hasObj = stride === CLASS_NAMES.length + 5;
    for (let i = 0; i < num; i += 1) {
      const off = i * stride;
      const obj = hasObj ? values[off + 4] : 1;
      let best = 0;
      let bestId = 0;
      const classStart = hasObj ? 5 : 4;
      for (let c = 0; c < CLASS_NAMES.length; c += 1) {
        const score = values[off + classStart + c] * obj;
        if (score > best) {
          best = score;
          bestId = c;
        }
      }
      if (best < CONFIDENCE_THRESHOLD) continue;
      const cx = values[off] / inputW;
      const cy = values[off + 1] / inputH;
      const w = values[off + 2] / inputW;
      const h = values[off + 3] / inputH;
      detections.push(toDet(bestId, best, cx, cy, w, h));
    }
  }

  return nms(detections, IOU_THRESHOLD);
}

function toDet(classId: number, confidence: number, cx: number, cy: number, w: number, h: number): DetectionResult {
  return {
    classId,
    className: CLASS_NAMES[classId] ?? `Class ${classId}`,
    confidence,
    boundingBox: {
      x: clamp01(cx - w / 2),
      y: clamp01(cy - h / 2),
      width: clamp01(w),
      height: clamp01(h),
    },
  };
}
