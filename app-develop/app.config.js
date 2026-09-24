export default {
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
    plugins: [
      "expo-asset",
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
