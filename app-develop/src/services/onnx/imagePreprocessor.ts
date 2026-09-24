import { Buffer } from "buffer";
import * as ImageManipulator from "expo-image-manipulator";
import jpeg from "jpeg-js";
import { Tensor } from "onnxruntime-react-native";
import { INPUT_HEIGHT, INPUT_WIDTH, NORMALIZE_0_1 } from "../../config/modelConfig";

export interface PreprocessResult {
  tensor: Tensor;
  origWidth: number;
  origHeight: number;
}

function decodeBase64Jpeg(base64: string): { width: number; height: number; data: Uint8Array } {
  const binary = Buffer.from(base64, "base64");
  const decoded = jpeg.decode(binary, { useTArray: true });
  return { width: decoded.width, height: decoded.height, data: decoded.data };
}

export async function imageUriToTensor(uri: string): Promise<PreprocessResult> {
  const resized = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: INPUT_WIDTH, height: INPUT_HEIGHT } }],
    { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true }
  );

  if (!resized.base64) {
    throw new Error("Could not read image pixels for on-device inference.");
  }

  const { data, width, height } = decodeBase64Jpeg(resized.base64);
  const float = new Float32Array(3 * INPUT_WIDTH * INPUT_HEIGHT);
  const scale = NORMALIZE_0_1 ? 1 / 255 : 1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const src = (y * width + x) * 4;
      const dst = y * width + x;
      float[dst] = data[src] * scale;
      float[INPUT_WIDTH * INPUT_HEIGHT + dst] = data[src + 1] * scale;
      float[2 * INPUT_WIDTH * INPUT_HEIGHT + dst] = data[src + 2] * scale;
    }
  }

  return {
    tensor: new Tensor("float32", float, [1, 3, INPUT_HEIGHT, INPUT_WIDTH]),
    origWidth: resized.width,
    origHeight: resized.height,
  };
}
