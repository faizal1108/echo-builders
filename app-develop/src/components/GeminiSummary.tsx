import { StyleSheet, Text, View } from "react-native";
import { GeminiSummary } from "../types/detection";

type Props = {
  summary: GeminiSummary | null;
  error?: string;
};

export default function GeminiSummaryCard({ summary, error }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <Text style={styles.badgeTitle}>✨ AI Explanation</Text>
        <Text style={styles.badgeSub}>Gemini · Generated from Detection Result</Text>
      </View>
      {!summary ? (
        <View style={styles.card}>
          <Text style={styles.warn}>Gemini explanation unavailable.</Text>
          <Text style={styles.body}>{error || "Local AI detection is still available."}</Text>
        </View>
      ) : (
        <>
          <Section title="🌾 What does this mean?" body={summary.summary} />
          <Section title="🔎 Common Symptoms" items={summary.symptoms} />
          <Section title="🛠 What should I do?" items={summary.immediate_action} />
          <Section title="🛡 Prevention" items={summary.prevention} />
          <Section title="👨‍🌾 Need Expert Help?" body={summary.expert_advice} />
        </>
      )}
    </View>
  );
}

function Section({ title, body, items }: { title: string; body?: string; items?: string[] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.section}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
      {items?.map((item) => (
        <Text key={item} style={styles.item}>
          • {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  badge: {
    backgroundColor: "#fff7ed",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#fed7aa",
  },
  badgeTitle: { fontWeight: "800", color: "#9a3412" },
  badgeSub: { fontSize: 12, color: "#c2410c", marginTop: 2 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#dcece1",
  },
  section: { fontWeight: "800", color: "#10261d", marginBottom: 8, fontSize: 16 },
  body: { color: "#163528", lineHeight: 22 },
  item: { color: "#163528", lineHeight: 22, marginBottom: 4 },
  warn: { fontWeight: "800", color: "#9a3412", marginBottom: 6 },
});
