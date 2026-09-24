import { useState } from "react";
import { Image, LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import { DetectionResult } from "../types/detection";

type Props = {
  uri: string;
  detections: DetectionResult[];
};

export default function DetectionOverlay({ uri, detections }: Props) {
  const [size, setSize] = useState({ w: 0, h: 0 });

  function onLayout(e: LayoutChangeEvent) {
    setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });
  }

  return (
    <View style={styles.frame} onLayout={onLayout}>
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      {size.w > 0 &&
        detections.map((det, index) => {
          const box = det.boundingBox;
          if (!box) return null;
          return (
            <View
              key={`${det.className}-${index}`}
              style={[
                styles.box,
                {
                  left: box.x * size.w,
                  top: box.y * size.h,
                  width: Math.max(24, box.width * size.w),
                  height: Math.max(24, box.height * size.h),
                },
              ]}
            >
              <Text style={styles.caption}>
                {det.className} {(det.confidence * 100).toFixed(0)}%
              </Text>
            </View>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#dcece1",
  },
  image: { width: "100%", height: "100%" },
  box: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#c2410c",
    borderRadius: 8,
  },
  caption: {
    position: "absolute",
    top: -22,
    left: 0,
    backgroundColor: "#c2410c",
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
});
