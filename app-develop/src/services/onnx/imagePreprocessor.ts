import { Buffer } from "buffer";
import * as ImageManipulator from "expo-image-manipulator";
import jpeg from "jpeg-js";
import { Image } from "react-native";
import { Tensor } from "onnxruntime-react-native";
import {
  INPUT_HEIGHT,
  INPUT_WIDTH,
  LETTERBOX_PAD,
  NORMALIZE_0_1,
  USE_LETTERBOX,
} from "../../config/modelConfig";

export interface PreprocessResult {
  tensor: Tensor;
  origWidth: number;
  origHeight: number;
  scale: number;
  padX: number;
  padY: number;
}

function getImageSize(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (error) => reject(error)
    );
  });
}

function decodeBase64Jpeg(base64: string): { width: number; height: number; data: Uint8Array } {
  const binary = Buffer.from(base64, "base64");
  const decoded = jpeg.decode(binary, { useTArray: true });
  return { width: decoded.width, height: decoded.height, data: decoded.data };
}

export async function imageUriToTensor(uri: string): Promise<PreprocessResult> {
  const orig = await getImageSize(uri);
  let targetW = INPUT_WIDTH;
  let targetH = INPUT_HEIGHT;
  let scale = 1;
  let padX = 0;
  let padY = 0;

  if (USE_LETTERBOX) {
    scale = Math.min(INPUT_WIDTH / orig.width, INPUT_HEIGHT / orig.height);
    targetW = Math.max(1, Math.round(orig.width * scale));
    targetH = Math.max(1, Math.round(orig.height * scale));
    padX = Math.floor((INPUT_WIDTH - targetW) / 2);
    padY = Math.floor((INPUT_HEIGHT - targetH) / 2);
  }

  const resized = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: targetW, height: targetH } }],
    { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true }
  );

  if (!resized.base64) {
    throw new Error("Could not read image pixels for on-device inference.");
  }

  const { data, width, height } = decodeBase64Jpeg(resized.base64);
  const float = new Float32Array(3 * INPUT_WIDTH * INPUT_HEIGHT);
  const scalePix = NORMALIZE_0_1 ? 1 / 255 : 1;
  const pad = LETTERBOX_PAD;

  if (USE_LETTERBOX) {
    for (let i = 0; i < float.length; i += 1) {
      float[i] = pad;
    }
  }

  const plane = INPUT_WIDTH * INPUT_HEIGHT;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const src = (y * width + x) * 4;
      const dx = x + padX;
      const dy = y + padY;
      if (dx < 0 || dy < 0 || dx >= INPUT_WIDTH || dy >= INPUT_HEIGHT) continue;
      const dst = dy * INPUT_WIDTH + dx;
      float[dst] = data[src] * scalePix;
      float[plane + dst] = data[src + 1] * scalePix;
      float[2 * plane + dst] = data[src + 2] * scalePix;
    }
  }

  console.log("[IMAGE] Preprocessed:", {
    orig,
    tensor: [1, 3, INPUT_HEIGHT, INPUT_WIDTH],
    scale,
    padX,
    padY,
    rgbNotRgba: true,
    chw: true,
    float32: true,
  });

  return {
    tensor: new Tensor("float32", float, [1, 3, INPUT_HEIGHT, INPUT_WIDTH]),
    origWidth: orig.width,
    origHeight: orig.height,
    scale: USE_LETTERBOX ? scale : orig.width / INPUT_WIDTH,
    padX,
    padY,
  };
}
