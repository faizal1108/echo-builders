import { Tensor } from "onnxruntime-react-native";
import { INPUT_HEIGHT, INPUT_WIDTH } from "../../config/modelConfig";
import { AnalyzeOutcome, DetectionResult } from "../../types/detection";
import { imageUriToTensor } from "./imagePreprocessor";
import { getOnnxSession } from "./modelLoader";
import { parseYoloOutput } from "./postProcessor";

export async function detectPestsOnDevice(imageUri: string): Promise<AnalyzeOutcome> {
  const session = await getOnnxSession();
  const { tensor } = await imageUriToTensor(imageUri);
  const inputName = session.inputNames[0];
  const feeds: Record<string, Tensor> = { [inputName]: tensor };
  const results = await session.run(feeds);
  const outputName = session.outputNames[0];
  const output = results[outputName];
  const data = output.data as Float32Array;
  const detections: DetectionResult[] = parseYoloOutput(data, output.dims, INPUT_WIDTH, INPUT_HEIGHT);
  const top = detections[0];
  return {
    detections,
    top,
    noDetection: detections.length === 0,
  };
}
