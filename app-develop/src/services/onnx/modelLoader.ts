import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import { InferenceSession } from "onnxruntime-react-native";
import { MODEL_FILE_NAME } from "../../config/modelConfig";

let sessionPromise: Promise<InferenceSession> | null = null;

function bundledModelModule(): number {
  return require("../../../assets/models/rice_pest_model.onnx") as number;
}

export async function resolveModelPath(): Promise<string> {
  const dest = `${FileSystem.cacheDirectory}${MODEL_FILE_NAME}`;
  const existing = await FileSystem.getInfoAsync(dest);
  if (existing.exists) {
    return dest;
  }

  const asset = Asset.fromModule(bundledModelModule());
  await asset.downloadAsync();
  const from = asset.localUri || asset.uri;
  if (!from) {
    throw new Error(`Could not resolve bundled ${MODEL_FILE_NAME}.`);
  }
  await FileSystem.copyAsync({ from, to: dest });
  return dest;
}

export async function getOnnxSession(): Promise<InferenceSession> {
  if (!sessionPromise) {
    sessionPromise = (async () => {
      console.log("[MODEL] Loading model");
      const path = await resolveModelPath();
      const session = await InferenceSession.create(path);
      console.log("[MODEL] Model loaded");
      console.log("[MODEL] Input names:", session.inputNames);
      console.log("[MODEL] Output names:", session.outputNames);
      return session;
    })();
  }
  try {
    return await sessionPromise;
  } catch (error) {
    sessionPromise = null;
    console.error("ONNX model initialization failed:", error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`ONNX model failed to load (${MODEL_FILE_NAME}). ${message}`);
  }
}
