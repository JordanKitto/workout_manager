import React from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function HomeScreen() {
    return (
        <SafeAreaView>
            <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: "600" }}>Home</Text>
                <Text style={{ marginTop: 8 }}> Greeting and quick actions will go here.</Text>
            </View>
        </SafeAreaView>
    );
}