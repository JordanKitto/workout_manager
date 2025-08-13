// apps/mobile/src/components/WorkoutHeader.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
    title: string;
    time: string;
    restTime?: string; // Optional for now
};

export default function WorkoutHeader({ title, time, restTime }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.name}>{title}</Text>
                <Text style={styles.timer}>{time}</Text>
            </View>

            {restTime !== undefined && (
                <View style={styles.restWrap}>
                    <Text style={styles.restLabel}>Rest:</Text>
                    <Text style={styles.restTimer}>{restTime}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    name: {
        fontSize: 20,
        fontWeight: "700",
    },
    timer: {
        fontSize: 16,
    },
    restWrap: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    restLabel: {
        fontSize: 14,
        color: "#555",
        marginRight: 6,
    },
    restTimer: {
        fontSize: 14,
        fontWeight: "600",
    },
});
