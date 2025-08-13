import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export type SetRowData = {
    id: string;
    weight: number;
    reps: number;
    completed?: boolean;
};

export type ExerciseData = {
    id: string;
    name: string;
    sets: SetRowData[];
};

type Props = {
    exercise: ExerciseData;
    onToggleComplete: (exerciseId: string, setId: string) => void;
};

export default function ExercisePanel({ exercise, onToggleComplete }: Props) {
    const [expanded, setExpanded] = useState(false);

    return (
        <View style={styles.container}>
            <Pressable onPress={() => setExpanded(!expanded)} style={styles.header}>
                <Text style={styles.title}>{exercise.name}</Text>
                <Text style={styles.toggle}>{expanded ? "▲" : "▼"}</Text>
            </Pressable>

            {expanded && (
                <View style={styles.setList}>
                    {exercise.sets.map((set) => (
                        <Pressable
                            key={set.id}
                            style={[
                                styles.setRow,
                                set.completed && styles.setRowCompleted,
                            ]}
                            onPress={() => onToggleComplete(exercise.id, set.id)}
                        >
                            <Text style={styles.setText}>
                                {set.weight} kg × {set.reps} reps
                            </Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: "#fff",
        overflow: "hidden",
    },
    header: {
        padding: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f7f7f7",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
    },
    toggle: {
        fontSize: 14,
        color: "#666",
    },
    setList: {
        padding: 12,
        backgroundColor: "#fff",
    },
    setRow: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    setRowCompleted: {
        backgroundColor: "#e6ffe6",
    },
    setText: {
        fontSize: 14,
    },
});
