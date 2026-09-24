import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Buffer } from "buffer";
import PaddyScannerScreen from "./src/screens/PaddyScannerScreen";
import ResultScreen from "./src/screens/ResultScreen";
import { RootStackParamList } from "./src/types/navigation";

const g = globalThis as typeof globalThis & { Buffer?: typeof Buffer };
if (!g.Buffer) {
  g.Buffer = Buffer;
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#f1f7f3" },
          headerTintColor: "#1b4332",
          headerTitleStyle: { fontWeight: "800" },
          contentStyle: { backgroundColor: "#f1f7f3" },
        }}
      >
        <Stack.Screen name="Scanner" component={PaddyScannerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Result" component={ResultScreen} options={{ title: "Result" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
