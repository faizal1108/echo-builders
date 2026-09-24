import { useEffect } from "react";
import { View } from "react-native";
import ErrorBoundary from "./src/components/ErrorBoundary";
import RicePestDetectorScreen from "./src/screens/RicePestDetectorScreen";

export default function App() {
  useEffect(() => {
    console.log("[APP] App mounted");
  }, []);

  return (
    <ErrorBoundary>
      <View style={{ flex: 1, backgroundColor: "#f1f7f3" }}>
        <RicePestDetectorScreen />
      </View>
    </ErrorBoundary>
  );
}
