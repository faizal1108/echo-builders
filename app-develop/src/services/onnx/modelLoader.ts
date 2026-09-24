import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import { InferenceSession } from "onnxruntime-react-native";
import { MODEL_ASSET } from "../../config/modelConfig";

let sessionPromise: Promise<InferenceSession> | null = null;

export async function resolveModelPath(): Promise<string> {
  const override = `${FileSystem.documentDirectory}paddy_pest_model.onnx`;
  const overrideInfo = await FileSystem.getInfoAsync(override);
  if (overrideInfo.exists) {
    return overrideInfo.uri;
  }

  const asset = Asset.fromModule(MODEL_ASSET);
  await asset.downloadAsync();
  const uri = asset.localUri || asset.uri;
  if (!uri) {
    throw new Error(
      "Could not load assets/models/paddy_pest_model.onnx. Place your YOLO ONNX file there, then rebuild."
    );
  }
  return uri;
}

export async function getOnnxSession(): Promise<InferenceSession> {
  if (!sessionPromise) {
    sessionPromise = (async () => {
      const path = await resolveModelPath();
      return InferenceSession.create(path);
    })();
  }
  try {
    return await sessionPromise;
  } catch (error) {
    sessionPromise = null;
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `ONNX model failed to load. Replace assets/models/paddy_pest_model.onnx with your exported YOLO model. ${message}`
    );
  }
}
