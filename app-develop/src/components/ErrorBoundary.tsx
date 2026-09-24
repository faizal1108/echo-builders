import { ReactNode, Component } from "react";
import { ScrollView, Text, View } from "react-native";

type Props = { children: ReactNode };
type State = { error: string | null };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error: error.message || String(error) };
  }

  componentDidCatch(error: Error) {
    console.error("[APP] Render crash:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, backgroundColor: "#f1f7f3", padding: 24, justifyContent: "center" }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#9a3412" }}>App error</Text>
          <ScrollView style={{ marginTop: 12 }}>
            <Text style={{ color: "#163528" }}>{this.state.error}</Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}
