import { StyleSheet, Text, View } from "react-native";
import { severityFromConfidence } from "../config/modelConfig";
import { DetectionResult } from "../types/detection";

export default function DetectionCard({ detection }: { detection: DetectionResult }) {
  const pct = (detection.confidence * 100).toFixed(1);
  return (
    <View style={styles.card}>
      <Text style={styles.kicker}>AI Detection Complete ✓</Text>
      <Text style={styles.label}>Detected Pest</Text>
      <Text style={styles.title}>{detection.className}</Text>
      <View style={styles.row}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Confidence</Text>
          <Text style={styles.statValue}>{pct}%</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Severity</Text>
          <Text style={styles.statValue}>{severityFromConfidence(detection.confidence)}</Text>
        </View>
      </View>
      <Text style={styles.local}>✓ Detected locally · ONNX Runtime</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#dcece1",
  },
  kicker: { color: "#2d6a4f", fontWeight: "800", marginBottom: 10 },
  label: { fontSize: 12, color: "#54986f", fontWeight: "600" },
  title: { fontSize: 26, fontWeight: "800", color: "#10261d", marginTop: 2 },
  row: { flexDirection: "row", gap: 12, marginTop: 14 },
  stat: { flex: 1, backgroundColor: "#f1f7f3", borderRadius: 14, padding: 12 },
  statLabel: { fontSize: 11, color: "#54986f", fontWeight: "600" },
  statValue: { fontSize: 20, fontWeight: "800", color: "#1b4332" },
  local: { marginTop: 12, fontSize: 12, fontWeight: "700", color: "#1b4332" },
});
