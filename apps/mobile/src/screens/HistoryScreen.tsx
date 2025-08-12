import React from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function HistoryScreen() {
    return (
        <SafeAreaView>
            <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: "600" }}>History</Text>
                <Text style={{ marginTop: 8 }}> Past workouts list will go here.</Text>
            </View>
        </SafeAreaView>
    );
}