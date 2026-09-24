import { Tensor } from "onnxruntime-react-native";
import { AnalyzeOutcome } from "../../types/detection";
import { imageUriToTensor } from "./imagePreprocessor";
import { getOnnxSession } from "./modelLoader";
import { parseYoloOutput } from "./postProcessor";

export async function detectPestsOnDevice(imageUri: string): Promise<AnalyzeOutcome> {
  const session = await getOnnxSession();
  const pre = await imageUriToTensor(imageUri);
  const inputName = session.inputNames[0];
  const feeds: Record<string, Tensor> = { [inputName]: pre.tensor };
  console.log("[INFERENCE] Starting", { inputName, outputNames: session.outputNames });
  const results = await session.run(feeds);
  const outputName = session.outputNames[0];
  const output = results[outputName];
  console.log("[INFERENCE] Completed", { outputName, dims: output.dims, type: output.type });
  const data = output.data as Float32Array;
  const detections = parseYoloOutput(data, output.dims, {
    origWidth: pre.origWidth,
    origHeight: pre.origHeight,
    scale: pre.scale,
    padX: pre.padX,
    padY: pre.padY,
  });
  const top = detections[0];
  return {
    detections,
    top,
    noDetection: detections.length === 0,
  };
}
