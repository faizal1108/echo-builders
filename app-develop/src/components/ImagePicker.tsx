import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onCamera: () => void;
  onGallery: () => void;
  disabled?: boolean;
};

export default function ImagePickerButtons({ onCamera, onGallery, disabled }: Props) {
  return (
    <View style={styles.row}>
      <Pressable style={[styles.btn, styles.primary]} onPress={onCamera} disabled={disabled}>
        <Text style={styles.emoji}>📷</Text>
        <Text style={styles.primaryText}>Capture Leaf</Text>
      </Pressable>
      <Pressable style={[styles.btn, styles.secondary]} onPress={onGallery} disabled={disabled}>
        <Text style={styles.emoji}>🖼</Text>
        <Text style={styles.secondaryText}>Upload Image</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: 12 },
  btn: {
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: "#1b4332" },
  secondary: { backgroundColor: "#ffffff", borderWidth: 1.5, borderColor: "#b7d7c1" },
  emoji: { fontSize: 28, marginBottom: 6 },
  primaryText: { color: "#fbf7ef", fontSize: 18, fontWeight: "700" },
  secondaryText: { color: "#1b4332", fontSize: 18, fontWeight: "700" },
});
