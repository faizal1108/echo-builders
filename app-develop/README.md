# Paddy AI Scanner (Android / Expo)

Offline **YOLO ONNX** pest detection on device. Gemini only explains the **text result**. The leaf image is never sent to Gemini.

This will **not** run inside Expo Go. Use a development build:

```bash
npx expo prebuild --platform android
npx expo run:android
```

## 1. Put your ONNX model here

```text
app-develop/assets/models/paddy_pest_model.onnx
```

Export from Ultralytics (example):

```bash
yolo export model=best.pt format=onnx imgsz=640
```

Copy the exported `.onnx` file over `paddy_pest_model.onnx`.

Optional override on device: copy the same file to the app document folder as `paddy_pest_model.onnx`.

## 2. Input size

Edit `src/config/modelConfig.ts`:

```ts
export const INPUT_WIDTH = 640;
export const INPUT_HEIGHT = 640;
```

These must match the size used when you exported the model.

## 3. Class labels

Edit `CLASS_NAMES` in `src/config/modelConfig.ts`. Order must match training.

Demo starter list is `PADDY_CLASSES`. For the IP102 `pests.yaml` names, set:

```ts
export const CLASS_NAMES = IP102_CLASSES;
```

## 4. Gemini API key (demo)

Create `app-develop/.env`:

```bash
EXPO_PUBLIC_GEMINI_API_KEY=your_key_here
```

Restart the bundler after changing env. The key is a public client key in this demo — do not ship a production secret in the app binary.

Gemini is called **only after** local detection, with JSON like:

```json
{ "crop": "Paddy", "detected_pest": "Rice Leaf Roller", "confidence": 0.914, "severity": "Moderate" }
```

No image is attached.

## 5. Build Android

From `app-develop`:

```bash
npm install
npx expo prebuild --platform android
npx expo run:android
```

If Gradle reports `SDK location not found`, Android SDK is installed at `C:\Users\moham\AppData\Local\Android\Sdk`. This project writes that path to `android/local.properties` (gitignored).

If the C: drive is full, Gradle caches corrupt and CMake fails. Free several GB on C:, or run:

```powershell
$env:GRADLE_USER_HOME = "A:\project\ECHO\.gradle-home"
npx expo run:android
```

`npm run android` already points Gradle user home at `A:\project\ECHO\.gradle-home`.


If the ONNX Expo plugin fails on a very new Expo SDK, pin Expo SDK 54 or keep `react-native.config.js` (already included).

## 6. Test fully offline detection

1. Open the app on the phone.
2. Turn **Wi-Fi and mobile data OFF**.
3. Capture or upload a leaf.
4. Tap **Analyze Leaf**.
5. You should still get pest name, confidence, and boxes.
6. Gemini should show: explanation unavailable, local detection still available.
7. Turn data **ON** and scan again to see the farmer explanation.

Status chip: **● Offline** / **● Online**.

## 7. Replace the demo model

1. Train / take your YOLO weights (`best.pt`).
2. `yolo export model=best.pt format=onnx imgsz=640`
3. Replace `assets/models/paddy_pest_model.onnx`.
4. Update `CLASS_NAMES`, `INPUT_WIDTH`, `INPUT_HEIGHT`, `CONFIDENCE_THRESHOLD` (default `0.40`), `IOU_THRESHOLD`.
5. Rebuild: `npx expo run:android`

## Demo script (~1–2 min)

Open app → Paddy AI Scanner → Capture/Upload → Analyze Leaf → local YOLO/ONNX → pest + box + confidence → Gemini summary (if online).
