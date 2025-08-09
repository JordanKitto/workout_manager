import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { DOMAIN_OK } from "@gc/domain";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 22, color: "#111", marginBottom: 12 }}>
        Shared: {DOMAIN_OK}
      </Text>
      <Text style={{ color: "#333" }}>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    alignItems: "center",
    justifyContent: "flex-start"
  }
});
