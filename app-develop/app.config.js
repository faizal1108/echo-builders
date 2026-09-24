const fs = require("fs");
const path = require("path");
const { withDangerousMod, withGradleProperties, withMainApplication } = require("expo/config-plugins");

function withStandaloneReleaseAndroid(config) {
  config = withGradleProperties(config, (cfg) => {
    const setProp = (key, value) => {
      const next = { type: "property", key, value };
      const idx = cfg.modResults.findIndex((item) => item.type === "property" && item.key === key);
      if (idx >= 0) {
        cfg.modResults[idx] = next;
      } else {
        cfg.modResults.push(next);
      }
    };
    setProp("EX_DEV_CLIENT_NETWORK_INSPECTOR", "false");
    // Bridgeless NativeModules omits un-codegen'd TurboModules. Use the interop/legacy registry.
    setProp("newArchEnabled", "false");
    return cfg;
  });

  config = withMainApplication(config, (cfg) => {
    let src = cfg.modResults.contents;
    if (!src.includes("ai.onnxruntime.reactnative.OnnxruntimePackage")) {
      src = src.replace(
        "import expo.modules.ExpoReactHostFactory",
        "import expo.modules.ExpoReactHostFactory\nimport ai.onnxruntime.reactnative.OnnxruntimePackage",
      );
    }
    if (!src.includes("OnnxruntimePackage()")) {
      src = src.replace(
        "PackageList(this).packages.apply {",
        "PackageList(this).packages.apply {\n          add(OnnxruntimePackage())",
      );
    }
    cfg.modResults.contents = src;
    return cfg;
  });

  return withDangerousMod(config, [
    "android",
    (cfg) => {
      const src = path.join(cfg.modRequest.projectRoot, "assets", "models", "rice_pest_model.onnx");
      const destDir = path.join(cfg.modRequest.platformProjectRoot, "app", "src", "main", "assets", "models");
      if (!fs.existsSync(src)) {
        throw new Error(`Missing ONNX model at ${src}`);
      }
      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(src, path.join(destDir, "rice_pest_model.onnx"));
      return cfg;
    },
  ]);
}

module.exports = {
  expo: {
    name: "Paddy AI Scanner",
    slug: "paddy-ai-scanner",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    scheme: "paddyai",
    newArchEnabled: false,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#f1f7f3",
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription:
          "Paddy AI Scanner uses the camera to photograph paddy leaves for on-device pest detection.",
        NSPhotoLibraryUsageDescription:
          "Paddy AI Scanner reads a leaf photo from your gallery for on-device pest detection.",
      },
    },
    android: {
      package: "com.echobuilders.paddyaiscanner",
      adaptiveIcon: {
        backgroundColor: "#E8F5EC",
        foregroundImage: "./assets/android-icon-foreground.png",
        backgroundImage: "./assets/android-icon-background.png",
        monochromeImage: "./assets/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
      permissions: [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.READ_MEDIA_IMAGES",
      ],
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    assetBundlePatterns: ["**/*"],
    updates: {
      enabled: false,
      checkAutomatically: "NEVER",
      fallbackToCacheTimeout: 0,
    },
    plugins: [
      withStandaloneReleaseAndroid,
      [
        "expo-asset",
        {
          assets: ["./assets/models/rice_pest_model.onnx"],
        },
      ],
      "onnxruntime-react-native",
      [
        "expo-image-picker",
        {
          cameraPermission:
            "Allow Paddy AI Scanner to photograph paddy leaves for on-device pest detection.",
          photosPermission:
            "Allow Paddy AI Scanner to use a gallery photo of a paddy leaf for on-device pest detection.",
          microphonePermission: false,
        },
      ],
    ],
  },
};
