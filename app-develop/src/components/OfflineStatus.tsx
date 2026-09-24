import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { isOnline } from "../utils/network";

export default function OfflineStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    let mounted = true;
    const tick = async () => {
      const next = await isOnline();
      if (mounted) setOnline(next);
    };
    tick();
    const id = setInterval(tick, 4000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <View style={styles.wrap}>
      <View style={[styles.dot, { backgroundColor: online ? "#2d6a4f" : "#b45309" }]} />
      <Text style={styles.label}>{online ? "Online" : "Offline"}</Text>
      <Text style={styles.sub}>LOCAL AI  ✓ Available Offline</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    backgroundColor: "#ffffff",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#dcece1",
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  label: { fontWeight: "700", color: "#163528" },
  sub: { fontSize: 11, color: "#2d6a4f", fontWeight: "600" },
});
