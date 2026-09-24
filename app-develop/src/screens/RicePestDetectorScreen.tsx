import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DetectionOverlay from "../components/DetectionOverlay";
import { CLASS_NAMES, CONFIDENCE_THRESHOLD } from "../config/modelConfig";
import { DetectionResult } from "../types/detection";

type ModelStatus = "idle" | "loading" | "ready" | "error";

export default function RicePestDetectorScreen() {
  const [uri, setUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatus>("idle");
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    console.log("[APP] Ready");
    let cancelled = false;
    (async () => {
      try {
        const { isOnline } = await import("../utils/network");
        const next = await isOnline();
        if (!cancelled) setOnline(next);
      } catch {
        if (!cancelled) setOnline(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function pick(fromCamera: boolean) {
    setError(null);
    try {
      const ImagePicker = await import("expo-image-picker");
      const permission = fromCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError(fromCamera ? "Camera permission was denied." : "Gallery permission was denied.");
        return;
      }
      const result = fromCamera
        ? await ImagePicker.launchCameraAsync({ quality: 0.9, mediaTypes: ["images"] })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.9, mediaTypes: ["images"] });
      if (result.canceled) return;
      const selected = result.assets[0]?.uri;
      if (!selected) {
        setError("Image URI missing.");
        return;
      }
      console.log("[IMAGE] Selected:", selected);
      setUri(selected);
      setDetections([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open camera or gallery.");
    }
  }

  async function analyze() {
    if (!uri) {
      setError("Select a leaf photo first.");
      return;
    }
    setBusy(true);
    setError(null);
    setModelStatus("loading");
    try {
      const { detectPestsOnDevice } = await import("../services/onnx/onnxDetector");
      const outcome = await detectPestsOnDevice(uri);
      setModelStatus("ready");
      setDetections(outcome.detections);
      if (outcome.noDetection) {
        setError("No pest detected above the confidence threshold. Try a closer, sharper leaf photo.");
      }
    } catch (err) {
      setModelStatus("error");
      const message = err instanceof Error ? err.message : String(err);
      console.error("[INFERENCE] failed", err);
      setError(`On-device analysis failed: ${message}`);
    } finally {
      setBusy(false);
    }
  }

  const top = detections[0];
  const statusLabel =
    modelStatus === "idle"
      ? "Not loaded (loads when you analyze)"
      : modelStatus === "loading"
        ? "Loading"
        : modelStatus === "ready"
          ? "Model Ready"
          : "Error";

  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.badge}>
          <View style={[styles.dot, { backgroundColor: online === false ? "#b45309" : "#2d6a4f" }]} />
          <Text style={styles.badgeText}>
            {online === false ? "Offline" : online ? "Online" : "Works Offline"}
          </Text>
        </View>
        <Text style={styles.title}>🌾 Rice Pest Detection</Text>
        <Text style={styles.sub}>Works Offline</Text>

        <View style={styles.card}>
          <Text style={styles.kicker}>Model</Text>
          <Text style={styles.modelName}>Rice Pest AI</Text>
          <Text style={styles.body}>Offline ONNX Model · {CLASS_NAMES.length} classes · YOLO11s</Text>
          <Text style={styles.status}>Status: {statusLabel}</Text>
        </View>

        <Pressable style={styles.primary} onPress={() => void pick(true)}>
          <Text style={styles.primaryText}>📷 Camera</Text>
        </Pressable>
        <Pressable style={styles.secondary} onPress={() => void pick(false)}>
          <Text style={styles.secondaryText}>🖼 Upload Image</Text>
        </Pressable>

        {uri ? (
          <>
            <DetectionOverlay uri={uri} detections={detections} />
            <Pressable style={styles.primary} onPress={() => void analyze()} disabled={busy}>
              {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Analyze Leaf</Text>}
            </Pressable>
            <Pressable
              onPress={() => {
                setUri(null);
                setDetections([]);
                setError(null);
              }}
            >
              <Text style={styles.link}>Choose another image</Text>
            </Pressable>
          </>
        ) : null}

        {top ? (
          <View style={styles.card}>
            <Text style={styles.kicker}>Detected Pest</Text>
            <Text style={styles.modelName}>{top.className}</Text>
            <Text style={styles.body}>Confidence {(top.confidence * 100).toFixed(1)}%</Text>
            <Text style={styles.hint}>Threshold {CONFIDENCE_THRESHOLD} · processed on device</Text>
          </View>
        ) : null}

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f1f7f3", paddingTop: 48 },
  content: { padding: 20, paddingBottom: 40 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#dcece1",
    marginBottom: 12,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  badgeText: { fontWeight: "700", color: "#163528" },
  title: { fontSize: 28, fontWeight: "800", color: "#10261d", marginBottom: 4 },
  sub: { color: "#2d6a4f", fontWeight: "700", marginBottom: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#dcece1",
    marginBottom: 12,
  },
  kicker: { fontSize: 11, fontWeight: "800", color: "#54986f", letterSpacing: 1 },
  modelName: { fontSize: 20, fontWeight: "800", color: "#1b4332", marginTop: 4 },
  body: { color: "#163528", marginTop: 4 },
  status: { marginTop: 8, fontWeight: "700", color: "#1b4332" },
  hint: { marginTop: 6, fontSize: 12, color: "#54986f" },
  primary: {
    backgroundColor: "#1b4332",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryText: { color: "#fff", fontWeight: "800", fontSize: 17 },
  secondary: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#b7d7c1",
    marginBottom: 12,
  },
  secondaryText: { color: "#1b4332", fontWeight: "800", fontSize: 17 },
  link: { textAlign: "center", color: "#2d6a4f", fontWeight: "700", paddingVertical: 8 },
  error: { color: "#9a3412", fontWeight: "700", lineHeight: 20, marginTop: 8 },
});
