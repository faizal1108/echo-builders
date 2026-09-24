import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ImagePickerButtons from "../components/ImagePicker";
import OfflineStatus from "../components/OfflineStatus";
import { CONFIDENCE_THRESHOLD } from "../config/modelConfig";
import { explainDetection } from "../services/gemini/geminiService";
import { detectPestsOnDevice } from "../services/onnx/onnxDetector";
import { RootStackParamList } from "../types/navigation";

const STEPS = ["Analyzing Paddy Leaf...", "Running AI locally on your device", "Detecting pests..."];

export default function PaddyScannerScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "Scanner">>();
  const [uri, setUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!busy) return undefined;
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 900);
    return () => clearInterval(id);
  }, [busy]);

  async function pick(fromCamera: boolean) {
    setError(null);
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError(fromCamera ? "Camera permission is required." : "Gallery permission is required.");
      return;
    }
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.9, mediaTypes: ["images"] })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.9, mediaTypes: ["images"] });
    if (!result.canceled && result.assets[0]?.uri) {
      setUri(result.assets[0].uri);
    }
  }

  async function analyze() {
    if (!uri) return;
    setBusy(true);
    setError(null);
    setStep(0);
    try {
      const outcome = await detectPestsOnDevice(uri);
      if (outcome.noDetection || !outcome.top) {
        navigation.navigate("Result", {
          imageUri: uri,
          detections: [],
          gemini: null,
          geminiError: undefined,
          noDetection: true,
        });
        return;
      }
      const gemini = await explainDetection(outcome.top);
      navigation.navigate("Result", {
        imageUri: uri,
        detections: outcome.detections,
        gemini: gemini.summary,
        geminiError: gemini.error,
        noDetection: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "On-device analysis failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <OfflineStatus />
        <Text style={styles.header}>Paddy AI Scanner</Text>
        <Text style={styles.sub}>Offline Pest Detection</Text>
        <View style={styles.hero}>
          <Text style={styles.leaf}>🌾</Text>
          <Text style={styles.lead}>Identify paddy pests directly on your device.</Text>
        </View>

        {!uri ? (
          <>
            <ImagePickerButtons onCamera={() => pick(true)} onGallery={() => pick(false)} disabled={busy} />
            <View style={styles.engine}>
              <Text style={styles.engineKicker}>ON-DEVICE AI</Text>
              <Text style={styles.engineTitle}>YOLO • ONNX Runtime</Text>
              <Text style={styles.engineNote}>No image upload required for detection</Text>
            </View>
          </>
        ) : (
          <>
            <Image source={{ uri }} style={styles.preview} />
            <View style={styles.meta}>
              <Text style={styles.metaLine}>AI Model{"\n"}YOLO Paddy Pest Detector</Text>
              <Text style={styles.metaLine}>Runtime{"\n"}ONNX Runtime</Text>
              <Text style={styles.metaLine}>Processing{"\n"}On Device</Text>
            </View>
            {busy ? (
              <View style={styles.busy}>
                <ActivityIndicator size="large" color="#1b4332" />
                <Text style={styles.busyText}>{STEPS[step]}</Text>
              </View>
            ) : (
              <>
                <Pressable style={styles.analyze} onPress={analyze}>
                  <Text style={styles.analyzeText}>Analyze Leaf</Text>
                </Pressable>
                <Pressable style={styles.again} onPress={() => setUri(null)}>
                  <Text style={styles.againText}>Choose Another Image</Text>
                </Pressable>
              </>
            )}
          </>
        )}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.threshold}>Confidence threshold {CONFIDENCE_THRESHOLD}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f1f7f3" },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  header: { fontSize: 32, fontWeight: "800", color: "#10261d" },
  sub: { marginTop: -8, color: "#2d6a4f", fontWeight: "700" },
  hero: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dcece1",
  },
  leaf: { fontSize: 64 },
  lead: { marginTop: 8, textAlign: "center", color: "#163528", fontSize: 16, fontWeight: "600" },
  engine: {
    backgroundColor: "#1b4332",
    borderRadius: 20,
    padding: 16,
  },
  engineKicker: { color: "#b7d7c1", fontSize: 11, fontWeight: "800", letterSpacing: 1.4 },
  engineTitle: { color: "#fbf7ef", fontSize: 18, fontWeight: "800", marginTop: 4 },
  engineNote: { color: "#dcece1", marginTop: 6 },
  preview: { width: "100%", height: 280, borderRadius: 20, backgroundColor: "#dcece1" },
  meta: { backgroundColor: "#fff", borderRadius: 18, padding: 14, gap: 8, borderWidth: 1, borderColor: "#dcece1" },
  metaLine: { color: "#163528", fontWeight: "600" },
  analyze: { backgroundColor: "#1b4332", borderRadius: 18, paddingVertical: 16, alignItems: "center" },
  analyzeText: { color: "#fff", fontWeight: "800", fontSize: 17 },
  again: { alignItems: "center", paddingVertical: 10 },
  againText: { color: "#2d6a4f", fontWeight: "700" },
  busy: { alignItems: "center", gap: 10, paddingVertical: 16 },
  busyText: { fontWeight: "700", color: "#1b4332" },
  error: { color: "#9a3412", fontWeight: "600" },
  threshold: { textAlign: "center", color: "#54986f", fontSize: 12 },
});
