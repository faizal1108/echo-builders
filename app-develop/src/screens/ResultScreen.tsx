import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DetectionCard from "../components/DetectionCard";
import DetectionOverlay from "../components/DetectionOverlay";
import GeminiSummaryCard from "../components/GeminiSummary";
import OfflineStatus from "../components/OfflineStatus";
import { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Result">;

export default function ResultScreen({ route, navigation }: Props) {
  const { imageUri, detections, gemini, geminiError, noDetection } = route.params;
  const top = detections[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <OfflineStatus />
        <Text style={styles.header}>Paddy Health Result</Text>

        <DetectionOverlay uri={imageUri} detections={detections} />

        <View style={styles.localBadge}>
          <Text style={styles.localTitle}>LOCAL AI</Text>
          <Text style={styles.localLine}>✓ Pest Detection</Text>
          <Text style={styles.localLine}>YOLO + ONNX Runtime</Text>
          <Text style={styles.localLine}>Processed on Device</Text>
        </View>

        {noDetection || !top ? (
          <View style={styles.card}>
            <Text style={styles.warnTitle}>No confident pest detected</Text>
            <Text style={styles.body}>The AI could not identify a pest with sufficient confidence.</Text>
            <Text style={styles.body}>{"\n"}Try:</Text>
            <Text style={styles.body}>• Taking a clearer photo</Text>
            <Text style={styles.body}>• Moving closer to the affected leaf</Text>
            <Text style={styles.body}>• Using better lighting</Text>
          </View>
        ) : (
          <>
            <DetectionCard detection={top} />
            <View style={styles.card}>
              <Text style={styles.item}>🐛 Detected Pest{"\n"}{top.className}</Text>
              <Text style={styles.item}>🎯 AI Confidence{"\n"}{(top.confidence * 100).toFixed(1)}%</Text>
              <Text style={styles.item}>📱 Detection{"\n"}Processed locally on device</Text>
              <Text style={styles.item}>⚡ AI Engine{"\n"}YOLO + ONNX Runtime</Text>
            </View>
            <GeminiSummaryCard summary={gemini} error={geminiError} />
          </>
        )}

        <Pressable style={styles.back} onPress={() => navigation.navigate("Scanner")}>
          <Text style={styles.backText}>Scan another leaf</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f1f7f3" },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  header: { fontSize: 28, fontWeight: "800", color: "#10261d" },
  localBadge: {
    backgroundColor: "#1b4332",
    borderRadius: 18,
    padding: 14,
  },
  localTitle: { color: "#b7d7c1", fontWeight: "800", letterSpacing: 1.2, marginBottom: 6 },
  localLine: { color: "#fbf7ef", fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#dcece1",
    gap: 10,
  },
  item: { color: "#163528", fontWeight: "700", lineHeight: 22 },
  warnTitle: { fontWeight: "800", fontSize: 18, color: "#9a3412", marginBottom: 8 },
  body: { color: "#163528", lineHeight: 22 },
  back: { backgroundColor: "#fff", borderRadius: 16, padding: 14, alignItems: "center", borderWidth: 1, borderColor: "#b7d7c1" },
  backText: { fontWeight: "800", color: "#1b4332" },
});
