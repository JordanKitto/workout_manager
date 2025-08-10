import React, { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { greet } from "@workout/domain";
import { AppButton } from "@workout/ui";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <SafeAreaView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "600" }}>Workout Manager</Text>
        <Text style={{ marginTop: 8 }}>{greet("Jordan")}</Text>
        <View style={{ marginTop: 12 }}>
          <AppButton title={`Clicks: ${count}`} onPress={() => setCount(c => c + 1)} />
        </View>
        <Text style={{ marginTop: 8 }}>Shared UI works on mobile.</Text>
      </View>
    </SafeAreaView>
  );
}
