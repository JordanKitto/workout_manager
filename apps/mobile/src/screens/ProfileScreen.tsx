import React from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function ProfileScreen() {
    return (
        <SafeAreaView>
            <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: "600" }}>Home</Text>
                <Text style={{ marginTop: 8 }}> Name, units, and dark mode will go here.</Text>
            </View>
        </SafeAreaView>
    );
}